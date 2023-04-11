const router = require('express').Router();
const VerifyUser = require('../../../middleware/auth');

const { bankVerification } = require('../../controllers');

router.post('/flw/verify-bank', VerifyUser.ensureAuthenticated, bankVerification);

module.exports = router;
