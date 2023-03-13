const { Sequelize, DataTypes } = require('sequelize');
const {sequelize} = require('../db/connect');
const UserModel = sequelize.define('users', {
  _id:{
    type:DataTypes.STRING,
    primaryKey: true,

  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  businessName: {
    type: DataTypes.STRING,
    allowNull: false,

  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

(async () => {
  try {
    await sequelize.sync({ force: false });
    console.log('Table created successfully.');
  } catch (error) {
    console.error('Unable to create table:', error);
  }
})();

module.exports = UserModel
