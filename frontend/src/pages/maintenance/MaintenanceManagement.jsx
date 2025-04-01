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

    const downloadAsCSV = () => {
        const headers = ['Bus Number', 'Maintenance Type', 'Date', 'Next Due Date', 'Description', 'Cost'];
        const csvContent = [
            headers.join(','),
            ...filteredRecords.map(record => [
                record.busNumber,
                record.maintenanceType,
                new Date(record.maintenanceDate).toLocaleDateString(),
                new Date(record.nextDueDate).toLocaleDateString(),
                `"${record.description}"`,
                `Rs. ${record.cost}`
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'maintenance_report.csv';
        link.click();
        setShowDownloadPopup(false);
    };

    const downloadAsPDF = () => {
        const doc = new jsPDF();
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
            theme: 'striped',
            headStyles: {
                fillColor: [51, 51, 51],
                textColor: 255,
                fontStyle: 'bold'
            },
            margin: { top: 35 }
        });

        const finalY = (doc.lastAutoTable && doc.lastAutoTable.finalY) || 35;
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
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold text-gray-800">Maintenance Management</h2>
                    <div className="flex space-x-4">
                        <button
                            onClick={() => setShowDownloadPopup(true)}
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-semibold text-base"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                            <span>Download Report</span>
                        </button>
                        <button 
                            onClick={() => setShowAddPopup(true)}
                            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-emerald-700 transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-semibold text-base"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                            </svg>
                            <span>Add New Record</span>
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

                <div className="overflow-x-auto rounded-lg border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="group px-6 py-4 text-left">
                                    <div className="flex items-center space-x-2 text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700">
                                        <span>Bus Number</span>
                                    </div>
                                </th>
                                <th className="group px-6 py-4 text-left">
                                    <div className="flex items-center space-x-2 text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700">
                                        <span>Type</span>
                                    </div>
                                </th>
                                <th className="group px-6 py-4 text-left">
                                    <div className="flex items-center space-x-2 text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700">
                                        <span>Date</span>
                                    </div>
                                </th>
                                <th className="group px-6 py-4 text-left">
                                    <div className="flex items-center space-x-2 text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700">
                                        <span>Next Due</span>
                                    </div>
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Description
                                </th>
                                <th className="group px-6 py-4 text-left">
                                    <div className="flex items-center space-x-2 text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700">
                                        <span>Cost</span>
                                    </div>
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {currentItems.map(record => (
                                <tr key={record._id} className="hover:bg-gray-50 transition duration-150">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {record.busNumber}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                            {record.maintenanceType}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {new Date(record.maintenanceDate).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {new Date(record.nextDueDate).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900">
                                        {record.description}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        Rs. {record.cost}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                                        <button 
                                            onClick={() => handleEdit(record._id)}
                                            className="inline-flex items-center px-4 py-2 bg-indigo-100 text-indigo-700 hover:bg-indigo-200 rounded-md transition-all duration-200 space-x-1 shadow-sm hover:shadow font-medium"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                            <span>Edit</span>
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(record._id)}
                                            className="inline-flex items-center px-4 py-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-md transition-all duration-200 space-x-1 shadow-sm hover:shadow font-medium"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                                        {Math.min(indexOfLastItem, filteredRecords.length)}
                                    </span> of{' '}
                                    <span className="font-medium">{filteredRecords.length}</span> results
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

                {/* Download Options Popup */}
                {showDownloadPopup && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-xl max-w-md w-full mx-4">
                            <h3 className="text-xl font-bold text-gray-800 mb-4">Download Report</h3>
                            <p className="text-gray-600 mb-4">Choose download format:</p>
                            <div className="space-y-3">
                                <button 
                                    onClick={downloadAsCSV}
                                    className="w-full bg-indigo-600 text-white px-4 py-2.5 rounded-lg hover:bg-indigo-700 transition duration-200 flex items-center justify-center space-x-2"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                    <span>Download as CSV</span>
                                </button>
                                <button 
                                    onClick={downloadAsPDF}
                                    className="w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-semibold"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    <span>Download as PDF</span>
                                </button>
                                <button 
                                    onClick={() => setShowDownloadPopup(false)}
                                    className="w-full bg-gray-100 text-gray-800 px-4 py-2.5 rounded-lg hover:bg-gray-200 transition duration-200"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Add Maintenance Popup */}
                {showAddPopup && (
                    <AddMaintenance onClose={handleClosePopup} />
                )}

                {/* Update Maintenance Popup */}
                {showUpdatePopup && selectedMaintenanceId && (
                    <UpdateMaintenance id={selectedMaintenanceId} onClose={handleClosePopup} />
                )}
            </div>
        </motion.div>
    );
};

export default MaintenanceManagement;