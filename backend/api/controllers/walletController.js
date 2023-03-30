const asyncWrapper = require('../../middleware/asyncWrapper');
const WalletModel = require('../../models/walletModel');
const generateAccountNumber = require('../../utils/accountNumberGen');
const { generateUniqueId } = require('../../utils/uniqueIds');
const { HashPassword } = require('../../authentication/password');

const createWallet = asyncWrapper(async (req, res) => {
  const { walletPin, confirmWalletPin } = req.body;
  const phone = req.user.dataValues.phone;

  // this generate account number from phone number
  const accountNumber = generateAccountNumber(phone);
  //   return;
  if (!walletPin || !confirmWalletPin)
    return res.status(400).send({ success: false, payload: 'Input cannot be empty' });
  if (walletPin !== confirmWalletPin)
    return res.status(409).send({ success: false, payload: "Pin doesn't match, Please try again" });
  const _id = generateUniqueId();
  const getWallet = await WalletModel.findOne({ where: { wallet_code: accountNumber } });
  if (getWallet)
    return res
      .status(400)
      .send({ success: false, payload: 'Account Already exist, Pls try again' });
  const customerWallet = await WalletModel.create({
    wallet_owner: req.user.user_id,
    wallet_code: accountNumber,
    wallet_pin: walletPin,
  });
  if (customerWallet) {
    return res.status(201).send({ success: true, payload: customerWallet });
  } else {
    return res
      .status(500)
      .send({ success: false, payload: 'Sorry something went wrong ,pls try again later' });
  }
});

const getWallet = asyncWrapper(async (req, res) => {
  const wallet = await WalletModel.findOne({ where: { wallet_owner: req.user.user_id } });

  if (!wallet)
    return res
      .status(200)
      .send({ success: false, payload: "Sorry, You don't have a wallet.Please create One " });
  return res.status(200).send({ success: true, wallet });
});

// create wallet pin

const createWalletPin = asyncWrapper(async (req, res, next) => {
  const { walletPin, confirmWalletPin } = req.body;
  const loggedInUser = req.user?.user_id;

  //   validation
  if (!walletPin || !confirmWalletPin)
    return res.status(400).send({ success: false, payload: 'Inputs can not be empty' });
  if (isNaN(walletPin) || isNaN(confirmWalletPin))
    return res.status(400).send({ success: false, payload: 'Pin cannot be a  string' });
  if (walletPin.length !== 4 || confirmWalletPin.length !== 4)
    return res.status(400).send({ success: false, payload: 'Wallet pin must be 4 digits' });
  if (walletPin !== confirmWalletPin)
    return res
      .status(400)
      .send({ success: false, payload: 'The provided pin do not match, please try again' });
  const hashedPin = await new HashPassword(walletPin).hash();
  if (!hashedPin)
    return next(createCustomError('Sorry!, Something went wrong,please try again later', 400));
  const createPin = await WalletModel.update(
    { wallet_pin: hashedPin },
    { where: { wallet_owner: loggedInUser } }
  );
  if (!createPin)
    return next(createCustomError('Sorry!, Something went wrong,please try again later', 500));
  if (!createPin[0])
    return next(
      createCustomError('Sorry!, System is unable to create pin. please try again later', 500)
    );
  return res.status(200).send({ success: true, payload: createPin });
});
module.exports = { createWallet, getWallet, createWalletPin };
