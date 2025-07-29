require('dotenv').config({ path: './.env' }); // Load environment variables from .env file
const express = require('express');
const { sequelize, Product } = require('./config/database');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5050;

// Middleware applied globally
// CORS allows your frontend to communicate with the backend. Can configure it further to restrict origins, methods, etc.
app.use(cors());
app.use(express.json());

    // Database connection and sync
    (async () => {
        try {
            await sequelize.authenticate();
            console.log('Postgres connection established successfully.'); // This will create the 'products' table if it doesn't exist. For development, you can use `force: true` to drop and recreate the table (remove it for production when you have real data).
            await sequelize.sync(); // Sync models with the database also passing { force: true } will drop and recreate the table for development purposes
            console.log('Database synced successfully.');
        } catch (error) {
            console.error('Unable to connect to the database:', error);
        }
    })();

    // ***SERVER TEST*** Welcome route to test if the server is running
    app.get('/', (req, res) => {
        res.send('Welcome to the Big Biz API');
    });


    // Basic Auth Middleware (for MVP)
    const authMiddleware = (req, res, next) => {
        const token = req.headers.authorization; 

        if (token === 'admin-token-123') {
            next(); 
        } else {
            res.status(401).json({ message: '**** Sorry, server says this is Unauthorized! Please check your token. ****' });
        }
    };


     /*
    ******* LOGIN AUTH ROUTE ********
    Hardcode a simple username/password check (very basic for MVP) In production, use a proper authentication system with hashed passwords and JWTs
    */
    app.post('/api/auth/login', (req, res) => {
        console.log('-----LOGIN REQUEST----- See req.body ===>', req.body);
        // req.body is an object containing the parsed body of the request, typically used for POST requests
        const { username, password } = req.body;
        if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
            return res.json({ message: 'Login successful', token: 'admin-token-123' });
        }
        res.status(401).json({ message: 'Invalid credentials' });
    });



    /*
    ******* PRODUCT CRUD OPERATIONS ********
    */

    // Get All Products from DB (Protected by authMiddleware)
    app.get('/api/products', authMiddleware, async (req, res) => {
        console.log('------Fetching all products from DB------'); // This will log the request to fetch all products
        console.log('------See req.headers.authorization------', req.headers.authorization); // This will log the authorization header sent with the request
        try {
            const products = await Product.findAll();
            res.json(products);
        } catch (err) {
            console.error('Error there was a problem getting products from DB:', err);
            res.status(500).json({ message: 'Internal server error' });
        }
    });

    // Get single product by ID
    app.get('/api/products/:id', authMiddleware, async (req, res) => {
        console.log('------Fetching product with ID: req.params.id------', req.params.id); // req.params is an object holding key-value pairs of the route parameters defined in the route path by a colon (:) like :id
        try {
            const product = await Product.findByPk(req.params.id);
            if (!product) return res.status(404).json({ message: 'Product not found' });
                res.json(product);
            } catch (err) {  
                res.status(500).json({ message: err.message });
            } 
    });


    // Create a new product    
    app.post('/api/products', authMiddleware, async (req, res) => {
        console.log('------Creating new product with data: (req.body)------ ', req.body); // req.body is an object containing the parsed body of the request, typically used for POST requests
        try {
            const newProduct = await Product.create(req.body);
            res.status(201).json(newProduct);
        } catch (err) {
            console.error('Error creating product:', err);
            res.status(400).json({ message: 'Server error' });
        }
    });


    // Update a product by ID
    app.put('/api/products/:id', authMiddleware, async (req, res) => {
        console.log('--- PUT PRODUCT REQUEST ---');
        console.log('------Updating product with ID: req.params.id------', req.params.id); // req.params is an object holding key-value pairs of the route parameters defined in the route path by a colon (:) like :id
        console.log('req.params (ID to update):', req.params);
        console.log('req.body (Updated Data):', req.body);
        console.log('-------------------------');
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
