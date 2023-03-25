const router = require('express').Router();
const { bankTransfer } = require('../../controllers');

router.get('/payment_failed', (req, res) => {
  res.send('failed payment route');
});

module.exports = router;
