const { Sequelize, DataTypes, Model } = require('sequelize');

const { sequelize } = require('../db/connect');
const UserModel = require('./userModel');
const WithdrawalModel = require('./withdrawalModel');
// const UserModel = require('./');
class TransactionLogModel extends Model {}
TransactionLogModel.init(
  {
    log_id: {
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
    transaction_id: {
      type: DataTypes.INTEGER,
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
  foreignKey: 'user_id',
  onDelete: 'CASCADE',
});
TransactionLogModel.belongsTo(WithdrawalModel, {
  foreignKey: 'user_id',
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
