require('dotenv').config();
const Flutterwave = require('flutterwave-node-v3');
const flw = new Flutterwave(process.env.FLW_PUBLIC_KEY, process.env.FLW_SECRETE_KEY);
const initiateBankTransaction = (details) => {
  return flw.Charge.bank_transfer(details);
};

module.exports = initiateBankTransaction;
