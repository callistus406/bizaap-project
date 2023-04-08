const router = require('express').Router();
const { transfer, authorizeTransfer } = require('../../controllers');
const VerifyUser = require('../../../middleware/auth');
const { authorizeTransaction } = require('../../../middleware/kycAuth');
router.post('/flw/transfer', VerifyUser.ensureAuthenticated, authorizeTransaction, transfer);
router.post(
  '/flw/transfer/authorization',
  VerifyUser.ensureAuthenticated,
  authorizeTransaction,
  authorizeTransfer
);

module.exports = router;

/**
 * check if wallet pin is null
 * if true allow the user to set wallet pin b4 initiating transaction
 */
