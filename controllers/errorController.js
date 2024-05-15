const errorController = {};

errorController.triggerError = (req, res, next) => {
    console.log(undefinedVariable); 
};

module.exports = errorController;
