import BusMaintenance from '../models/BusMaintenance.model.js';

const createMaintenance = async (req, res) => {
    try {
        const maintenance = new BusMaintenance(req.body);
        await maintenance.save();
        res.status(201).json(maintenance);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getAllMaintenance = async (req, res) => {
    try {
        const records = await BusMaintenance.find();
        res.status(200).json(records);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getMaintenanceById = async (req, res) => {
    try {
        const record = await BusMaintenance.findById(req.params.id);
        if (!record) return res.status(404).json({ message: 'Record not found' });
        res.status(200).json(record);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateMaintenance = async (req, res) => {
    try {
        const updatedRecord = await BusMaintenance.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedRecord) return res.status(404).json({ message: 'Record not found' });
        res.status(200).json(updatedRecord);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteMaintenance = async (req, res) => {
    try {
        const deletedRecord = await BusMaintenance.findByIdAndDelete(req.params.id);
        if (!deletedRecord) return res.status(404).json({ message: 'Record not found' });
        res.status(200).json({ message: 'Record deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export {
    createMaintenance,
    getAllMaintenance,
    getMaintenanceById,
    updateMaintenance,
    deleteMaintenance
};