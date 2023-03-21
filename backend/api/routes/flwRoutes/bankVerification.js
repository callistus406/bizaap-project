const router = require('express').Router();

const { bankVerification } = require('../../controllers');

router.post('/verifybank', bankVerification);

module.exports = router;
