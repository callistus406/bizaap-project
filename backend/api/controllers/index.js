const { registerController } = require('./registerController');
const { bankTransfer } = require('./flwcontrollers/bankTransfer');
const { getBills, buyAirtime } = require('./flwcontrollers/billsController');
const { bankVerification } = require('./flwcontrollers/bankVerification');
const {
  initiatePayment,
  cardPayment,
  cardAuthorization,
  verifyCardTransaction,
  validateCardTransaction,
} = require('./flwcontrollers/cardPaymentController');
const { fetchBal } = require('./flwcontrollers/balanceController');
const { receivePayment } = require('./flwcontrollers/recievePaymentController');
const { createWallet, getWallet } = require('./walletController');
module.exports = {
  registerController,
  bankTransfer,
  cardPayment,
  fetchBal,
  receivePayment,
  cardAuthorization,
  verifyCardTransaction,
  validateCardTransaction,
  getBills,
  buyAirtime,
  bankVerification,
  initiatePayment,
  getWallet,
  createWallet,
};
