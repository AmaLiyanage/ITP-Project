import mongoose from 'mongoose';

const vehicleDocumentSchema = new mongoose.Schema({
    busNumber: { 
        type: String, 
        required: true 
    },
    documentType: { 
        type: String, 
        required: true,
        enum: ['insurance', 'service', 'licence', 'emissions']
    },
    documentFile: {
        type: String,  // This will store the file path/URL
        required: true
    },
    expiryDate: {
        type: Date,
        required: true
    },
    uploadDate: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['active', 'expired', 'pending'],
        default: 'active'
    }
}, { timestamps: true });

export default mongoose.model('VehicleDocument', vehicleDocumentSchema);