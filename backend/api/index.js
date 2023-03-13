const router = require('express').Router();

const login = require('./routes/login');
const register = require('./routes/register');
const dashboard = require('./routes/dashboard');
console.log(register);
router.use(login);
router.use(register);
router.use(dashboard);

module.exports = router;
