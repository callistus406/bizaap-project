const router = require('express').Router();
const { createBillPayment, getBillsCategories, validateBiller } = require('../../controllers');
const VerifyUser = require('../../../middleware/auth');
const { authorizeTransaction } = require('../../../middleware/kycAuth');

router.get('/flw/bills/category', VerifyUser.ensureAuthenticated, getBillsCategories);
router.get(
  '/flw/bills/payment',
  VerifyUser.ensureAuthenticated,
  authorizeTransaction,
  createBillPayment
);

module.exports = router;
