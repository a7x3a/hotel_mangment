const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const verifyToken = require('../middlewares/auth');

//Public Routes
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);

//Private Routes (path,middleware,controller or function)
router.get('/', verifyToken , userController.getAllUsers);
router.get('/:id', verifyToken , userController.getUserById);
router.put('/update/:id', verifyToken , userController.updateUser);
router.delete('/delete/:id', verifyToken , userController.deleteUser);
router.post('/logout',verifyToken,userController.logoutUser)
module.exports = router;
