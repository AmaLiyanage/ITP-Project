import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaWrench } from 'react-icons/fa';
import { useMaintenanceStore } from '../../store/maintenanceStore';

const BrowseMaintenance = () => {
    const { records, loading, error, fetchRecords } = useMaintenanceStore();
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchRecords();
    }, []);

    const openMaintenanceDetails = (record) => {
        setSelectedRecord(record);
        setShowModal(true);
    };

    const MaintenanceSkeleton = () => (
        <div className="bg-white rounded-lg overflow-hidden shadow-lg border border-gray-200 animate-pulse">
            <div className="p-6">
                <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-gray-200 rounded-full mr-2"/>
                    <div>
                        <div className="h-6 bg-gray-200 rounded w-24 mb-1"/>
                        <div className="h-4 bg-gray-200 rounded w-20"/>
                    </div>
                </div>
                <div className="space-y-3">
                    <div className="h-5 bg-gray-200 rounded w-32"/>
                    <div className="h-4 bg-gray-200 rounded w-full"/>
                    <div className="flex justify-between">
                        <div className="h-4 bg-gray-200 rounded w-16"/>
                        <div className="h-4 bg-gray-200 rounded w-24"/>
                    </div>
                </div>
            </div>
        </div>
    );

    // Add pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 9;

    // Add pagination calculation
    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = records.slice(indexOfFirstRecord, indexOfLastRecord);
    const totalPages = Math.ceil(records.length / recordsPerPage);

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => <MaintenanceSkeleton key={i}/>)}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-white">
                <p className="text-red-500 mb-4">{error}</p>
                <button
                    onClick={fetchRecords}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
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
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold text-gray-800">Browse Maintenance Records</h2>
                    </div>
                </div>

                {/* Results Count */}
                <motion.div
                    key={records.length}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-gray-600 mb-4"
                >
                    Found <span className="font-semibold">{records.length}</span> maintenance records
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {currentRecords.map(record => (
                        <motion.div
                            key={record._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            whileHover={{ scale: 1.02 }}
                            className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl border border-gray-200 hover:border-blue-300 transition-all duration-300 cursor-pointer"
                            onClick={() => openMaintenanceDetails(record)}
                        >
                            <div className="relative p-6">
                                {/* Status Badge */}
                                <div className="absolute top-4 right-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                        new Date(record.nextDueDate) < new Date()
                                            ? 'bg-red-100 text-red-700'
                                            : 'bg-green-100 text-green-700'
                                    }`}>
                                        {new Date(record.nextDueDate) < new Date() ? 'Overdue' : 'On Schedule'}
                                    </span>
                                </div>

                                {/* Header */}
                                <div className="flex items-center mb-4">
                                    <div className="p-2 rounded-full bg-blue-50 mr-3">
                                        <FaWrench className="text-blue-500 text-lg" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                                            {record.busNumber}
                                        </h3>
                                        <div className="flex items-center text-sm text-gray-500">
                                            <span className="mr-2">
                                                {new Date(record.maintenanceDate).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="space-y-3">
                                    <div className="flex flex-wrap gap-2">
                                        <span className="inline-flex items-center bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                                            {record.maintenanceType}
                                        </span>
                                        <span className="inline-flex items-center bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full text-sm font-medium">
                                            Rs. {record.cost}
                                        </span>
                                    </div>

                                    <p className="text-gray-600 text-sm line-clamp-2 min-h-[2.5rem]">
                                        {record.description}
                                    </p>

                                    <div className="pt-3 border-t border-gray-100">
                                        <div className="flex justify-between items-center">
                                            <div className="text-sm text-gray-500">
                                                Next Service:
                                                <span className="ml-1 font-medium text-gray-700">
                                                    {new Date(record.nextDueDate).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <div className="text-blue-600 group-hover:translate-x-1 transition-transform">
                                                View Details →
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {records.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center text-gray-600 py-8"
                    >
                        <FaWrench className="mx-auto text-4xl mb-4 text-gray-400" />
                        <p>No maintenance records found.</p>
                    </motion.div>
                )}

                {/* Pagination Controls */}
                {records.length > 0 && (
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
            </div>

            {/* Enhanced Modal */}
            <AnimatePresence>
                {showModal && selectedRecord && (
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
                            className="bg-white rounded-xl max-w-2xl w-full p-8 shadow-2xl"
                            onClick={e => e.stopPropagation()}
                        >
                            {/* Modal Header */}
                            <div className="flex justify-between items-start mb-6">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-full bg-blue-50">
                                            <FaWrench className="text-blue-600 text-xl" />
                                        </div>
                                        <h2 className="text-2xl font-bold text-gray-800">
                                            Maintenance Details
                                        </h2>
                                    </div>
                                    <div className="flex gap-2">
                                        <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                                            Bus: {selectedRecord.busNumber}
                                        </span>
                                        <span className="bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full text-sm font-medium">
                                            Rs. {selectedRecord.cost}
                                        </span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {/* Modal Content */}
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h3 className="text-sm font-medium text-gray-500 mb-1">Maintenance Type</h3>
                                        <p className="text-lg font-semibold text-gray-800">{selectedRecord.maintenanceType}</p>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h3 className="text-sm font-medium text-gray-500 mb-1">Status</h3>
                                        <span className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold ${
                                            new Date(selectedRecord.nextDueDate) < new Date()
                                                ? 'bg-red-100 text-red-700'
                                                : 'bg-green-100 text-green-700'
                                        }`}>
                                            {new Date(selectedRecord.nextDueDate) < new Date() ? 'Maintenance Overdue' : 'On Schedule'}
                                        </span>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h3 className="text-sm font-medium text-gray-500 mb-1">Maintenance Date</h3>
                                        <p className="text-lg font-semibold text-gray-800">
                                            {new Date(selectedRecord.maintenanceDate).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h3 className="text-sm font-medium text-gray-500 mb-1">Next Due Date</h3>
                                        <p className="text-lg font-semibold text-gray-800">
                                            {new Date(selectedRecord.nextDueDate).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="text-sm font-medium text-gray-500 mb-2">Description</h3>
                                    <p className="text-gray-800 whitespace-pre-line">{selectedRecord.description}</p>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">

                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default BrowseMaintenance;