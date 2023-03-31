const router = require('express').Router();
const { transfer, authorizeTransfer } = require('../../controllers');
const VerifyUser = require('../../../middleware/auth');
router.post('/flw/transfer', VerifyUser.ensureAuthenticated, transfer);
router.post('/flw/transfer/authorization', VerifyUser.ensureAuthenticated, authorizeTransfer);

module.exports = router;

/**
 * check if wallet pin is null
 * if true allow the user to set wallet pin b4 initiating transaction
 */
