import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useState } from "react";  // Import useState for dropdown handling
import "./NavBar.css";

const AdminNav = () => {
  const { isAuthenticated, logout, user } = useAuthStore();
  const navigate = useNavigate();

  const [showEmployeeDropdown, setShowEmployeeDropdown] = useState(false); // Manage employee dropdown
  const [showTaskDropdown, setShowTaskDropdown] = useState(false); // Manage task dropdown
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false); // Handle mobile menu visibility

  const handleLogout = async () => {
    await logout();
    navigate("/adminlogin"); // Redirect to login page after logout
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900 text-white shadow-lg backdrop-blur-lg bg-opacity-90">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <Link to="/admindashboard" className="text-xl font-bold bg-gradient-to-r from-green-400 to-emerald-600 text-transparent bg-clip-text">
            Admin Panel
          </Link>

          {/* Navigation Links */}
          <div className={`md:flex space-x-4 ${mobileMenuOpen ? 'block' : 'hidden'}`}>
            {isAuthenticated ? (
              <>
                <Link to="/admindashboard" className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition-colors">Dashboard</Link>
                <Link to="/admin/vehicles" className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition-colors">Vehicles</Link>
                <Link to="/admin/vehicles/documents" className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition-colors">Documents</Link>
                <Link to="/admin/maintenance" className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition-colors">Maintenance</Link>
                <Link to="/adminaddFAQs" className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition-colors">Add FAQs</Link>
                <Link to="/adminDisplayFAQ" className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition-colors">FAQs</Link>
                <Link to="/admin/feedback" className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition-colors">Feedbacks</Link>

                {/* Employees Dropdown */}
                <div
                  className="relative"
                  onMouseEnter={() => setShowEmployeeDropdown(true)}
                  onMouseLeave={() => setShowEmployeeDropdown(false)}
                >
                  <button className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition-colors">
                    Employees
                  </button>
                  {showEmployeeDropdown && (
                    <div className="absolute top-full left-0 mt-1 bg-gray-800 rounded shadow-lg z-50">
                      <Link to="/adminAddEmployee" className="block px-4 py-2 text-sm text-white hover:bg-gray-700">Add Employee</Link>
                      <Link to="/adminEmployeeDetails" className="block px-4 py-2 text-sm text-white hover:bg-gray-700">Employee Details</Link>
                    </div>
                  )}
                </div>

                {/* Tasks Dropdown */}
                <div
                  className="relative"
                  onMouseEnter={() => setShowTaskDropdown(true)}
                  onMouseLeave={() => setShowTaskDropdown(false)}
                >
                  <button className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition-colors">
                    Tasks
                  </button>
                  {showTaskDropdown && (
                    <div className="absolute top-full left-0 mt-1 bg-gray-800 rounded shadow-lg z-50">
                      <Link to="/adminAddTask" className="block px-4 py-2 text-sm text-white hover:bg-gray-700">Add Task</Link>
                      <Link to="/adminTaskDetails" className="block px-4 py-2 text-sm text-white hover:bg-gray-700">Task Details</Link>
                    </div>
                  )}
                </div>
                <button onClick={handleLogout} className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors">Logout</button>
              </>
            ) : (
              <>
                <Link to="/adminlogin" className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition-colors">Login</Link>
              
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default AdminNav;
