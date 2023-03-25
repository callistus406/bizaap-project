const { withdrawal, authorizeWithdrawal } = require('./flwcontrollers/withdrawalController');
const { createWallet, getWallet, createWalletPin } = require('./walletController');
const { getBills, buyAirtime } = require('./flwcontrollers/billsController');
const { bankVerification } = require('./flwcontrollers/bankVerification');
const { getAllBanks } = require('./flwcontrollers/getBanksController');
const { fetchBal } = require('./flwcontrollers/balanceController');
const { registerController } = require('./registerController');
const {
  initiatePayment,
  cardPayment,
  cardAuthorization,
  verifyCardTransaction,
  validateCardTransaction,
} = require('./flwcontrollers/receiveCardPaymentController');
module.exports = {
  validateCardTransaction,
  verifyCardTransaction,
  authorizeWithdrawal,
  registerController,
  cardAuthorization,
  bankVerification,
  initiatePayment,
  createWalletPin,
  createWallet,
  getAllBanks,
  cardPayment,
  buyAirtime,
  withdrawal,
  getWallet,
  fetchBal,
  getBills,
};
