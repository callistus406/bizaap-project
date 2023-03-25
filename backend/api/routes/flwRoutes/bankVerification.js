const router = require('express').Router();

const { bankVerification } = require('../../controllers');

router.post('/flw/verify_bank', bankVerification);

module.exports = router;
