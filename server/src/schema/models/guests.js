const { DataTypes } = require('sequelize');
const db = require('../../config/database');

const Guest = db.define('Guest', {
    guest_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    phone: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true, // Remove the unique constraint
    },
    document_type: {
        type: DataTypes.ENUM('ID Card', 'SSN'),
        allowNull: false
    },
    document_number: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true
    }
}, {
    tableName: 'Guest',
    timestamps: false
});

module.exports = Guest;
