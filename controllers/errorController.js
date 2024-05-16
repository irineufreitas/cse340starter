

const path = require('path');

const errorController = {};

// Controller function to trigger an intentional error
errorController.triggerError = (req, res, next) => {
    try {
       
        console.log(undefinedVariable); // This will throw an error
    } catch (error) {
       
        next(error);
    }
};

errorController.handle500Error = (err, req, res, next) => {
    res.status(500).render(path.join(__dirname, '../views/error/error-trigger.ejs'), {
        title: 'Error',
        year: new Date().getFullYear() 
    });
};

module.exports = errorController;
