const { Sequelize, DataTypes } = require('sequelize');

const { sequelize } = require('../db/connect');

const BillsModel = sequelize.define('bills', {
  _id: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  billsId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  transactionCode: {
    type: DataTypes.STRING(45),
    allowNull: false,
  },
  referenceNumber: {
    type: DataTypes.STRING(45),
    autoIncrement: true,
    primaryKey: true,
  },

  amount: {
    type: DataTypes.FLOAT, //TODO: review this
    allowNull: false,
  },
  currencyId: {
    type: DataTypes.INTEGER, //TODO: review this
    allowNull: false,
  },
  dateTime: {
    type: DataTypes.DATE,
    allowNull: false,
  },

  paymentGatewayId: {
    type: DataTypes.INTEGER(11), //:TODO:review this
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
    console.log(' Deposit Table created successfully.');
  } catch (error) {
    console.error('Unable to create table:', error);
  }
})();

module.exports = BillsModel;
