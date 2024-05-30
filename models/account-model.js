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

async function getAccountById(accountId) {
  try {
    // Query the database to get the account by its ID
    const query = {
      text: 'SELECT * FROM account WHERE account_id = $1',
      values: [accountId],
    };

    const result = await pool.query(query);

    // Check if any account was found
    if (result.rows.length === 0) {
      return null; // Account not found
    }

    // Return the first account found (assuming account_id is unique)
    return result.rows[0];
  } catch (error) {
    console.error('Error in getAccountById:', error);
    throw error; // Throw the error for handling in the calling code
  }
}

/* *****************************
*   Update account information
* *************************** */
async function updateAccountInformation(accountId, firstName, lastName, email) {
  try {
    const query = {
      text: 'UPDATE account SET account_firstname = $1, account_lastname = $2, account_email = $3 WHERE account_id = $4 RETURNING *',
      values: [firstName, lastName, email, accountId],
    };

    const result = await pool.query(query);

    if (result.rows.length === 0) {
      return null; // Account not found or not updated
    }

    return result.rows[0]; // Return updated account data
  } catch (error) {
    console.error('Error updating account information:', error);
    throw error;
  }
}

/* *****************************
*   Change account password
* *************************** */
async function changePassword(accountId, newPassword) {
  try {
    const query = {
      text: 'UPDATE account SET account_password = $1 WHERE account_id = $2 RETURNING *',
      values: [newPassword, accountId],
    };

    const result = await pool.query(query);

    if (result.rows.length === 0) {
      return null; // Account not found or password not updated
    }

    return result.rows[0]; // Return updated account data
  } catch (error) {
    console.error('Error changing password:', error);
    throw error;
  }
}
module.exports = { registerAccount, getAccountByEmail, getAccountById, updateAccountInformation, changePassword};
