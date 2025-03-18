const db = require('../config/database');
const User = require('./models/users'); // Import the User model
const Guest = require('./models/guests'); // Import the Guest model
const Room = require('./models/room'); // Import the Room model
const Reservation = require('./models/reservation'); // Import the Reservation model
const Payment = require('./models/payment'); // Import the Payment model

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
