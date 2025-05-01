import React, { useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import './DeleteCard.css';

const DeleteCard = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { card } = location.state || {}; 

    useEffect(() => {
        if (!card) {
            navigate('/view-card'); 
        }
    }, [card, navigate]);

    const handleDelete = async () => {
        const confirmDelete = window.confirm("Are you sure you want to delete this card?");
        if (!confirmDelete) return;

        try {
            await axios.delete(`http://localhost:5000/paymentCards/${card._id}`);
            alert('Card deleted successfully!');
            navigate('/ViewCard'); 
        } catch (error) {
            alert('Failed to delete card');
            console.error(error);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="delete-card-container"
        >
            <div className="delete-card-form">
                <h2>Delete Card</h2>
                <div className="delete-card-warning">
                    Warning: This action cannot be undone. Please confirm that you want to delete this card.
                </div>
                <div className="card-details-form">
                    <div className="form-group">
                        <label>Card Number</label>
                        <input
                            type="text"
                            value={card?.cardNumber || ''}
                            readOnly
                        />
                    </div>
                    <div className="form-group">
                        <label>Card Holder</label>
                        <input
                            type="text"
                            value={card?.cardHolderName || ''}
                            readOnly
                        />
                    </div>
                    <div className="form-group">
                        <label>Expiry Date</label>
                        <input
                            type="text"
                            value={card?.expiryDate || ''}
                            readOnly
                        />
                    </div>
                </div>
                <div className="delete-card-actions">
                    <button
                        className="cancel-button"
                        onClick={() => navigate('/ViewCard')}
                    >
                        Cancel
                    </button>
                    <button
                        className="delete-button"
                        onClick={handleDelete}
                    >
                        Delete Card
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default DeleteCard;