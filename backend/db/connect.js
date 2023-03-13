const { Sequelize } = require('sequelize');
require('dotenv').config();
// Create a new Sequelize instance
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: 'localhost',
    dialect: 'mysql',
    //   logging: false // Disable logging
  }
);

// Test the database connection
const connectDb = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection to the database has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

// Export the Sequelize instance
module.exports = { connectDb, sequelize };
