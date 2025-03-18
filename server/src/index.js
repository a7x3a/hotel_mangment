const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
require('./schema');;//index-schema is the file that contains all the schemas
const userRoutes = require('./routes/userRoutes');
const guestRoutes = require('./routes/guestRoutes');
const paymentRoutes = require('./routes/paymentRoutes');  
// const roomRoutes = require('./routes/roomRoutes');
// const reservationRoutes = require('./routes/ReservationRoutes');
// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser())

// Use Routes
app.use('/users', userRoutes);
app.use('/guests', guestRoutes);
app.use('/payments', paymentRoutes);
// app.use('/rooms', roomRoutes);
// app.use('/reservations', reservationRoutes);

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 
