const { Sequelize, DataTypes, Model } = require('sequelize');
const { sequelize } = require('../db/connect');
class ResetPasswordModel extends Model {}
ResetPasswordModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    token: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },
  { sequelize, modelName: 'resetPassword' }
);

(async () => {
  try {
    await sequelize.sync({ force: false });
    console.log('Table created successfully.');
  } catch (error) {
    console.error('Unable to create table:', error);
  }
})();

// console.log(UserModel);
module.exports = ResetPasswordModel;
