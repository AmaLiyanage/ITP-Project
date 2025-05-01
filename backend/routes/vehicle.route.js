import express from 'express';
import { verifyToken } from '../middleware/verifyToken.js';
import {
    getVehicles,
    addVehicle,
    updateVehicle,
    deleteVehicle
} from '../controllers/vehicle.controller.js';

const router = express.Router();

// Get all vehicles
router.get('/', getVehicles);

// Add a new vehicle
router.post('/', addVehicle);

// Update a vehicle by ID
router.put('/:id', updateVehicle);

// Delete a vehicle by ID
router.delete('/:id', deleteVehicle);

export default router;
