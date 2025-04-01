import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { FaCar, FaSort, FaFilter, FaTimes } from 'react-icons/fa';
import { useVehicleStore } from '../../store/vehicleStore';
import { toast } from 'react-hot-toast';

const VehicleCardView = () => {
  const { vehicles, filteredVehicles, loading, error, fetchVehicles, filterVehicles } = useVehicleStore();
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filtersExpanded, setFiltersExpanded] = useState(false);
  const [filterOptions, setFilterOptions] = useState({
    make: '',
    vehicleType: '',
    minSeats: '',
    maxSeats: '',
    status: ''
  });
  const [sortOrder, setSortOrder] = useState('newest');
  const [isResetting, setIsResetting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const vehiclesPerPage = 9;

  useEffect(() => {
    fetchVehicles();
  }, []);

  useEffect(() => {
    const backendFilters = {
      ...filterOptions,
      minSeatCount: filterOptions.minSeats,
      maxSeatCount: filterOptions.maxSeats,
      search: searchTerm
    };
    filterVehicles(backendFilters);
  }, [searchTerm, filterOptions]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilterOptions(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const openVehicleDetails = (vehicle) => {
    setSelectedVehicle(vehicle);
    setShowModal(true);
  };

  const resetFilters = () => {
    setIsResetting(true);
    setFilterOptions({
      make: '',
      vehicleType: '',
      minSeats: '',
      maxSeats: '',
      status: ''
    });
    setSearchTerm('');
    setSortOrder('newest');
    toast.success('Filters reset successfully');
    setTimeout(() => setIsResetting(false), 500);
  };

  const sortVehicles = (vehicles) => {
    return [...vehicles].sort((a, b) => {
      switch (sortOrder) {
        case 'newest':
          return new Date(b.createdDate) - new Date(a.createdDate);
        case 'oldest':
          return new Date(a.createdDate) - new Date(b.createdDate);
        case 'seatsAsc':
          return a.seatCount - b.seatCount;
        case 'seatsDesc':
          return b.seatCount - a.seatCount;
        default:
          return 0;
      }
    });
  };

  const indexOfLastVehicle = currentPage * vehiclesPerPage;
  const indexOfFirstVehicle = indexOfLastVehicle - vehiclesPerPage;
  const currentVehicles = sortVehicles(filteredVehicles).slice(indexOfFirstVehicle, indexOfLastVehicle);
  const totalPages = Math.ceil(filteredVehicles.length / vehiclesPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const VehicleSkeleton = () => (
    <div className="bg-white rounded-lg overflow-hidden shadow-md border border-gray-200 animate-pulse">
      <div className="h-48 bg-gray-200"/>
      <div className="p-4 space-y-3">
        <div className="h-6 bg-gray-200 rounded w-3/4"/>
        <div className="h-4 bg-gray-200 rounded w-1/2"/>
        <div className="h-4 bg-gray-200 rounded w-2/3"/>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => <VehicleSkeleton key={i}/>)}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-red-500 mb-4">{error}</p>
        <button 
          onClick={fetchVehicles}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-7xl mx-auto p-6"
    >
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-blue-50">
                <FaCar className="text-blue-600 text-xl" />
              </div>
              <h1 className="text-3xl font-bold text-gray-800">Browse Vehicles</h1>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={resetFilters}
                disabled={isResetting}
                className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition duration-200 border border-red-200 disabled:opacity-50 flex items-center"
              >
                <FaTimes className="inline mr-2" />
                Reset
              </button>
              <button 
                className={`px-4 py-2 bg-white text-gray-800 rounded-lg hover:bg-gray-100 transition duration-200 border border-gray-300 flex items-center ${filtersExpanded ? 'bg-gray-100' : ''}`}
                onClick={() => setFiltersExpanded(!filtersExpanded)}
              >
                <FaFilter className="inline mr-2" />
                Filters {filtersExpanded ? '▼' : '▲'}
              </button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 items-center mb-4">
            <div className="relative flex-1 w-full">
              <input
                type="text"
                placeholder="Search vehicles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-white text-gray-800 border border-gray-300 rounded-lg p-3 w-full pl-10 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
              <span className="absolute left-3 top-3">🔍</span>
            </div>
            
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="bg-white text-gray-800 border border-gray-300 rounded-lg p-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 w-full md:w-auto"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="seatsAsc">Seats (Low to High)</option>
              <option value="seatsDesc">Seats (High to Low)</option>
            </select>
          </div>

          <AnimatePresence>
            {filtersExpanded && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4"
              >
                <select
                  name="make"
                  value={filterOptions.make}
                  onChange={handleFilterChange}
                  className="bg-white text-gray-800 border border-gray-300 rounded-lg p-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                >
                  <option value="">All Makes</option>
                  <option value="Leyland">Leyland</option>
                  <option value="Isuzu">Isuzu</option>
                  <option value="Volvo">Volvo</option>
                  <option value="Mercedes-Benz">Mercedes-Benz</option>
                </select>

                <select
                  name="vehicleType"
                  value={filterOptions.vehicleType}
                  onChange={handleFilterChange}
                  className="bg-white text-gray-800 border border-gray-300 rounded-lg p-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                >
                  <option value="">All Types</option>
                  <option value="Bus">Bus</option>
                </select>

                <input
                  type="number"
                  name="minSeats"
                  placeholder="Min Seats"
                  value={filterOptions.minSeats}
                  onChange={handleFilterChange}
                  className="bg-white text-gray-800 border border-gray-300 rounded-lg p-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />

                <input
                  type="number"
                  name="maxSeats"
                  placeholder="Max Seats"
                  value={filterOptions.maxSeats}
                  onChange={handleFilterChange}
                  className="bg-white text-gray-800 border border-gray-300 rounded-lg p-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />

                <select
                  name="status"
                  value={filterOptions.status}
                  onChange={handleFilterChange}
                  className="bg-white text-gray-800 border border-gray-300 rounded-lg p-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                >
                  <option value="">All Status</option>
                  <option value="Available">Available</option>
                  <option value="Not Available">Not Available</option>
                </select>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Results Count */}
        <motion.div 
          key={filteredVehicles.length}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-gray-600 mb-6 flex items-center gap-2"
        >
          Found <span className="font-semibold">{filteredVehicles.length}</span> vehicles
        </motion.div>

        {/* Vehicle Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentVehicles.map(vehicle => (
            <motion.div
              key={vehicle._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl border border-gray-200 hover:border-blue-300 transition-all duration-300 cursor-pointer"
              onClick={() => openVehicleDetails(vehicle)}
            >
              <div className="relative">
                <div className="h-48 bg-gray-100">
                  {vehicle.image ? (
                    <img
                      src={vehicle.image}
                      alt={`${vehicle.make} ${vehicle.model}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FaCar className="text-gray-400 text-4xl" />
                    </div>
                  )}
                </div>
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    vehicle.status === 'Available' 
                      ? 'bg-green-100 text-green-700 border border-green-200' 
                      : 'bg-red-100 text-red-700 border border-red-200'
                  }`}>
                    {vehicle.status}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors mb-1">
                    {vehicle.make} {vehicle.model}
                  </h3>
                  <p className="text-sm text-gray-500">{vehicle.vehicleNumber}</p>
                </div>

                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                      {vehicle.vehicleType}
                    </span>
                    <span className="inline-flex items-center bg-gray-50 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                      {vehicle.seatCount} Seats
                    </span>
                  </div>

                  <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      Added: {new Date(vehicle.createdDate).toLocaleDateString()}
                    </span>
                    <span className="text-blue-600 group-hover:translate-x-1 transition-transform">
                      View Details →
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredVehicles.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-gray-600 py-12"
          >
            <FaCar className="mx-auto text-4xl mb-4 text-gray-400" />
            <p className="text-lg">No vehicles found matching your criteria.</p>
          </motion.div>
        )}

        {/* Add Pagination Controls */}
        {filteredVehicles.length > 0 && (
          <div className="mt-8 flex justify-center items-center gap-2">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Previous
            </button>
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => paginate(index + 1)}
                className={`px-3 py-1 rounded-lg border ${
                  currentPage === index + 1
                    ? 'bg-blue-50 border-blue-300 text-blue-600'
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                {index + 1}
              </button>
            ))}
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        )}

        {/* Enhanced Modal */}
        <AnimatePresence>
          {showModal && selectedVehicle && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm"
              onClick={() => setShowModal(false)}
            >
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-xl max-w-2xl w-full p-2 shadow-2xl max-h-[55vh] overflow-y-auto"
                onClick={e => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-base font-bold text-gray-800">Vehicle Details</h2>
                      <span className="bg-blue-50 text-blue-700 px-2 rounded text-xs font-medium">
                        {selectedVehicle.vehicleNumber}
                      </span>
                      <span className={`px-2 rounded text-xs font-medium ${
                        selectedVehicle.status === 'Available'
                          ? 'bg-green-50 text-green-700'
                          : 'bg-red-50 text-red-700'
                      }`}>
                        {selectedVehicle.status}
                      </span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowModal(false)}
                    className="p-0.5"
                  >
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Modal Content */}
                <div className="space-y-2">
                  <div className="h-96 rounded-lg overflow-hidden bg-gray-100">
                    {selectedVehicle.image ? (
                      <img
                        src={selectedVehicle.image}
                        alt={`${selectedVehicle.make} ${selectedVehicle.model}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FaCar className="text-gray-400 text-3xl" />
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Make & Model</h3>
                      <p className="text-base font-semibold text-gray-800">
                        {selectedVehicle.make} {selectedVehicle.model}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Vehicle Type</h3>
                      <p className="text-base font-semibold text-gray-800">
                        {selectedVehicle.vehicleType}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Seat Capacity</h3>
                      <p className="text-base font-semibold text-gray-800">
                        {selectedVehicle.seatCount} Seats
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Added Date</h3>
                      <p className="text-base font-semibold text-gray-800">
                        {selectedVehicle.createdDate ? new Date(selectedVehicle.createdDate).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end gap-3 mt-4 pt-3 border-t border-gray-200">
                    {selectedVehicle.status === 'Available' && (
                      <button
                        className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-base font-medium"
                      >
                        Book Now
                      </button>
                    )}
                    
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default VehicleCardView;