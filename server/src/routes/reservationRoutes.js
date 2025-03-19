const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');
const verifyToken = require('../middlewares/auth');

//Private Routes
router.get('/',verifyToken,reservationController.getAllReservations);
router.get('/:id',verifyToken,reservationController.getReservationById);
router.post('/create',verifyToken,reservationController.createReservation);
router.delete('/delete/:id',verifyToken,reservationController.deleteReservationById);
router.put('/update/:id',verifyToken,reservationController.updateReservationById);
module.exports = router ;