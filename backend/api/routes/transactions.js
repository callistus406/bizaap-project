const router = require('express').Router();

const { income, expense, allTransactions } = require('../controllers');

router.get('/customer/fetch/transactions', allTransactions);
router.get('/customer/expenses', expense);
router.get('/customer/income', income);

module.exports = router;
