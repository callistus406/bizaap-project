const router = require('express').Router();
const { registerController } = require('../controllers');
console.log(registerController);
// router.get('/register', getRegisterController);
router.post('/register', registerController);

module.exports = router;
