// backend/src/config/database.js
const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config({ path: '../.env' }); // double check the path to your .env file

const sequelize = new Sequelize( process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: true, // See queries in the console
});

const Product = sequelize.define('Product', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    sku: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    brand: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    price: {
        type: DataTypes.DECIMAL(10, 2)  // Adjust precision and scale as needed
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    imageUrl: {
        type: DataTypes.STRING,
    },
    category: {
        type: DataTypes.STRING,
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
}, {
    tableName: 'products',
    timestamps: true, // Adds createdAt and updatedAt fields
});
    
module.exports = {
    sequelize,
    Product
};
