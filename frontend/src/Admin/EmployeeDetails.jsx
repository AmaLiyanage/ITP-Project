import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Employee from './Employee';
import { motion } from 'framer-motion';
import './EmployeeDetails.css';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const URL = "http://localhost:5000/api/employees";

const fetchHandler = async () => {
  return await axios.get(URL).then((res) => res.data);
};

// ✅ Move this OUTSIDE the component
const generatePDF = (employees) => {
  const doc = new jsPDF({ orientation: "landscape" });

  const img = new Image();
  img.src = '/buisness-logo.png';

  img.onload = () => {
    doc.addImage(img, 'PNG', 14, 10, 30, 30);

    doc.setFontSize(20);
    doc.setTextColor(0, 0, 0);
    doc.text('MALSHAN MOTORS', 50, 25);
    doc.setFontSize(16);
    doc.text('Employee Report', 50, 35);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 50);

    const columns = ["Name", "Age", "Gender", "Designation", "Email", "Phone", "NIC_No", "Date_Joined"];
    const rows = employees.map(emp => [
      emp.name, emp.age, emp.gender, emp.designation, emp.email, emp.phone, emp.nicNo, emp.date_joined
    ]);

    autoTable(doc, {
      head: [columns],
      body: rows,
      startY: 55,
      styles: { fontSize: 10, overflow: 'linebreak' },
      headStyles: { fillColor: [41, 128, 185], textColor: 255, halign: 'center' },
      bodyStyles: { valign: 'middle' }
    });

    doc.save("Employee_Report.pdf");
  };
};

function EmployeeDetails() {
  const [employees, setEmployees] = useState([]);
  const [allEmployees, setAllEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [noResults, setNoResults] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await fetchHandler();
        setEmployees(data.employees);
        setAllEmployees(data.employees);
        setError(null);
      } catch (err) {
        console.error("Error fetching employees:", err);
        setError("Failed to load employees. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setEmployees(allEmployees);
      setNoResults(false);
      return;
    }

    const filtered = allEmployees.filter((employee) => {
      const searchFields = [
        employee.name,
        employee.age?.toString(),
        employee.gender,
        employee.designation,
        employee.address,
        employee.email,
        employee.phone?.toString(),
        employee.nicNo,
        employee.date_joined
      ];

      return searchFields.some(field =>
        field?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });

    setEmployees(filtered);
    setNoResults(filtered.length === 0);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    if (!e.target.value.trim()) {
      setEmployees(allEmployees);
      setNoResults(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Employee Details</h1>
            <button
              onClick={() => generatePDF(employees)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download Report
            </button>
          </div>

          <div className="mb-6">
            <div className="flex gap-4">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                onKeyPress={handleKeyPress}
                placeholder="Search employees..."
                className="flex-1 min-w-0 block w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
              <button
                onClick={handleSearch}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Search
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-4 text-sm text-red-700 bg-red-100 rounded-lg">
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : noResults ? (
            <div className="text-center py-8 text-gray-500">
              No employees found matching your search.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Age</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Gender</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Designation</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Address</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Phone</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">NIC No</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Date Joined</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {employees.map((employee) => (
                    <Employee key={employee._id} employee={employee} />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default EmployeeDetails;
