const { DataTypes } = require('sequelize');
const db = require('../../config/database');
const Reservation = require('./reservation');

const Payment = db.define('Payment', {
    payment_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    reservation_id: {
        type: DataTypes.INTEGER,
        allowNull: true,  // Changed from false to true to allow null values
        references: {
            model: Reservation,
            key: 'reservation_id',
            onDelete: 'SET NULL'  // Changed from 'CASCADE' to 'SET NULL'
        }   
    },
    amount_paid: {
        type: DataTypes.DECIMAL(10,2),
        allowNull: false
    },
    payment_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'Payment',
    timestamps: false
});

module.exports = Payment;