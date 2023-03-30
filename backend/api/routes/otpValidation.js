const router = require('express').Router();

const { otpValidation } = require('../controllers');
router.post('/customer/validate_otp', otpValidation);

module.exports = router;
