import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    dateOfJourney: { type: String, required: true },
    numberOfDays: { type: Number, required: true },
    busType: { type: String, required: true },
    departureLocation: { type: String, required: true },
    destination: { type: String, required: true },
    distance: { type: String },
    duration: { type: String },
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", BookingSchema);
export default Booking;
