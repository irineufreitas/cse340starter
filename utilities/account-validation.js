const utilities = require(".")
  const { body, validationResult } = require("express-validator")
  const validate = {}

  /*  **********************************
  *  Registration Data Validation Rules
  * ********************************* */
  validate.registationRules = () => {
    return [
      // firstname is required and must be string
      body("firstName")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide a first name."), // on error this message is sent.
  
      // lastname is required and must be string
      body("lastName")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 2 })
        .withMessage("Please provide a last name."), // on error this message is sent.
  
      // valid email is required and cannot already exist in the DB
      body("email")
      .trim()
      .escape()
      .notEmpty()
      .isEmail()
      .normalizeEmail() // refer to validator.js docs
      .withMessage("A valid email is required."),
  
      // password is required and must be strong password
      body("password")
        .trim()
        .notEmpty()
        .isStrongPassword({
          minLength: 12,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1,
        })
        .withMessage("Password does not meet requirements."),
    ]
  }

/*  **********************************
*  Login Data Validation Rules
* ********************************* */
validate.loginRules = () => {
  return [
    // valid email is required
    body("account_email")
      .trim()
      .escape()
      .notEmpty()
      .isEmail()
      .normalizeEmail() // refer to validator.js docs
      .withMessage("A valid email is required."),

    // password is required
    body("account_password")
      .trim()
      .notEmpty()
      .withMessage("Password is required."),
  ];
};


  /* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
  validate.checkRegData = async (req, res, next) => {
    const errors = validationResult(req);
    const { firstName, lastName, email, password } = req.body;
  
    // Check for empty fields
    if (!errors.isEmpty()) {
      const nav = await utilities.getNav();
      res.render("account/register", {
        title: "Registration",
        nav,
        errors: errors.array(),
        firstName,
        lastName,
        email,
      });
      return;
    }
  
    // Perform additional validation checks here if needed
  
    next(); // If no errors, proceed to the next middleware
  };

  /* ******************************
* Check login data and return errors or continue to login
* ***************************** */
validate.checkLoginData = async (req, res, next) => {
  const errors = validationResult(req);
  const { account_email } = req.body;

  if (!errors.isEmpty()) {
    const nav = await utilities.getNav();
    res.render("account/login", {
      title: "Login",
      nav,
      errors: errors.array(),
      account_email,
    });
    return;
  }

  next();
};
  
  module.exports = validate;