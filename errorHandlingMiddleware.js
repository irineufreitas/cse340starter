const errorHandlingMiddleware = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('error', {
        title: 'Error',
        year: new Date().getFullYear() 
    });
};

module.exports = errorHandlingMiddleware;
