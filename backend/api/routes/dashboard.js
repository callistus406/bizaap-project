const router = require('express').Router();

router.get('/dashboard', (req, res) => {
  res.send({ success: true, payload: 'Dashboard route' });
});

module.exports = router;
