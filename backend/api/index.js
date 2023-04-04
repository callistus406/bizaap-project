const router = require('express').Router();
const login = require('./routes/login');
const wallet = require('./routes/wallet');
const profile = require('./routes/profile');
const register = require('./routes/register');
const dashboard = require('./routes/dashboard');
const banks = require('./routes/flwRoutes/banks');
const balance = require('./routes/flwRoutes/balance');
const resetPassword = require('./routes/resetPassword');
const otpValidation = require('./routes/otpValidation');
const transfer = require('./routes/flwRoutes/transfer');
const transactions = require('./routes/transactions');
// const income = require('./routes/income');
const billsPayment = require('./routes/flwRoutes/billsPayment');
const lostAndFound = require('./routes/lostAndFound');
const cardPayment = require('./routes/flwRoutes/receiveCardPayment');
const bankVerification = require('./routes/flwRoutes/bankVerification');

// const failedTransaction = require('./routes/flwRoutes/failedTransaction');

router.use(bankVerification);
router.use(billsPayment);
router.use(resetPassword);
router.use(cardPayment);
router.use(transfer);
router.use(otpValidation);
console.log(register);
router.use(dashboard);
router.use(register);
router.use(balance);
router.use(transactions);
router.use(profile);
router.use(wallet);
router.use(login);
router.use(lostAndFound);

router.use(banks);

module.exports = router;
