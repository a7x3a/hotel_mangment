const { DataTypes } = require('sequelize');
const db = require('../../config/database');
const Guest = require('./guests');
const User = require('./users');
const Room = require('./room');
    
const Reservation = db.define('Reservation', {
    reservation_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    guest_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Guest,
            key: 'guest_id'
        }
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'user_id'
        }
    },
    room_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Room,
            key: 'room_id'
        }
    },
    check_in: {
        type: DataTypes.DATE,
        allowNull: false
    },
    check_out: {
        type: DataTypes.DATE,
        allowNull: false
    },
    start_from: {
        type: DataTypes.DATE,
        allowNull: false
    },
    total_price: {
        type: DataTypes.DECIMAL(10,2),
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('Pending', 'Confirmed', 'Cancelled'),
        allowNull: false,
        defaultValue: 'Pending'
    }
}, {
    tableName: 'Reservation',
    timestamps: false
});

module.exports = Reservation;
