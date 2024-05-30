const jwt = require('jsonwebtoken');
const { getAccountById } = require('../models/account-model');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (token) {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      const accountId = decoded.account_id;
      const account = await getAccountById(accountId);

      if (account) {
        req.user = account; 
        next(); 
      } else {
        req.flash('notice', 'Access denied. Please log in.');
        res.redirect('/account/login');
      }
    } else {
      req.flash('notice', 'Access denied. Please log in.');
      res.redirect('/account/login');
    }
  } catch (error) {
    console.error('Error in authMiddleware:', error);
    req.flash('notice', 'Access denied. Please log in.');
    res.redirect('/account/login');
  }
};

module.exports = authMiddleware;
