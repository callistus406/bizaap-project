const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('../db/connect');
const UserModel = require('./userModel');
const TransferModel = sequelize.define('transfer', {
  transfer_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  account_owner: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: UserModel,
      key: 'user_id',
    },
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
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  currency: {
    type: DataTypes.STRING(5),
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
    console.log('Transfer Table created successfully.');
  } catch (error) {
    console.error('Unable to create table:', error);
  }
})();

module.exports = TransferModel;