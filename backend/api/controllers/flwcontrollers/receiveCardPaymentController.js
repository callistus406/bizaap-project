/***
 * *NOTE: THIS CODE HAS NOT BEEN REFACTORED
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
const { txSMSTemplate } = require('../../../utils/txMessageTemplate');
const { maskAccountNumber } = require('../../../utils/maskAcctNumber');
const { formatCurrency, formatDate } = require('../../../utils/formatters');
const { sendSMS } = require('../../../service/twilioConfig');
const { receiptGenerator } = require('../../../utils/receiptGenerator');
const { logFailedTransaction, logPendingTransaction } = require('../../../utils/fileLogger');
require('dotenv').config();
// =======================================INITIALIZE CARD PAYMENT=====================================================
const cardPayment = asyncWrapper(async (req, res, next) => {
  const loggedInUser = req.user?.user_id;
  const envVar = process.env;
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
  // get payload from req body
  const payload = req.body;
  if (error) return next(createCustomError(error.message, 400));
  // generate universal unique code
  const uniqueString = generateUniqueId();

  // cache details
  payload.enckey = envVar.FLW_ENCRYPTION_KEY;
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
      const stampDuty = amount >= 10000 ? parseFloat(process.env.STAMP_DUTY) : 0; //checks if amount is above 10k
      const percentageCharge = flwPercentage * amount; //calc %charge
      const commission = percentageCharge + stampDuty;
      const totalCharge = commission + amount;
      // req.session.charge_payload.toReceive = payload.amount; //amt to get
      // cache values
      req.session.charge_payload.totalDebit = totalCharge; //total debit
      req.session.charge_payload.commission = commission;
      req.session.charge_payload.toReceive = amount - commission;

      // return success message with charge payload to FE
      return res.status(200).send({ success: true, payload: req.session.charge_payload });
      // return res.redirect('/api/v1/payment/card_payment/authorization');
    } else {
      return res.status(400).send({
        success: 'false',
        payload: 'Sorry Your card is not supported for this service.please try another card.',
      });
    }
  } else {
    return res.status(400).send({ success: false, payload: 'sorry something went wrong' });
  }
  // Authorizing transactions
});
/**
 * ===============================================================!THIS CTRL VALIDATES CARD TRANSACTION WITH PIN===================================================================================
 */

const cardAuthorization = asyncWrapper(async (req, res) => {
  const { user_id, phone } = req.user;

  const payload = req.session.charge_payload;

  // add pin to the payload
  payload.authorization.pin = req.body.pin;
  // TODO: validate pin
  // second  charge card api call
  const response = await flw.Charge.card(payload);

  // return res.send({ response });
  switch (response?.meta?.authorization?.mode) {
    case 'otp':
      // Show the user a form to enter the OTP
      req.session.charge_payload.flw_ref = response.data.flw_ref;
      req.session.charge_payload.validationUrl = '/api/v1/flw/payment/card-payment/validation';
      return res.status(200).send({ success: true, payload: req.session.charge_payload });
    // return res.redirect('/api/v1/payment/card_payment/validation');
    case 'redirect':
      const authUrl = response.meta.authorization.redirect;
      // todo:
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
        const getBalance = await WalletModel.findOne({ where: { wallet_owner: user_id } });
        const commission = parseFloat(req.session.charge_payload.commission);
        const convertBalance = parseFloat(getBalance.dataValues.balance);
        const balancePlusAmt = convertBalance + parseFloat(payload.amount);
        const finalBalance = parseFloat(balancePlusAmt) - commission;
        const updateWallet = await WalletModel.update(
          { balance: finalBalance },
          { where: { wallet_owner: user_id } }
        );
        if (!updateWallet[0])
          return res.status(500).send({
            success: false,
            payload:
              'Sorry System is unable to complete transaction.PLease wait for a few minutes and try again',
          });
        const newDate = new Date();

        const walletInfo = await WalletModel.findOne({ where: { wallet_owner: user_id } });
        // todo: populate deposit model
        const customerAcctNum = walletInfo.dataValues.wallet_code;
        const recipientTxLogger = await transactionLogger({
          transaction_type: 'Credit',
          amount: payload.toReceive,
          account_number: customerAcctNum,
          description: 'Card Transfer',
          tx_ref: `TX-${payload.tx_ref}`,
          status: 'successful',
          customer_id: user_id,
        });

        // SEND CREDIT MESSAGE TO THE RECIPIENT
        const creditMessage = txSMSTemplate(
          'Credit',
          maskAccountNumber(customerAcctNum),
          formatCurrency(payload.amount),
          formatCurrency(commission),
          formatDate(newDate),
          `DM-${transactionId}/TF/Card Transfer`,
          formatCurrency(finalBalance)
        );
        await sendSMS(process.env.TWILIO_FROM_NUMBER, phone, creditMessage);
        req.session.transfer_payload = {};
        return res.status(200).send({ success: true, payload: transaction.data });
      } else if (transaction.data.status == 'pending') {
        // Schedule a job that polls for the status of the payment every 10 minutes
        // LOG TO FILE

        const pendingTxLogPayload = {
          transaction_type: 'Card Transaction',
          account_number: walletInfo.dataValues.wallet_code,
          tx_ref: req.session.charge_payload.tx_ref,
          user_id: user_id,
          status: 'Pending',
          amount: req.session.charge_payload.amount,
        };
        logPendingTransaction(pendingTxLogPayload);
        const intervalId = setInterval(() => {
          const paymentId = transactionId;
          pollPaymentStatus(paymentId, intervalId);
        }, 600000); //10 mins
        setTimeout(() => {
          clearInterval(intervalId);
          console.log('Polling stopped.');
        }, 14400000); // Stop after 4 hours (4 * 60 * 60 * 1000 = 14400000 ms)
        return res.status(200).send({ success: false, payload: transaction });
      } else {
        // LOG TO FILE

        const failedTxLogPayload = {
          transaction_type: 'Card Transaction',
          account_number: walletInfo.dataValues.wallet_code,
          tx_ref: req.session.charge_payload.tx_ref,
          user_id: user_id,
          status: 'Failed',
          amount: req.session.charge_payload.amount,
        };
        logFailedTransaction(failedTxLogPayload);
        return res
          .status(400)
          .send({ success: false, payload: 'Sorry your payment cannot be completed' });
      }
  }
});
const logTxAndSendSMS = async ({
  transaction_type,
  amount,
  account_number,
  description,
  tx_ref,
  status,
  customer_id,
  // +++++++++++

  requestPayload,
  finalBalance,
  txId,
  phone,
}) => {
  const newDate = new Date();
  // transaction logger
  const recipientTxLogger = await transactionLogger({
    transaction_type,
    amount,
    account_number,
    description,
    tx_ref,
    status,
    customer_id,
  });

  // CREDIT ALERT MESSAGE
  const creditMessage = txSMSTemplate(
    'Credit',
    maskAccountNumber(account_number),
    formatCurrency(requestPayload.amount),
    formatCurrency(requestPayload.commission),
    formatDate(newDate),
    `DM-${txId}/TF/Card Transfer`,
    formatCurrency(finalBalance)
  );
  // SEND CREDIT MESSAGE TO THE RECIPIENT

  sendSMS(process.env.TWILIO_FROM_NUMBER, phone, creditMessage)
    .then((data) => console.log(data))
    .catch((error) => console.log(error.message));
};

//================================= !VALIDATES CARD TRANSACTION WITH OTP====================================================

const validateCardTransaction = asyncWrapper(async (req, res) => {
  const { user_id, phone } = req.user;
  // fetch wallet details
  const walletInfo = await WalletModel.findOne({ where: { wallet_owner: user_id } });
  // transaction calaculation
  const requestPayload = req.session.charge_payload;
  const customerBal = parseFloat(walletInfo.dataValues.balance);
  const balancePlusAmt = customerBal + parseFloat(requestPayload.amount);
  const finalBalance = parseFloat(balancePlusAmt) - parseFloat(requestPayload.commission);

  /**
   *
   * @param {*paymentId}  this this the transaction code gotten from fl
   * @param {*intervalId} intervalId is parameter used to kill job
   */
  function pollPaymentStatus(paymentId, intervalId) {
    const newDate = new Date();

    flw.Transaction.verify({ id: paymentId })
      .then(async (response) => {
        // Check the status of the payment
        if (response.data.status === 'successful') {
          const updateWallet = await WalletModel.update(
            { balance: finalBalance },
            { where: { wallet_owner: user_id } }
          );
          // TODO: validate and Log to file

          // populate databases
          // POPULATE DEPOSIT DATABASE

          const depositedRecord = await DepositModel.create({
            tx_ref_code: `TX-${payload.tx_ref}`,
            depositor: response.data?.customer.name,
            transaction_code: response.data.id,
            amount: payload.toReceive,
            currency: process.env.DEFAULT_CURRENCY,
            account_number: walletInfo.dataValues.wallet_code,
            to_receive: payload.toReceive,
            gateway_id: process.env.PAYMENT_GATEWAY,
            status: response.data.status,
            remark: response.data.narration,
          });
          // SEND MESSAGE AND POPULATE LOGGER TABLE
          logTxAndSendSMS({
            transaction_type: 'Credit',
            amount: payload.toReceive,
            receiver_account: walletInfo.dataValues.wallet_code,
            description: 'Card Transfer',
            tx_ref: `TX-${payload.tx_ref}`,
            status: 'successful',
            customer_id: user_id,
            // +++++++++++++
            walletInfo,
            requestPayload,
            finalBalance,
            txId: response.data.id,
            phone,
          });

          res.status(200).send({ success: true, response });
          clearInterval(intervalId);
          // return;
        } else if (response.data.status === 'failed') {
          // LOG TO FILE

          const failedTxLogPayload = {
            transaction_type: 'Card Transaction',
            account_number: walletInfo.dataValues.wallet_code,
            tx_ref: requestPayload.tx_ref,
            user_id: user_id,
            status: 'Failed',
            amount: requestPayload.amount,
          };
          logFailedTransaction(failedTxLogPayload);
          // FAILED ALERT MESSAGE
          const failedTxMessage = txSMSTemplate(
            'Failed',
            maskAccountNumber(walletInfo.dataValues.wallet_code),
            formatCurrency(requestPayload.amount),
            formatCurrency(requestPayload.commission),
            formatDate(newDate),
            `DM-${txId}/TF/Card Transfer`,
            formatCurrency(walletInfo.dataValues.balance)
          );
          // SEND FAILED MESSAGE TO THE RECIPIENT

          sendSMS(process.env.TWILIO_FROM_NUMBER, phone, failedTxMessage)
            .then((data) => console.log(data))
            .catch((error) => console.log(error.message));
          clearInterval(intervalId);

          // return res.status(500).send({ success: false, response });
        } else {
          console.log('Payment status:', response.data.status);
        }
      })
      .catch((error) => {
        return res.status(500).send('Error fetching payment status:', error);
      });
  }
  // ====================================================end of pollin=======================================
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
      account_number: receiver,
      to_receive,
      gateway_id,
      status,
      remark,
    });

    logTxAndSendSMS({
      transaction_type: 'Credit',
      amount: to_receive,
      account_number: receiver,
      description: 'Card Transfer',
      tx_ref: tx_ref_code,
      status: 'successful',
      customer_id: user_id,
      // +++++++++++++
      requestPayload,
      finalBalance,
      txId: transaction_code,
      phone,
    });
    // TODO: pass the results in an array

    return depositedRecord;
  };
  // get otp
  const otp = req.body.otp;
  if (!otp) return next(createCustomError('OTP field must not be empty', 400));
  // VALIDATE OTP
  const response = await flw.Charge.validate({
    otp: otp,
    flw_ref: req.session.charge_payload.flw_ref,
  });

  if (response?.data?.status === 'successful' || response?.data?.status === 'pending') {
    // Verify the payment
    const newDate = new Date();
    const transactionId = response?.data?.id;
    const transaction = await flw.Transaction.verify({
      id: transactionId,
    });
    if (transaction.data.status === 'error')
      return res.status(400).send({ success: false, payload: response.message });

    if (transaction.data.status == 'successful') {
      response.tx_redirect = '/api/v1/payment-successful';
      const txInfo = transaction.data;

      const creditAmt = req.session.charge_payload.toReceive;
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
        { where: { wallet_owner: user_id } }
      );
      // log to file if any error
      const depositedRecord = await populateDatabase({
        tx_ref_code: txInfo.tx_ref,
        depositor: txInfo?.customer.name,
        transaction_code: txInfo.id,
        deposit_amount: txInfo.amount,
        currency: txInfo.currency,
        receiver: walletInfo.dataValues.wallet_code,
        to_receive: creditAmt,
        gateway_id: 1,
        status: txInfo.status,
        remark: txInfo.narration,
      });
      req.session.charge_payload = {};
      return res.status(200).send({
        success: true,
        payload: receiptGenerator(
          'Credit',
          creditAmt,
          txInfo.tx_ref,
          walletInfo.dataValues.wallet_code,
          'Card Transfer',
          txInfo.status,
          newDate,
          txInfo.narration
        ),
      });
      // TODO: refund or decline payment
      // Frontend will construct the receipt
      // :?check webhook
    } else if (transaction.data.status == 'pending') {
      // Schedule a job that polls for the status of the payment every 10 minutes
      // LOG TO FILE

      const pendingTxLogPayload = {
        transaction_type: 'Card Transaction',
        account_number: walletInfo.dataValues.wallet_code,
        tx_ref: requestPayload.tx_ref,
        user_id: user_id,
        status: 'Pending',
        amount: requestPayload.amount,
      };
      logPendingTransaction(pendingTxLogPayload);
      // query flw to verify pending transaction
      const intervalId = setInterval(() => {
        const paymentId = transactionId;
        pollPaymentStatus(paymentId, intervalId);
      }, 600000);
      setTimeout(() => {
        clearInterval(intervalId);
        console.log('Polling stopped.');
      }, 14400000); // Stop after 4 hours (4 * 60 * 60 * 1000 = 14400000 ms)
      // return res.status(200).send({ success: false, payload: transaction });
    }
  }
});

module.exports = {
  cardPayment,
  cardAuthorization,
  validateCardTransaction,
};
