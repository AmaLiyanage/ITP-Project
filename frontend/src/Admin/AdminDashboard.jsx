import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import FloatingShape from "../components/FloatingShape";

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [searchId, setSearchId] = useState("");
  const [filteredUser, setFilteredUser] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/auth/users");
        const text = await response.text();
        console.log("Raw response:", text);

        try {
          const data = JSON.parse(text);
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

    fetchUsers();
  }, []);

  // Function to filter user by ID
  const handleSearch = () => {
    const foundUser = users.find((user) => user._id === searchId);
    setFilteredUser(foundUser || null);
  };

  // Function to download user details as PDF
  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text("User Details", 14, 15);

    if (filteredUser) {
      // If a specific user is searched, download only that user
      doc.text(`ID: ${filteredUser._id}`, 14, 30);
      doc.text(`Name: ${filteredUser.name}`, 14, 40);
      doc.text(`Email: ${filteredUser.email}`, 14, 50);
      doc.text(`Last Login: ${filteredUser.lastLogin ? new Date(filteredUser.lastLogin).toLocaleString() : "N/A"}`, 14, 60);
    } else {
      // Otherwise, download all users as a table
      autoTable(doc, {
        startY: 30,
        head: [["ID", "Name", "Email", "Last Login"]],
        body: users.map((user) => [
          user._id,
          user.name,
          user.email,
          user.lastLogin ? new Date(user.lastLogin).toLocaleString() : "N/A",
        ]),
      });
    }

    doc.save("User_Details.pdf");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900 flex items-center justify-center relative overflow-hidden p-6">
      <FloatingShape color="bg-green-500" size="w-64 h-64" top="-5%" left="10%" delay={0} />
      <FloatingShape color="bg-emerald-500" size="w-48 h-48" top="70%" left="80%" delay={5} />
      <FloatingShape color="bg-lime-500" size="w-32 h-32" top="40%" left="-10%" delay={2} />

      <div className="w-full max-w-5xl bg-gray-900 bg-opacity-80 backdrop-filter backdrop-blur-lg rounded-xl shadow-2xl border border-gray-800 p-6 relative mt-10">
        
        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-600 text-transparent bg-clip-text">
          Admin Dashboard
        </h2>

        {/* Search Bar */}
        <div className="mb-6 flex justify-center">
          <input
            type="text"
            placeholder="Enter User ID"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            className="w-1/2 p-3 rounded-l-lg border border-gray-600 bg-gray-800 text-white focus:outline-none"
          />
          <button
            onClick={handleSearch}
            className="p-3 bg-green-600 text-white font-semibold rounded-r-lg hover:bg-green-700 transition"
          >
            Search
          </button>
        </div>

        {/* Display Filtered User */}
        {filteredUser ? (
          <div className="mb-6 bg-gray-800 p-4 rounded-lg shadow-md text-white">
            <h3 className="text-xl font-semibold text-green-400">User Details</h3>
            <p><strong>ID:</strong> {filteredUser._id}</p>
            <p><strong>Name:</strong> {filteredUser.name}</p>
            <p><strong>Email:</strong> {filteredUser.email}</p>
            <p><strong>Last Login:</strong> {filteredUser.lastLogin ? new Date(filteredUser.lastLogin).toLocaleString() : "N/A"}</p>
          </div>
        ) : (
          searchId && <p className="text-center text-gray-400">No user found with this ID</p>
        )}

        {/*  Download PDF Button */}
       {/*  Move button outside any condition to always render */}
     <div className="flex justify-center my-6">
     <button
    onClick={downloadPDF}
    className="p-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
     >
    Download PDF
   </button>
   </div>


        {/* Users Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-700 shadow-lg rounded-lg">
            <thead>
              <tr className="bg-gray-800 text-white text-lg">
                <th className="border border-gray-600 p-3">ID</th>
                <th className="border border-gray-600 p-3">Name</th>
                <th className="border border-gray-600 p-3">Email</th>
                <th className="border border-gray-600 p-3">Last Login</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user._id} className="text-center bg-gray-700 text-gray-300 hover:bg-gray-600 transition">
                    <td className="border border-gray-600 p-3">{user._id}</td>
                    <td className="border border-gray-600 p-3">{user.name}</td>
                    <td className="border border-gray-600 p-3">{user.email}</td>
                    <td className="border border-gray-600 p-3">
                      {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : "N/A"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="border border-gray-600 p-4 text-center text-gray-400">
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
