const express = require('express');
const app = express();
const session = require("express-session");
const pool = require('./database/');
const expressLayouts = require("express-ejs-layouts");
const env = require("dotenv").config();
const staticRoutes = require("./routes/static");
const baseController = require("./controllers/baseController");
const Util = require('./utilities/index.js');
const inventoryRoute = require("./routes/inventoryRoute");
const accountRoute = require("./routes/accountRoute");
const errorHandlingMiddleware = require('./errorHandlingMiddleware');
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const bcrypt = require('bcrypt');

const utilities = require('./utilities/index.js');
const reviewRoute = require('./routes/reviewRoute');

// Middleware
app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
}));

app.use(require('connect-flash')());
app.use(function(req, res, next){
  res.locals.messages = require('express-messages')(req, res);
  next();
});

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(cookieParser())

app.use(utilities.checkJWTToken)

// make user info available 
app.use((req, res, next) => {
  res.locals.user = {
    isAuthenticated: req.session.isAuthenticated || false,
    account_firstname: req.session.account_firstname,
    account_type: req.session.account_type,
    account_id: req.session.account_id
  };

  // console.log("req.session:", req.session);
  // console.log("res.locals.user:", res.locals.user);
  // console.log("User info set in middleware. isAuthenticated:", req.session.isAuthenticated);
  next();
});

app.use((req, res, next) => {
  if (req.user) {
    res.locals.user = {
      ...res.locals.user,
      ...req.user
    };
  }
  next();
});



// View Engine and Templates
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout"); // not at views root

// Routes
app.use(staticRoutes);

// Index route
app.get("/", baseController.buildHome);

// Inventory routes
app.use("/inv", inventoryRoute);

// Account routes
app.use("/account", accountRoute);

//review routes
app.use('/reviews', reviewRoute);

// File Not Found Route - must be last route in list
app.use(async (req, res, next) => {
  next({status: 404, message: 'Sorry, we appear to have lost that page.'});
});

// Express Error Handler
app.use(async (err, req, res, next) => {
  let nav = await Util.getNav();
  console.error(`Error at: "${req.originalUrl}": ${err.message}`);
  res.render("errors/error", {
    title: err.status || 'Server Error',
    message: err.message,
    nav
  });
});

// Local Server Information
const port = process.env.PORT;
const host = process.env.HOST;

// Log statement to confirm server operation
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`);
});
