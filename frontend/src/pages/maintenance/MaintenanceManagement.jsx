import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';
import { useMaintenanceStore } from '../../store/maintenanceStore';
import AddMaintenance from '../../components/maintenance/AddMaintenance';
import UpdateMaintenance from '../../components/maintenance/UpdateMaintenance';

const MaintenanceManagement = () => {
    const navigate = useNavigate();
    const { records, filteredRecords, loading, error, fetchRecords, deleteRecord, filterRecords } = useMaintenanceStore();
    const maintenanceTypes = [
        'Routine Service',
        'Oil Change',
        'Brake Service',
        'Tire Replacement',
        'Engine Repair',
        'Body Repair',
        'AC Service',
        'Battery Service',
        'Other'
    ];

    const [showDownloadPopup, setShowDownloadPopup] = useState(false);
    const [isFilterCollapsed, setIsFilterCollapsed] = useState(false);
    const [filters, setFilters] = useState({
        busNumber: '',
        maintenanceType: '',
        costMin: '',
        costMax: '',
    });
    const [showAddPopup, setShowAddPopup] = useState(false);
    const [showUpdatePopup, setShowUpdatePopup] = useState(false);
    const [selectedMaintenanceId, setSelectedMaintenanceId] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // Calculate pagination values
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredRecords.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);

    // Handle page changes
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Reset to first page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [filters]);

    useEffect(() => {
        fetchRecords();
    }, []);

    useEffect(() => {
        filterRecords(filters);
    }, [filters]);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this maintenance record?')) {
            try {
                await deleteRecord(id);
            } catch (error) {
                console.error('Error deleting record:', error);
            }
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleDownloadReport = () => {
        downloadAsPDF();
    };

    const downloadAsPDF = () => {
        const doc = new jsPDF();
        
        // Add logo
        const img = new Image();
        img.src = '/buisness-logo.png';
        doc.addImage(img, 'PNG', 14, 10, 30, 30);
        
        // Add header
        doc.setFontSize(20);
        doc.setTextColor(0, 0, 0);
        doc.text('MALSHAN MOTORS', 50, 25);
        doc.setFontSize(16);
        doc.text('Maintenance Management Report', 50, 35);
        
        // Add generation date
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 45);

        const tableData = filteredRecords.map(record => [
            record.busNumber,
            record.maintenanceType,
            new Date(record.maintenanceDate).toLocaleDateString(),
            new Date(record.nextDueDate).toLocaleDateString(),
            record.description,
            `Rs. ${record.cost}`
        ]);

        autoTable(doc, {
            head: [['Bus Number', 'Type', 'Date', 'Next Due', 'Description', 'Cost']],
            body: tableData,
            startY: 55,
            theme: 'striped',
            headStyles: {
                fillColor: [51, 51, 51],
                textColor: 255,
                fontStyle: 'bold'
            },
            margin: { top: 55 }
        });

        const finalY = (doc.lastAutoTable && doc.lastAutoTable.finalY) || 55;
        doc.text(`Total Records: ${filteredRecords.length}`, 14, finalY + 10);

        doc.save('maintenance_report.pdf');
        setShowDownloadPopup(false);
    };

    const handleEdit = (id) => {
        setSelectedMaintenanceId(id);
        setShowUpdatePopup(true);
    };

    const handleClosePopup = () => {
        setShowAddPopup(false);
        setShowUpdatePopup(false);
        setSelectedMaintenanceId(null);
        fetchRecords(); // Refresh the records after closing popup
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-white">Loading maintenance records...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <p className="text-red-500 mb-4">{error}</p>
                <button 
                    onClick={fetchRecords}
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
            <div className="rounded-xl">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold text-gray-800">Maintenance Management</h2>
                    <div className="flex space-x-4">                    <button
                        onClick={() => setShowDownloadPopup(true)}
                        className="group relative px-8 py-3 bg-gradient-to-br from-green-500 via-green-600 to-green-700 text-white rounded-xl hover:from-green-600 hover:via-green-700 hover:to-green-800 transition-all duration-300 flex items-center space-x-3 shadow-lg hover:shadow-green-500/40 transform hover:-translate-y-0.5 border border-green-400/20 overflow-hidden"
                    >
                <span className="relative flex items-center z-10">
                    <svg 
                     xmlns="http://www.w3.org/2000/svg" 
                     className="h-5 w-5 transform group-hover:translate-y-1 transition-transform duration-300 ease-out" 
                     viewBox="0 0 20 20" 
                     fill="currentColor"
                    >
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
               <span className="ml-2.5 font-semibold tracking-wide">Download PDF Report</span>
               </span>

               {/* Hover Overlay Effects */}
               <span className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/20 via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out z-0"></span>
               <span className="absolute inset-0 rounded-xl border border-white/20 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out z-0"></span>
            </button>

                        
            <button 
                onClick={() => setShowAddPopup(true)}
                className="group relative px-8 py-3 bg-gradient-to-br from-green-500 via-emerald-600 to-green-700 text-white rounded-xl hover:from-emerald-600 hover:via-green-700 hover:to-green-800 transition-all duration-300 flex items-center space-x-3 shadow-lg hover:shadow-emerald-500/40 transform hover:-translate-y-0.5 border border-emerald-400/20 overflow-hidden"
            >
            <span className="relative flex items-center z-10">
                <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 transform group-hover:rotate-90 transition-transform duration-300 ease-out" 
                viewBox="0 0 20 20" 
                fill="currentColor"
                >
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
        </svg>
        <span className="ml-2.5 font-semibold tracking-wide">Add New Record</span>
    </span>

    {/* Hover effects */}
    <span className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/20 via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out z-0"></span>
    <span className="absolute inset-0 rounded-xl border border-white/20 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out z-0"></span>
</button>

                    </div>
                </div>

                <button 
                    className="mb-4 text-gray-600 hover:text-gray-800 flex items-center transition duration-200"
                    onClick={() => setIsFilterCollapsed(!isFilterCollapsed)}
                >
                    <span className={`transform transition-transform ${isFilterCollapsed ? '' : 'rotate-180'} inline-block mr-2`}>▼</span>
                    {isFilterCollapsed ? 'Show Filters' : 'Hide Filters'}
                </button>

                {!isFilterCollapsed && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        <input
                            type="text"
                            name="busNumber"
                            value={filters.busNumber}
                            onChange={handleFilterChange}
                            placeholder="Search Bus Number"
                            className="bg-white text-gray-800 border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                        />

                        <select
                            name="maintenanceType"
                            value={filters.maintenanceType}
                            onChange={handleFilterChange}
                            className="bg-white text-gray-800 border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                        >
                            <option value="">All Types</option>
                            {maintenanceTypes.map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>

                        <input
                            type="number"
                            name="costMin"
                            value={filters.costMin}
                            onChange={handleFilterChange}
                            placeholder="Min Cost"
                            className="bg-white text-gray-800 border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                        />

                        <input
                            type="number"
                            name="costMax"
                            value={filters.costMax}
                            onChange={handleFilterChange}
                            placeholder="Max Cost"
                            className="bg-white text-gray-800 border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                        />
                    </div>
                )}

                {/* Card View */}
                <div className="mb-6">
                    <div className="flex flex-col space-y-6">
                        {currentItems.map(record => (
                            <motion.div 
                                key={record._id} 
                                className="w-full bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
                                whileHover={{ y: -2 }}
                            >
                                <div className="p-6">
                                    <div className="flex flex-col space-y-4">
                                        {/* Header Section */}
                                        <div className="flex justify-between items-start">
                                            <div className="flex items-center space-x-3">
                                                <div className="p-2 bg-blue-50 rounded-lg">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-bold text-gray-900">{record.maintenanceType}</h3>
                                                    <span className="text-sm font-medium text-gray-500">Bus #{record.busNumber}</span>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end">
                                                <div className="text-2xl font-bold text-blue-600">Rs. {record.cost.toLocaleString()}</div>
                                                <span className="text-sm text-gray-500">Maintenance Cost</span>
                                            </div>
                                        </div>

                                        {/* Content Section */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                                            <div className="flex items-center space-x-2">
                                                <div className="p-1.5 bg-green-50 rounded-md">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <div className="text-sm font-semibold text-gray-900">Maintenance Date</div>
                                                    <div className="text-sm text-gray-600">{new Date(record.maintenanceDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</div>
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-center space-x-2">
                                                <div className="p-1.5 bg-yellow-50 rounded-md">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <div className="text-sm font-semibold text-gray-900">Next Due Date</div>
                                                    <div className="text-sm text-gray-600">{new Date(record.nextDueDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Description Section */}
                                        <div className="mt-2">
                                            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                                                {record.description}
                                            </div>
                                        </div>

                                        {/* Actions Section */}
                                        <div className="flex justify-end items-center space-x-3 mt-4 pt-4 border-t border-gray-100">
                                            <button 
                                                onClick={() => handleEdit(record._id)}
                                                className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg font-medium text-sm transition-colors duration-200"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                                Edit
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(record._id)}
                                                className="inline-flex items-center px-4 py-2 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg font-medium text-sm transition-colors duration-200"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Download Options Popup */}
            {showDownloadPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 shadow-xl max-w-md w-full">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Download Report</h3>
                        <p className="text-gray-600 mb-4">Generate a PDF report of all maintenance records</p>
                        <div className="space-y-3">
                            <button 
                                onClick={handleDownloadReport}
                                className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-200 flex items-center justify-center space-x-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <span>Download PDF Report</span>
                            </button>
                            <button 
                                onClick={() => setShowDownloadPopup(false)}
                                className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition duration-200"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Maintenance Modal */}
            {showAddPopup && (
                <AddMaintenance onClose={handleClosePopup} />
            )}

            {/* Update Maintenance Modal */}
            {showUpdatePopup && selectedMaintenanceId && (
                <UpdateMaintenance 
                    id={selectedMaintenanceId}
                    onClose={handleClosePopup}
                />
            )}
        </motion.div>
    );
};

export default MaintenanceManagement;