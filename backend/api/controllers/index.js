const { transfer, authorizeTransfer } = require('./flwcontrollers/transferController');
const {
  createWallet,
  getWallet,
  createWalletPin,
  walletTransfer,
  authorizeWalletTransfer,
  resetWalletPin,
} = require('./walletController');
const {
  createBillPayment,
  getBillsCategories,
  validateBiller,
} = require('./flwcontrollers/billsController');
const { bankVerification } = require('./flwcontrollers/bankVerification');
// const {  } = require('./requestOTPController');
const { getAllBanks } = require('./flwcontrollers/getBanksController');
const { otpValidation, requestOtp } = require('./OTPController');
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

const { calcTransactionLimitCtrl } = require('./transactionLimitController');
const { resetPassword, confirmResetPassword } = require('./resetPasswordController');
const {
  checkKycVerification,
  kycVerificationCtrl,
  kycVerificationFinalStageCtrl,
} = require('./kycVerificationController');
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
  checkKycVerification,
  otpValidation,
  walletTransfer,
  registerController,
  income,
  requestOtp,
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
  resetWalletPin,
  kycVerificationCtrl,
  kycVerificationFinalStageCtrl,
  calcTransactionLimitCtrl,
};
