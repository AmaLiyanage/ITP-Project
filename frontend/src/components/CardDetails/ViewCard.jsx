import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './ViewCard.css';

const ViewCard = () => {
    const [cards, setCards] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCards = async () => {
            try {
                const response = await axios.get('http://localhost:5000/paymentCards');
                setCards(response.data.paymentCards);
                setIsLoading(false);
            } catch (error) {
                console.error('Failed to fetch cards', error);
                setError('Failed to load cards. Please try again later.');
                setIsLoading(false);
            }
        };

        fetchCards();
    }, []);

    const handleDelete = (card) => {
        navigate('/DeleteCard', { state: { card } }); 
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="view-card-container"
        >
            <div className="max-w-7xl mx-auto">
                <div className="bg-white rounded-xl shadow-lg p-8">
                    <div className="flex justify-between items-center mb-8">
                        <h1>Payment Cards</h1>
                        <button 
                            className="add-button" 
                            onClick={() => navigate('/AddCard')}
                        >
                            Add New Card
                        </button>
                    </div>

                    {error && (
                        <div className="mb-4 p-4 text-sm text-red-700 bg-red-100 rounded-lg">
                            {error}
                        </div>
                    )}

                    {isLoading ? (
                        <div className="flex justify-center items-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        </div>
                    ) : cards.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            No cards found. Add your first card!
                        </div>
                    ) : (
                        <div className="card-list">
                            {cards.map(card => (
                                <div key={card._id} className="card-item">
                                    <p><strong>Card Number:</strong> {card.cardNumber}</p>
                                    <p><strong>Card Holder:</strong> {card.cardHolderName}</p>
                                    <p><strong>Expiry Date:</strong> {card.expiryDate}</p>
                                    
                                    <div className="card-actions">
                                        <button 
                                            className="delete-button" 
                                            onClick={() => handleDelete(card)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default ViewCard;