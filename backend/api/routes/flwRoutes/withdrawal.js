const router = require('express').Router();
const { withdrawal, authorizeWithdrawal } = require('../../controllers');

router.post('/flw/withdrawal', withdrawal);
router.post('/flw/withdrawal/authorization', authorizeWithdrawal);

module.exports = router;

/**
 * check if wallet pin is null
 * if true allow the user to set wallet pin b4 initiating transaction
 */
