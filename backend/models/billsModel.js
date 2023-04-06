const { Sequelize, DataTypes } = require('sequelize');

const { sequelize } = require('../db/connect');
const UserModel = require('./userModel');

const BillsModel = sequelize.define('bills', {
  bills_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  customer_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: UserModel,
      key: 'user_id',
    },
  },

  flw_ref: {
    type: DataTypes.STRING(45),
    allowNull: false,
  },
  tx_ref: {
    type: DataTypes.STRING(45),
    allowNull: false,
  },
  bill_type: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },

  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  currency: {
    type: DataTypes.STRING(5),
    allowNull: false,
  },

  payment_gateway: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING(45),
    allowNull: false,
  },
  remark: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
});

(async () => {
  try {
    await sequelize.sync({ force: false });
    console.log(' Bills Table created successfully.');
  } catch (error) {
    console.error('Unable to create table:', error);
  }
})();

module.exports = BillsModel;
