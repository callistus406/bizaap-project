const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('../db/connect');
const WithdrawalModel = sequelize.define('withdrawal', {
  _id: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },

  withdrawalId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  transactionCode: {
    type: DataTypes.STRING(45),
    autoIncrement: true,
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },

  currencyId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: currency,
      key: 'id', //TODO: review this
    },
  },
  charged: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  toReceive: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  dateTime: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  method: {
    type: DataTypes.INTEGER, //TODO:review this
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING(45),
    allowNull: false,
  },
  remarks: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
});

(async () => {
  try {
    await sequelize.sync({ force: false });
    console.log('Withdrawal Table created successfully.');
  } catch (error) {
    console.error('Unable to create table:', error);
  }
})();

module.exports = WithdrawalModel;
