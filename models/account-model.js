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


module.exports = { registerAccount };
