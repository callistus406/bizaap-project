const { withdrawal, authorizeWithdrawal } = require('./flwcontrollers/withdrawalController');
const { createWallet, getWallet, createWalletPin } = require('./walletController');
const { getBills, buyAirtime } = require('./flwcontrollers/billsController');
const { bankVerification } = require('./flwcontrollers/bankVerification');
const { getAllBanks } = require('./flwcontrollers/getBanksController');
const { fetchBal } = require('./flwcontrollers/balanceController');
const { registerController } = require('./registerController');
const { getCustomersProfile, updateCustomersProfile } = require('./profileController');
const {
  cardPayment,
  initiatePayment,
  cardAuthorization,
  validateCardTransaction,
} = require('./flwcontrollers/receiveCardPaymentController');
module.exports = {
  validateCardTransaction,
  updateCustomersProfile,
  getCustomersProfile,
  authorizeWithdrawal,
  registerController,
  cardAuthorization,
  bankVerification,
  createWalletPin,
  initiatePayment,
  createWallet,
  getAllBanks,
  cardPayment,
  buyAirtime,
  withdrawal,
  getWallet,
  fetchBal,
  getBills,
};
