import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { FaSearch, FaDownload, FaUser, FaEnvelope, FaClock, FaCalendarAlt } from "react-icons/fa";

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/auth/users"); // Fetch users from backend
        const text = await response.text(); // Get the response text
        try {
          const data = JSON.parse(text); // Parse the response as JSON
          if (data.success) {
            setUsers(data.users); 
          } else {
            console.error("Failed to fetch users:", data.message); 
          }
        } catch (jsonError) {
          console.error("Error parsing JSON:", jsonError, "Response text:", text); 
        }
      } catch (error) {
        console.error("Error fetching users:", error); 
      }
    };

    fetchUsers(); // Call the fetchUsers function when the component mounts
  }, []);

  const handleSearch = () => {
    const start = new Date(startDate);  
    const end = new Date(endDate);     
    end.setHours(23, 59, 59, 999); 
  
    const filtered = users.filter((user) => {
      const registered = user.createdAt ? new Date(user.createdAt) : null; // Convert user registration date to Date object.
      return registered && registered >= start && registered <= end;      
    });
  
    setFilteredUsers(filtered); 
  };
  

  const downloadPDF = () => {
    const doc = new jsPDF();
  
    // Define the logo details
    const logoUrl = "/buisness-logo.png"; 
    const logoWidth = 30;                
    const logoHeight = 20;               
    const logoX = 14;  
    const logoY = 10;                    
  
    
    doc.addImage(logoUrl, "PNG", logoX, logoY, logoWidth, logoHeight);
  
    // Calculate where the text will start after the logo
    const textX = logoX + logoWidth + 10; 
    const textY = logoY + 5;             
  
   // company name
    doc.setFontSize(18); 
    doc.setFont("helvetica", "bold"); 
    doc.text("MALSHAN MOTORS", textX, textY); 
  
    //report title
    doc.setFontSize(14); 
    doc.setFont("helvetica", "normal"); 
    doc.text("User Details Report", textX, textY + 8);
  
    // date
    doc.setFontSize(10); 
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, textX, textY + 16); 
  
    // Set the starting Y-position for the table (below the text section)
    const tableStartY = logoY + logoHeight + 20; 
  
    // Prepare the data for the table (either filtered or all users)
    const tableData = (filteredUsers.length > 0 ? filteredUsers : users).map((user) => [
      user.name, 
      user.email, 
      user.lastLogin ? new Date(user.lastLogin).toLocaleString() : "N/A", 
      user.createdAt ? new Date(user.createdAt).toLocaleString() : "N/A", 
    ]);
  
    // Add the table to the PDF using the autoTable plugin
    autoTable(doc, {
      startY: tableStartY, // Start Y-position for the table
      head: [["Name", "Email", "Last Login", "Register Date"]], 
      body: tableData, 
    });
  
    
    doc.save("User_Details.pdf"); // Download the PDF with the file name 
  };
  

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="w-full max-w-5xl bg-white rounded-xl shadow-2xl border border-gray-800 p-8 mt-10">
        <h2 className="text-3xl font-bold mb-8 text-center text-green-600">Admin Dashboard</h2>

        {/* Search Fields */}
        <div className="flex flex-col md:flex-row justify-center items-center mb-6 gap-4">
          <div className="flex items-center gap-2 w-full md:w-1/3">
            <FaCalendarAlt className="text-gray-600" />
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-600 bg-white text-black"
            />
          </div>
          <div className="flex items-center gap-2 w-full md:w-1/3">
            <FaCalendarAlt className="text-gray-600" />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-600 bg-white text-black"
            />
          </div>
          <button
            onClick={handleSearch}
            className="flex items-center gap-2 bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition"
          >
            <FaSearch /> Search
          </button>
        </div>

        {/* Filter Message */}
        {filteredUsers.length > 0 && (
          <div className="mb-6 p-4 bg-green-100 border border-green-300 rounded-lg text-green-800 font-medium">
            Showing users who registered between <strong>{startDate}</strong> and <strong>{endDate}</strong>
          </div>
        )}

        {/* Download Button */}
        <div className="flex justify-center my-6">
          <button
            onClick={downloadPDF}
            className="flex items-center gap-2 bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition"
          >
            <FaDownload /> Download PDF
          </button>
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse border border-gray-600 shadow-md rounded-lg">
            <thead>
              <tr className="bg-gray-100 text-gray-900 text-lg">
                <th className="border border-gray-600 p-3"><FaUser className="inline mr-1" /> Name</th>
                <th className="border border-gray-600 p-3"><FaEnvelope className="inline mr-1" /> Email</th>
                <th className="border border-gray-600 p-3"><FaClock className="inline mr-1" /> Last Login</th>
                <th className="border border-gray-600 p-3"><FaCalendarAlt className="inline mr-1" /> Register Date</th>
              </tr>
            </thead>
            <tbody>
              {(filteredUsers.length > 0 ? filteredUsers : users).map((user) => (
                <tr
                  key={user._id}
                  className="text-center bg-white text-gray-800 hover:bg-gray-100 transition"
                >
                  <td className="border border-gray-600 p-3">{user.name}</td>
                  <td className="border border-gray-600 p-3">{user.email}</td>
                  <td className="border border-gray-600 p-3">
                    {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : "N/A"}
                  </td>
                  <td className="border border-gray-600 p-3">
                    {user.createdAt ? new Date(user.createdAt).toLocaleString() : "N/A"}
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan="4" className="border border-gray-600 p-4 text-center text-gray-500">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
