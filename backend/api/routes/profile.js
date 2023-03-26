const router = require('express').Router();
const { getCustomersProfile, updateCustomersProfile } = require('../controllers');

router.get('/customer/profile', getCustomersProfile);
router.patch('/customer/update/profile', updateCustomersProfile);

module.exports = router;
