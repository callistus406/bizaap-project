const router = require('express').Router();
const { cardPayment, cardAuthorization, validateCardTransaction } = require('../../controllers');
const VerifyUser = require('../../../middleware/auth');
const { authorizeTransaction } = require('../../../middleware/kycAuth');

router.post('/flw/payment/card_payment', VerifyUser.ensureAuthenticated, cardPayment);
router.post(
  '/flw/payment/card_payment/authorization',
  VerifyUser.ensureAuthenticated,
  authorizeTransaction,
  cardAuthorization
);
router.post(
  '/flw/payment/card_payment/validation',
  VerifyUser.ensureAuthenticated,
  authorizeTransaction,
  validateCardTransaction
);

module.exports = router;
