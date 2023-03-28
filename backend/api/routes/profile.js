const router = require('express').Router();
const { getCustomersProfile, updateCustomersProfile } = require('../controllers');
const VerifyUser = require('../../middleware/auth');

router.get('/customer/profile', VerifyUser.ensureAuthenticated, getCustomersProfile);
router.patch('/customer/update/profile', VerifyUser.ensureAuthenticated, updateCustomersProfile);

module.exports = router;
