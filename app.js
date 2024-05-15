const express = require('express');
const app = express();
const errorHandlingMiddleware = require('./errorHandlingMiddleware');


const indexRoute = require('./routes/index');
const errorRoute = require('./routes/error');


app.use(errorHandlingMiddleware);

app.use('/', indexRoute);
app.use('/error', errorRoute); 

module.exports = app;
