const router = require('express').Router();
const VerifyUser = require('../../../middleware/auth');

const { bankVerification } = require('../../controllers');

router.post('/flw/verify_bank', VerifyUser.ensureAuthenticated, bankVerification);

module.exports = router;
