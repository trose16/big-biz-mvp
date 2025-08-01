// backend/src/server.js

require('dotenv').config({ path: './.env' });
const express = require('express');
const { sequelize } = require('./config/database');
const Product = require('./models/Product');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes'); // Import new auth router

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

    // Mount the authentication routes under the /api/auth path
    app.use('/api/auth', authRoutes);


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

    // DELETE (Remove) a product by ID
    app.delete('/api/products/:id', authMiddleware, async (req, res) => {
        console.log('--- DELETE PRODUCT REQUEST ---');
        console.log('req.params (ID to delete):', req.params);
        console.log('----------------------------');
        try {
            const productId = req.params.id; // Get the product ID from URL parameters

            // Use Sequelize's destroy method to delete the product
            // It returns the number of rows deleted (0 or 1 for a primary key match)
            const deletedRowCount = await Product.destroy({
                where: { id: productId }
            });

            if (deletedRowCount === 0) {
                // If no rows were deleted, it means the product with that ID was not found
                console.log(`--- DELETE PRODUCT: Product with ID ${productId} not found. ---`);
                return res.status(404).json({ message: 'Product not found.' });
            }

            // If deletion was successful, send 204 No Content
            console.log(`--- DELETE PRODUCT: Product with ID ${productId} deleted successfully. ---`);
            res.status(204).send(); // Send 204 No Content

        } catch (err) {
            console.error('--- DELETE PRODUCT: Failed to delete product:', err.message, '---');
            res.status(500).json({ message: err.message });
        }
    });



    // Start Server
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
