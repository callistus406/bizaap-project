const { Sequelize, DataTypes } = require('sequelize');

const { sequelize } = require('../db/connect');

const LostItemModel = sequelize.define('lost_items', {
  item_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  item_name: {
    type: DataTypes.STRING(45),
    allowNull: false,
  },
  item_worth: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  date_lost: {
    type: DataTypes.STRING(45),
    allowNull: false,
  },
  location_lost: {
    type: DataTypes.STRING(45),
    allowNull: false,
  },
  phone_number: {
    type: DataTypes.STRING(45),
    allowNull: false,
  },
});

(async () => {
  try {
    await sequelize.sync({ force: false });
    console.log(`Payment-gateway Table created successfully.`);
  } catch (error) {
    console.error('Unable to create table:', error);
  }
})();

module.exports = LostItemModel;
