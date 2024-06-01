const pool = require('../database/');

const reviewModel = {};

/* ***************************
 *  Add a new review
 * ************************** */


reviewModel.addReview = async (review) => {
  try {
    const query = `INSERT INTO reviews (review_text, inv_id, account_id, review_date)
                   VALUES ($1, $2, $3, NOW())`;
    const values = [review.review_text, review.inv_id, review.account_id];
    await pool.query(query, values);
  } catch (error) {
    console.error('Error adding review:', error);
    throw error;
  }
};

/* ***************************
 *  Get reviews by item ID
 * ************************** */

reviewModel.getReviewsByItemId = async (itemId) => {
  try {
    const query = `SELECT reviews.*, CONCAT(SUBSTRING(account.account_firstname, 1, 1), account.account_lastname) AS reviewer_name,
                   inventory.inv_make AS car_make, inventory.inv_model AS car_model
                   FROM reviews
                   JOIN account ON reviews.account_id = account.account_id
                   JOIN inventory ON reviews.inv_id = inventory.inv_id
                   WHERE reviews.inv_id = $1
                   ORDER BY review_date DESC`;
    const values = [itemId];
    const result = await pool.query(query, values);
    return result.rows;
  } catch (error) {
    console.error('Error getting reviews by item ID:', error);
    throw error;
  }
};



//update

reviewModel.updateReview = async (review_id, review_text) => {
    try {
      const query = `UPDATE reviews SET review_text = $1, review_date = NOW() WHERE review_id = $2 RETURNING *`;
      const values = [review_text, review_id];
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Error updating review:', error);
      throw error;
    }
  };

  // delete
  
  reviewModel.deleteReview = async (review_id) => {
    try {
      const query = `DELETE FROM reviews WHERE review_id = $1 RETURNING *`;
      const values = [review_id];
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Error deleting review:', error);
      throw error;
    }
  };

  //getbyaccountID
  reviewModel.getReviewsByAccountId = async (accountId) => {
    try {
      const query = `SELECT reviews.*, CONCAT(SUBSTRING(account.account_firstname, 1, 1), account.account_lastname) AS reviewer_name,
                     inventory.inv_make AS car_make, inventory.inv_model AS car_model
                     FROM reviews
                     JOIN account ON reviews.account_id = account.account_id
                     JOIN inventory ON reviews.inv_id = inventory.inv_id
                     WHERE reviews.account_id = $1
                     ORDER BY review_date DESC`;
      const values = [accountId];
      const result = await pool.query(query, values);
      return result.rows;
    } catch (error) {
      console.error('Error getting reviews:', error);
      throw error;
    }
  };

/* *****************************
 *  Get Review by ID
 * *************************** */
reviewModel.getReviewById = async (reviewId) => {
    try {
      const query = {
        text: 'SELECT * FROM reviews WHERE review_id = $1',
        values: [reviewId]
      };
      const result = await pool.query(query);
      return result.rows[0];
    } catch (error) {
      console.error('Error getting review by ID:', error);
      throw error;
    }
  };


  
module.exports = reviewModel;

