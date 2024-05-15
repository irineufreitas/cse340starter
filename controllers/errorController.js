// errorController.js

const path = require('path');

const errorController = {};

// Controller function to trigger an intentional error
errorController.triggerError = (req, res, next) => {
    try {
        // Simulate an error by accessing an undefined variable
        console.log(undefinedVariable); // This will throw an error
    } catch (error) {
        // Pass the error to the error handling middleware
        next(error);
    }
};

// Controller function to handle 500 errors
errorController.handle500Error = (err, req, res, next) => {
    res.status(500).render(path.join(__dirname, '../views/error/error-trigger.ejs'), {
        title: 'Error',
        year: new Date().getFullYear() 
    });
};

module.exports = errorController;
