import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Employee from './Employee';
import './EmployeeDetails.css';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const URL = "http://localhost:5000/employees";

const fetchHandler = async () => {
  return await axios.get(URL).then((res) => res.data);
};

function EmployeeDetails() {
  const [employees, setEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [noResults, setNoResults] = useState(false);

  useEffect(() => {
    fetchHandler().then((data) => setEmployees(data.employees));
  }, []);

  const generatePDF = () => {
    const doc = new jsPDF({ orientation: "landscape" });
    doc.text("Employee Report", 14, 14);

    const columns = ["ID", "Name", "Age", "Gender", "Designation", "Email", "Phone", "NIC_No", "Date_Joined"];
    const rows = employees.map(emp => [
      emp._id, emp.name, emp.age, emp.gender, emp.designation, emp.email, emp.phone, emp.nicNo, emp.date_joined
    ]);

    autoTable(doc, {
      head: [columns],
      body: rows,
      startY: 20
    });

    doc.save("Employee_Report.pdf");
  };

  const handleSearch = () => {
    fetchHandler().then((data) => {
      const filteredEmployees = data.employees.filter((employee) =>
        Object.values(employee).some((field) =>
          field?.toString().toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
  
      setEmployees(filteredEmployees);
      setNoResults(filteredEmployees.length === 0);
    });
  };

  return (
    <div className="EDD-Div2">
      <h1 className='EDD-h1'>Employee Details</h1>
      <button onClick={generatePDF} className="EDD-btn">Download Report</button>

      <input 
        onChange={(e) => setSearchQuery(e.target.value)}
        type="text"
        name="search"
        placeholder="Search User Details"
        className="EDD-search-input"
      />
      <button onClick={handleSearch} className="EDD-search-btn">Search</button>

      {noResults ? (
        <div className="EDD-SearchBar">
          <p>No User Found</p>
        </div>
      ) : (
        <div>
          {employees.length === 0 ? (
            <p className="EDD-no-employees">No employees found!</p>
          ) : (
            <table className="EDD-table">
              <thead>
                <tr>
                  <th className="EDD-th">ID</th>
                  <th className="EDD-th">Name</th>
                  <th className="EDD-th">Age</th>
                  <th className="EDD-th">Gender</th>
                  <th className="EDD-th">Designation</th>
                  <th className="EDD-th">Address</th>
                  <th className="EDD-th">Email</th>
                  <th className="EDD-th">Phone</th>
                  <th className="EDD-th">NIC No</th>
                  <th className="EDD-th">Date Joined</th>
                  <th className="EDD-th">Actions</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((employee) => (
                  <Employee key={employee._id} employee={employee} />
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
);

}

export default EmployeeDetails;
