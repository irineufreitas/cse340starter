// require utilities
const accountModel = require('../models/account-model');
const utilities = require('../utilities')
const jwt = require("jsonwebtoken")
const bcrypt = require('bcrypt');
const reviewModel = require("../models/review-model");

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
      req.session.account_firstname = accountData.account_firstname;
      req.session.account_type = accountData.account_type;
      req.session.account_id = accountData.account_id;
      req.session.isAuthenticated = true;

      // console.log("User logged in. isAuthenticated:", req.session.isAuthenticated);
      // console.log("account_firstname:", accountData.account_firstname);
      // console.log("Account type:", accountData.account_type);
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


// accountLogout

async function accountLogout(req, res) {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error logging out:', err);
      return res.status(500).send('Error logging out');
    }
    res.clearCookie('jwt');
    res.redirect('/');
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
  // console.log("res.locals.user:", res.locals.user);

  // Fetch account data and reviews by the logged-in user
  const accountId = req.session.account_id;
  const reviews = await reviewModel.getReviewsByAccountId(accountId);

  // Check the account type
  const accountType = res.locals.user.account_type;

  // Greet the user based on account type
  let greeting = `<h2>Welcome ${res.locals.user.account_firstname}</h2>`;
  if (accountType === "Employee" || accountType === "Admin") {
    // Add additional heading for inventory management
    greeting += "<h3>Inventory Management</h3>";
    // Add link to access inventory management view
    greeting += `<p><a href="/inventory/management">Manage Inventory</a></p>`;
  }

  res.render("account/management", {
    title: "Account Management",
    nav,
    messages,
    errors,
    greeting,
    reviews // Pass greeting to the view
  });
}

/* ****************************************
*  Process Account Information Update
* *************************************** */
async function updateAccountInformation(req, res) {
  let nav = await utilities.getNav();
  
  const { accountId, firstName, lastName, email } = req.body;

  try {
    // Call the model function to update the account information
    const updateResult = await accountModel.updateAccountInformation(accountId, firstName, lastName, email);

    if (updateResult) {
      req.flash("info", "Account information updated successfully.");
      return res.redirect("/account/management");
    } else {
      req.flash("info", "Failed to update account information. Please try again.");
      return res.redirect("/account/management");
    }
  } catch (error) {
    console.error('Error updating account information:', error);
    req.flash("info", "An error occurred. Please try again.");
    return res.redirect("/account/management");
  }
}

/* ****************************************
*  Process Password Change
* *************************************** */
async function changePassword(req, res) {
  let nav = await utilities.getNav();
  const { accountId, newPassword } = req.body;

  try {
    // Generate hash of the new password
    const saltRounds = 10;
    bcrypt.hash(newPassword, saltRounds, async function(err, hash) {
      if (err) {
        console.error('Error hashing password:', err);
        req.flash("info", "An error occurred. Please try again.");
        return res.redirect("/account/management");
      } else {
        // Call the model function to change the password
        const changePasswordResult = await accountModel.changePassword(accountId, hash);

        if (changePasswordResult) {
          req.flash("info", "Password changed successfully.");
          return res.redirect("/account/management");
        } else {
          req.flash("info", "Failed to change password. Please try again.");
          return res.redirect("/account/management");
        }
      }
    });
  } catch (error) {
    console.error('Error changing password:', error);
    req.flash("info", "An error occurred. Please try again.");
    return res.redirect("/account/management");
  }
}

// Render the update account information form
async function renderUpdateAccountForm(req, res) {
  try {
    const nav = await utilities.getNav();
    // Fetch account data to prepopulate the form fields
    const accountData = await accountModel.getAccountById(req.session.account_id);
    res.render("account/update", {
      title: "Update Account Information",
      nav,
      user: accountData, 
      errors: [],
      messages: [],
      messages: req.flash('info')
    });
  } catch (error) {
    console.error("Error rendering update account form:", error);
    req.flash('info', 'An error occurred while rendering the update account form.');
    res.redirect('/account/management');
  }
}

const getAccountAdmin = async (req, res) => {
  const { account_id } = req.user;
  try {
    const userReviewsQuery = `SELECT reviews.*, inventory.inv_make, inventory.inv_model
                              FROM reviews
                              JOIN inventory ON reviews.inv_id = inventory.inv_id
                              WHERE account_id = $1
                              ORDER BY review_date DESC`;

    const userReviewsResult = await pool.query(userReviewsQuery, [account_id]);

    const userReviews = userReviewsResult.rows;

    res.render('accountAdmin', { user: req.user, userReviews });
  } catch (error) {
    console.error('Error getting account details:', error);
    res.redirect('/');
  }
};



module.exports = { buildLogin, buildRegister, registerAccount, accountLogin, buildAccountManagement, accountLogout, updateAccountInformation, changePassword, renderUpdateAccountForm, getAccountAdmin };
