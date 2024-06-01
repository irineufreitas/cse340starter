const pool = require('../database/');
const reviewModel = require('../models/review-model');
const utilities = require('../utilities');
const reviewCont = {};
/* ***************************
 *  Add Review
 * ************************** */
reviewCont.addReview = async function (req, res) {
    try {
      const { review_text, inv_id, account_id } = req.body;
  
      // Server-side validation
      if (!review_text.trim()) {
        req.flash('error', 'Review text cannot be empty.');
        return res.redirect(`/inv/detail/${inv_id}`);
      }
  
      // Insert the review into the database
      await reviewModel.addReview({ review_text, inv_id, account_id });
  
      req.flash('info', 'Review added successfully.');
      res.redirect(`/inv/detail/${inv_id}`);
    } catch (error) {
      console.error('Error adding review:', error);
      req.flash('error', 'An error occurred while adding the review.');
      res.redirect(`/inv/detail/${req.body.inv_id}`);
    }
  };

/* ***************************
 *  Render Edit Review Form
 * ************************** */
reviewCont.renderEditReviewForm = async function (req, res) {
    try {
        const reviewId = parseInt(req.params.reviewId, 10);
        const review = await reviewModel.getReviewById(reviewId);
        const nav = await utilities.getNav();

        if (review.account_id !== req.session.account_id) {
            req.flash('error', 'You are not authorized to edit this review.');
            return res.redirect(`/inv/detail/${review.inv_id}`);
        }

        res.render('reviews/edit-review', {
            title: 'Edit Review',
            nav,
            review,
            errors: [],
            messages: req.flash('info')
        });
    } catch (error) {
        console.error('Error rendering edit review form:', error);
        req.flash('error', 'An error occurred while rendering the edit review form.');
        res.redirect(`/inv/detail/${req.params.reviewId}`);
    }
};


// Edit a review
reviewCont.editReview = async (req, res) => {
  const { id } = req.params;
  const { review_text } = req.body;
  try {
    const query = 'UPDATE reviews SET review_text = $1, review_date = now() WHERE review_id = $2 RETURNING *';
    const values = [review_text, id];
    const result = await pool.query(query, values);
    res.redirect(`/account/admin`);
  } catch (error) {
    console.error('Error editing review:', error);
    res.redirect(`/account/admin`);
  }
};

/* ***************************
 *  Update Review
 * ************************** */
reviewCont.updateReview = async function (req, res) {
    try {
        const reviewId = parseInt(req.params.reviewId, 10);
        const { review_text } = req.body;

        console.log('Review ID:', reviewId);
        console.log('Review Text:', review_text);

        if (!review_text.trim()) {
            req.flash('error', 'Review text cannot be empty.');
            return res.redirect(`/reviews/edit/${reviewId}`);
        }

        const review = await reviewModel.updateReview(reviewId, review_text);
        req.flash('info', 'Review updated successfully.');
        res.redirect(`/inv/detail/${review.inv_id}`);
    } catch (error) {
        console.error('Error updating review:', error);
        req.flash('error', 'An error occurred while updating the review.');
        res.redirect(`/reviews/edit/${req.params.reviewId}`);
    }
};


/* ***************************
 *  Delete Review
 * ************************** */
reviewCont.deleteReview = async function (req, res) {
    try {
        const reviewId = req.params.reviewId;
        const review = await reviewModel.getReviewById(reviewId);

        if (review.account_id !== req.session.account_id) {
            req.flash('error', 'You are not authorized to delete this review.');
            return res.redirect(`/inv/detail/${review.inv_id}`);
        }

        await reviewModel.deleteReview(reviewId);
        req.flash('info', 'Review deleted successfully.');
        res.redirect(`/inv/detail/${review.inv_id}`);
    } catch (error) {
        console.error('Error deleting review:', error);
        req.flash('error', 'An error occurred while deleting the review.');
        res.redirect(`/inv/detail/${req.body.inv_id}`);
    }
};
  

  

module.exports = reviewCont;
