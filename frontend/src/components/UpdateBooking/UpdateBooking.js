import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Polyline } from '@react-google-maps/api';
import axios from 'axios';
import { styles } from './styles';
import { decodePolyline, formatDuration } from './utils';
import { MAP_CONFIG } from './config';
import { useParams, useNavigate } from 'react-router-dom';

const UpdateBooking = () => {
  const navigate = useNavigate();
  const { id } = useParams(); 

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [dateOfJourney, setDateOfJourney] = useState('');
  const [numberOfDays, setNumberOfDays] = useState('');
  const [busType, setBusType] = useState(''); 
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [path, setPath] = useState(null);
  const [distance, setDistance] = useState('');
  const [duration, setDuration] = useState('');
  const [mapKey, setMapKey] = useState(Date.now());
  const [errors, setErrors] = useState({}); 
 
  const busTypes = ['AC Bus', 'Non-AC Bus'];

  
  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/bookings/${id}`);
        const booking = response.data;

        
        setName(booking.name);
        setEmail(booking.email);
        setDateOfJourney(booking.dateOfJourney);
        setNumberOfDays(booking.numberOfDays);
        setBusType(booking.busType);
        setOrigin(booking.departureLocation);
        setDestination(booking.destination);
      } catch (error) {
        console.error('Error fetching booking:', error);
        alert('Failed to fetch booking data.');
      }
    };

    fetchBooking();
  }, [id]);

 
  const validateName = (name) => {
    return name.trim().length > 0; 
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
    return regex.test(email);
  };

  const validateDateOfJourney = (date) => {
    const selectedDate = new Date(date);
    const currentDate = new Date();
    return selectedDate >= currentDate; 
  };

  const validateNumberOfDays = (days) => {
    return days > 0; 
  };

  const validateBusType = (busType) => {
    return busType.trim().length > 0; 
  };

  const validateLocation = (location) => {
    return location.trim().length > 0; 
  };

  const calculateRoute = async () => {
    try {
      
      setPath(null);
      setDistance('');
      setDuration('');
      setMapKey(Date.now());

      const response = await axios.post('http://localhost:5000/bookings/directions', {
        origin,
        destination
      });

      if (response.data.routes[0]) {
        const decodedPath = decodePolyline(response.data.routes[0].overview_polyline.points);
        setPath(decodedPath);
        setDistance(response.data.routes[0].legs[0].distance.text);
        setDuration(formatDuration(response.data.routes[0].legs[0].duration.value));
      }
    } catch (error) {
      console.error('Error calculating route:', error);
      setPath(null);
      setDistance('');
      setDuration('');
    }
  };

  const handleUpdate = async () => {
    
    const validationErrors = {};

    if (!validateName(name)) {
      validationErrors.name = 'Name is required.';
    }
    if (!validateEmail(email)) {
      validationErrors.email = 'Please enter a valid email address.';
    }
    if (!validateDateOfJourney(dateOfJourney)) {
      validationErrors.dateOfJourney = 'Please select a valid date (today or in the future).';
    }
    if (!validateNumberOfDays(numberOfDays)) {
      validationErrors.numberOfDays = 'Number of days must be greater than 0.';
    }
    if (!validateBusType(busType)) {
      validationErrors.busType = 'Bus type is required.';
    }
    if (!validateLocation(origin)) {
      validationErrors.origin = 'Starting location is required.';
    }
    if (!validateLocation(destination)) {
      validationErrors.destination = 'Destination is required.';
    }

    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

   
    setErrors({});

    try {
      const response = await axios.put(`http://localhost:5000/bookings/${id}`, {
        name,
        email,
        dateOfJourney,
        numberOfDays,
        busType,
        departureLocation: origin,
        destination
      });

      console.log('Backend Response:', response.data); 

      if (response.status === 200) {
        alert('Booking updated successfully!');
        navigate('/BookingDetails');
      } else {
        alert('Failed to update booking.');
      }
    } catch (error) {
      console.error('Error updating booking:', error.response ? error.response.data : error.message);
      alert('An error occurred while updating the booking.');
    }
  };

  const handleButtonHover = (e, isHover) => {
    e.target.style.backgroundColor = isHover ? '#3367d6' : '#4285f4';
    e.target.style.transform = isHover ? 'translateY(-1px)' : 'translateY(0)';
  };

  return (
    <div style={styles.container}>
      <div style={styles.form}>
        <h1 style={styles.title}>Update Travel Information</h1>

        <div style={styles.inputGroup}>
          <div>
            <input
              style={styles.input}
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              readOnly
            />
            {errors.name && <span style={{ color: 'red' }}>{errors.name}</span>}
          </div>
          <div>
            <input
              style={styles.input}
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              readOnly
            />
            {errors.email && <span style={{ color: 'red' }}>{errors.email}</span>}
          </div>
          <div>
            <input
              style={styles.input}
              type="date"
              placeholder="Date of Journey"
              value={dateOfJourney}
              onChange={(e) => setDateOfJourney(e.target.value)}
            />
            {errors.dateOfJourney && <span style={{ color: 'red' }}>{errors.dateOfJourney}</span>}
          </div>
          <div>
            <input
              style={styles.input}
              type="number"
              placeholder="Number of Days"
              value={numberOfDays}
              onChange={(e) => setNumberOfDays(e.target.value)}
            />
            {errors.numberOfDays && <span style={{ color: 'red' }}>{errors.numberOfDays}</span>}
          </div>
          <div>
            <select
              style={styles.input}
              value={busType}
              onChange={(e) => setBusType(e.target.value)}
            >
              <option value="">Select Bus Type</option>
              {busTypes.map((type, index) => (
                <option key={index} value={type}>
                  {type}
                </option>
              ))}
            </select>
            {errors.busType && <span style={{ color: 'red' }}>{errors.busType}</span>}
          </div>
          <div>
            <input
              style={styles.input}
              type="text"
              placeholder="Enter starting location"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
            />
            {errors.origin && <span style={{ color: 'red' }}>{errors.origin}</span>}
          </div>
          <div>
            <input
              style={styles.input}
              type="text"
              placeholder="Enter destination"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
            />
            {errors.destination && <span style={{ color: 'red' }}>{errors.destination}</span>}
          </div>
          <button
            style={styles.button}
            onClick={handleUpdate}
            onMouseOver={(e) => handleButtonHover(e, true)}
            onMouseOut={(e) => handleButtonHover(e, false)}
          >
            Update Booking
          </button>
        </div>

        <h1 style={styles.title}>Check Your Route</h1>

        <div>
          <input
            style={styles.input}
            type="text"
            placeholder="Enter starting location"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
          />
        </div>
        <div>
          <input
            style={styles.input}
            type="text"
            placeholder="Enter destination"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          />
        </div>
        <button
          style={styles.button}
          onClick={calculateRoute}
          onMouseOver={(e) => handleButtonHover(e, true)}
          onMouseOut={(e) => handleButtonHover(e, false)}
        >
          Check Route
        </button>

        {(distance || duration) && (
          <div style={styles.infoCard}>
            {distance && (
              <p style={styles.infoText}>
                <span role="img" aria-label="road">🛣️</span>
                <span>Distance: {distance}</span>
              </p>
            )}
            {duration && (
              <p style={styles.infoText}>
                <span role="img" aria-label="time">⏱️</span>
                <span>Duration: {duration}</span>
              </p>
            )}
          </div>
        )}
      </div>

      <div style={styles.mapWrapper}>
        <LoadScript googleMapsApiKey={MAP_CONFIG.apiKey}>
          <GoogleMap
            key={mapKey}
            mapContainerStyle={styles.map}
            center={MAP_CONFIG.defaultCenter}
            zoom={MAP_CONFIG.defaultZoom}
          >
            {path && (
              <Polyline
                path={path}
                options={{
                  strokeColor: '#4285f4',
                  strokeWeight: 4,
                  strokeOpacity: 0.8
                }}
              />
            )}
          </GoogleMap>
        </LoadScript>
      </div>
    </div>
  );
};

export default UpdateBooking;