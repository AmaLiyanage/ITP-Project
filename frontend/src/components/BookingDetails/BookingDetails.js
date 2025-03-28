import React, { useEffect, useState } from "react";
import './bootstrap.min.css'; 
import "./bookingdetails.css";
import axios from "axios";
import background from './background1.jpeg';
import { Link, useNavigate } from "react-router-dom";


const URL = "http://localhost:5000/bookings"; 

const fetchHandler = async () => {
  return await axios.get(URL).then((res) => res.data); 
}

function BookingDetails() {
  const [bookings, setBookings] = useState([]); 
  const navigate = useNavigate();

  useEffect(() => {
    fetchHandler().then((data) => setBookings(data)); 
  }, []);

  const handleDelete = (booking) => {
    navigate('/DeleteBooking', { state: { booking } }); 
};

  return (
    <div className="container mt-4 text-center">
      <img src={background} alt="Booking Header" className="img-fluid rounded mb-3" />
      
      <h1 className="heading mb-4">Booking Details</h1>

      <div className="table-responsive">
        <table className="table table-striped booking-table">
          <thead className="table-dark">
            <tr>
              <th>Booking ID</th>
              <th>Name</th>
              <th>Email</th>         
              <th>Date of Journey</th>
              <th>Number of Days</th>
              <th>Bus Type</th>
              <th>Departure Location</th>
              <th>Destination</th>
              <th>Distance</th>
              <th>Duration</th>
              <th>Update</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length > 0 ? (
              bookings.map((booking, index) => (
                <tr key={index}>
                  <td>{booking._id}</td> 
                  <td>{booking.name}</td>
                  <td>{booking.email}</td>
                  <td>{new Date(booking.dateOfJourney).toLocaleDateString()}</td>
                  <td>{booking.numberOfDays}</td>
                  <td>{booking.busType}</td>
                  <td>{booking.departureLocation}</td>
                  <td>{booking.destination}</td>
                  <td>{booking.distance}</td>
                  <td>{booking.duration}</td>
                  <td>
                  <Link to={`/BookingDetails/${booking._id}`} state={booking}>
                        <button className="btn btn-warning me-2">Update</button>
                     </Link>
                  </td>
                  <td>
                  <button className="delete-button" onClick={() => handleDelete(booking)}>Delete</button>
                    </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10">No bookings available.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default BookingDetails;
