const router = require('express').Router();
const { requestOtp, otpValidation } = require('../controllers');
router.post('/customer/validste-otp', otpValidation);
router.post('/customer/resend-otp', requestOtp);

module.exports = router;
