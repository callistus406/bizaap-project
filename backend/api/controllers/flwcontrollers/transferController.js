const { transferValidation } = require('../../../validation/validation');
const { UnHashPassword } = require('../../../authentication/password');
const asyncWrapper = require('../../../middleware/asyncWrapper');
const { generateUniqueId } = require('../../../utils/uniqueIds');
const flw = require('../../../service/flutterwaveConfig');
const WalletModel = require('../../../models/walletModel');
const TransferModel = require('../../../models/transferModel');
const Decimal = require('decimal.js');
const { transactionLogger } = require('../../../utils/transactionLogger');
require('dotenv').config();

const transfer = asyncWrapper(async (req, res) => {
  const loggedInUser = req.user?.user_id;
  const uniqueId = generateUniqueId();
  let { account_bank, account_number, amount, narration } = req.body;
  amount = new Decimal(parseFloat(amount));
  const validateData = req.body;
  const { error } = new transferValidation(validateData).validate();
  if (error) return res.status(400).send({ success: false, payload: error.message });
  req.session.transfer_payload = req.body;
  req.session.transfer_payload.currency = 'NGN';
  req.session.transfer_payload.reference = `TF_${uniqueId}`;
  req.session.transfer_payload.callback_url =
    'https://webhook.site/b3e505b0-fe02-430e-a538-22bbbce8ce0d'; // TODO: change this to custom webhook
  req.session.transfer_payload.debit_currency = 'NGN';
  // reject amounts below 10 naira
  console.log('poiuyt', amount.gt(50));
  if (amount.lt(50))
    return res.status(400).send({
      success: false,
      payload: 'Sorry, you can not transfer amount below 50 naira',
    });
  // get customers balance
  const getWallet = await WalletModel.findOne({
    where: { wallet_owner: loggedInUser },
    attributes: ['balance'],
  });

  const balance = new Decimal(getWallet.dataValues.balance);
  balance.toFixed(2);
  //   calc for % of amount entered
  const percentageCharge = new Decimal(
    (process.env.BANK_TRANSFER_PERCENTAGE_CHARGE / 100) * amount
  );
  // fetches transfer charges from flutterwave
  const transferFee = await flw.Transfer.fee({ amount, currency: 'NGN' });
  if (transferFee?.status !== 'success')
    return res
      .status(500)
      .send({ success: false, payload: 'Sorry, Something went wrong, please try again later.' });
  // converts FLW to float
  const flwCharge = new Decimal(parseFloat(transferFee.data[0].fee));
  console.log('qwerty', flwCharge);
  // adds the amount to withdraw and sys percentage and FLW charge
  const totalChargesPlusAmt = amount.plus(percentageCharge).plus(flwCharge);
  // checks if the total charges and amount is less than clg
  const totalChargeMinusBal = balance.minus(totalChargesPlusAmt);

  // constraints
  if (totalChargeMinusBal < 0)
    return res.status(400).send({
      success: false,
      payload: 'Sorry, You do not have sufficient balance to perform this transaction',
    });
  if (totalChargesPlusAmt <= balance) {
    const finalBalance = balance.minus(totalChargesPlusAmt).toFixed(2);
    // add transfer details to session body
    //* store payload in user session
    req.session.transfer_payload.auth_url = '/flw/transfer/authorization';
    req.session.transfer_payload.wallet_pin_url = '/customer/wallet/create_pin';
    req.session.transfer_payload.charge_details = {};
    req.session.transfer_payload.charge_details.finalBalance = finalBalance;
    req.session.transfer_payload.charge_details.total_charge = percentageCharge + flwCharge;
    req.session.transfer_payload.charge_details.amt_plus_charges = totalChargesPlusAmt;
    // get customer wallet
    const getWallet = await WalletModel.findOne({ where: { wallet_owner: loggedInUser } });
    //sends url to route the user to create wallet pin route
    // if pin is not set send create wallet pin url
    if (!getWallet.wallet_pin)
      return res.status(307).send({
        success: false,
        payload: {
          message: 'Wallet pin not set',
          redirect_url: req.session.transfer_payload.wallet_pin_url,
        },
      });
    return res.status(200).send({ success: true, payload: req.session.transfer_payload });
  } else {
    return res.status(400).send({
      success: false,
      payload: 'Sorry, You do not have sufficient balance to perform this transaction ',
    });
  }
});

const authorizeTransfer = asyncWrapper(async (req, res) => {
  const loggedInUser = req.user?.user_id;
  // get pin from customer
  const wallet_pin = req.body.wallet_pin;
  // find customer wallet
  const wallet = await WalletModel.findOne({ where: { wallet_owner: loggedInUser } });
  // un-hash and compare wallet pin
  const unHashedPin = await new UnHashPassword(wallet_pin, wallet.wallet_pin).unHash();
  if (!unHashedPin) return res.status(400).send({ success: false, payload: 'Incorrect Pin' });

  const {
    account_bank,
    account_number,
    amount,
    narration,
    currency,
    reference,
    callback_url,
    debit_currency,
  } = req.session.transfer_payload;
  const { finalBalance, total_charge, totalChargesPlusAmt } =
    req.session.transfer_payload.charge_details;
  // make request to FLW TODO:
  // const response = await flw.Transfer.initiate({
  //   account_bank,
  //   account_number,
  //   amount,
  //   narration,
  //   currency,
  //   reference,
  //   callback_url,
  //   debit_currency,
  // });

  // TODO:implement webhooks
  // ! end of FLW query
  // get the calculated balance from session
  const balance = req.session.transfer_payload?.charge_details.finalBalance;

  // debit the customers account

  const updateCustomerWallet = await WalletModel.update(
    { balance: balance },
    {
      where: { wallet_owner: loggedInUser },
    }
  );
  // send charges, account ,transfer ref, date, dest acct name, bal description
  if (!updateCustomerWallet[0])
    return res.status(500).send({ success: false, payload: 'SORRY SOMETHING WENT WRONG' });
  const date = new Date();
  // TODO: dynamic values will come from flw

  const createTransferLog = await TransferModel.create({
    account_owner: loggedInUser,
    transaction_code: 'dsdsd',
    transaction_ref: reference,
    amount: amount,
    currency: currency,
    charged: total_charge,
    to_receive: amount,
    receiver: 'julia stores',
    destination_acct: account_number,
    date_time: date.getFullYear() + '-' + date.getMonth() + 1 + '-' + date.getDay(),
    status: 'successful',
    remarks: narration,
  });

  const loggerPayload = {
    type: 'Transfer',
    amount: amount,
    customer_id: loggedInUser,
    tx_ref: reference,
    status: 'successful', //TODO:
  };
  const logTransaction = await transactionLogger(loggerPayload);

  console.log(logTransaction, 'popings');

  return res.status(200).send({
    success: true,
    payload: {
      log: createTransferLog,
      // account: account_number,
      // amount,
      // total_debit: totalChargesPlusAmt,
      // charge: total_charge,
      // balance: finalBalance,
      // reference,
      // date: new Date().toDateString(),
    },
  });
});
module.exports = { transfer, authorizeTransfer };
