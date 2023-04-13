const VerifyUser = require('../../middleware/auth');
const { calcTransactionLimitCtrl } = require('../controllers');

const router = require('express').Router();

router.get(
  '/customer/fetch/transaction-limit',
  VerifyUser.ensureAuthenticated,
  calcTransactionLimitCtrl
);

module.exports = router;
