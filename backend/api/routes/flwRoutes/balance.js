const { fetchBal } = require('../../controllers');

const router = require('express').Router();

router.get('/get/balance', fetchBal);

module.exports = router;
