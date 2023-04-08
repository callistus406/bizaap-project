const { Sequelize, DataTypes, Model } = require('sequelize');
const { sequelize } = require('../db/connect');
const UserModel = require('./userModel');
class KycModel extends Model {}
KycModel.init(
  {
    kyc_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: UserModel,
        key: 'user_id',
      },
    },
    nin_number: {
      type: DataTypes.STRING(11),
      allowNull: false,
    },
    photo_url: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
  },
  { sequelize, modelName: 'kyc' }
);
KycModel.belongsTo(UserModel, { foreignKey: 'kyc_id' });
UserModel.hasOne(KycModel, { foreignKey: 'user_id' });
// TODO:add is verified true or false by KYC:add as a middleware
(async () => {
  try {
    await sequelize.sync({ force: false });
    console.log('KycModel created successfully.');
  } catch (error) {
    console.error('Unable to create table:', error);
  }
})();

// console.log(UserModel);
module.exports = KycModel;
