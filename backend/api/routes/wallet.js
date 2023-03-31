const router = require('express').Router();
const {
  createWallet,
  getWallet,
  createWalletPin,
  walletTransfer,
  authorizeWalletTransfer,
} = require('./../controllers');
const VerifyUser = require('../../middleware/auth');

router.post('/customer/create/wallet', VerifyUser.ensureAuthenticated, createWallet);
router.get('/customer/find/wallet', VerifyUser.ensureAuthenticated, getWallet);
router.patch('/customer/wallet/create_pin', VerifyUser.ensureAuthenticated, createWalletPin);
router.post('/customer/wallet/transfer', VerifyUser.ensureAuthenticated, walletTransfer);
router.post(
  '/customer/wallet/transfer/authorization',
  VerifyUser.ensureAuthenticated,
  authorizeWalletTransfer
);

module.exports = router;
