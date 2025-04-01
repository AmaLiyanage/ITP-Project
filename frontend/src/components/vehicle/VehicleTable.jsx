import React from 'react';
import { motion } from "framer-motion";

const VehicleTable = ({ vehicles, onEdit, onDelete }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="overflow-x-auto rounded-lg border border-gray-200"
    >
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {/* Table headers */}
            <th className="group px-6 py-4 text-left">
              <div className="flex items-center space-x-2 text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700">
                <span>Vehicle Number</span>
              </div>
            </th>
            <th className="group px-6 py-4 text-left">
              <div className="flex items-center space-x-2 text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700">
                <span>Type</span>
              </div>
            </th>
            <th className="group px-6 py-4 text-left">
              <div className="flex items-center space-x-2 text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700">
                <span>Make</span>
              </div>
            </th>
            <th className="group px-6 py-4 text-left">
              <div className="flex items-center space-x-2 text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700">
                <span>Model</span>
              </div>
            </th>
            <th className="group px-6 py-4 text-left">
              <div className="flex items-center space-x-2 text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700">
                <span>Image</span>
              </div>
            </th>
            <th className="group px-6 py-4 text-left">
              <div className="flex items-center space-x-2 text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700">
                <span>Seats</span>
              </div>
            </th>
            <th className="group px-6 py-4 text-left">
              <div className="flex items-center space-x-2 text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700">
                <span>Status</span>
              </div>
            </th>
            <th className="group px-6 py-4 text-left">
              <div className="flex items-center space-x-2 text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700">
                <span>Created Date</span>
              </div>
            </th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {vehicles.map((vehicle) => (
            <motion.tr 
              key={vehicle._id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="hover:bg-gray-50 transition-colors duration-200"
            >
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{vehicle.vehicleNumber}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {vehicle.vehicleType}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{vehicle.make}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{vehicle.model}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                {vehicle.image ? (
                  <img 
                    src={vehicle.image} 
                    alt={`${vehicle.make} ${vehicle.model}`} 
                    className="h-12 w-12 object-cover rounded-lg border border-gray-200 shadow-md" 
                  />
                ) : (
                  <span className="text-gray-500">No Image</span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{vehicle.seatCount}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                  vehicle.status === 'Available' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {vehicle.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {vehicle.createdDate ? new Date(vehicle.createdDate).toLocaleDateString() : 'N/A'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                <button 
                  onClick={() => onEdit(vehicle)}
                  className="inline-flex items-center px-4 py-2 bg-indigo-100 text-indigo-700 hover:bg-indigo-200 rounded-md transition-all duration-200 space-x-1 shadow-sm hover:shadow font-medium"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  <span>Edit</span>
                </button>
                <button 
                  onClick={() => onDelete(vehicle._id)}
                  className="inline-flex items-center px-4 py-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-md transition-all duration-200 space-x-1 shadow-sm hover:shadow font-medium"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  <span>Delete</span>
                </button>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
};

export default VehicleTable;