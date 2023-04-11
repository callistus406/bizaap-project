const { createCustomError } = require('../../../middleware/customError');
const { UnHashPassword } = require('../../../authentication/password');
const asyncWrapper = require('../../../middleware/asyncWrapper');
const { generateUniqueId } = require('../../../utils/uniqueIds');
const flw = require('../../../service/flutterwaveConfig');
const TopUpModel = require('../../../models/topUpModel');
const VerifyUser = require('../../../middleware/auth');
const WalletModel = require('../../../models/walletModel');
const BillsModel = require('../../../models/billsModel');
const { Op } = require('sequelize');
const TransferModel = require('../../../models/transferModel');
const { transactionLogger } = require('../../../utils/transactionLogger');
require('dotenv').config();

// *********************THE FE MAKES REQUEST FIRST TO BILLS CATEGORY TO GET THE INFO**************************************

const getBillsCategories = asyncWrapper(async (req, res) => {
  const loggedInUser = req.user?.user_id;

  const response = await flw.Bills.fetch_bills_Cat();
  if (Object.keys(response).length === 0)
    return next(createCustomError('Sorry,System is unable to get bills category', 500));
  return res.status(200).send({ success: true, payload: response });
});

/**
 * *------------------------------------************************---------------------------------------
 */

const createBillPayment = asyncWrapper(async (req, res, next) => {
  let { type, amount, item_code, code, customer } = req.body;
  if (!type || !amount || !item_code || !code || !customer)
    return next(createCustomError('inputs cannot be empty', 400));

  const loggedInUser = req.user?.user_id;
  const getWallet = await WalletModel.findOne({
    where: { wallet_owner: loggedInUser },
    include: { model: UserModel },
  });
  // get wallet pin
  const walletPin = getWallet.dataValues?.wallet_pin;
  // get wallet balance
  const walletBalance = parseFloat(getWallet.dataValues?.balance);
  // verify amount is of type number
  if (!Number.isNaN(amount)) return next(createCustomError('please enter a valid amount', 400));

  // convert amount to float
  amount = parseFloat(amount);
  // check if customer wallet is secure

  if (!walletPin)
    return res.status(400).send({
      success: false,
      payload: {
        message: 'please, create a pin for your wallet',
        redirectUrl: '/customer/wallet/create_pin',
      },
    });

  // validate biller

  const validateBillerPayload = {
    item_code,
    code,
    customer,
  };
  const billerResponse = await flw.Bills.validate(validateBillerPayload);
  if (Object.keys(billerResponse).length === 0)
    return next(createCustomError('validation failed', 400));
  if (response.status === 'error') return next(createCustomError(response.message, 400));
  // TODO:if pending
  const txRef = generateUniqueId();
  const payload = {
    country: 'NG',
    customer,
    amount: amount,
    recurrence: 'ONCE',
    type,
    reference: `ART-${txRef}`,
  };

  if (amount <= 0) return next(createCustomError('Invalid amount', 400));
  if (type === 'AIRTIME') {
    // flw charges 0.02
    // validate wallet

    // check discount eligibility

    if (amount > walletBalance)
      return next(
        createCustomError(
          "Sorry,You don't have sufficient balance to perform this transaction ",
          400
        )
      );

    const finalBalance = walletBalance - (amount - process.env.AIRTIME_CASH_BACK);

    // validate pin
    const validatePin = await new UnHashPassword(pin, walletPin).unHash();
    if (!validatePin) return next(createCustomError('Incorrect Pin', 400));

    // query flutterwave
    const response = await flw.Bills.create_bill(payload);
    // validate outcome
    if (Object.keys(response).length === 0)
      return next(
        createCustomError(
          'Sorry,System is unable to complete transaction.please wait a few seconds and try again',
          400
        )
      );
    const responseData = response.data;
    // add data
    const storeBillsRecord = await BillsModel.create({
      transaction_ref: responseData.tx_ref,
      customer_id: loggedInUser,
      flw_ref: responseData.flw_ref,
      tx_ref: responseData.reference,
      network_service: responseData.network,
      amount: responseData.amount,
      currency: process.env.DEFAULT_CURRENCY,
      status: response.status,
      remark: response.message,
    });

    const updateWallet = await WalletModel.update(
      { balance: finalBalance },
      { where: { wallet_owner: loggedInUser } }
    );
  } else {
    const billsCount = await BillsModel.count({
      where: {
        customer_id: loggedInUser,
        bill_type: {
          [Op.ne]: 'AIRTIME',
        },
      },
    });
    if (billsCount <= 3) {
      if (amount > walletBalance)
        return next(
          createCustomError(
            "Sorry,You don't have sufficient balance to perform this transaction ",
            400
          )
        );
      const finalBalance = balance - amount;
      const storeBillsRecord = await BillsModel.create({
        transaction_ref: responseData.tx_ref,
        customer_id: loggedInUser,
        flw_ref: responseData.flw_ref,
        tx_ref: responseData.reference,
        network_service: responseData.network,
        amount: responseData.amount,
        currency: process.env.DEFAULT_CURRENCY,
        status: response.status,
        remark: response.message,
      });

      const updateWallet = await WalletModel.update(
        { balance: finalBalance },
        { where: { wallet_owner: loggedInUser } }
      );
    } else {
      const systemCharge = process.env.BILLS_PAYMENT_CHARGE;
      // const flwCharge = process.env.FLW_BILLS_PAYMENT_CHARGE;
      const amtPlusCharges = amount + systemCharge;
      const finalBalance = walletBalance - (amount + systemCharge);
      if (amtPlusCharges > walletBalance)
        return next(
          createCustomError(
            "Sorry,You don't have sufficient balance to perform this transaction",
            400
          )
        );
      const storeBillsRecord = await BillsModel.create({
        transaction_ref: responseData.tx_ref,
        customer_id: loggedInUser,
        flw_ref: responseData.flw_ref,
        tx_ref: responseData.reference,
        network_service: responseData.network,
        amount: responseData.amount,
        currency: process.env.DEFAULT_CURRENCY,
        status: response.status,
        remark: response.message,
      });
      const updateWallet = await WalletModel.update(
        { balance: finalBalance },
        { where: { wallet_owner: loggedInUser } }
      );

      transactionLogger({
        type: 'Bills',
        amount: amtPlusCharges,
        customer_id: loggedInUser,
        tx_ref: responseData.reference,
        status: response.status,
      });

      return res.status(200).send({ success: true, payload: storeBillsRecord });
    }
  }

  // AIRTIME   1 NAIRA   CASHBACK AND FREE FIRST 3 TRANSACTIONS

  // const
  // const updateWallet = await WalletModel
});

// ***********************************************************
const validateBiller = asyncWrapper(async (req, res) => {
  const { item_code, code, customer } = req.body;

  if (!item_code || !code || !customer)
    return next(createCustomError('inputs cannot be empty', 400));

  const payload = {
    item_code,
    code,
    customer,
  };
  const response = await flw.Bills.validate(payload);
  if (Object.keys(response).length === 0) return next(createCustomError('validation failed', 400));
  if (response.status === 'error') return next(createCustomError(response.message, 400));

  return res.status(200).send({ success: true, payload: response });
});

module.exports = { createBillPayment, getBillsCategories, validateBiller };

const discountEligibility = async (type, loggedInUser, walletBalance, amount) => {
  if (type === 'AIRTIME') {
  } else {
  }
};
