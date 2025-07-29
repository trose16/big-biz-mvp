// backend/src/routes/authRoutes.js
const express = require('express');
const authController = require('../controllers/authController'); // Import the auth controller where your logic lives

const router = express.Router(); // Create a new Express Router instance

// Define the POST /login route. This router will handle /login requests.
// The main server.js will later map this router to /api/auth.
router.post('/login', authController.login);

module.exports = router; // Export router so server.js can use it