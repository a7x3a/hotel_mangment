const db = require('../config/database');
const User = require('./models/users'); 
const Guest = require('./models/guests'); 
const Room = require('./models/room');
const Reservation = require('./models/reservation');
const Payment = require('./models/payment'); 

// Sync all models
const syncModels = async () => {
    try {
        await db.sync();
        console.log("All tables synchronized successfully!");
    } catch (error) {
        console.error("Error syncing tables:", error);
    }
};

syncModels();

module.exports = { User, Guest, Room, Reservation, Payment };
