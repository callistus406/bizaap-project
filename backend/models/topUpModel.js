const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('../db/connect');
const TopUpModel = sequelize.define('topUp', {
  _id: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  topUpId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  transactionCode: {
    type: DataTypes.STRING(45),
    autoIncrement: true,
  },
  networkService: {
    type: DataTypes.STRING(45),
    allowNull: false,
  },
  amount: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
  },

  currencyId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: currency,
      key: 'id', //TODO: review this
    },
  },
  dateTime: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  paymentGatewayId: {
    type: DataTypes.INTEGER, //:TODO:review this
    allowNull: false,
  },

  status: {
    type: DataTypes.STRING(45), //TODO:review this
    allowNull: false,
  },
  remark: {
    type: DataTypes.STRING(100),
    allowNull: true, //TODO:review this
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
