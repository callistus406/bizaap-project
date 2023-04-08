const router = require('express').Router();
const {
  createWallet,
  getWallet,
  createWalletPin,
  walletTransfer,
  resetWalletPin,
  authorizeWalletTransfer,
} = require('./../controllers');
const VerifyUser = require('../../middleware/auth');
const { authorizeTransaction } = require('../../middleware/kycAuth');

router.patch(
  '/customer/wallet/reset-pin',
  VerifyUser.ensureAuthenticated,
  authorizeTransaction,
  resetWalletPin
);
router.post(
  '/customer/create/wallet',
  VerifyUser.ensureAuthenticated,
  authorizeTransaction,
  createWallet
);
router.get(
  '/customer/find/wallet',
  VerifyUser.ensureAuthenticated,
  authorizeTransaction,
  getWallet
);
router.patch(
  '/customer/wallet/create_pin',
  VerifyUser.ensureAuthenticated,
  authorizeTransaction,
  createWalletPin
);
router.post(
  '/customer/wallet/transfer',
  VerifyUser.ensureAuthenticated,
  authorizeTransaction,
  walletTransfer
);
router.post(
  '/customer/wallet/transfer/authorization',
  VerifyUser.ensureAuthenticated,
  authorizeWalletTransfer
);

module.exports = router;
