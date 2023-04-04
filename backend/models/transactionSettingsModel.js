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
  transferCharge: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  dailyTransferLimit: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
  },
  monthlyTransferLimit: {
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
