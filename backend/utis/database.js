const Sequelize = require('sequelize');

const sequelize = new Sequelize('bizzapdb', 'newuser1', 'password27$', {
  dialect: 'mysql',
  host: 'localhost',
});

module.exports = sequelize;
