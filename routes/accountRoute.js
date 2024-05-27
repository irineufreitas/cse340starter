const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');
const regValidate = require('../utilities/account-validation')

// Render the login page
router.get('/login', accountController.buildLogin);

router.get('/register', accountController.buildRegister);

//router.post('/register', (accountController.registerAccount));

router.get('/', accountController.buildAccountManagement);

// Process the login request
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  accountController.accountLogin,
  
)

// Process the registration data
router.post(
    "/register",
    regValidate.registationRules(),
    regValidate.checkRegData,
    accountController.registerAccount
  )

  // New route for management view
router.get('/management', accountController.buildAccountManagement);

  module.exports = router;