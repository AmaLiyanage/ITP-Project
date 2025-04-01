import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from "framer-motion";

const VehicleFormModal = ({ setModalOpen, fetchVehicles, editingVehicle, busModels }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    vehicleNumber: '',
    vehicleType: 'Bus',
    make: 'Leyland',
    model: busModels.Leyland[0],
    image: '',
    seatCount: '',
    status: 'Available',
  });

  useEffect(() => {
    // Reset form when modal opens/closes
    if (editingVehicle) {
      let model = editingVehicle.model;
      if (editingVehicle.make in busModels && !busModels[editingVehicle.make].includes(model)) {
        model = busModels[editingVehicle.make][0];
      }
      setFormData({
        ...editingVehicle,
        model: model
      });
    } else {
      setFormData({
        vehicleNumber: '',
        vehicleType: 'Bus',
        make: 'Leyland',
        model: busModels.Leyland[0],
        image: '',
        seatCount: '',
        status: 'Available',
      });
    }
    setError('');
  }, [editingVehicle, busModels]);

  const validateForm = () => {
    if (!formData.vehicleNumber.trim()) {
      setError('Vehicle number is required');
      return false;
    }
    if (!formData.seatCount || formData.seatCount < 1) {
      setError('Valid seat count is required');
      return false;
    }
    return true;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      if (editingVehicle) {
        await axios.put(`http://localhost:5000/api/vehicles/${editingVehicle._id}`, formData);
      } else {
        await axios.post('http://localhost:5000/api/vehicles', formData);
      }
      await fetchVehicles();
      setModalOpen(false);
    } catch (error) {
      console.error('Error saving vehicle:', error);
      setError(error.response?.data?.message || 'Error saving vehicle. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMakeChange = (e) => {
    const selectedMake = e.target.value;
    setFormData({
      ...formData, 
      make: selectedMake,
      model: busModels[selectedMake][0]
    });
  };

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 overflow-y-auto"
      >
        <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={() => setModalOpen(false)} />

          <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl sm:align-middle z-[60]"
          >
            <div className="absolute top-0 right-0 pt-4 pr-4 z-[70]">
              <button
                onClick={() => setModalOpen(false)}
                className="text-gray-400 bg-white rounded-full h-8 w-8 flex items-center justify-center hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <span className="sr-only">Close</span>
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                <h3 className="text-2xl font-bold text-gray-900 mb-8">
                  {editingVehicle ? "Edit Vehicle Details" : "Add New Vehicle"}
                </h3>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
                      {error}
                    </div>
                  )}
                  <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                        Vehicle Number <span className="text-red-500">*</span>
                      </label>
                      <div className="mt-1 relative">
                        <input
                          type="text"
                          name="vehicleNumber"
                          value={formData.vehicleNumber}
                          onChange={handleChange}
                          required
                          className="block w-full px-4 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500 focus:outline-none focus:ring-1 transition duration-150 ease-in-out"
                          placeholder="Enter vehicle registration number"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                        Vehicle Type <span className="text-red-500">*</span>
                      </label>
                      <div className="mt-1">
                        <select
                          name="vehicleType"
                          value={formData.vehicleType}
                          onChange={handleChange}
                          required
                          className="block w-full px-4 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500 focus:outline-none focus:ring-1 transition duration-150 ease-in-out"
                        >
                          <option value="Bus">Bus</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                        Make <span className="text-red-500">*</span>
                      </label>
                      <div className="mt-1">
                        <select
                          name="make"
                          value={formData.make}
                          onChange={handleMakeChange}
                          required
                          className="block w-full px-4 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500 focus:outline-none focus:ring-1 transition duration-150 ease-in-out"
                        >
                          <option value="Leyland">Leyland</option>
                          <option value="Isuzu">Isuzu</option>
                          <option value="Volvo">Volvo</option>
                          <option value="Mercedes-Benz">Mercedes-Benz</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                        Model <span className="text-red-500">*</span>
                      </label>
                      <div className="mt-1">
                        <select
                          name="model"
                          value={formData.model}
                          onChange={handleChange}
                          required
                          className="block w-full px-4 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500 focus:outline-none focus:ring-1 transition duration-150 ease-in-out"
                        >
                          {formData.make && busModels[formData.make] && 
                            busModels[formData.make].map(model => (
                              <option key={model} value={model}>{model}</option>
                            ))
                          }
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                        Seat Count <span className="text-red-500">*</span>
                      </label>
                      <div className="mt-1">
                        <input
                          type="number"
                          name="seatCount"
                          value={formData.seatCount}
                          onChange={handleChange}
                          required
                          min="1"
                          className="block w-full px-4 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500 focus:outline-none focus:ring-1 transition duration-150 ease-in-out"
                          placeholder="Enter number of seats"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                        Image URL
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="image"
                          value={formData.image}
                          onChange={handleChange}
                          className="block w-full px-4 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500 focus:outline-none focus:ring-1 transition duration-150 ease-in-out"
                          placeholder="Enter vehicle image URL"
                        />
                      </div>
                      {formData.image && (
                        <div className="mt-3">
                          <img 
                            src={formData.image} 
                            alt="Vehicle preview" 
                            className="h-40 w-full object-cover rounded-lg border border-gray-200 shadow-sm" 
                            onError={(e) => e.target.src = "https://via.placeholder.com/150?text=Invalid+URL"} 
                          />
                        </div>
                      )}
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                        Status
                      </label>
                      <div className="mt-1 flex items-center space-x-3">
                        <div className="relative inline-block w-14 align-middle select-none">
                          <input
                            type="checkbox"
                            name="status"
                            id="status"
                            checked={formData.status === 'Available'}
                            onChange={(e) => setFormData({ 
                              ...formData, 
                              status: e.target.checked ? 'Available' : 'Not Available' 
                            })}
                            className="hidden"
                          />
                          <label
                            htmlFor="status"
                            className={`block overflow-hidden h-8 rounded-full cursor-pointer transition-colors duration-200 ease-in-out ${
                              formData.status === 'Available' ? 'bg-green-500' : 'bg-gray-200'
                            }`}
                          >
                            <span
                              className={`block h-8 w-8 rounded-full bg-white shadow-lg transform transition-transform duration-200 ease-in-out ${
                                formData.status === 'Available' ? 'translate-x-6 border-green-500' : 'translate-x-0 border-gray-200'
                              }`}
                            />
                          </label>
                        </div>
                        <span className={`text-sm font-medium ${
                          formData.status === 'Available' ? 'text-green-600' : 'text-gray-500'
                        }`}>
                          {formData.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 sm:mt-10 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setModalOpen(false)}
                      disabled={isSubmitting}
                      className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          {editingVehicle ? "Updating..." : "Adding..."}
                        </>
                      ) : (
                        editingVehicle ? "Update Vehicle" : "Add Vehicle"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default VehicleFormModal;