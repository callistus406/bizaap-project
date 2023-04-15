const router = require('express').Router();
const VerifyUser = require('../../middleware/auth');
const { resetPassword, confirmResetPassword } = require('../controllers');

router.post('/customer/reset_password', resetPassword);
router.post('/customer/confirm-password/:token', confirmResetPassword);

module.exports = router;
