// backend/src/config/database.js
const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config({ path: '../.env' }); // double check the path to your .env file

const sequelize = new Sequelize( process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: true, // See queries in the console
});

module.exports = { sequelize }; 

