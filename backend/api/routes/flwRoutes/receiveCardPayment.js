const router = require('express').Router();
const { cardPayment, cardAuthorization, validateCardTransaction } = require('../../controllers');
const VerifyUser = require('../../../middleware/auth');

router.post('/flw/payment/card_payment', VerifyUser.ensureAuthenticated, cardPayment);
router.post(
  '/flw/payment/card_payment/authorization',
  VerifyUser.ensureAuthenticated,
  cardAuthorization
);
router.post(
  '/flw/payment/card_payment/validation',
  VerifyUser.ensureAuthenticated,
  validateCardTransaction
);

module.exports = router;
