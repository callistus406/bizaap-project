const { transfer, authorizeTransfer } = require('./flwcontrollers/transferController');
const {
  createWallet,
  getWallet,
  createWalletPin,
  walletTransfer,
  authorizeWalletTransfer,
} = require('./walletController');
const { getBills, buyAirtime } = require('./flwcontrollers/billsController');
const { bankVerification } = require('./flwcontrollers/bankVerification');
const { getAllBanks } = require('./flwcontrollers/getBanksController');
const otpValidation = require('./otpValidationController');
const { fetchBal } = require('./flwcontrollers/balanceController');
const { income, expense, allTransactions } = require('./transactionsController');
const { registerController } = require('./registerController');
const { getCustomersProfile, updateCustomersProfile } = require('./profileController');
const {
  cardPayment,
  initiatePayment,
  cardAuthorization,
  validateCardTransaction,
} = require('./flwcontrollers/receiveCardPaymentController');

const { resetPassword, confirmResetPassword } = require('./resetPasswordController');
module.exports = {
  validateCardTransaction,
  updateCustomersProfile,
  getCustomersProfile,
  authorizeTransfer,
  resetPassword,
  confirmResetPassword,
  allTransactions,
  otpValidation,
  walletTransfer,
  registerController,
  income,
  expense,
  authorizeWalletTransfer,
  cardAuthorization,
  bankVerification,
  createWalletPin,
  initiatePayment,
  createWallet,
  getAllBanks,
  cardPayment,
  buyAirtime,
  transfer,
  getWallet,
  fetchBal,
  getBills,
};
