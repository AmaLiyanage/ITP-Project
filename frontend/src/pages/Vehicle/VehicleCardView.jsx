import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { FaCar } from 'react-icons/fa';
import { useVehicleStore } from '../../store/vehicleStore';
import { useNavigate } from 'react-router-dom';

const VehicleCardView = () => {
    const { vehicles, loading, error, fetchVehicles } = useVehicleStore();
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const vehiclesPerPage = 9;

    const navigate = useNavigate();

    const handleBookNow = () => {
        navigate('/AddBooking');
    }
  

    useEffect(() => {
        fetchVehicles();
    }, []);

    const openVehicleDetails = (vehicle) => {
        setSelectedVehicle(vehicle);
        setShowModal(true);
    };

    const indexOfLastVehicle = currentPage * vehiclesPerPage;
    const indexOfFirstVehicle = indexOfLastVehicle - vehiclesPerPage;
    const currentVehicles = vehicles.slice(indexOfFirstVehicle, indexOfLastVehicle);
    const totalPages = Math.ceil(vehicles.length / vehiclesPerPage);

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
                    </div>
                </div>

                {/* Results Count */}
                <motion.div
                    key={vehicles.length}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-gray-600 mb-6 flex items-center gap-2"
                >
                    Found <span className="font-semibold">{vehicles.length}</span> vehicles
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

                {vehicles.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center text-gray-600 py-12"
                    >
                        <FaCar className="mx-auto text-4xl mb-4 text-gray-400" />
                        <p className="text-lg">No vehicles found.</p>
                    </motion.div>
                )}

                {/* Add Pagination Controls */}
                {vehicles.length > 0 && (
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
                                            onClick={handleBookNow}
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

export default VehicleCardView