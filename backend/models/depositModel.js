const { Sequelize, DataTypes } = require('sequelize');

const { sequelize } = require('../db/connect');
const UserModel = require('./userModel');
const GatewayModel = require('./gatewayModel');

const DepositModel = sequelize.define('deposit', {
  tx_ref_code: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  deposit_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  depositor: {
    type: DataTypes.STRING(200),
  },
  transaction_code: {
    type: DataTypes.STRING(200),
    allowNull: false,
  },
  deposit_amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  currency: {
    type: DataTypes.STRING(5),
    allowNull: false,
  },
  to_receive: {
    type: DataTypes.FLOAT, //to  personal acct or another users account
    allowNull: false,
  },
  receiver: {
    type: DataTypes.INTEGER, //to  personal acct or another users account
    allowNull: false,
    references: {
      model: UserModel,
      key: 'user_id',
    },
    status: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    remark: {
      type: DataTypes.STRING(200),
      allowNull: true,
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
  remarks: {
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
