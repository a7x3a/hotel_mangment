const { DataTypes } = require('sequelize');
const db = require('../../config/database');

const Room = db.define('Room', {
    room_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    room_number: {
        type: DataTypes.STRING(10),
        allowNull: false,
        unique: true
    },
    room_type: {
        type: DataTypes.ENUM('Single', 'Double', 'Suite'),
        allowNull: false
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('Available', 'Reserved', 'Occupied'),
        allowNull: false,
        defaultValue: 'Available'
    }
}, {
    tableName: 'Room',
    timestamps: false
});

module.exports = Room;
