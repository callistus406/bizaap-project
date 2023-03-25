const { WithdrawalValidation } = require('../../../validation/validation');
const { UnHashPassword } = require('../../../authentication/password');
const asyncWrapper = require('../../../middleware/asyncWrapper');
const { generateUniqueId } = require('../../../utils/uniqueIds');
const flw = require('../../../service/flutterwaveConfig');
const WalletModel = require('../../../models/walletModel');
require('dotenv').config();
const withdrawal = asyncWrapper(async (req, res) => {
  const loggedInUser = req.user?.user_id;
  const uniqueId = generateUniqueId();
  let { account_bank, account_number, amount, narration } = req.body;
  amount = parseFloat(amount);
  const validateData = req.body;
  const { error } = new WithdrawalValidation(validateData).validate();

  if (error) return res.status(400).send({ success: false, payload: error.message });
  req.session.withdrawal_payload = req.body;
  req.session.withdrawal_payload.currency = 'NGN';
  req.session.withdrawal_payload.reference = `TF_${uniqueId}`;
  req.session.withdrawal_payload.callback_url =
    'https://webhook.site/b3e505b0-fe02-430e-a538-22bbbce8ce0d'; // TODO: change this to custom webhook
  req.session.withdrawal_payload.debit_currency = 'NGN';
  // reject amounts below 10 naira
  if (parseFloat(amount) < 50)
    return res.status(400).send({
      success: false,
      payload: 'Sorry, you can not transfer amount below 50 naira',
    });

  const getWallet = await WalletModel.findOne({
    where: { wallet_owner: loggedInUser },
    attributes: ['balance'],
  });
  const balance = parseFloat(getWallet.dataValues.balance);
  //   calc for 3% of amount entered
  const percentageCharge = (process.env.BANK_WITHDRAWAL_PERCENTAGE_CHARGE / 100) * amount;
  // fetches transfer charges from flutterwave
  const transferFee = await flw.Transfer.fee({ amount, currency: 'NGN' });
  if (transferFee?.status !== 'success')
    return res
      .status(500)
      .send({ success: false, payload: 'Sorry, Something went wrong, please try again later.' });
  // converts FLW to float
  const flwCharge = parseFloat(transferFee.data[0].fee);
  // adds the amount to withdraw and sys percentage and FLW charge
  const totalChargesPlusAmt = amount + parseFloat(percentageCharge) + flwCharge;
  // checks if the total charges and amount is less than clg
  if (totalChargesPlusAmt <= parseFloat(balance)) {
    //TODO: check for negative value -1
    const finalBalance = parseFloat(balance) - (amount + totalChargesPlusAmt);
    // add withdrawal details to session body
    req.session.withdrawal_payload.auth_url = '/flw/withdrawal/authorization';
    req.session.withdrawal_payload.wallet_pin_url = '/customer/wallet/create_pin';
    req.session.withdrawal_payload.charge_details = {};
    req.session.withdrawal_payload.charge_details.finalBalance = finalBalance;
    req.session.withdrawal_payload.charge_details.total_charge =
      parseFloat(percentageCharge) + flwCharge;
    req.session.withdrawal_payload.charge_details.amt_plus_charges = totalChargesPlusAmt;
    // get customer wallet
    const getWallet = await WalletModel.findOne({ where: { wallet_owner: loggedInUser } });
    //sends url to route the user to create wallet pin route
    // if pin is not set send create wallet pin url
    if (!getWallet.wallet_pin)
      return res.status(400).send({
        success: false,
        payload: {
          message: 'Wallet pin not set',
          redirect_url: req.session.withdrawal_payload.wallet_pin_url,
        },
      });
    return res.status(200).send({ success: true, payload: req.session.withdrawal_payload });
  } else {
    return res.status(400).send({
      success: false,
      payload: 'Sorry, You do not have sufficient balance to perform this transaction ',
    });
  }
});

const authorizeWithdrawal = asyncWrapper(async (req, res) => {
  const loggedInUser = req.user?.user_id;
  // get pin from customer
  const wallet_pin = req.body.wallet_pin;
  // find customer wallet
  const wallet = await WalletModel.findOne({ where: { wallet_owner: loggedInUser } });
  // un-hash and compare wallet pin
  const unHashedPin = await new UnHashPassword(wallet_pin, wallet.wallet_pin).unHash();
  if (!unHashedPin) return res.status(400).send({ success: false, payload: 'Incorrect Pin' });
  // return res.send(req.session.withdrawal_payload);
  const {
    account_bank,
    account_number,
    amount,
    narration,
    currency,
    reference,
    callback_url,
    debit_currency,
  } = req.session.withdrawal_payload;

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
  const balance = req.session.withdrawal_payload.charge_details.finalBalance;

  // debit the customers account
  const updateCustomerWallet = await WalletModel.update(
    { balance: balance },
    {
      where: { wallet_owner: loggedInUser },
    }
  );
  return res.status(200).send({ success: true, payload: updateCustomerWallet });
});
module.exports = { withdrawal, authorizeWithdrawal };
