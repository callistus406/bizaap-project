const { Sequelize, DataTypes, Model } = require('sequelize');

const { sequelize } = require('../db/connect');
const UserModel = require('./userModel');
const TransferModel = require('./transferModel');
// const UserModel = require('./');
class TransactionLogModel extends Model {}
TransactionLogModel.init(
  {
    transaction_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    transaction_type: {
      type: DataTypes.STRING(45), //debit or credit
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
    account_number: {
      type: DataTypes.STRING(10), //accout in qust
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
  },
  { sequelize, modelName: 'transactionLog' }
);
console.log(TransactionLogModel.belongsTo);

TransactionLogModel.belongsTo(UserModel, {
  foreignKey: 'customer_id',
  onDelete: 'CASCADE',
});
TransactionLogModel.belongsTo(TransferModel, {
  foreignKey: 'customer_id',
  onDelete: 'CASCADE',
});

//
(async () => {
  try {
    await sequelize.sync({ force: false });
    console.log(' TransactionLog Table created successfully.');
  } catch (error) {
    console.error('Unable to create table:', error);
  }
})();

module.exports = TransactionLogModel;
