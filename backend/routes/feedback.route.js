import express from 'express';
import { verifyToken } from '../middleware/verifyToken.js';
import {
    addFeedback,
    getFeedbacks,
    getAllFeedbacks,
    getFeedbackById,
    updateFeedback,
    deleteFeedback
} from '../controllers/feedback.controller.js';

const router = express.Router();

// Protected routes (require authentication)
router.use(verifyToken);

// User routes
router.post('/', addFeedback);
router.get('/my-feedbacks', getFeedbacks);
router.get('/my-feedbacks/:id', getFeedbackById);
router.put('/:id', updateFeedback);
router.delete('/:id', deleteFeedback);

// Admin route
router.get('/all', getAllFeedbacks);

export default router;
