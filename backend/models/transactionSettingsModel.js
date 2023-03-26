const { Sequelize, DataTypes } = require('sequelize');

const { sequelize } = require('../db/connect');

const TransactionLSettingsModel = sequelize.define('transactionSettings', {
  _id: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  currentValue: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  withdrawalCharge: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  dailyWithdrawalLimit: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  monthlyWithdrawalLimit: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
});

(async () => {
  try {
    await sequelize.sync({ force: false });
    console.log(' TransactionSettings Table created successfully.');
  } catch (error) {
    console.error('Unable to create table:', error);
  }
})();

module.exports = TransactionLSettingsModel;