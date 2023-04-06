const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('../db/connect');
const TopUpModel = sequelize.define('topUp', {
  topUp_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  transaction_ref: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  flw_ref: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  network_service: {
    type: DataTypes.STRING(10),
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
  payment_gateway: {
    type: DataTypes.INTEGER, //:TODO:review this
    allowNull: false,
  },

  status: {
    type: DataTypes.STRING(12),
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
    console.log('TopUp Table created successfully.');
  } catch (error) {
    console.error('Unable to create table:', error);
  }
})();

module.exports = TopUpModel;
