// require utilities
const accountModel = require('../models/account-model');
const utilities = require('../utilities')
const jwt = require("jsonwebtoken")
const bcrypt = require('bcrypt');

require("dotenv").config()

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav();
  // Ensure messages is always an array
  let messages = req.flash('notice') || [];
  
  if (!Array.isArray(messages)) {
      messages = [messages];
  }

  console.log("Flash messages:", messages); // Debugging line
  res.render("account/login", {
      title: "Login",
      nav,
      messages,
  });
}


/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav();
  const { account_email, account_password } = req.body;

  try {
    const accountData = await accountModel.getAccountByEmail(account_email);

    if (!accountData) {
      req.flash("notice", "Please check your credentials and try again.");
      return res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
        messages: req.flash('notice')
      });
    }

    const isMatch = await bcrypt.compare(account_password, accountData.account_password);

    if (isMatch) {
      delete accountData.account_password;
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });

      res.cookie("jwt", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        maxAge: 3600 * 1000,
      });

      return res.redirect("/account/management");
    } else {
      req.flash("notice", "Please check your credentials and try again.");
      return res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
        messages: req.flash('notice') // Add flash messages
      });
    }
  } catch (error) {
    console.error('Error during login:', error);
    req.flash("notice", "An error occurred during login. Please try again.");
    return res.status(500).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
      messages: req.flash('notice') // Add flash messages
    });
  }
}
/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/register", {
    title: "Register",
    nav,
    messages: req.flash('info'),
    errors: null,
    firstName: '',
    lastName: '',
    email: ''
  });
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav();
  const { firstName, lastName, email, password } = req.body;
  console.log("Request body:", req.body);

  // Generate hash of the password
  const saltRounds = 10;
  bcrypt.hash(password, saltRounds, async function(err, hash) {
    if (err) {
      console.error('Error hashing password:', err);
      req.flash("info", "An error occurred during registration. Please try again.");
      return res.render("account/register", {
        title: "Registration",
        nav,
        messages: req.flash("info"),
        errors: null, // reset errors if any
        firstName,
        lastName,
        email
      });
    } else {
      // Call registerAccount with the hashed password
      const regResult = await accountModel.registerAccount(
        firstName,
        lastName,
        email,
        hash // 
      );

      if (regResult) {
        req.flash(
          "info",
          `Congratulations, you're registered ${firstName}. Please log in.`
        );
        req.flash("notice", req.flash("info")); 
        res.redirect("/account/login");
      } else {
        req.flash("info", "Sorry, the registration failed.");
        res.render("account/register", {
          title: "Registration",
          nav,
          messages: req.flash("info"),
          errors: null, // reset errors if any
          firstName,
          lastName,
          email
        });
      }
    }
  });
}


/* ****************************************
*  Deliver account management view
* *************************************** */
async function buildAccountManagement(req, res, next) {
  let nav = await utilities.getNav();
  let messages = req.flash('info');
  let errors = [];

  if (!Array.isArray(messages)) {
    messages = [messages];
  }

  res.render("account/management", {
    title: "Account Management",
    nav,
    messages,
    errors,
  });
}

module.exports = { buildLogin, buildRegister, registerAccount, accountLogin, buildAccountManagement }
