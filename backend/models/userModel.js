const { Sequelize, DataTypes, Model } = require('sequelize');
const { sequelize } = require('../db/connect');
class UserModel extends Model {}
UserModel.init(
  {
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    full_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING(200),
      allowNull: false,
      unique: true,
    },
    phone: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    bvn: {
      type: DataTypes.STRING(11),
      allowNull: false,
    },
  },
  { sequelize, modelName: 'user' }
);
// TODO:add is verified true or false by KYC:add as a middleware
(async () => {
  try {
    await sequelize.sync({ force: false });
    console.log('Table created successfully.');
  } catch (error) {
    console.error('Unable to create table:', error);
  }
})();

// console.log(UserModel);
module.exports = UserModel;
