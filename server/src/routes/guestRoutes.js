const express = require('express');
const router = express.Router();
const guestController = require('../controllers/guestController')
const verifyToken = require('../middlewares/auth')

//Private Routes cause if u not logged as Cashier or Admin Can,t See Anything
router.get('/',verifyToken,guestController.getAllGuests);
router.get('/:id',verifyToken,guestController.getUserById);
router.delete('/delete/:id',verifyToken,guestController.deleteGuestById)
router.post('/createGuest',verifyToken,guestController.createGuest);
router.put('/update/:id',verifyToken,guestController.updateGuest)

module.exports = router