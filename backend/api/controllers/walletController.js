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
const { receiptGenerator } = require('../../utils/receiptGenerator');
const { date } = require('joi');
const MessagingResponse = require('twilio').twiml.MessagingResponse;

const { sendSMS } = require('../../service/twilioConfig');
const { txSMSTemplate } = require('../../utils/txMessageTemplate');
const { maskAccountNumber } = require('../../utils/maskAcctNumber');
const { formatDate, formatCurrency } = require('../../utils/formatters');
const { validateTransactionLimit } = require('../../utils/transactionLimitValidator');
const { errorLogger } = require('../../utils/fileLogger');
// ==========================CREATE WALLET CONTROLLER====================================================
const createWallet = asyncWrapper(async (req, res, next) => {
  // !NOT FUNCTIONAL FOR NOW
  const { walletPin, confirmWalletPin } = req.body;
  const phone = req.user.dataValues?.phone;

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
// ==========================GET WALLET CONTROLLER====================================================
// THIS FETCHES THE LOGGED IN USER'S WALLET INFO
const getWallet = asyncWrapper(async (req, res) => {
  const { user_id } = req.user;
  const wallet = await WalletModel.findOne({ where: { wallet_owner: user_id } });

  if (!wallet)
    return res
      .status(404)
      .send({ success: false, payload: "Sorry, You don't have a wallet.Please create One " });
  return res.status(200).send({ success: true, wallet });
});

// ==========================CREATE WALLET PIN CONTROLLER====================================================

// CREATE WALLET PIN FOR CUSTOMER
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
  //CHECK IF WALLET IS ALREADY SECURED

  const isSecured = await WalletModel.findOne({
    where: { wallet_owner: loggedInUser },
    attributes: ['wallet_pin'],
  });
  // CHECK IF PIN EXISTS IN WALLET
  if (isSecured.dataValues.wallet_pin)
    return next(
      createCustomError(
        "Your account is already associated with a PIN. To update your PIN, please navigate to the 'Update PIN' section",
        400
      )
    );
  if (walletPin !== confirmWalletPin)
    return res
      .status(400)
      .send({ success: false, payload: 'The provided pin do not match, please try again' });
  // HASH AND SALT  PIN
  const hashedPin = await new HashPassword(walletPin).hash();
  if (!hashedPin)
    return next(createCustomError('Sorry!, Something went wrong,please try again later', 500));
  // UPDATE PIN
  const createPin = await WalletModel.update(
    { wallet_pin: hashedPin },
    { where: { wallet_owner: loggedInUser } }
  );
  // CHECKS IF UPDATE WAS SUCCESSFUL
  if (!createPin[0])
    return next(
      createCustomError('Sorry!, System is unable to create pin. please try again later', 500)
    );

  return res
    .status(201)
    .send({ success: true, payload: 'Your wallet PIN has been successfully updated.' });
});

// =================================================WALLET TRANSFERS==================================================================

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
  // check transaction eligibility
  const { isEligible, txLimit, totalTx } = await validateTransactionLimit({
    _user: getWallet.dataValues.user,
    _amount: amount,
  });
  console.log(isEligible);
  if (!isEligible)
    return next(
      createCustomError(
        `We regret to inform you that you have reached the maximum transaction limit for the day. As per our policies, you are only permitted to transfer a sum of ${formatCurrency(
          txLimit - totalTx
        )} at this time.`,
        400
      )
    );

  const senderBal = parseFloat(getWallet.dataValues?.balance);
  const senderAcct = getWallet.dataValues.wallet_code;

  if (amount <= 0) return next(createCustomError('Invalid amount', 400));

  if (amount > senderBal)
    return next(
      createCustomError("Sorry,You don't have sufficient balance to perform this transaction ", 400)
    );

  if (senderAcct === walletCode)
    return next(
      createCustomError(
        'Sorry,You cannot send money to your account.please check the account number and try again',
        400
      )
    );

  // cache transfer payload
  req.session.transfer_payload = {};
  req.session.transfer_payload.amount = amount;
  req.session.transfer_payload.narration = narration;
  req.session.transfer_payload.senderBal = senderBal;
  req.session.transfer_payload.receiver_account = walletCode;
  req.session.transfer_payload.wallet_pin = getWallet.dataValues.wallet_pin
    ? getWallet.dataValues.wallet_pin
    : null;
  req.session.transfer_payload.sender_account = getWallet.dataValues.wallet_code;

  req.session.transfer_payload.sender_name = getWallet.dataValues.user.full_name;

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
// ==========================AUTHORIZE WALLET TRANSAFER CONTROLLER====================================================

// this controller authorizes customer to proceed with transaction via pin verification
const authorizeWalletTransfer = asyncWrapper(async (req, res, next) => {
  const { phone, user_id } = req.user;
  const { pin } = req.body;
  // get payload from session
  const {
    amount,
    receiver_account,
    senderBal,
    narration,
    wallet_pin,
    sender_account,
    sender_name,
  } = req.session.transfer_payload;
  // validate pin
  if (!pin) return next(createCustomError('Invalid Pin', 400));
  // checks if wallet is secure
  if (!wallet_pin)
    return next(createCustomError('sorry, You are not allowed to perform this transaction.', 400));
  // compare pin
  const unHashedPin = await new UnHashPassword(pin, wallet_pin).unHash();
  if (!unHashedPin) return next(createCustomError('Incorrect Pin', 400));
  if (!req.session.transfer_payload.amount || !req.session.transfer_payload.receiver_account)
    return next(createCustomError('Sorry you are not authorized to access this resource', 401));

  let senderFinalBal = senderBal - amount;
  // senderFinalBal.toFixed(2);
  const updateSenderAcct = await WalletModel.update(
    { balance: senderFinalBal },
    { where: { wallet_owner: user_id } }
  );

  if (!updateSenderAcct[0]) {
    const errorPayload = {
      error_type: 'DB Error',
      user_id: user_id,
      source: 'Wallet Table',
      message: `Unable to update wallet database with user with debit balance balance of  ${formatCurrency(
        senderFinalBal
      )}. amount sent: ${formatCurrency(amount)}`,
    };
    errorLogger(errorPayload);
    return next(
      createCustomError(
        'System is unable to complete transaction, please wait for a few minutes, check your balance before you try again',
        500
      )
    );
  }

  // ------------------+++++++++++++++++ RECIPIENT SECTION+++++++++++----------------------------------
  const getRecipientsAcct = await WalletModel.findOne({
    where: { wallet_code: receiver_account },
    include: { model: UserModel },
  });

  if (!getRecipientsAcct)
    return next(
      createCustomError('Account not found.Please check the account number and try again', 404)
    );

  // receivers final balance
  const recipientsBalance = parseFloat(getRecipientsAcct.dataValues?.balance);

  let recipientsFinalBal = recipientsBalance + amount;

  // update recipients acct
  const updateRecipientsAcct = await WalletModel.update(
    { balance: recipientsFinalBal },
    { where: { wallet_code: receiver_account } }
  );
  // CHECK IF UPDATE WAS SUCCESSFUL
  if (!updateRecipientsAcct[0]) {
    const errorPayload = {
      error_type: 'DB Error',
      user_id: user_id,
      source: 'Wallet Table',
      message: `Unable to update wallet database with user with credit balance balance of  ${formatCurrency(
        recipientsFinalBal
      )}. amount to receive: ${formatCurrency(amount)}`,
    };
    errorLogger(errorPayload);
    return next(
      createCustomError(
        'System is unable to complete transaction, please wait for a few minutes, check your balance before you try again',
        400
      )
    );
  }
  // GET TRANSACTION DATE
  const newDate = new Date();
  // GEN UNIQUE REF NUM
  const txRef = generateUniqueId();
  // console.log(date);
  const transactionCode = generateTXCode();
  // populate transfer table
  const createRecord = await TransferModel.create({
    sender_account: sender_account,
    transaction_code: `DM-${transactionCode}`,
    transaction_ref: `TX-${txRef}`,
    amount: amount,
    charged: process.env.WALLET_TX_CHARGE,
    to_receive: amount,
    transaction_date: newDate,
    currency: 'NGN',
    destination_account: receiver_account,
    status: 'successful',
    remark: narration,
  });

  if (!createRecord)
    return next(createCustomError('System is unable to update Transfer Record', 500));
  // populate transaction log table

  const senderTxLogger = await transactionLogger({
    transaction_type: 'Debit',
    amount: amount,
    account_number: sender_account,
    tx_ref: `TX-${txRef}`,
    description: 'Wallet Transfer',
    status: 'successful',
    customer_id: user_id,
  });

  // SEND DEBIT MESSAGE TO THE SENDER
  const debitMessage = txSMSTemplate(
    'Debit',
    maskAccountNumber(sender_account),
    formatCurrency(amount),
    formatCurrency(process.env.WALLET_TX_CHARGE),
    formatDate(newDate),
    `DM-${transactionCode}/TF/Wallet Transfer`,
    formatCurrency(senderFinalBal)
  );
  const senderResponse = await sendSMS(process.env.TWILIO_FROM_NUMBER, phone, debitMessage);
  // ******************SEND MESSAGE END********************

  // RECIPIENTS LOGGER

  const recipientTxLogger = await transactionLogger({
    transaction_type: 'Credit',
    amount: amount,
    account_number: receiver_account,
    description: 'Wallet Transfer',
    tx_ref: `TX-${txRef}`,
    status: 'successful',
    customer_id: getRecipientsAcct.dataValues.user.user_id,
  });

  // delete payload from session
  const receipt = receiptGenerator(
    'Debit',
    amount,
    `TX-${txRef}`,
    receiver_account,
    'wallet Transfer',
    'successful',
    newDate,
    narration
  );
  // SEND CREDIT MESSAGE TO THE RECIPIENT
  const creditMessage = txSMSTemplate(
    'Credit',
    maskAccountNumber(receiver_account),
    formatCurrency(amount),
    formatCurrency(process.env.WALLET_TX_CHARGE),
    formatDate(newDate),
    `DM-${transactionCode}/TF/Wallet Transfer`,
    formatCurrency(recipientsFinalBal)
  );

  const ReceiveResponse = await sendSMS(
    process.env.TWILIO_FROM_NUMBER,
    getRecipientsAcct.dataValues.user.phone,
    creditMessage
  );
  req.session.transfer_payload = {}; //:TODO:

  // ******************SEND MESSAGE END********************
  return res.status(200).send({ success: true, payload: receipt });
});

const resetWalletPin = asyncWrapper(async (req, res, next) => {
  const loggedInUser = req.user?.user_id;
  const { oldPin, newPin, confirmPin } = req.body;

  if (!oldPin || !newPin || !confirmPin)
    return next(createCustomError('Inputs cannot be empty!', 400));

  if (isNaN(newPin)) return next(createCustomError('Pin must not contain letters', 400));
  if (newPin.toString().length !== 4) next(createCustomError('Pin must be 4 digit', 400));
  newPin.toString();
  confirmPin.toString();
  const getWallet = await WalletModel.findOne({
    where: { wallet_owner: loggedInUser },
  });
  const walletPin = getWallet.dataValues?.wallet_pin;

  const isValid = await new UnHashPassword(oldPin, walletPin).unHash();

  if (!isValid) return next(createCustomError('Inccorect  pin', 400));

  if (newPin !== confirmPin) return next(createCustomError('The entered pin does not match', 400));

  const hashedPin = await new HashPassword(newPin).hash();

  if (!hashedPin)
    return next(createCustomError('Sorry, something went wrong.please try again  later', 500));

  const updatePin = await WalletModel.update(
    { wallet_pin: hashedPin },
    { where: { wallet_owner: loggedInUser } }
  );

  if (!updatePin[0]) {
    const errorPayload = {
      error_type: 'DB Error',
      user_id: user_id,
      source: 'Wallet Table',
      message: `Unable to update wallet pin `,
    };
    errorLogger(errorPayload);
    return next(
      createCustomError(
        'Sorry,system is unable to update your wallet pin.please try again later',
        500
      )
    );
  }

  return res.status(200).send({ success: true, payload: 'Wallet pin update, successful!' });
});

module.exports = {
  getWallet,
  createWallet,
  walletTransfer,
  createWalletPin,
  authorizeWalletTransfer,
  resetWalletPin,
};
