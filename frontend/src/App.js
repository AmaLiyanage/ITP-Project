import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; 
import './App.css';
import AddBooking from './components/AddBooking/AddBooking';
import BookingDetails from './components/BookingDetails/BookingDetails'; 
import React from 'react';
import UpdateBooking from './components/UpdateBooking/UpdateBooking';
import DeleteBooking from './components/DeleteBooking/DeleteBooking';
import AddCard from './components/AddCard/AddCard';
import ViewCard from './components/CardDetails/ViewCard';
import UpdateCard from './components/EditCard/UpdateCard';
import DeleteCard from './components/DeleteCard/DeleteCard';

function App() {
  return (
    <Router> 
      <Routes>
        <Route path="/" element={<AddBooking />} />
        <Route path="/AddBooking" element={<AddBooking />} />
        <Route path="/BookingDetails" element={<BookingDetails />} />
        <Route path="/BookingDetails/:id" element={<UpdateBooking />} />
        <Route path="/DeleteBooking" element={<DeleteBooking/>}/>
        <Route path = "/AddCard" element = {<AddCard/>}/>
        <Route path = "/ViewCard" element = {<ViewCard/>} />
        <Route path = "/UpdateCard" element = {<UpdateCard/>}/>
        <Route path = "/DeleteCard" element = {<DeleteCard/>}/>
      </Routes>
    </Router>
  );
}

export default App;
