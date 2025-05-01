import React, { useEffect, useState } from "react";
import { motion } from 'framer-motion';
import "./bookingdetails.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";

const URL = "http://localhost:5000/bookings"; 

const fetchHandler = async () => {
  return await axios.get(URL).then((res) => res.data); 
}

function BookingDetails() {
  const [bookings, setBookings] = useState([]); 
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchHandler();
        setBookings(data);
        setIsLoading(false);
      } catch (error) {
        setError('Failed to load bookings. Please try again later.');
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDelete = (booking) => {
    navigate('/DeleteBooking', { state: { booking } }); 
  };

  const generatePDF = (booking) => {
    const doc = new jsPDF(); // portrait by default
  
    const img = new Image();
    img.src = '/buisness-logo.png'; // Make sure this path is correct and accessible
  
    img.onload = () => {
      // Add logo
      doc.addImage(img, 'PNG', 14, 10, 30, 30);
  
      // Company Name
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 0, 0);
      doc.text("MALSHAN MOTORS", 50, 25);
  
      // Report Title
      doc.setFontSize(20);
      doc.text("Bus Booking Report", 105, 40, { align: "center" });
  
      // Divider
      doc.setLineWidth(0.5);
      doc.line(20, 45, 190, 45);
  
      // Customer Info Section
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Customer Information", 20, 55);
  
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.text("Booking ID:", 20, 65);
      doc.text(`${booking._id}`, 60, 65);
  
      doc.text("Name:", 20, 75);
      doc.text(`${booking.name}`, 60, 75);
  
      doc.text("Email:", 20, 85);
      doc.text(`${booking.email}`, 60, 85);
  
      // Trip Info Section
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Trip Details", 20, 105);
  
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.text("Date of Journey:", 20, 115);
      doc.text(`${new Date(booking.dateOfJourney).toLocaleDateString()}`, 60, 115);
  
      doc.text("Number of Days:", 20, 125);
      doc.text(`${booking.numberOfDays}`, 60, 125);
  
      doc.text("Bus Type:", 20, 135);
      doc.text(`${booking.busType}`, 60, 135);
  
      doc.text("Departure Location:", 20, 145);
      doc.text(`${booking.departureLocation}`, 60, 145);
  
      doc.text("Destination:", 20, 155);
      doc.text(`${booking.destination}`, 60, 155);
  
      doc.text("Distance:", 20, 165);
      doc.text(`${booking.distance}`, 60, 165);
  
      doc.text("Duration:", 20, 175);
      doc.text(`${booking.duration}`, 60, 175);
  
      // Footer
      doc.setFontSize(10);
      doc.setTextColor(150);
      doc.text("Generated on: " + new Date().toLocaleString(), 20, 285);
  
      // Save
      doc.save(`Booking_${booking._id}.pdf`);
    
  };
  
  };
  
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="container"
    >
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="heading">Booking Details</h1>
            <Link
              to="/AddBooking"
              className="btn btn-info"
            >
              Add New Booking
            </Link>
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
          ) : bookings.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No bookings found. Add your first booking!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="booking-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>         
                    <th>Date of Journey</th>
                    <th>Number of Days</th>
                    <th>Bus Type</th>
                    <th>Departure Location</th>
                    <th>Destination</th>
                    <th>Distance</th>
                    <th>Duration</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking._id}>
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
                        <div className="flex gap-2">
                          <Link to={`/BookingDetails/${booking._id}`} state={booking}>
                            <button className="btn btn-warning">Update</button>
                          </Link>
                          <button className="delete-button" onClick={() => handleDelete(booking)}>Delete</button>
                          <button className="btn btn-info" onClick={() => generatePDF(booking)}>PDF</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default BookingDetails;
