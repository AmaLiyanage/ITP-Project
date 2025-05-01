import { User } from '../models/user.model.js';
import Feedback from '../models/Feedback.model.js';

const addFeedback = async (req, res) => {
    try {
        const { subject, message, rating } = req.body;
        if (!subject || !message) {
            return res.status(400).json({ message: "All required fields must be filled." });
        }

        // Find user details since we have userId from token
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const newFeedback = new Feedback({ 
            name: user.name,
            email: user.email,
            subject, 
            message,
            rating,
            userId: req.userId 
        });
        
        await newFeedback.save();
        res.status(201).json(newFeedback);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getFeedbacks = async (req, res) => {
    try {
        const feedbacks = await Feedback.find({ userId: req.userId });
        res.status(200).json(feedbacks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllFeedbacks = async (req, res) => {
    try {
        const feedbacks = await Feedback.find().populate('userId', 'name email');
        res.status(200).json(feedbacks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getFeedbackById = async (req, res) => {
    try {
        const feedback = await Feedback.findOne({ 
            _id: req.params.id,
            userId: req.userId 
        });
        if (!feedback) {
            return res.status(404).json({ message: 'Feedback not found' });
        }
        res.status(200).json(feedback);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateFeedback = async (req, res) => {
    try {
        const { subject, message, rating } = req.body;
        const feedback = await Feedback.findOne({ 
            _id: req.params.id,
            userId: req.userId 
        });

        if (!feedback) {
            return res.status(404).json({ message: 'Feedback not found or unauthorized' });
        }

        feedback.subject = subject;
        feedback.message = message;
        feedback.rating = rating;
        await feedback.save();

        res.status(200).json(feedback);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteFeedback = async (req, res) => {
    try {
        const deletedFeedback = await Feedback.findOneAndDelete({
            _id: req.params.id,
            userId: req.userId
        });
        if (!deletedFeedback) {
            return res.status(404).json({ message: 'Feedback not found or unauthorized' });
        }
        res.status(200).json({ message: 'Feedback deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export {
    addFeedback,
    getFeedbacks,
    getAllFeedbacks,
    getFeedbackById,
    updateFeedback,
    deleteFeedback
};