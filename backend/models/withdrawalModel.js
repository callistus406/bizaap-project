const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('../db/connect');
const WithdrawalModel = sequelize.define('withdrawal', {
  withdrawal_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  account_owner: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  transaction_code: {
    type: DataTypes.STRING(45),
    allowNull: false,
  },
  transaction_ref: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  currency: {
    type: DataTypes.STRING(4),
    allowNull: false,
  },
  charged: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  to_receive: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  date_time: {
    type: DataTypes.STRING(10), //TODO: update this
    allowNull: false,
  },
  method: {
    type: DataTypes.STRING(45), //TODO:review this
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING(45),
    allowNull: false,
  },
  receiver: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  destination_acct: {
    type: DataTypes.STRING(10),
    allowNull: true,
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
