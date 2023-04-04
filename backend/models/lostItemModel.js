const { Sequelize, DataTypes } = require('sequelize');

const { sequelize } = require('../db/connect');
const UserModel = require('./userModel');

const LostItemModel = sequelize.define('lost_items', {
  item_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  image_url: {
    type: DataTypes.STRING(200),
    allowNull: false,
  },
  item_name: {
    type: DataTypes.STRING(45),
    allowNull: false,
  },
  item_worth: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
  },
  date_lost: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  location_lost: {
    type: DataTypes.STRING(45),
    allowNull: false,
  },
  username: {
    type: DataTypes.STRING(45),
    allowNull: false,
    references: {
      model: UserModel,
      key: 'username',
    },
  },
  phone_number: {
    type: DataTypes.STRING(45),
    allowNull: false,
  },
});

(async () => {
  try {
    await sequelize.sync({ force: false });
    console.log(`lostItem Table created successfully.`);
  } catch (error) {
    console.error('Unable to create table:', error);
  }
})();

module.exports = LostItemModel;
