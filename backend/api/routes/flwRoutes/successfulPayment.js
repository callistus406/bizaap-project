const router = require('express').Router();
const { bankTransfer } = require('../../controllers');

router.get('/payment_successful', (req, res) => {
  res.send('successful payment route');
});

module.exports = router;
