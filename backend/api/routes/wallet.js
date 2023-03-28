const router = require('express').Router();
const { createWallet, getWallet, createWalletPin } = require('./../controllers');
const VerifyUser = require('../../middleware/auth');

router.post('/customer/create/wallet', VerifyUser.ensureAuthenticated, createWallet);
router.get('/customer/find/wallet', VerifyUser.ensureAuthenticated, getWallet);
router.patch('/customer/wallet/create_pin', VerifyUser.ensureAuthenticated, createWalletPin);

module.exports = router;
