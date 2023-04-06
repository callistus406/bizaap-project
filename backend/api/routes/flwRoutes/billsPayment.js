const router = require('express').Router();
const { createBillPayment, getBillsCategories, validateBiller } = require('../../controllers');
const VerifyUser = require('../../../middleware/auth');

router.get('/flw/bills/category', VerifyUser.ensureAuthenticated, getBillsCategories);
router.get('/flw/bills/payment', VerifyUser.ensureAuthenticated, createBillPayment);

module.exports = router;
