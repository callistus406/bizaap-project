const router = require('express').Router();
const { bankTransfer } = require('../../controllers');

router.get('/payment_processing', (req, res) => {
  res.send('processing payment route...');
});

module.exports = router;
