const Booking = require("../Model/BookingModel");
const { GoogleMapsService } = require("../services/googleMapsService");
const { transformRouteResponse, validateRouteRequest } = require("../utils/routeUtils");

const addBooking = async (req, res) => {
  try {
    const { name, email, dateOfJourney, numberOfDays, busType, departureLocation, destination } = req.body;

    if (!name || !email || !dateOfJourney || !numberOfDays || !busType || !departureLocation || !destination) {
      return res.status(400).json({ message: "All fields are required." });
    }

    validateRouteRequest(departureLocation, destination);

    
    const routeData = await GoogleMapsService.getDirections(departureLocation, destination);

    const transformedRoute = transformRouteResponse(routeData);
    

    if (!transformedRoute || !transformedRoute.routes) {
      return res.status(400).json({ message: "Unable to fetch route details" });
    }

    const distance = transformedRoute.routes[0].legs[0].distance.value;
    const duration = transformedRoute.routes[0].legs[0].duration.text;
    
    let bookings;

    bookings = new Booking({
      name,
      email,
      dateOfJourney,
      numberOfDays,
      busType,
      departureLocation,
      destination,
      distance,
      duration
    });

    bookings = await bookings.save();
    return res.status(201).json({ message: "Booking created successfully", bookings });
  } catch (error) {
    return res.status(500).json({ message: "Cannot add booking", error });
  }
};

const getDirections = async (req, res) => {
  try {
    const {  origin,destination } = req.body;

    if ( !origin || !destination) {
      return res.status(400).json({ message: "All fields are required." });
    }

    validateRouteRequest(origin, destination);

  
    const routeData = await GoogleMapsService.getDirections(origin, destination);

    const transformedRoute = transformRouteResponse(routeData);
    

    if (!transformedRoute || !transformedRoute.routes) {
      return res.status(400).json({ message: "Unable to fetch route details" });
    }

   return res.json(transformedRoute);
   
  } catch (error) {
    return res.status(500).json({ message: "Cannot get route details", error });
  }
};

const getAllBookings = async (req, res) => {
  try {
    
    let bookings;

    bookings = await Booking.find();
    return res.status(200).json(bookings);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch bookings", error });
  }
};

const getBookingById = async (req, res) => {
  try {
    
    let bookings;
    
    bookings = await Booking.findById(req.params.id);
    if (!bookings) return res.status(404).json({ message: "Booking not found" });

    return res.status(200).json(bookings);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching booking", error });
  }
};

const updateBooking = async (req, res) => {
  try {

     const id =req.params.id;

    const { name, email, dateOfJourney, numberOfDays, busType, departureLocation, destination } = req.body;

     let existingBooking = await Booking.findById(id);

     if(!existingBooking){
         return res.status(404).json({message:"Booking cannot find "});
     }

      let updatedDistance = existingBooking.distance;
      let updatedDuration = existingBooking.duration;

      if (departureLocation !== existingBooking.departureLocation || destination !== existingBooking.destination) {
        validateRouteRequest(departureLocation, destination);
      }

      const routeData = await GoogleMapsService.getDirections(departureLocation, destination);
      const transformedRoute = transformRouteResponse(routeData);

      updatedDistance = transformedRoute.routes[0].legs[0].distance.value / 1000; 
      updatedDuration = transformedRoute.routes[0].legs[0].duration.text;

    let bookings;
    
    bookings = await Booking.findByIdAndUpdate(id,
      { name,
       email, 
       dateOfJourney,
        numberOfDays, 
        busType, 
        departureLocation, 
        destination, 
        distance: updatedDistance,
        duration :updatedDuration
      },
      { new: true }
    );

    if (!bookings) return res.status(404).json({ message: "Booking not found" });

    return res.status(200).json({ message: "Booking updated successfully", bookings });
  } catch (error) {
    return res.status(500).json({ message: "Error updating booking", error });
  }
};

const deleteBooking = async (req, res) => {
  try {
    
     let bookings;

     bookings = await Booking.findByIdAndDelete(req.params.id);
    if (!bookings) return res.status(404).json({ message: "Booking not found" });

    return res.status(200).json({ message: "Booking deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error deleting booking", error });
  }
};

module.exports = { addBooking, getAllBookings, getBookingById, updateBooking, deleteBooking ,getDirections };
