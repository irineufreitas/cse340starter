const express = require('express');
const router = express.Router();
const errorController = require('../controllers/errorController');

// Intentionally trigger an error
router.get('/trigger-error', errorController.triggerError);

module.exports = router;
