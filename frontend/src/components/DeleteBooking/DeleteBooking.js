import React, { useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import './bootstrap.min.css';  

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
        <div className="container mt-5">
            <div className="card">
                <div className="card-header bg-danger text-white">
                    <h2 className="card-title">Booking Deletion</h2>
                </div>
                <div className="card-body">
                    <form onSubmit={handleDelete}>
                       
                        <div className="mb-3">
                            <label htmlFor="name" className="form-label">Name:</label>
                            <input
                                type="text"
                                id="name"
                                className="form-control"
                                value={booking.name}
                                readOnly
                            />
                        </div>

                       
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email:</label>
                            <input
                                type="email"
                                id="email"
                                className="form-control"
                                value={booking.email}
                                readOnly
                            />
                        </div>

                       
                        <div className="mb-3">
                            <label htmlFor="dateOfJourney" className="form-label">Date of Journey:</label>
                            <input
                                type="date"
                                id="dateOfJourney"
                                className="form-control"
                                value={booking.dateOfJourney}
                                readOnly
                            />
                        </div>

                        
                        <div className="mb-3">
                            <label htmlFor="numberOfDays" className="form-label">Number of Days:</label>
                            <input
                                type="number"
                                id="numberOfDays"
                                className="form-control"
                                value={booking.numberOfDays}
                                readOnly
                            />
                        </div>

                        
                        <div className="mb-3">
                            <label htmlFor="busType" className="form-label">Bus Type:</label>
                            <input
                                type="text"
                                id="busType"
                                className="form-control"
                                value={booking.busType}
                                readOnly
                            />
                        </div>

                        
                        <div className="mb-3">
                            <label htmlFor="departureLocation" className="form-label">Departure Location:</label>
                            <input
                                type="text"
                                id="departureLocation"
                                className="form-control"
                                value={booking.departureLocation}
                                readOnly
                            />
                        </div>

                       
                        <div className="mb-3">
                            <label htmlFor="destination" className="form-label">Destination:</label>
                            <input
                                type="text"
                                id="destination"
                                className="form-control"
                                value={booking.destination}
                                readOnly
                            />
                        </div>

                     
                        <div className="mb-3">
                            <label htmlFor="distance" className="form-label">Distance:</label>
                            <input
                                type="text"
                                id="distance"
                                className="form-control"
                                value={booking.distance}
                                readOnly
                            />
                        </div>

                       
                        <div className="mb-3">
                            <label htmlFor="duration" className="form-label">Duration:</label>
                            <input
                                type="text"
                                id="duration"
                                className="form-control"
                                value={booking.duration}
                                readOnly
                            />
                        </div>

                       
                        <div className="d-grid">
                            <button type="submit" className="btn btn-danger">
                                Delete Booking
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default DeleteBooking;