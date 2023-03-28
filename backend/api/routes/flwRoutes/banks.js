const router = require('express').Router();
const { getAllBanks } = require('../../controllers');
const flw = require('../../../service/flutterwaveConfig');
const VerifyUser = require('../../../middleware/auth');

router.post('/flw/get/banks', VerifyUser.ensureAuthenticated, getAllBanks);

module.exports = router;
