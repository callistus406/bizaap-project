const { Sequelize, DataTypes } = require('sequelize');

const { sequelize } = require('../db/connect');

const GatewayModel = sequelize.define('payment_gateway', {
  gateway_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  gateway_name: {
    type: DataTypes.STRING(45),
    allowNull: false,
  },
  gateway_type: {
    type: DataTypes.STRING(45),
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
    console.log(`Payment-gateway Table created successfully.`);
  } catch (error) {
    console.error('Unable to create table:', error);
  }
})();

module.exports = GatewayModel;
