const { HashPassword, UnHashPassword } = require('../../authentication/password');
const transactionLogModel = require('../../models/transactionLogModel');
const { transactionLogger } = require('../../utils/transactionLogger');
const generateAccountNumber = require('../../utils/accountNumberGen');
const { createCustomError } = require('../../middleware/customError');
const { generateTXCode } = require('../../utils/generateTxCode');
const { generateUniqueId } = require('../../utils/uniqueIds');
const asyncWrapper = require('../../middleware/asyncWrapper');
const TransferModel = require('../../models/transferModel');
const DepositModel = require('../../models/depositModel');
const WalletModel = require('../../models/walletModel');
const UserModel = require('../../models/userModel');
const { default: Decimal } = require('decimal.js');

const createWallet = asyncWrapper(async (req, res, next) => {
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

// This controller initiates wallet transfer

const walletTransfer = asyncWrapper(async (req, res, next) => {
  // get input from user
  let { amount, walletCode, narration } = req.body;
  if (!amount || !walletCode) return next(createCustomError('Input field can not be empty', 400));
  // get id og logged in user
  const loggedInUser = req.user?.user_id;
  // find user wallet
  const getWallet = await WalletModel.findOne({
    where: { wallet_owner: loggedInUser },
    include: { model: UserModel },
  });

  // gets wallet pin
  const isValid = getWallet.dataValues?.wallet_pin;
  amount = parseFloat(amount);
  const senderBal = parseFloat(getWallet.dataValues?.balance);

  if (amount <= 0) return next(createCustomError('Invalid amount', 400));

  if (amount > senderBal)
    return next(
      createCustomError("Sorry,You don't have sufficient balance to perform this transaction ", 400)
    );

  // store transfer payload to session object
  req.session.transfer_payload = {};
  req.session.transfer_payload.amount = amount;
  req.session.transfer_payload.narration = narration;
  req.session.transfer_payload.senderBal = senderBal;
  req.session.transfer_payload.walletCode = walletCode;
  req.session.transfer_payload.wallet_pin = getWallet.dataValues.wallet_pin
    ? getWallet.dataValues.wallet_pin
    : null;
  req.session.transfer_payload.sender = getWallet.dataValues.user.full_name;

  // check if user has a wallet pin
  if (!isValid)
    return res.status(400).send({
      success: false,
      payload: {
        message: 'please, create a pin for your wallet',
        redirectUrl: '/customer/wallet/create_pin',
      },
    });

  return res.status(200).send({
    success: true,
    payload: {
      message: 'Transaction initiated',
      authUrl: '/customer/wallet/transfer/authorization',
    },
  });
});

// this controller authorizes customer to proceed with transaction via pin verification
const authorizeWalletTransfer = asyncWrapper(async (req, res, next) => {
  const loggedInUser = req.user?.user_id;
  const { pin } = req.body;
  // get payload from session
  const { amount, walletCode, senderBal, narration, wallet_pin, sender } =
    req.session.transfer_payload;
  // validate pin
  if (!pin) return next(createCustomError('Invalid Pin', 400));
  // checks if wallet is secure
  if (!wallet_pin)
    return next(createCustomError('sorry, You are not allowed to perform this transaction.', 400));
  // compare pin
  const unHashedPin = await new UnHashPassword(pin, wallet_pin).unHash();
  if (!unHashedPin) return next(createCustomError('Incorrect Pin', 400));
  if (!req.session.transfer_payload.amount || !req.session.transfer_payload.walletCode)
    return next(createCustomError('Sorry you are not authorized to access this resource', 401));

  let senderFinalBal = senderBal - amount;
  // senderFinalBal.toFixed(2);
  const updateSenderAcct = await WalletModel.update(
    { balance: senderFinalBal },
    { where: { wallet_owner: loggedInUser } }
  );

  if (!updateSenderAcct[0])
    return next(
      createCustomError(
        'System is unable to complete transaction, please wait for a few minutes, check your balance before you try again',
        500
      )
    );
  // ------------------ RECIPIENT----------------------------------
  const getRecipientsAcct = await WalletModel.findOne({
    where: { wallet_code: walletCode },
    include: { model: UserModel },
  });

  if (!getRecipientsAcct)
    return next(
      createCustomError('Account not found.Please check the account number and try again', 404)
    );

  // receivers final balance
  const recipientsBalance = parseFloat(getRecipientsAcct.dataValues?.balance);

  let recipientsFinalBal = recipientsBalance + amount;
  // recipientsFinalBal.toFixed(2);
  // update recipients acct
  const updateRecipientsAcct = await WalletModel.update(
    { balance: recipientsFinalBal },
    { where: { wallet_code: walletCode } }
  );
  if (!updateRecipientsAcct[0])
    return next(
      createCustomError(
        'System is unable to complete transaction, please wait for a few minutes, check your balance before you try again',
        400
      )
    );

  const newDate = new Date();
  const txRef = generateUniqueId();
  // console.log(date);
  const transactionCode = generateTXCode();
  // populate transfer table
  const createRecord = await TransferModel.create({
    account_owner: loggedInUser,
    transaction_code: `DM-${transactionCode}`,
    transaction_ref: `TX-${txRef}`,
    amount: amount,
    charged: 0,
    to_receive: amount,
    currency: 'NGN',
    destination_acct: walletCode,
    receiver: getRecipientsAcct.dataValues.user.full_name,
    date_time: newDate,
    status: 'successful',
    remark: narration,
  });

  // console.log('ddddddddddddddddddddddd');

  // console.log(createRecord);
  if (!createRecord)
    return next(createCustomError('System is unable to update Transfer Record', 500));
  // populate transaction log table

  const senderTxPayload = {
    type: 'Transfer',
    amount: amount,
    customer_id: loggedInUser,
    tx_ref: `TX-${txRef}`,
    status: 'successful',
  };

  const senderTxLogger = await transactionLogger(senderTxPayload);

  const createRecord2 = await DepositModel.create({
    depositor: sender,
    transaction_code: `DM-${transactionCode}`,
    tx_ref_code: `TX-${txRef}`,
    amount: amount,
    to_receive: amount,
    currency: 'NGN',
    receiver: getRecipientsAcct.dataValues.user?.user_id,
    status: 'successful',
    gateway_id: 1,
    remark: narration,
  });

  // // recipient
  const recipientTxPayload = {
    type: 'Deposit',
    amount: amount,
    customer_id: getRecipientsAcct.dataValues?.wallet_owner,
    tx_ref: `TX-${txRef}`,
    status: 'successful',
  };
  const recipientTxLogger = await transactionLogger(recipientTxPayload);

  // delete payload from session
  req.session.transfer_payload = {};

  return res.send({ senderTxLogger, recipientTxLogger, createRecord2 });
});
module.exports = {
  getWallet,
  createWallet,
  walletTransfer,
  createWalletPin,
  authorizeWalletTransfer,
};
