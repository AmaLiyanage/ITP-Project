import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from "framer-motion";
import FloatingShape from "../components/FloatingShape";
import VehicleFormModal from "../components/vehicle/VehicleFormModal";

const Vehicle = () => {
  const busModels = {
    '': [],
    Leyland: ["Olympian", "Titan", "Atlantean", "Tiger", "Royal Tiger"],
    Isuzu: ["Journey", "Erga", "Gala", "Elga", "Citibus"],
    Volvo: ["9700", "9900", "7900", "8900", "B8R"],
    "Mercedes-Benz": ["Citaro", "Tourismo", "Intouro", "Sprinter", "Conecto"]
  };

  const [vehicles, setVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
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

  useEffect(() => {
    fetchVehicles();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, vehicles]);

  const fetchVehicles = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/vehicles');
      setVehicles(response.data);
      setFilteredVehicles(response.data);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
    }
  };

  const applyFilters = () => {
    let filtered = [...vehicles];

    // Apply make filter
    if (filters.make) {
      filtered = filtered.filter((vehicle) => vehicle.make === filters.make);
    }

    // Apply model filter only if make is selected and model is selected
    if (filters.make && filters.model) {
      filtered = filtered.filter((vehicle) => vehicle.model === filters.model);
    }

    // Apply seat count filters
    if (filters.minSeatCount || filters.maxSeatCount) {
      filtered = filtered.filter((vehicle) => {
        const seatCount = vehicle.seatCount;
        const minSeatCount = parseInt(filters.minSeatCount) || 0;
        const maxSeatCount = parseInt(filters.maxSeatCount) || Number.MAX_SAFE_INTEGER;
        return seatCount >= minSeatCount && seatCount <= maxSeatCount;
      });
    }

    // Apply status filter
    if (filters.status) {
      filtered = filtered.filter((vehicle) => vehicle.status === filters.status);
    }

    setFilteredVehicles(filtered);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    
    // If make changes, reset model selection
    if (name === 'make') {
      setFilters({ 
        ...filters, 
        [name]: value,
        model: '' // Reset model when make changes
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
        await axios.delete(`http://localhost:5000/api/vehicles/${id}`);
        fetchVehicles(); // Refresh the list after deleting
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

    const csv = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map((row) => Object.values(row).join(',')),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'vehicle_report.csv';
    link.click();
    setShowDownloadPopup(false);
  };

  const downloadAsPDF = () => {
    try {
      const doc = new jsPDF();
      
      doc.setFontSize(18);
      doc.text('Vehicle Management Report', 14, 22);
      doc.setFontSize(11);
      doc.setTextColor(100);
      
      const dateStr = new Date().toLocaleDateString('en-US', {
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
      doc.text(`Generated on: ${dateStr}`, 14, 30);
      
      const tableColumn = ["Vehicle Number", "Type", "Make", "Model", "Seats", "Status", "Created Date"];
      const tableRows = filteredVehicles.map(vehicle => [
        vehicle.vehicleNumber,
        vehicle.vehicleType,
        vehicle.make,
        vehicle.model,
        vehicle.seatCount,
        vehicle.status,
        vehicle.createdDate ? new Date(vehicle.createdDate).toLocaleDateString() : 'N/A'
      ]);
      
      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 35,
        theme: 'striped',
        headStyles: {
          fillColor: [66, 139, 202],
          textColor: 255,
          fontStyle: 'bold'
        },
        margin: { top: 35 }
      });
      
      const finalY = (doc.lastAutoTable && doc.lastAutoTable.finalY) || 35;
      doc.text(`Total Vehicles: ${filteredVehicles.length}`, 14, finalY + 10);
      
      doc.save('vehicle_report.pdf');
      setShowDownloadPopup(false);
    } catch (error) {
      console.error("PDF generation error:", error);
      alert("Error generating PDF. Please check console for details.");
      setShowDownloadPopup(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900 py-8 px-4">
      <FloatingShape color="bg-green-500" size="w-64 h-64" top="-5%" left="10%" delay={0} />
      <FloatingShape color="bg-emerald-500" size="w-48 h-48" top="70%" left="80%" delay={5} />
      <FloatingShape color="bg-lime-500" size="w-32 h-32" top="40%" left="-10%" delay={2} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto bg-gray-900 bg-opacity-80 backdrop-filter backdrop-blur-lg rounded-xl shadow-2xl border border-gray-800 p-6"
      >
        <h1 className="text-3xl font-bold text-center text-white mb-8">Vehicle Management</h1>

        {/* Filter Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
          <select
            name="make"
            value={filters.make}
            onChange={handleFilterChange}
            className="bg-gray-800 text-white border border-gray-700 rounded-lg p-2"
          >
            <option value="">All Makes</option>
            <option value="Leyland">Leyland</option>
            <option value="Isuzu">Isuzu</option>
            <option value="Volvo">Volvo</option>
            <option value="Mercedes-Benz">Mercedes-Benz</option>
          </select>

          <select
            name="model"
            value={filters.model}
            onChange={handleFilterChange}
            disabled={!filters.make}
            className="bg-gray-800 text-white border border-gray-700 rounded-lg p-2"
          >
            <option value="">All Models</option>
            {filters.make && busModels[filters.make] && 
              busModels[filters.make].map(model => (
                <option key={model} value={model}>{model}</option>
              ))
            }
          </select>

          <input
            type="number"
            name="minSeatCount"
            value={filters.minSeatCount}
            onChange={handleFilterChange}
            placeholder="Min Seats"
            className="bg-gray-800 text-white border border-gray-700 rounded-lg p-2"
          />

          <input
            type="number"
            name="maxSeatCount"
            value={filters.maxSeatCount}
            onChange={handleFilterChange}
            placeholder="Max Seats"
            className="bg-gray-800 text-white border border-gray-700 rounded-lg p-2"
          />

          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="bg-gray-800 text-white border border-gray-700 rounded-lg p-2"
          >
            <option value="">All Status</option>
            <option value="Available">Available</option>
            <option value="Not Available">Not Available</option>
          </select>

          <button 
            onClick={handleDownloadReport}
            className="bg-green-600 text-white rounded-lg p-2 hover:bg-green-700 transition duration-200"
          >
            Download Report
          </button>
        </div>

        <div className="flex justify-end mb-6">
          <button
            onClick={() => { setEditingVehicle(null); setModalOpen(true); }}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-200"
          >
            + Add Vehicle
          </button>
        </div>

        {/* Vehicle Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Vehicle Number</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Make</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Model</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Image</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Seats</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Created Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-gray-900 divide-y divide-gray-800">
              {filteredVehicles.map((vehicle) => (
                <tr key={vehicle._id} className="hover:bg-gray-800 transition-colors duration-200">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{vehicle.vehicleNumber}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{vehicle.vehicleType}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{vehicle.make}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{vehicle.model}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {vehicle.image ? (
                      <img 
                        src={vehicle.image} 
                        alt={`${vehicle.make} ${vehicle.model}`} 
                        className="h-12 w-12 object-cover rounded"
                      />
                    ) : (
                      <span className="text-gray-500">No Image</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{vehicle.seatCount}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      vehicle.status === 'Available' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {vehicle.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {vehicle.createdDate ? new Date(vehicle.createdDate).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button 
                      onClick={() => handleEdit(vehicle)}
                      className="text-indigo-400 hover:text-indigo-300"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(vehicle._id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

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
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
            <h3 className="text-xl font-bold text-white mb-4">Download Report</h3>
            <p className="text-gray-300 mb-4">Choose download format:</p>
            <div className="space-y-3">
              <button 
                onClick={downloadAsCSV}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-200"
              >
                Download as CSV
              </button>
              <button 
                onClick={downloadAsPDF}
                className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition duration-200"
              >
                Download as PDF
              </button>
              <button 
                onClick={() => setShowDownloadPopup(false)}
                className="w-full bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600 transition duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Vehicle;
