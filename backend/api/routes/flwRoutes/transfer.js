const router = require('express').Router();
const VerifyUser = require('../../../middleware/auth');
const { transfer, authorizeTransfer } = require('../../controllers');
const { authorizeTransaction } = require('../../../middleware/kycAuth');
router.post('/flw/transfer', VerifyUser.ensureAuthenticated, authorizeTransaction, transfer);
router.post(
  '/flw/transfer/authorization',
  VerifyUser.ensureAuthenticated,
  authorizeTransaction,
  authorizeTransfer
);

module.exports = router;
