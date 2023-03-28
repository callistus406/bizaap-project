const router = require('express').Router();
const { withdrawal, authorizeWithdrawal } = require('../../controllers');
const VerifyUser = require('../../../middleware/auth');
router.post('/flw/withdrawal', VerifyUser.ensureAuthenticated, withdrawal);
router.post('/flw/withdrawal/authorization', VerifyUser.ensureAuthenticated, authorizeWithdrawal);

module.exports = router;

/**
 * check if wallet pin is null
 * if true allow the user to set wallet pin b4 initiating transaction
 */
