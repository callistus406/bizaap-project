/***
 * *NOTE: THIS CODE HAS NOT BEEN REFACTORED OR OPTIMIZED
 * DEVELOPMENT IS STILL IN PROGRESS
 */

const asyncWrapper = require('../../../middleware/asyncWrapper');
const flw = require('../../../service/flutterwaveConfig');
const open = require('open');
const { generateUniqueId } = require('../../../utils/uniqueIds');
const DepositModel = require('../../../models/depositModel');
const GatewayModel = require('../../../models/gatewayModel');
const WalletModel = require('../../../models/walletModel');
require('dotenv').config();
const initiatePayment = asyncWrapper((req, res) => {
  const amount = req.body.amount;
  req.session.charge_payload = amount;
});

const cardPayment = asyncWrapper(async (req, res) => {
  const payload = req.body;
  const uniqueString = generateUniqueId();
  // TODO:validate input

  payload.enckey = process.env.FLW_ENCRYPTION_KEY;
  payload.flw_ref = `FLW${uniqueString}`;
  payload.tx_ref = `TX_${generateUniqueId()}`;
  const response = await flw.Charge.card(payload);

  // validate error
  if (response?.status === 'error') {
    return res.status(400).send({ success: false, payload: response });
  } else if (response?.status === 'success') {
    if (response.meta.authorization.mode === 'pin') {
      req.session.charge_payload = payload;
      req.session.charge_payload.authorization = response.meta.authorization;
      req.session.charge_payload.authUrl = "/api/v1/payment/card_payment/authorization'";
      return res.status(200).send({ success: true, payload: req.session.charge_payload });
      // return res.redirect('/api/v1/payment/card_payment/authorization');
    } else {
      return res.status(400).send({ success: false, payload: response });
    }
  } else {
    return res
      .status(400)
      .send({ success: false, payload: { message: 'sorry something went wrong' } });
  }
  // Authorizing transactions
});
/**
 * !THIS VALIDATES CARD TRANSACTION WITH PIN
 */
const cardAuthorization = asyncWrapper(async (req, res) => {
  const payload = req.session.charge_payload;
  payload.authorization.pin = req.body.pin;
  const response = await flw.Charge.card(payload);
  switch (response?.meta?.authorization?.mode) {
    case 'otp':
      // Show the user a form to enter the OTP
      req.session.charge_payload.flw_ref = response.data.flw_ref;
      req.session.charge_payload.validationUrl = '/api/v1/payment/card_payment/validation';
      return res.status(200).send({ success: true, payload: req.session.charge_payload });
    // return res.redirect('/api/v1/payment/card_payment/validation');
    case 'redirect':
      const authUrl = response.meta.authorization.redirect;
      return res.redirect(authUrl);
    default:
      // No validation needed; just verify the payment
      const transactionId = response?.data?.id;
      const transaction = await flw.Transaction.verify({
        id: transactionId,
      });
      if (transaction.data.status == 'successful') {
        return res.redirect('/payment_successful');
      } else if (transaction.data.status == 'pending') {
        // Schedule a job that polls for the status of the payment every 10 minutes

        // TODO:check this
        transactionVerificationQueue.add({
          id: transactionId,
        });
        return res.status(102).redirect('/payment_processing');
      } else {
        return res.redirect('/payment_failed');
      }
  }
});
// !VALIDATES CARD TRANSACTION WITH OTP
const validateCardTransaction = asyncWrapper(async (req, res) => {
  function pollPaymentStatus(paymentId) {
    flw.Transaction.verify({ id: paymentId })
      .then((response) => {
        // Check the status of the payment
        if (response.data.status === 'successful') {
          return res.status(200).send({ success: true, response });
        } else if (response.data.status === 'failed') {
          console.log('Payment failed.');
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
      deposit_amount,
      currency,
      receiver, //:TODO:
      to_receive, //:TODO:
      gateway_id,
      status,
      remark,
    });
    return depositedRecord;
  };
  const otp = req.body.otp;

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
      // TODO: wok on this
      response.tx_redirect = '/api/v1/payment_successful';
      console.log(transaction);
      const txInfo = transaction.data;
      // REMOVES 3% FROM THE DEPOSITED MONEY
      // return res.send(txInfo);
      const creditAmt = (process.env.PERCENTAGE_CHARGE / 100) * txInfo?.amount;
      // :TODO: Database actions

      const depositedRecord = await populateDatabase({
        tx_ref_code: txInfo.tx_ref,
        depositor: txInfo?.customer.name,
        transaction_code: txInfo.id,
        deposit_amount: txInfo.amount,
        currency: txInfo.currency,
        receiver: req.user?.dataValues.user_id, //:TODO:
        to_receive: txInfo.amount - creditAmt, //:TODO:
        gateway_id: 1,
        status: txInfo.status,
        remark: txInfo.narration,
      });
      // gets the current balance from wallet
      const getBalance = await WalletModel.findOne({
        where: { wallet_owner: req.user?.dataValues.user_id },
        attributes: ['balance'],
      });

      const creditedAmount = txInfo.amount - creditAmt;
      const finalBalance = parseFloat(creditedAmount) + parseFloat(getBalance?.dataValues.balance);
      console.log(finalBalance, 'dsd');

      const updateWallet = await WalletModel.update(
        { balance: finalBalance },
        { where: { wallet_owner: req.user?.dataValues.user_id } }
      );

      console.log(updateWallet);
      // return res.send(depositedRecord);

      // TODO: increase wallet
      return res.status(200).send({ success: true, payload: depositedRecord, transaction });
      // return res.status(200).send({ success: true, payload: transaction });
      // TODO: refund or decline payment
      // return res.redirect('/payment_successful');
      // Frontend will construct the receipt
      // :?check webhook
    } else if (transaction.data.status == 'pending') {
      // Schedule a job that polls for the status of the payment every 10 minutes
      // TODO:webhook
      // transactionVerificationQueue.add({
      //   id: transactionId,
      // });
      // TODO:work on cron
      // const intervalId = setInterval(() => {
      //   const paymentId = transactionId;
      //   pollPaymentStatus(paymentId);
      // }, 2000);
      // setTimeout(() => {
      //   clearInterval(intervalId);
      //   console.log('Polling stopped.');
      // }, 10 * 60 * 1000 * 6);
      return res.redirect('/payment_processing');
    }
  }

  return res.redirect('/payment_failed');
});

// !NOT FUNCTIONAL
const verifyCardTransaction = asyncWrapper(async (req, res) => {
  const { transactionId, expectedAmount, expectedCurrency } = req.body;
  console.log('ver', transactionId);
  const response = await flw.Transaction.verify({ id: transactionId });

  if (
    response.data.status === 'successful' &&
    response.data.amount === expectedAmount &&
    response.data.currency === expectedCurrency
  ) {
    // Success! Confirm the customer's payment
    // populate the database

    res.status(200).send({ success: true, payload: response });
  } else if (response.data.status === 'pending') {
    // TODO:redirect user
  } else if (response.data.status === 'failed') {
    res.status(400).send({ success: false, payload: response });
  } else if (
    response.data.status === 'successful' &&
    response.data.amount > expectedAmount &&
    response.data.currency === expectedCurrency
  ) {
    // refund customer
  } else {
    res.status(400).send({ success: false, payload: response });
  }
});
module.exports = {
  initiatePayment,
  cardPayment,
  cardAuthorization,
  verifyCardTransaction,
  validateCardTransaction,
};
