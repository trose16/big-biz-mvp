// backend/src/controllers/authController.js

const login = (req, res) => {
    console.log('--- authController: login function received request ---'); // Added context log
    console.log('Request body:', req.body); // Added context log

    const { username, password } = req.body;

    if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
        console.log('--- authController: Login successful for user:', username, '---'); // Added context log
        return res.json({ message: 'Login successful', token: 'admin-token-123' });
    } else {
        console.log('--- authController: Login failed for user:', username, '---'); // Added context log
        res.status(401).json({ message: 'Invalid credentials' });
    }
};

module.exports = { login }; // Export function so authRoutes.js can import it