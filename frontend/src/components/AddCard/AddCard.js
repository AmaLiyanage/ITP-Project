import React, { useState } from 'react';
import axios from 'axios';
import './AddCard.css';
import { useNavigate } from 'react-router-dom';

const AddCard = () => {
    const navigate = useNavigate();

    const [cardDetails, setCardDetails] = useState({
        cardNumber: '',
        cardHolderName: '',
        expiryDate: '',
        cvv: ''
    });

    const [errors, setErrors] = useState({});

    
    const validateCardNumber = (cardNumber) => {
        const regex = /^\d{16}$/; 
        return regex.test(cardNumber);
    };

    const validateExpiryDate = (expiryDate) => {
        const regex = /^(0[1-9]|1[0-2])\/\d{2}$/; 
        if (!regex.test(expiryDate)) return false;

        const [month, year] = expiryDate.split('/');
        const currentYear = new Date().getFullYear() % 100; 
        const currentMonth = new Date().getMonth() + 1;

        if (parseInt(year) < currentYear) return false; 
        if (parseInt(year) === currentYear && parseInt(month) < currentMonth) return false; 
        return true;
    };

    const validateCVV = (cvv) => {
        const regex = /^\d{3,4}$/; 
        return regex.test(cvv);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCardDetails({ ...cardDetails, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        
        const validationErrors = {};
        if (!validateCardNumber(cardDetails.cardNumber)) {
            validationErrors.cardNumber = 'Card number must be 16 digits.';
        }
        if (!validateExpiryDate(cardDetails.expiryDate)) {
            validationErrors.expiryDate = 'Expiry date must be in MM/YY format and not expired.';
        }
        if (!validateCVV(cardDetails.cvv)) {
            validationErrors.cvv = 'CVV must be 3 or 4 digits.';
        }

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        
        setErrors({});

        
        const maskedCardNumber = `**** **** **** ${cardDetails.cardNumber.slice(-4)}`;

        try {
            const response = await axios.post('http://localhost:5000/paymentCards', {
                ...cardDetails,
                cardNumber: maskedCardNumber, 
            });
            alert('Card added successfully!');
            console.log(response.data);
            navigate('/ViewCard');
        } catch (error) {
            alert('Failed to add card');
            console.error(error);
        }
    };

    return (
        <div className="add-card-container">
            <form className="add-card-form" onSubmit={handleSubmit}>
                <div>
                    <label>Card Number:</label>
                    <input
                        type="text"
                        name="cardNumber"
                        value={cardDetails.cardNumber}
                        onChange={handleChange}
                        placeholder="1234 5678 9012 3456"
                        maxLength="16"
                        required
                    />
                    {errors.cardNumber && <span style={{ color: 'red' }}>{errors.cardNumber}</span>}
                </div>

                <div>
                    <label>Card Holder Name:</label>
                    <input
                        type="text"
                        name="cardHolderName"
                        value={cardDetails.cardHolderName}
                        onChange={handleChange}
                        placeholder="John Doe"
                        required
                    />
                </div>

                <div>
                    <label>Expiry Date:</label>
                    <input
                        type="text"
                        name="expiryDate"
                        value={cardDetails.expiryDate}
                        onChange={handleChange}
                        placeholder="MM/YY"
                        maxLength="5"
                        required
                    />
                    {errors.expiryDate && <span style={{ color: 'red' }}>{errors.expiryDate}</span>}
                </div>

                <div>
                    <label>CVV:</label>
                    <input
                        type="text"
                        name="cvv"
                        value={cardDetails.cvv}
                        onChange={handleChange}
                        placeholder="123"
                        maxLength="4"
                        required
                    />
                    {errors.cvv && <span style={{ color: 'red' }}>{errors.cvv}</span>}
                </div>

                <button type="submit">Add Card</button>
            </form>
        </div>
    );
};

export default AddCard;