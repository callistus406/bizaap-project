const { fetchBal } = require('../../controllers');
const VerifyUser = require('../../../middleware/auth');
const router = require('express').Router();

router.get('/get/balance', VerifyUser.ensureAuthenticated, fetchBal);

module.exports = router;
