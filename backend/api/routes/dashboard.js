const router = require('express').Router();

router.get('/customer/dashboard', (req, res) => {
  res.send({ success: true, payload: 'Dashboard route' });
});

module.exports = router;
