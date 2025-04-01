const Feedback = require('../models/Feedback');

const addFeedback = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;
        if (!name || !email || !subject || !message) {
            return res.status(400).json({ message: "All fields are required." });
        }
        const newFeedback = new Feedback({ 
            name, 
            email, 
            subject, 
            message,
            userId: req.user.userId 
        });
        await newFeedback.save();
        res.status(201).json(newFeedback);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getFeedbacks = async (req, res) => {
    try {
        const feedbacks = await Feedback.find({ userId: req.user.userId });
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
            userId: req.user.userId 
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
        const { subject, message } = req.body;
        const feedback = await Feedback.findOne({ 
            _id: req.params.id,
            userId: req.user.userId 
        });

        if (!feedback) {
            return res.status(404).json({ message: 'Feedback not found or unauthorized' });
        }

        feedback.subject = subject;
        feedback.message = message;
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
            userId: req.user.userId
        });
        if (!deletedFeedback) {
            return res.status(404).json({ message: 'Feedback not found or unauthorized' });
        }
        res.status(200).json({ message: 'Feedback deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    addFeedback,
    getFeedbacks,
    getAllFeedbacks,
    getFeedbackById,
    updateFeedback,
    deleteFeedback
};