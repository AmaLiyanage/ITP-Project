const express = require('express');
const router = express.Router();
const {
    createDocument,
    getAllDocuments,
    getDocumentsByBus,
    updateDocument,
    deleteDocument
} = require('../controllers/vehicleDocumentController');

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

module.exports = router;