import mongoose from 'mongoose';

const vehicleSchema = new mongoose.Schema({
  vehicleNumber: { type: String, required: true },
  vehicleType: { type: String, required: true },
  make: { type: String, required: true },
  model: { type: String, required: true },
  image: { type: String }, // Added image field
  seatCount: { type: Number, required: true },
  status: { type: String, required: true },
  createdDate: { type: Date, default: Date.now } // Added createdDate field
});

export default mongoose.model('Vehicle', vehicleSchema);
