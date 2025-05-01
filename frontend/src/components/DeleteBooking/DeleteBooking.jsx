import React, { useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import './DeleteBooking.css';

function DeleteBooking() {
    const location = useLocation();
    const navigate = useNavigate();
    const { booking } = location.state || {};

    useEffect(() => {
        if (!booking) {
            navigate('/BookingDetails');
        }
    }, [booking, navigate]);

    const handleDelete = async (e) => {
        e.preventDefault();

        const confirmDelete = window.confirm("Are you sure you want to delete this booking?");
        if (!confirmDelete) return;

        try {
            await axios.delete(`http://localhost:5000/bookings/${booking._id}`);
            alert('Booking deleted successfully!');
            navigate('/BookingDetails');
        } catch (error) {
            alert('Failed to delete booking');
            console.error(error);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="delete-booking-container"
        >
            <div className="delete-booking-form">
                <h2>Delete Booking</h2>
                <div className="delete-booking-warning">
                    Warning: This action cannot be undone. Please confirm that you want to delete this booking.
                </div>
                <form onSubmit={handleDelete} className="booking-details-form">
                    <div className="form-group">
                        <label>Name:</label>
                        <input type="text" value={booking?.name} readOnly />
                    </div>

                    <div className="form-group">
                        <label>Email:</label>
                        <input type="email" value={booking?.email} readOnly />
                    </div>

                    <div className="form-group">
                        <label>Date of Journey:</label>
                        <input type="date" value={booking?.dateOfJourney} readOnly />
                    </div>

                    <div className="form-group">
                        <label>Number of Days:</label>
                        <input type="number" value={booking?.numberOfDays} readOnly />
                    </div>

                    <div className="form-group">
                        <label>Bus Type:</label>
                        <input type="text" value={booking?.busType} readOnly />
                    </div>

                    <div className="form-group">
                        <label>Departure Location:</label>
                        <input type="text" value={booking?.departureLocation} readOnly />
                    </div>

                    <div className="form-group">
                        <label>Destination:</label>
                        <input type="text" value={booking?.destination} readOnly />
                    </div>

                    <div className="form-group">
                        <label>Distance:</label>
                        <input type="text" value={booking?.distance} readOnly />
                    </div>

                    <div className="form-group">
                        <label>Duration:</label>
                        <input type="text" value={booking?.duration} readOnly />
                    </div>

                    <div className="delete-booking-actions">
                        <button type="button" className="cancel-button" onClick={() => navigate('/BookingDetails')}>
                            Cancel
                        </button>
                        <button type="submit" className="delete-button">
                            Delete Booking
                        </button>
                    </div>
                </form>
            </div>
        </motion.div>
    );
}

export default DeleteBooking;
