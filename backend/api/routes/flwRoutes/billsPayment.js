const router = require('express').Router();
const { getBills, buyAirtime } = require('../../controllers');
const VerifyUser = require('../../../middleware/auth');

router.get('/get/bills', VerifyUser.ensureAuthenticated, getBills);
router.get('/pay_bill/airtime', VerifyUser.ensureAuthenticated, buyAirtime);

module.exports = router;
