const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');
const regValidate = require('../utilities/account-validation');
const utilities = require('../utilities');
const authMiddleware = require('../middleware/authMiddleware'); 

// Render the login page
router.get('/login', accountController.buildLogin);

router.get('/register', accountController.buildRegister);

router.get('/', accountController.buildAccountManagement);

// Process the login request
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  accountController.accountLogin
);

// Process the registration data
router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  accountController.registerAccount
);

// New route for management view
router.get('/management', authMiddleware,utilities.checkLogin, accountController.buildAccountManagement);

// Add logout route
router.get('/logout', accountController.accountLogout);

// accountRoute.js

// Route to render the update account information form
router.get("/update", authMiddleware, accountController.renderUpdateAccountForm); 

// Route to handle account information update
router.post("/update/:id", authMiddleware, accountController.updateAccountInformation); 


// Change password route
router.post(
  "/change-password",
  accountController.changePassword
);

module.exports = router;
