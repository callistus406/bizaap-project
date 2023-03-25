const router = require('express').Router();
const { createWallet, getWallet, createWalletPin } = require('./../controllers');

router.post('/customer/create/wallet', createWallet);
router.get('/customer/find/wallet', getWallet);
router.patch('/customer/wallet/create_pin', createWalletPin);

module.exports = router;
