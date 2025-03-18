const { DataTypes } = require('sequelize');
const db = require('../../config/database');

const User = db.define('User', {
    user_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    username: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM('Admin', 'Cashier'),
        allowNull: false
    }
}, {
    tableName: 'Users', // Explicitly setting table name to match SQL schema
    timestamps: false // Disable `createdAt` and `updatedAt` fields if not needed
});


module.exports = User;
