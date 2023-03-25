const router = require('express').Router();
const {
  cardPayment,
  cardAuthorization,
  verifyCardTransaction,
  validateCardTransaction,
} = require('../../controllers');

router.post('/flw/payment/card_payment', cardPayment);
router.get('/flw/payment/card_payment/authorization', cardAuthorization);
router.post('/flw/payment/card_payment/verification', verifyCardTransaction);
router.get('/flw/payment/card_payment/validation', validateCardTransaction);

module.exports = router;
