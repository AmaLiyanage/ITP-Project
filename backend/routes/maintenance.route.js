import express from 'express';
import { verifyToken } from '../middleware/verifyToken.js';
import {
    createMaintenance,
    getAllMaintenance,
    getMaintenanceById,
    updateMaintenance,
    deleteMaintenance
} from '../controllers/maintenance.controller.js';

const router = express.Router();

router.post('/add', createMaintenance);
router.get('/', getAllMaintenance);
router.get('/:id', getMaintenanceById);
router.put('/:id', updateMaintenance);
router.delete('/:id', deleteMaintenance);

export default router;