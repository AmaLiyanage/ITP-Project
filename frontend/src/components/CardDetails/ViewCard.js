import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './ViewCard.css';

const ViewCard = () => {
    const [cards, setCards] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCards = async () => {
            try {
                const response = await axios.get('http://localhost:5000/paymentCards');
                setCards(response.data.paymentCards);
            } catch (error) {
                console.error('Failed to fetch cards', error);
            }
        };

        fetchCards();
    }, []);

    const handleUpdate = (card) => {
        navigate('/UpdateCard', { state: { card } }); 
    };

    const handleDelete = (card) => {
        navigate('/DeleteCard', { state: { card } }); 
    };

    return (
        <div className="view-card-container">
            <h1>Payment Cards</h1>
            <div className="card-list">
                {cards.map(card => (
                    <div key={card._id} className="card-item">
                        <p><strong>Card Number:</strong> {card.cardNumber}</p>
                        <p><strong>Card Holder:</strong> {card.cardHolderName}</p>
                        <p><strong>Expiry Date:</strong> {card.expiryDate}</p>
                        
                        <div className="card-actions">
                            <button className="update-button" onClick={() => handleUpdate(card)}>Update</button>
                            <button className="delete-button" onClick={() => handleDelete(card)}>Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ViewCard;