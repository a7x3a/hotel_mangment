const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController')
const verifyToken = require('../middlewares/auth')

//Private Routes
router.get('/',verifyToken,paymentController.getAllPayments);
router.get('/:id',verifyToken,paymentController.getPaymentById);
router.post('/create',verifyToken,paymentController.createPayment);
router.delete('/delete/:id',verifyToken,paymentController.deletePayment);
router.get('/reservation/:reservation_id',verifyToken,paymentController.getPaymentByReservationId);
router.put('/update/:id',verifyToken,paymentController.updatePayment);
module.exports = router ;