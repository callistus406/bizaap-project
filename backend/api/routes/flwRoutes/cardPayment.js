const {
  cardPayment,
  cardAuthorization,
  verifyCardTransaction,
  validateCardTransaction,
} = require('../../controllers');

const router = require('express').Router();

router.post('/payment/card_payment', cardPayment);
router.get('/payment/card_payment/authorization', cardAuthorization);
router.post('/payment/card_payment/verification', verifyCardTransaction);
router.get('/payment/card_payment/validation', validateCardTransaction);

module.exports = router;
