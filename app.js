const express = require('express');
const app = express();
const errorHandlingMiddleware = require('./errorHandlingMiddleware');

// Define your routes
const indexRoute = require('./routes/index');
const errorRoute = require('./routes/error');

// Mount the error handling middleware
app.use(errorHandlingMiddleware);

// Mount your routes
app.use('/', indexRoute);
app.use('/error', errorRoute); // Assuming your error route is mounted under /error path

module.exports = app;
