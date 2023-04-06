const { transfer, authorizeTransfer } = require('./flwcontrollers/transferController');
const {
  createWallet,
  getWallet,
  createWalletPin,
  walletTransfer,
  authorizeWalletTransfer,
} = require('./walletController');
const {
  createBillPayment,
  getBillsCategories,
  validateBiller,
} = require('./flwcontrollers/billsController');
const { bankVerification } = require('./flwcontrollers/bankVerification');
const { getAllBanks } = require('./flwcontrollers/getBanksController');
const otpValidation = require('./otpValidationController');
const { fetchBal } = require('./flwcontrollers/balanceController');
const { income, expense, allTransactions } = require('./transactionsController');
const { registerController } = require('./registerController');
const {
  lostItemCtrl,
  fetchLostItemsCtrl,
  fetchCustomerLostItems,
  foundLostItemCtrl,
  fetchFoundItemsCtrl,
  fetchCustomerFoundItems,
} = require('./lostAndFoundController');
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
  foundLostItemCtrl,
  fetchFoundItemsCtrl,
  otpValidation,
  walletTransfer,
  registerController,
  income,
  fetchCustomerFoundItems,
  fetchLostItemsCtrl,
  lostItemCtrl,
  expense,
  fetchCustomerLostItems,
  authorizeWalletTransfer,
  cardAuthorization,
  bankVerification,
  createWalletPin,
  initiatePayment,
  createWallet,
  getAllBanks,
  cardPayment,
  transfer,
  getWallet,
  fetchBal,
  createBillPayment,
  getBillsCategories,
  validateBiller,
};
