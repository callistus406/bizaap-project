const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('../db/connect');

const UserModel = require('./userModel');
const WalletModel = sequelize.define('wallet', {
  wallet_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  wallet_owner: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  wallet_code: {
    type: DataTypes.STRING(45),
    allowNull: false,
    unique: true,
  },
  wallet_pin: {
    type: DataTypes.STRING(200),
    allowNull: true,
  },

  balance: {
    type: DataTypes.FLOAT, //TODO:change to decimal

    allowNull: false,
    defaultValue: 0,
  },
});

WalletModel.belongsTo(UserModel, { foreignKey: 'wallet_owner' });

(async () => {
  try {
    await sequelize.sync({ force: false });
    console.log(`Wallet Table created successfully.`);
  } catch (error) {
    console.error('Unable to create table:', error);
  }
})();

module.exports = WalletModel;
