const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
require('./schema');;
const userRoutes = require('./routes/userRoutes');
const guestRoutes = require('./routes/guestRoutes');
const paymentRoutes = require('./routes/paymentRoutes');  
const roomRoutes = require('./routes/roomRoutes');
const reservationRoutes = require('./routes/reservationRoutes');

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser())

// Use Routes
app.use('/users', userRoutes);
app.use('/guests', guestRoutes);
app.use('/payments', paymentRoutes);
app.use('/rooms', roomRoutes);
app.use('/reservations', reservationRoutes);

// Start server
app.listen(port, () => {
  console.log('\x1b[32m\x1b[1mServer is up and running! 🚀\x1b[0m'); 
  console.log('\x1b[34m\x1b[1mListening on port \x1b[35m' + port + '\x1b[0m'); 
  console.log('\x1b[35mReady 🌍💻\x1b[0m');
});

