import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import VehicleFormModal from '../../components/vehicle/VehicleFormModal';
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';
import { useVehicleStore } from '../../store/vehicleStore';

const VehicleManagement = () => {
  const { vehicles, filteredVehicles, loading, error, fetchVehicles, deleteVehicle, filterVehicles } = useVehicleStore();
  
  // Define available bus models for filtering
  const busModels = {
    '': [], // Empty selection
    Leyland: ["Olympian", "Titan", "Atlantean", "Tiger", "Royal Tiger"],
    Isuzu: ["Journey", "Erga", "Gala", "Elga", "Citibus"],
    Volvo: ["9700", "9900", "7900", "8900", "B8R"],
    "Mercedes-Benz": ["Citaro", "Tourismo", "Intouro", "Sprinter", "Conecto"]
  };

  const [modalOpen, setModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [showDownloadPopup, setShowDownloadPopup] = useState(false);
  const [filters, setFilters] = useState({
    make: '',
    model: '',
    minSeatCount: '',
    maxSeatCount: '',
    status: '',
  });

  // Add pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Calculate pagination values
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredVehicles.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredVehicles.length / itemsPerPage);

  // Handle page changes
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  useEffect(() => {
    fetchVehicles();
  }, []);

  useEffect(() => {
    filterVehicles(filters);
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'make') {
      setFilters({ 
        ...filters, 
        [name]: value,
        model: ''
      });
    } else {
      setFilters({ ...filters, [name]: value });
    }
  };

  const handleEdit = (vehicle) => {
    setEditingVehicle(vehicle);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this vehicle?")) {
      try {
        await deleteVehicle(id);
      } catch (error) {
        console.error('Error deleting vehicle:', error);
      }
    }
  };

  const handleDownloadReport = () => {
    setShowDownloadPopup(true);
  };

  const downloadAsCSV = () => {
    const csvData = filteredVehicles.map((vehicle) => ({
      VehicleNumber: vehicle.vehicleNumber,
      VehicleType: vehicle.vehicleType,
      Make: vehicle.make,
      Model: vehicle.model,
      ImageURL: vehicle.image || 'No Image',
      SeatCount: vehicle.seatCount,
      Status: vehicle.status,
      CreatedDate: vehicle.createdDate ? new Date(vehicle.createdDate).toLocaleDateString() : 'N/A'
    }));

    // Convert to CSV
    const headers = Object.keys(csvData[0]);
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => headers.map(header => row[header]).join(','))
    ].join('\n');

    // Download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'vehicle_report.csv';
    link.click();
    setShowDownloadPopup(false);
  };

  const downloadAsPDF = () => {
    const doc = new jsPDF();

    const tableData = filteredVehicles.map(vehicle => [
      vehicle.vehicleNumber,
      vehicle.vehicleType,
      vehicle.make,
      vehicle.model,
      vehicle.seatCount,
      vehicle.status,
      vehicle.createdDate ? new Date(vehicle.createdDate).toLocaleDateString() : 'N/A'
    ]);

    autoTable(doc, {
      head: [['Vehicle Number', 'Type', 'Make', 'Model', 'Seats', 'Status', 'Created Date']],
      body: tableData,
      theme: 'striped',
      headStyles: {
        fillColor: [51, 51, 51],
        textColor: 255,
        fontStyle: 'bold'
      },
      margin: { top: 35 }
    });

    const finalY = (doc.lastAutoTable && doc.lastAutoTable.finalY) || 35;
    doc.text(`Total Vehicles: ${filteredVehicles.length}`, 14, finalY + 10);

    doc.save('vehicle_report.pdf');
    setShowDownloadPopup(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-gray-50 py-8 relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          {/* Header Section */}
          <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
            <div className="flex flex-wrap items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-800">Vehicle Management</h1>
              <div className="flex space-x-4 mt-4 sm:mt-0">
                <button
                  onClick={handleDownloadReport}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 flex items-center space-x-2 shadow-sm hover:shadow transform hover:-translate-y-0.5"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  <span>Download Report</span>
                </button>
                <button
                  onClick={() => { setEditingVehicle(null); setModalOpen(true); }}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-emerald-700 transition-all duration-200 flex items-center space-x-2 shadow-sm hover:shadow transform hover:-translate-y-0.5"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  <span>Add Vehicle</span>
                </button>
              </div>
            </div>
          </div>

          {/* Filter Section */}
          <div className="p-6 border-b border-gray-200 bg-white">
            <div className="mb-4">
              <h3 className="text-lg font-medium text-gray-700">Filter Vehicles</h3>
              <p className="text-sm text-gray-500">Use the filters below to find specific vehicles</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">Make</label>
                <select
                  name="make"
                  value={filters.make}
                  onChange={handleFilterChange}
                  className="block w-full bg-white text-gray-800 border border-gray-300 rounded-lg px-4 py-2.5 appearance-none hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="">All Makes</option>
                  <option value="Leyland">Leyland</option>
                  <option value="Isuzu">Isuzu</option>
                  <option value="Volvo">Volvo</option>
                  <option value="Mercedes-Benz">Mercedes-Benz</option>
                </select>
                <div className="absolute inset-y-0 right-0 top-6 flex items-center px-2 pointer-events-none text-gray-500">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
                <select
                  name="model"
                  value={filters.model}
                  onChange={handleFilterChange}
                  disabled={!filters.make}
                  className="block w-full bg-white text-gray-800 border border-gray-300 rounded-lg px-4 py-2.5 appearance-none hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-50 disabled:text-gray-500 disabled:border-gray-200 disabled:cursor-not-allowed"
                >
                  <option value="">All Models</option>
                  {filters.make && busModels[filters.make] && 
                    busModels[filters.make].map(model => (
                      <option key={model} value={model}>{model}</option>
                    ))
                  }
                </select>
                <div className="absolute inset-y-0 right-0 top-6 flex items-center px-2 pointer-events-none text-gray-500">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Min Seats</label>
                <div className="relative">
                  <input
                    type="number"
                    name="minSeatCount"
                    value={filters.minSeatCount}
                    onChange={handleFilterChange}
                    placeholder="Enter minimum"
                    className="block w-full bg-white text-gray-800 border border-gray-300 rounded-lg px-4 py-2.5 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Seats</label>
                <div className="relative">
                  <input
                    type="number"
                    name="maxSeatCount"
                    value={filters.maxSeatCount}
                    onChange={handleFilterChange}
                    placeholder="Enter maximum"
                    className="block w-full bg-white text-gray-800 border border-gray-300 rounded-lg px-4 py-2.5 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                  />
                </div>
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                  className="block w-full bg-white text-gray-800 border border-gray-300 rounded-lg px-4 py-2.5 appearance-none hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="">All Status</option>
                  <option value="Available">Available</option>
                  <option value="Not Available">Not Available</option>
                </select>
                <div className="absolute inset-y-0 right-0 top-6 flex items-center px-2 pointer-events-none text-gray-500">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Table Section */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle Number</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Make</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Model</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Seats</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentItems.map((vehicle) => (
                  <tr key={vehicle._id} className="hover:bg-gray-50 transition-colors duration-200">
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
                          className="h-12 w-12 object-cover rounded-lg border border-gray-200 shadow-sm" 
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button 
                        onClick={() => handleEdit(vehicle)}
                        className="inline-flex items-center px-3 py-1.5 bg-indigo-100 text-indigo-700 hover:bg-indigo-200 rounded-md transition-all duration-200 space-x-1"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        <span>Edit</span>
                      </button>
                      <button 
                        onClick={() => handleDelete(vehicle._id)}
                        className="inline-flex items-center px-3 py-1.5 bg-red-100 text-red-700 hover:bg-red-200 rounded-md transition-all duration-200 space-x-1"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        <span>Delete</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {/* Pagination Controls */}
            <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
              <div className="flex flex-1 justify-between sm:hidden">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{' '}
                    <span className="font-medium">
                      {Math.min(indexOfLastItem, filteredVehicles.length)}
                    </span> of{' '}
                    <span className="font-medium">{filteredVehicles.length}</span> results
                  </p>
                </div>
                <div>
                  <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="sr-only">Previous</span>
                      <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                      </svg>
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                      <button
                        key={pageNumber}
                        onClick={() => handlePageChange(pageNumber)}
                        className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                          pageNumber === currentPage
                            ? 'z-10 bg-blue-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
                            : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                        }`}
                      >
                        {pageNumber}
                      </button>
                    ))}
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="sr-only">Next</span>
                      <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {modalOpen && (
        <VehicleFormModal
          setModalOpen={setModalOpen}
          fetchVehicles={fetchVehicles}
          editingVehicle={editingVehicle}
          busModels={busModels}
        />
      )}

      {/* Download Options Popup */}
      {showDownloadPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-xl max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Download Report</h3>
            <p className="text-gray-600 mb-4">Choose download format:</p>
            <div className="space-y-3">
              <button 
                onClick={downloadAsCSV}
                className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                <span>Download as CSV</span>
              </button>
              <button 
                onClick={downloadAsPDF}
                className="w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Download as PDF</span>
              </button>
              <button 
                onClick={() => setShowDownloadPopup(false)}
                className="w-full bg-gray-700 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-all duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default VehicleManagement;