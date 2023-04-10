/***
 * *NOTE: THIS CODE HAS NOT BEEN REFACTORED OR OPTIMIZED
 * DEVELOPMENT IS STILL IN PROGRESS
 */
const { pollPaymentStatus } = require('../../../utils/transactionVerificationJob');
const { CardPaymentValidation } = require('../../../validation/validation');
const { transactionLogger } = require('../../../utils/transactionLogger');
const { createCustomError } = require('../../../middleware/customError');
const asyncWrapper = require('../../../middleware/asyncWrapper');
const { generateUniqueId } = require('../../../utils/uniqueIds');
const DepositModel = require('../../../models/depositModel');
const GatewayModel = require('../../../models/gatewayModel');
const WalletModel = require('../../../models/walletModel');
const flw = require('../../../service/flutterwaveConfig');
const Decimal = require('decimal.js');
require('dotenv').config();

const cardPayment = asyncWrapper(async (req, res, next) => {
  const loggedInUser = req.user?.user_id;

  let {
    card_number,
    cvv,
    email,
    expiry_month,
    expiry_year,
    amount,
    currency,
    phone_number,
    fullname,
  } = req.body;
  // currency must be in NGN
  // const currency = 'NGN';
  const validateData = {
    card_number,
    cvv,
    expiry_month,
    expiry_year,
    amount,
    email,
    amount,
    phone_number,
    fullname,
  };
  // validation

  const { error } = new CardPaymentValidation(validateData).validate();

  const payload = req.body;
  if (error) return next(createCustomError(error.message, 400));
  // generate universal unique code
  const uniqueString = generateUniqueId();

  // store secrete properties in session
  payload.enckey = process.env.FLW_ENCRYPTION_KEY;
  // payload.flw_ref = `FLW-${uniqueString}`;
  payload.tx_ref = `TX-${uniqueString}`;

  // first charge card api call
  const response = await flw.Charge.card(payload);

  // validate error
  if (response?.status === 'error') {
    return res.status(400).send({ success: false, payload: response });
  } else if (response?.status === 'success') {
    if (response.meta.authorization.mode === 'pin') {
      req.session.charge_payload = payload;
      req.session.charge_payload.authorization = response.meta.authorization;
      req.session.charge_payload.authUrl = "/api/v1/flw/payment/card-payment/authorization'";
      amount = parseFloat(payload.amount);
      // get charge
      const flwPercentage = parseFloat(process.env.FLW_CARD_PERCENTAGE_CHARGE);
      const stampDuty = amount >= 10000 ? parseFloat(process.env.STAMP_DUTY) : 0;
      const percentageCharge = flwPercentage * amount;
      const commission = percentageCharge + stampDuty;
      const totalCharge = commission + amount;
      // req.session.charge_payload.toReceive = payload.amount; //amt to get

      req.session.charge_payload.totalDebit = totalCharge; //total debit
      req.session.charge_payload.commission = commission;
      req.session.charge_payload.toReceive = amount - commission;
      return res.status(200).send({ success: true, payload: req.session.charge_payload });
      // return res.redirect('/api/v1/payment/card_payment/authorization');
    } else {
      return res.status(400).send({
        success: 'false',
        payload: 'Sorry Your card is not supported for this service,please try another card.',
      });
    }
  } else {
    return res.status(400).send({ success: false, payload: 'sorry something went wrong' });
  }
  // Authorizing transactions
});
/**
 * !THIS VALIDATES CARD TRANSACTION WITH PIN
 */
const cardAuthorization = asyncWrapper(async (req, res) => {
  const loggedInUser = req.user?.user_id;

  const payload = req.session.charge_payload;

  // add pin to the payload
  payload.authorization.pin = req.body.pin;
  // second  charge card api call
  const response = await flw.Charge.card(payload);

  // return res.send({ response });
  switch (response?.meta?.authorization?.mode) {
    case 'otp':
      // Show the user a form to enter the OTP
      req.session.charge_payload.flw_ref = response.data.flw_ref;
      req.session.charge_payload.validationUrl = '/api/v1/flw/payment/card_payment/validation';
      return res.status(200).send({ success: true, payload: req.session.charge_payload });
    // return res.redirect('/api/v1/payment/card_payment/validation');
    case 'redirect':
      const authUrl = response.meta.authorization.redirect;
      return res.redirect(authUrl);
    default:
      // No validation needed; just verify the payment

      //
      const transactionId = response?.data?.id;
      const transaction = await flw.Transaction.verify({
        id: transactionId,
      });
      if (transaction.data.status == 'successful') {
        //
        const getBalance = await WalletModel.findOne({ where: { wallet_owner: loggedInUser } });

        const convertBalance = new Decimal(getBalance.balance);
        const balancePlusAmt = new Decimal(convertBalance.plus(payload.amount));
        const finalBalance = parseFloat(balancePlusAmt.minus(charge));
        const updateWallet = await WalletModel.update(
          { balance: finalBalance },
          { where: { wallet_owner: updateWallet } }
        );
        return res.send({ finalBalance: parseFloat(finalBalance) });
      } else if (transaction.data.status == 'pending') {
        // Schedule a job that polls for the status of the payment every 10 minutes

        const intervalId = setInterval(() => {
          const paymentId = transactionId;
          pollPaymentStatus(paymentId, intervalId);
        }, 2000);
        setTimeout(() => {
          clearInterval(intervalId);
          console.log('Polling stopped.');
        }, 10800000);
        return res.status(200).send({ success: false, payload: transaction });
      } else {
        return res.redirect('/payment_failed');
      }
  }
});

// !VALIDATES CARD TRANSACTION WITH OTP
const validateCardTransaction = asyncWrapper(async (req, res) => {
  const loggedInUser = req.user?.user_id;

  function pollPaymentStatus(paymentId, intervalId) {
    flw.Transaction.verify({ id: paymentId })
      .then((response) => {
        // Check the status of the payment
        if (response.data.status === 'successful') {
          clearInterval(intervalId);
          // TODO: send alert sms
          return res.status(200).send({ success: true, response });
        } else if (response.data.status === 'failed') {
          clearInterval(intervalId);

          return res.status(500).send({ success: false, response });
        } else {
          console.log('Payment status:', response.data.status);
        }
      })
      .catch((error) => {
        console.error('Error fetching payment status:', error);
      });
  }

  const populateDatabase = async ({
    tx_ref_code,
    depositor,
    transaction_code,
    deposit_amount,
    currency,
    receiver,
    to_receive,
    gateway_id,
    status,
    remark,
  }) => {
    const depositedRecord = await DepositModel.create({
      tx_ref_code,
      depositor,
      transaction_code,
      amount: deposit_amount,
      currency,
      receiver,
      to_receive,
      gateway_id,
      status,
      remark,
    });

    const loggerPayload = {
      type: 'Deposit',
      amount: to_receive,
      customer_id: receiver,
      tx_ref: tx_ref_code,
      status: status,
    };
    const isUpdated = await transactionLogger(loggerPayload);
    // TODO: pass the results in an array
    console.log(isUpdated);
    return depositedRecord;
  };
  // get otp
  const otp = req.body.otp;
  if (!otp) return next(createCustomError('OTP field must not be empty', 400));

  const response = await flw.Charge.validate({
    otp: otp,
    flw_ref: req.session.charge_payload.flw_ref,
  });

  if (response?.data?.status === 'successful' || response?.data?.status === 'pending') {
    // Verify the payment
    const transactionId = response?.data?.id;
    const transaction = await flw.Transaction.verify({
      id: transactionId,
    });
    if (transaction.data.status === 'error')
      return res.status(400).send({ success: false, payload: response.message });

    if (transaction.data.status == 'successful') {
      response.tx_redirect = '/api/v1/payment_successful';
      const txInfo = transaction.data;

      const creditAmt = req.session.charge_payload.toReceive;
      const depositedRecord = await populateDatabase({
        tx_ref_code: txInfo.tx_ref,
        depositor: txInfo?.customer.name,
        transaction_code: txInfo.id,
        deposit_amount: txInfo.amount,
        currency: txInfo.currency,
        receiver: loggedInUser,
        to_receive: creditAmt,
        gateway_id: 1,
        status: txInfo.status,
        remark: txInfo.narration,
      });
      // gets the current balance from wallet
      const getBalance = await WalletModel.findOne({
        where: { wallet_owner: req.user?.dataValues.user_id },
        attributes: ['balance'],
      });
      // add the credit amt with the current balance
      const calcBalance = parseFloat(creditAmt) + parseFloat(getBalance?.dataValues.balance);

      //convert to two precision
      const finalBalance = calcBalance;
      // update user wallet
      const updateWallet = await WalletModel.update(
        { balance: finalBalance },
        { where: { wallet_owner: loggedInUser } }
      );
      req.session.charge_payload = {};

      return res.status(200).send({ success: true, payload: depositedRecord, transaction });
      // return res.status(200).send({ success: true, payload: transaction });
      // TODO: refund or decline payment
      // Frontend will construct the receipt
      // :?check webhook
    } else if (transaction.data.status == 'pending') {
      // Schedule a job that polls for the status of the payment every 10 minutes

      // query flw to verify pending transaction
      const intervalId = setInterval(() => {
        const paymentId = transactionId;
        pollPaymentStatus(paymentId, intervalId);
      }, 600000);
      setTimeout(() => {
        clearInterval(intervalId);
        console.log('Polling stopped.');
      }, 10800000);
      return res.status(200).send({ success: false, payload: transaction });
    }
  }
});

module.exports = {
  cardPayment,
  cardAuthorization,
  validateCardTransaction,
};
