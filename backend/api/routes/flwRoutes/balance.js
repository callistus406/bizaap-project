const { fetchBal } = require('../../controllers');
const VerifyUser = require('../../../middleware/auth');
const router = require('express').Router();

router.get('/customer/fetch/balance', VerifyUser.ensureAuthenticated, fetchBal);

module.exports = router;
