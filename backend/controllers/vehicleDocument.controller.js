import VehicleDocument from '../models/VehicleDocument.model.js';
import multer from 'multer';
import path from 'path';

// Configure multer for PDF storage
const storage = multer.diskStorage({
    destination: './uploads/documents',
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Only PDF files are allowed!'), false);
        }
    }
}).single('documentFile');

// Create new vehicle document
const createDocument = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: err.message });
        }

        try {
            if (!req.file) {
                return res.status(400).json({ message: 'Please upload a PDF file' });
            }

            const document = new VehicleDocument({
                busNumber: req.body.busNumber,
                documentType: req.body.documentType,
                documentFile: req.file.path,
                expiryDate: req.body.expiryDate,
                status: req.body.status || 'active'
            });

            const savedDocument = await document.save();
            res.status(201).json(savedDocument);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    });
};

const getAllDocuments = async (req, res) => {
    try {
        const documents = await VehicleDocument.find();
        res.status(200).json(documents);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getDocumentsByBus = async (req, res) => {
    try {
        const documents = await VehicleDocument.find({ busNumber: req.params.busNumber });
        res.status(200).json(documents);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateDocument = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: err.message });
        }

        try {
            const updateData = {
                busNumber: req.body.busNumber,
                documentType: req.body.documentType,
                expiryDate: req.body.expiryDate,
                status: req.body.status
            };

            if (req.file) {
                updateData.documentFile = req.file.path;
            }

            const updatedDocument = await VehicleDocument.findByIdAndUpdate(
                req.params.id,
                updateData,
                { new: true }
            );

            if (!updatedDocument) {
                return res.status(404).json({ message: 'Document not found' });
            }

            res.status(200).json(updatedDocument);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    });
};

const deleteDocument = async (req, res) => {
    try {
        const deletedDocument = await VehicleDocument.findByIdAndDelete(req.params.id);
        if (!deletedDocument) {
            return res.status(404).json({ message: 'Document not found' });
        }
        res.status(200).json({ message: 'Document deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export {
    createDocument,
    getAllDocuments,
    getDocumentsByBus,
    updateDocument,
    deleteDocument
};