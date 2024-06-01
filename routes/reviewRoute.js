const express = require('express');
const router = express.Router();
const { addReview, editReview, deleteReview } = require('../controllers/reviewController');
const authMiddleware = require('../middleware/authMiddleware');
const utilities = require('../utilities');
const reviewCont = require('../controllers/reviewController');

// Add a new review
router.post('/add', authMiddleware, utilities.checkLogin, reviewCont.addReview);

// Edit a review
router.get('/edit/:reviewId', authMiddleware, utilities.checkLogin, reviewCont.renderEditReviewForm);
router.post('/edit/:reviewId', authMiddleware, reviewCont.editReview);

// Route to handle updating a review
router.post('/update/:reviewId', authMiddleware, reviewCont.updateReview);

// Route to handle deleting a review
router.post('/delete/:reviewId', authMiddleware, reviewCont.deleteReview);


module.exports = router;
