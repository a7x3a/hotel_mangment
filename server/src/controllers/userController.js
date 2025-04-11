const { User } = require('../schema/index');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Register a new user (Admin or Cashier)
exports.registerUser = async (req, res) => {
    try {
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
        // Check for existing session more securely
        if (req.cookies.session_token) {
            try {
                const decoded = jwt.verify(req.cookies.session_token, process.env.JWT_SECRET);
                return res.status(400).json({ 
                    message: "Already logged in",
                    user: { id: decoded.id, role: decoded.role } // Don't return full user details
                });
            } catch (e) {
                // If token is invalid, clear it and proceed with login
                res.clearCookie('session_token');
            }
        }

        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const user = await User.findOne({ 
            where: { username },
            attributes: { exclude: ['password'] } // Never select password in the first place
        });
        
        if (!user) {
            // Use the same message for both cases to prevent username enumeration
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Need to explicitly get the hashed password for comparison
        const userWithPassword = await User.findOne({
            where: { username },
            attributes: ['password']
        });

        const isMatch = await bcrypt.compare(password, userWithPassword.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        // Generate JWT token with minimal claims
        const token = jwt.sign(
            { 
                id: user.user_id, 
                role: user.role,
                // Add security-related claims
                iss: 'your-app-name',
                aud: 'your-app-client'
            },
            process.env.JWT_SECRET,
            { 
                expiresIn: '1d',
                algorithm: 'HS256' // Explicitly specify algorithm
            }
        );

        // Set secure cookie
        res.cookie('session_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // HTTPS only in production
            sameSite: 'strict', // Prevent CSRF
            maxAge: 24 * 60 * 60 * 1000,
            path: '/',
            domain: process.env.COOKIE_DOMAIN || undefined
        });

        return res.status(200).json({
            message: 'Login successful',
            user: {
                id: user.user_id,
                name: user.name,
                username: user.username,
                role: user.role
                // Only include necessary fields
            }
            // Don't send token in response body when using cookies
        });

    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ message: 'Authentication failed' }); // Generic error message
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
