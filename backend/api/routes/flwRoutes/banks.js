const router = require('express').Router();
const { getAllBanks } = require('../../controllers');
const flw = require('../../../service/flutterwaveConfig');

router.post('/flw/get/banks', getAllBanks);

module.exports = router;
