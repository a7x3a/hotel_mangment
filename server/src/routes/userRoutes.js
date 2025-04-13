const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const verifyToken = require('../middlewares/auth');
const checkRole = require('../middlewares/checkRole')
//Public Routes
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);

//Private Routes (path,middleware,controller or function)
router.get('/', verifyToken, checkRole(['Admin']), userController.getAllUsers);
router.get('/:id', verifyToken, checkRole(['Admin','Cashier']), userController.getUserById);
router.put('/update/:id', verifyToken, userController.updateUser);
router.delete('/delete/:id', verifyToken, checkRole(['Admin','Cashier']), userController.deleteUser);
router.post('/logout', verifyToken, userController.logoutUser)
module.exports = router;
