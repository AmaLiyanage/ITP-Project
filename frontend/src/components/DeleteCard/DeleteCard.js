import React, { useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import './bootstrap.min.css';

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
        <div className="container mt-5">
            <div className="card">
                <div className="card-header bg-danger text-white">
                    <h1 className="card-title">Delete Card</h1>
                </div>
                <div className="card-body">
                    <div className="card-details">
                        <div className="mb-3">
                            <label className="form-label"><strong>Card Number:</strong></label>
                            <input
                                type="text"
                                className="form-control"
                                value={card?.cardNumber || ''}
                                readOnly
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label"><strong>Card Holder:</strong></label>
                            <input
                                type="text"
                                className="form-control"
                                value={card?.cardHolderName || ''}
                                readOnly
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label"><strong>Expiry Date:</strong></label>
                            <input
                                type="text"
                                className="form-control"
                                value={card?.expiryDate || ''}
                                readOnly
                            />
                        </div>
                        
                    </div>
                    <button className="btn btn-danger w-100" onClick={handleDelete}>
                        Confirm Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteCard;