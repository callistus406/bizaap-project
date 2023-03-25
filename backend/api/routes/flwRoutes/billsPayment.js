const router = require('express').Router();
const { getBills, buyAirtime } = require('../../controllers');

router.get('/get/bills', getBills);
router.get('/pay_bill/airtime', buyAirtime);

module.exports = router;
