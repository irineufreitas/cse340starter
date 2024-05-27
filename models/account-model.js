const pool = require('../database/');

/* *****************************
*   Register new account
* *************************** */
async function registerAccount(firstName, lastName, email, password){
    try {
      const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *";
      console.log("SQL Query:", sql); // Log the SQL query
      console.log("Parameters:", [firstName, lastName, email, password]); // Log the query parameters
      const result = await pool.query(sql, [firstName, lastName, email, password]);
      console.log("Query Result:", result.rows); // Log the result of the query
      return result;
    } catch (error) {
      console.error("Error occurred while registering account:", error);
      return null;
    }
  }
/* *****************************
* Return account data using email address
* ***************************** */
async function getAccountByEmail (account_email) {
  try {
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1',
      [account_email])
    return result.rows[0]
  } catch (error) {
    return new Error("No matching email found")
  }
}


module.exports = { registerAccount, getAccountByEmail };
