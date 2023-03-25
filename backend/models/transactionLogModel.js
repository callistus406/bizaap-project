const { Sequelize, DataTypes } = require('sequelize');

const { sequelize } = require('../db/connect');

const TransactionLogModel = sequelize.define('transactionLog', {
  _id: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  logId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  type: {
    type: DataTypes.STRING(45),
    allowNull: false,
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },

  status: {
    type: DataTypes.STRING(45),
    allowNull: false,
  },
});

(async () => {
  try {
    await sequelize.sync({ force: false });
    console.log(' TransactionLog Table created successfully.');
  } catch (error) {
    console.error('Unable to create table:', error);
  }
})();

module.exports = TransactionLogModel;
