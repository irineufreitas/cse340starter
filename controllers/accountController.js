// require utilities
const accountModel = require('../models/account-model');
const utilities = require('../utilities')

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav();
  // Ensure messages is always an array
  let messages = req.flash('info');
  
  if (!Array.isArray(messages)) {
      messages = [];
  }
  res.render("account/login", {
      title: "Login",
      nav,
      messages,
  });
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
  const { firstName, lastName, email, password } = req.body
  console.log("Request body:", req.body);

  const regResult = await accountModel.registerAccount(
    firstName,
    lastName,
    email,
    password
  )

  if (regResult) {
    req.flash(
      "info",
      `Congratulations, you're registered ${firstName}. Please log in.`
    )
    res.redirect("/account/login");
  } else {
    req.flash("info", "Sorry, the registration failed.")
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


module.exports = { buildLogin, buildRegister, registerAccount }
