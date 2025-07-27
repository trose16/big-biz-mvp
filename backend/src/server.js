require('dotenv').config({ path: './.env' }); // Load environment variables from .env file
const express = require('express');
const { sequelize, Product } = require('./config/database');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5050;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection and sync
(async () => {
    try {
        await sequelize.authenticate();
        console.log('Postgres connection established successfully.'); // This will create the 'products' table if it doesn't exist. For development, you can use `force: true` to drop and recreate the table (remove it for production when you have real data).
        await sequelize.sync({ force: true }); // Sync models with the database also { force: true } will drop and recreate the table for development purposes
        console.log('Database synced successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
})();

// Basic Auth Middleware (for MVP)
const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization; // For MVP, hardcode a simple token check or remove for public access if just testing product API
    if (token === 'admin-token-123') {
        next(); 
    } else {
        res.status(401).json({ message: 'Sorry Server says this is Unauthorized' });
    }
};

    // Routes
    app.get('/', (req, res) => {
        res.send('Welcome to the Big Biz API');
    });

    // Auth Route (very basic for MVP)
    app.post('/api/auth/login', (req, res) => {
        const { username, password } = req.body;
        if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
            return res.json({ message: 'Login successful', token: 'admin-token-123' });
        }
        res.status(401).json({ message: 'Invalid credentials' });
    });

    // Product Routes (Protected by authMiddleware)
    app.get('/api/products', authMiddleware, async (req, res) => {
        console.log('Fetching products from DB', req.headers);
        try {
            const products = await Product.findAll();
            res.json(products);
        } catch (err) {
            console.error('Error there was a problem getting products from DB:', err);
            res.status(500).json({ message: 'Internal server error' });
        }
    });

    app.get('/api/products/:id', authMiddleware, async (req, res) => {
        try {
            const product = await Product.findByPk(req.params.id);
            if (!product) return res.status(404).json({ message: 'Product not found' });
                res.json(product);
            } catch (err) {  
                res.status(500).json({ message: err.message });
            } 
        });

    app.post('/api/products', authMiddleware, async (req, res) => {
        try {
            const newProduct = await Product.create(req.body);
            res.status(201).json(newProduct);
        } catch (err) {
            console.error('Error creating product:', err);
            res.status(400).json({ message: 'Server error' });
        }
    });

    app.put('/api/products/:id', authMiddleware, async (req, res) => {
        try {
            const product = await Product.findByPk(req.params.id);
            if (!product) return res.status(404).json({ message: 'Product not found' });
            const updatedProduct = await product.update(req.body);
            res.json(updatedProduct);
        } catch (err) {
            console.error('Error updating product:', err);
            res.status(400).json({ message: 'Server error' });
        }
    });

    // Start Server
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
