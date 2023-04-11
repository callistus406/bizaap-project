const router = require('express').Router();

const VerifyUser = require('../../middleware/auth');
const { income, expense, allTransactions } = require('../controllers');

router.get('/customer/fetch/transactions', VerifyUser.ensureAuthenticated, allTransactions);
router.get('/customer/expenses', VerifyUser.ensureAuthenticated, expense);
router.get('/customer/income', VerifyUser.ensureAuthenticated, income);

module.exports = router;
