const express = require('express');
const router = express.Router();
const {
    addFeedback,
    getFeedbacks,
    getAllFeedbacks,
    getFeedbackById,
    updateFeedback,
    deleteFeedback
} = require('../controllers/feedbackController');
const verifyToken = require('../middleware/verifyToken');

// Public route
router.get('/all', getAllFeedbacks);

// Protected routes requiring authentication
router.post('/', verifyToken, addFeedback);
router.get('/user', verifyToken, getFeedbacks);
router.get('/:id', verifyToken, getFeedbackById);
router.put('/:id', verifyToken, updateFeedback);
router.delete('/:id', verifyToken, deleteFeedback);

module.exports = router;