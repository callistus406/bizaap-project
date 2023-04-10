const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('../db/connect');
const UserModel = require('./userModel');
const WalletModel = require('./walletModel');
const TransferModel = sequelize.define('transfer', {
  transfer_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  sender_account: {
    type: DataTypes.STRING(10),
    allowNull: false,
    references: {
      model: WalletModel,
      key: 'wallet_code',
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
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
  },
  currency: {
    type: DataTypes.STRING(5),
    allowNull: false,
  },
  charged: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
  },
  to_receive: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
  },
  transaction_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING(45),
    allowNull: false,
  },
  destination_account: {
    type: DataTypes.STRING(10),
    allowNull: true,
  },
  remark: {
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
