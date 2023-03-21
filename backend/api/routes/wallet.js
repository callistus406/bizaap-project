const router = require('express').Router();
const { createWallet, getWallet } = require('./../controllers');

router.post('/customer/create/wallet', createWallet);
router.get('/customer/find/wallet', getWallet);

module.exports = router;
