import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { IoMdClose } from 'react-icons/io';

const AddMaintenance = ({ onClose }) => {
    // Predefined maintenance types
    const maintenanceTypes = [
        "Routine Service",
        "Oil Change",
        "Brake Service",
        "Tire Replacement",
        "Engine Repair",
        "Transmission Service",
        "Air Conditioning",
        "Electrical System",
        "Body Repair",
        "Other"
    ];

    const [form, setForm] = useState({ 
        busNumber: '', 
        maintenanceType: '', 
        description: '', 
        maintenanceDate: '', 
        nextDueDate: '', 
        cost: '' 
    });
    const [vehicles, setVehicles] = useState([]);
    const [errors, setErrors] = useState({});
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        fetchVehicles();
    }, []);

    const fetchVehicles = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/vehicles');
            setVehicles(response.data);
        } catch (error) {
            console.error('Error fetching vehicles:', error);
            setErrorMessage('Failed to load vehicles');
        }
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const validateForm = () => {
        let newErrors = {};
        if (!form.busNumber.trim()) newErrors.busNumber = 'Bus Number is required';
        if (!form.maintenanceType.trim()) newErrors.maintenanceType = 'Maintenance Type is required';
        if (!form.maintenanceDate) newErrors.maintenanceDate = 'Maintenance Date is required';
        if (!form.nextDueDate) newErrors.nextDueDate = 'Next Due Date is required';
        if (!form.cost || form.cost <= 0) newErrors.cost = 'Cost must be a positive number';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');

        if (!validateForm()) return;

        try {
            await axios.post('http://localhost:5000/api/maintenance/add', form);
            onClose();
        } catch (error) {
            setErrorMessage('Failed to submit. Please try again.');
            console.error(error);
        }
    };

    const handleClose = () => {
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 border border-gray-200"
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Add Maintenance Record</h2>
                    <button 
                        onClick={handleClose}
                        className="text-gray-400 hover:text-gray-600 text-2xl"
                    >
                        <IoMdClose />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Bus Number</label>
                        <select
                            name="busNumber"
                            value={form.busNumber}
                            onChange={handleChange}
                            required
                            className="w-full bg-white text-gray-800 border border-gray-300 rounded-lg p-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        >
                            <option value="">Select Bus Number</option>
                            {vehicles.map(vehicle => (
                                <option key={vehicle._id} value={vehicle.vehicleNumber}>
                                    {vehicle.vehicleNumber} - {vehicle.make} {vehicle.model}
                                </option>
                            ))}
                        </select>
                        {errors.busNumber && <p className="text-red-500 text-sm mt-1">{errors.busNumber}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Maintenance Type</label>
                        <select
                            name="maintenanceType"
                            value={form.maintenanceType}
                            onChange={handleChange}
                            required
                            className="w-full bg-white text-gray-800 border border-gray-300 rounded-lg p-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        >
                            <option value="">Select Maintenance Type</option>
                            {maintenanceTypes.map((type) => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                        {errors.maintenanceType && <p className="text-red-500 text-sm mt-1">{errors.maintenanceType}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            className="w-full bg-white text-gray-800 border border-gray-300 rounded-lg p-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                            rows="3"
                            placeholder="Enter description"
                        ></textarea>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Maintenance Date</label>
                            <input
                                type="date"
                                name="maintenanceDate"
                                value={form.maintenanceDate}
                                onChange={handleChange}
                                required
                                className="w-full bg-white text-gray-800 border border-gray-300 rounded-lg p-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                            />
                            {errors.maintenanceDate && <p className="text-red-500 text-sm mt-1">{errors.maintenanceDate}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Next Due Date</label>
                            <input
                                type="date"
                                name="nextDueDate"
                                value={form.nextDueDate}
                                onChange={handleChange}
                                required
                                className="w-full bg-white text-gray-800 border border-gray-300 rounded-lg p-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                            />
                            {errors.nextDueDate && <p className="text-red-500 text-sm mt-1">{errors.nextDueDate}</p>}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Cost</label>
                        <input
                            type="number"
                            name="cost"
                            value={form.cost}
                            onChange={handleChange}
                            required
                            className="w-full bg-white text-gray-800 border border-gray-300 rounded-lg p-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                            placeholder="Enter maintenance cost (Rs.)"
                            min="0"
                            step="0.01"
                        />
                        {errors.cost && <p className="text-red-500 text-sm mt-1">{errors.cost}</p>}
                    </div>

                    {errorMessage && (
                        <div className="text-red-500 text-center">{errorMessage}</div>
                    )}

                    <div className="flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition duration-200 border border-gray-300"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
                        >
                            Add Maintenance
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default AddMaintenance;