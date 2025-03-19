const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');
const verifyToken = require('../middlewares/auth')
const checkRole = require('../middlewares/checkRole')
//Private Routes
router.get('/',verifyToken,roomController.getAllRooms);
router.get('/:id',verifyToken,roomController.getRoomById);
router.post('/create',verifyToken,checkRole(['Admin']),roomController.createRoom);
router.delete('/delete/:id',verifyToken,checkRole(['Admin']),roomController.deleteRoomById);
router.put('/update/:id',verifyToken,checkRole(['Admin']),roomController.updateRoomById);
module.exports = router ;