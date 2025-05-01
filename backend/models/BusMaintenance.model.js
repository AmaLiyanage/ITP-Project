import mongoose from 'mongoose';

const BusMaintenanceSchema = new mongoose.Schema({
    busNumber: { type: String, required: true },
    maintenanceType: { type: String, required: true },
    description: { type: String },
    maintenanceDate: { type: Date, required: true },
    nextDueDate: { type: Date, required: true },
    cost: { type: Number, required: true }
}, { timestamps: true });

const BusMaintenance = mongoose.model('BusMaintenance', BusMaintenanceSchema);
export default BusMaintenance;