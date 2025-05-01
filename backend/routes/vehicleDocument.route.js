import express from 'express';
import { verifyToken } from '../middleware/verifyToken.js';
import {
    createDocument,
    getAllDocuments,
    getDocumentsByBus,
    updateDocument,
    deleteDocument
} from '../controllers/vehicleDocument.controller.js';

const router = express.Router();

// Create a new document
router.post('/', createDocument);

// Get all documents
router.get('/', getAllDocuments);

// Get documents by bus number
router.get('/bus/:busNumber', getDocumentsByBus);

// Update a document
router.put('/:id', updateDocument);

// Delete a document
router.delete('/:id', deleteDocument);

export default router;