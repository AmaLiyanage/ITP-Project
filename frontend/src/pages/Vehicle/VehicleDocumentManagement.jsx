import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { useVehicleDocumentStore } from '../../store/vehicleDocumentStore';
import VehicleDocumentFormModal from '../../components/vehicle/VehicleDocumentFormModal';
import { FaFileAlt, FaPlus, FaDownload, FaEdit, FaTrash, FaFilter, FaSearch, FaFilePdf } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';

const VehicleDocumentManagement = () => {
  const { 
    documents, 
    filteredDocuments, 
    loading, 
    error, 
    fetchDocuments, 
    addDocument, 
    updateDocument, 
    deleteDocument,
    filterDocuments 
  } = useVehicleDocumentStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDocument, setEditingDocument] = useState(null);
  const [filters, setFilters] = useState({
    busNumber: '',
    documentType: '',
    status: ''
  });
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);

  // Add pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Calculate pagination values
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredDocuments.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredDocuments.length / itemsPerPage);

  // Handle page changes
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  useEffect(() => {
    fetchDocuments();
  }, []);

  useEffect(() => {
    filterDocuments(filters);
  }, [filters]);

  const handleAddDocument = async (formData) => {
    try {
      await addDocument(formData);
      toast.success('Document added successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to add document');
      throw error;
    }
  };

  const handleUpdateDocument = async (formData) => {
    try {
      await updateDocument(editingDocument._id, formData);
      toast.success('Document updated successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to update document');
      throw error;
    }
  };

  const handleDeleteDocument = async (id) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      try {
        await deleteDocument(id);
        toast.success('Document deleted successfully');
      } catch (error) {
        toast.error('Failed to delete document');
      }
    }
  };

  const handleDownload = (document) => {
    // Remove the duplicate uploads/documents from the path
    window.open(`http://localhost:5000/${document.documentFile}`, '_blank');
  };

  const handleDownloadPDF = () => {
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
    doc.text('Vehicle Documents Report', 50, 35);
    
    // Add generation date
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 45);

    // Define the table columns and data
    const tableData = filteredDocuments.map(doc => [
      doc.busNumber,
      getDocumentTypeLabel(doc.documentType),
      new Date(doc.expiryDate).toLocaleDateString(),
      doc.status.charAt(0).toUpperCase() + doc.status.slice(1)
    ]);

    // Generate the table using autoTable
    autoTable(doc, {
      head: [['Bus Number', 'Document Type', 'Expiry Date', 'Status']],
      body: tableData,
      startY: 55,
      headStyles: { 
        fillColor: [51, 51, 51],
        textColor: 255,
        fontStyle: 'bold'
      },
      alternateRowStyles: { fillColor: [245, 247, 250] }
    });

    const finalY = (doc.lastAutoTable && doc.lastAutoTable.finalY) || 55;
    doc.text(`Total Documents: ${filteredDocuments.length}`, 14, finalY + 10);

    doc.save('vehicle-documents-report.pdf');
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDocumentTypeLabel = (type) => {
    const types = {
      insurance: 'Insurance',
      service: 'Service Documents',
      licence: 'Vehicle License',
      emissions: 'Emissions Test'
    };
    return types[type] || type;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-4">
        <p>Error: {error}</p>
        <button
          onClick={fetchDocuments}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
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
      className="max-w-7xl mx-auto p-6 space-y-6"
    >
      {/* Header Section with Gradient Background */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl shadow-lg p-8 text-white">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-white/10 backdrop-blur-sm">
              <FaFileAlt className="text-3xl text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Vehicle Documents</h1>
              <p className="text-blue-100 mt-1">Manage all your vehicle documentation in one place</p>
            </div>
          </div>
          <div className="flex gap-4">
            <button
              onClick={handleDownloadPDF}
              className="flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm text-white rounded-lg hover:bg-white/20 transition-all transform hover:scale-105 shadow-md"
            >
              <FaFilePdf />
              <span className="font-semibold">Download Report</span>
            </button>
            <button
              onClick={() => {
                setEditingDocument(null);
                setIsModalOpen(true);
              }}
              className="flex items-center gap-2 px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-all transform hover:scale-105 shadow-md"
            >
              <FaPlus />
              <span className="font-semibold">Add New Document</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
        <button
          onClick={() => setIsFilterExpanded(!isFilterExpanded)}
          className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors"
        >
          <FaFilter className={isFilterExpanded ? "text-blue-600" : ""} />
          <span className="font-medium">Filter Documents</span>
        </button>

        {isFilterExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6"
          >
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="busNumber"
                placeholder="Search by bus number..."
                value={filters.busNumber}
                onChange={handleFilterChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <select
              name="documentType"
              value={filters.documentType}
              onChange={handleFilterChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              <option value="">All Document Types</option>
              <option value="insurance">Insurance</option>
              <option value="service">Service Documents</option>
              <option value="licence">Vehicle License</option>
              <option value="emissions">Emissions Test</option>
            </select>

            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="expired">Expired</option>
              <option value="pending">Pending</option>
            </select>
          </motion.div>
        )}
      </div>

      {/* Documents Table */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Bus Number</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Document Type</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Expiry Date</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentItems.map((document, index) => (
                <motion.tr
                  key={document._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {document.busNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {getDocumentTypeLabel(document.documentType)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {new Date(document.expiryDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(document.status)}`}>
                      {document.status.charAt(0).toUpperCase() + document.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => handleDownload(document)}
                        className="text-blue-600 hover:text-blue-800 transition-colors p-1"
                        title="Download"
                      >
                        <FaDownload />
                      </button>
                      <button
                        onClick={() => {
                          setEditingDocument(document);
                          setIsModalOpen(true);
                        }}
                        className="text-indigo-600 hover:text-indigo-800 transition-colors p-1"
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDeleteDocument(document._id)}
                        className="text-red-600 hover:text-red-800 transition-colors p-1"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>

          {filteredDocuments.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-12 text-gray-500"
            >
              <FaFileAlt className="text-4xl mb-4 text-gray-400" />
              <p className="text-lg">No documents found</p>
              <p className="text-sm mt-2">Try adjusting your filters or add a new document</p>
            </motion.div>
          )}

          {/* Pagination Controls */}
          {filteredDocuments.length > 0 && (
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
                      {Math.min(indexOfLastItem, filteredDocuments.length)}
                    </span> of{' '}
                    <span className="font-medium">{filteredDocuments.length}</span> results
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
          )}
        </div>
      </div>

      <VehicleDocumentFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingDocument(null);
        }}
        editingDocument={editingDocument}
        onSubmit={editingDocument ? handleUpdateDocument : handleAddDocument}
      />
    </motion.div>
  );
};

export default VehicleDocumentManagement;