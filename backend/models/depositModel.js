const { Sequelize, DataTypes } = require('sequelize');

const { sequelize } = require('../db/connect');
const UserModel = require('./userModel');
const GatewayModel = require('./gatewayModel');
const WalletModel = require('./walletModel');

const DepositModel = sequelize.define('deposit', {
  deposit_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  tx_ref_code: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  depositor: {
    type: DataTypes.STRING(200),
  },
  transaction_code: {
    type: DataTypes.STRING(200),
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
  to_receive: {
    type: DataTypes.DECIMAL(12, 2), //to  personal acct or another users account
    allowNull: false,
  },
  account_number: {
    type: DataTypes.STRING(10), //receivers acct or account owner
    allowNull: false,
    references: {
      model: WalletModel,
      key: 'wallet_code',
    },
  },
  gateway_id: {
    type: DataTypes.INTEGER, //:TODO:review this
    allowNull: false,
    references: {
      model: GatewayModel,
      key: 'gateway_id',
    },
  },
  status: {
    type: DataTypes.STRING(45),
    allowNull: false,
  },
  remark: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
});

(async () => {
  try {
    await sequelize.sync({ force: false });
    console.log(' Deposit Table created successfully.');
  } catch (error) {
    console.error('Unable to create table:', error);
  }
})();

// DepositModel.hasOne(GatewayModel, { foreignKey: 'paymentGatewayId' });
// DepositModel.hasOne(UserModel, { foreignKey: 'userId' });

// DepositModel.belongsTo(GatewayModel, { foreignKey: 'gateway_id' });
// GatewayModel.hasMany(DepositModel, { foreignKey: 'gateway_id' });
// DepositModel.belongsTo(UserModel, { foreignKey: 'user_id' });
module.exports = DepositModel;
