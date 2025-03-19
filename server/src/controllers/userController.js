const { User } = require('../schema/index');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Register a new user (Admin or Cashier)
exports.registerUser = async (req, res) => {
    try {
        if (req.cookies.session_token) {
            return res.status(500).json({ message: "already in" });
        }
        const { name, username, password, role } = req.body;
        if(!name || !username || !password || !role){
            return res.status(400).json({ message: "All fields are required" });
        }
        const existingUser = await User.findOne({ where: { username } });
        if (existingUser) return res.status(400).json({ message: 'username already exists' });
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ name, username, password: hashedPassword, role });
        return res.status(201).json({ message: 'user registered successfully', user });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// User login
exports.loginUser = async (req, res) => {
    try {
        if (req.cookies.session_token) {
            return res.status(500).json({ message: "already in" });
        }
        const { username, password } = req.body;
        if(!username || !password){
            return res.status(400).json({ message: "All fields are required" });
        }
        const user = await User.findOne({ where: { username } });
        if (!user) return res.status(400).json({ message: 'Invalid username or password' });
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid username or password' });
        const token = jwt.sign(
            { id: user.user_id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );
        res.cookie('session_token', token, {
            httpOnly: true, 
            maxAge: 24 * 60 * 60 * 1000 // Cookie expires in 1 day
        });
        return res.status(200).json({ message: 'login successful' });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// Get all users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        if(users.length > 0){
            return res.status(200).json(users);
        }else{
            return res.status(404).json({message : 'no user records found!'})
        }    
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// Get a single user by ID
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).json({ message: 'user not found' });
        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// Update user details
exports.updateUser = async (req, res) => {
    try {
        const { name, username, role } = req.body;
        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).json({ message: 'user not found' });
        await user.update({ name, username, role });
        return res.status(200).json({ message: 'user updated successfully', user });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// Delete a user
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).json({ message: 'user not found' });
        await user.destroy();
        return res.status(200).json({ message: 'user deleted successfully' });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

//Logout a user 
exports.logoutUser = async (req, res) => {
    try {
        res.clearCookie('session_token');
        return res.status(200).json({ message: 'logged out successfully' });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
