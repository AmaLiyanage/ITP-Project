const express = require('express');
const router = express.Router();
const {
    signup,
    login,
    logout,
    getAllUsers,
    updateUser,
    deleteUser
} = require('../controllers/userController');

// Auth middleware
const verifyToken = require('../middleware/verifyToken');

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);
router.get('/users', getAllUsers);
router.put('/profile', verifyToken, updateUser);
router.delete('/profile', verifyToken, deleteUser);

module.exports = router;