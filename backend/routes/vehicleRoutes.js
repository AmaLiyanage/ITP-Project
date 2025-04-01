const express = require('express');
const router = express.Router();
const {
  getVehicles,
  addVehicle,
  updateVehicle,
  deleteVehicle
} = require('../controllers/vehicleController');

// Get all vehicles
router.get('/', getVehicles);

// Add a new vehicle
router.post('/', addVehicle);

// Update a vehicle by ID
router.put('/:id', updateVehicle);

// Delete a vehicle by ID
router.delete('/:id', deleteVehicle);

module.exports = router;
