import Vehicle from '../models/Vehicle.model.js';

// @desc    Get all vehicles
// @route   GET /api/vehicles
// @access  Public
const getVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find();
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add a new vehicle
// @route   POST /api/vehicles
// @access  Public
// @body    vehicleNumber, vehicleType, make, model, image, seatCount, status
const addVehicle = async (req, res) => {
  try {
    const vehicle = new Vehicle({
      vehicleNumber: req.body.vehicleNumber,
      vehicleType: req.body.vehicleType,
      make: req.body.make,
      model: req.body.model,
      image: req.body.image,
      seatCount: req.body.seatCount,
      status: req.body.status
      // createdDate will be set automatically
    });
    await vehicle.save();
    res.status(201).json(vehicle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a vehicle by ID
// @route   PUT /api/vehicles/:id
// @access  Public
const updateVehicle = async (req, res) => {
  try {
    const updatedVehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedVehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }
    res.json(updatedVehicle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a vehicle by ID
// @route   DELETE /api/vehicles/:id
// @access  Public
const deleteVehicle = async (req, res) => {
  try {
    const deletedVehicle = await Vehicle.findByIdAndDelete(req.params.id);
    if (!deletedVehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }
    res.json({ message: "Vehicle deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  getVehicles,
  addVehicle,
  updateVehicle,
  deleteVehicle
};
