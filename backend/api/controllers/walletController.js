const asyncWrapper = require('../../middleware/asyncWrapper');
const WalletModel = require('../../models/walletModel');
const generateAccountNumber = require('../../utils/accountNumberGen');
const { generateUniqueId } = require('../../utils/uniqueIds');
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
    return res.status(400).send({ success: true, payload: 'Account Already exist, Pls try again' });
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
module.exports = { createWallet, getWallet };
