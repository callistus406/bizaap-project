const router = require('express').Router();

const { income, expense } = require('../controllers');

router.get('/customer/expense', expense);

router.get('/customer/income', income);
// router.get('/customer/all-transaction', income);
module.exports = router;
