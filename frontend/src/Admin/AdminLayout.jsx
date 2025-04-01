import { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaHome, FaBus, FaTools, FaBars, FaTimes, FaQuestion, FaComments, FaSignOutAlt, FaFileAlt } from 'react-icons/fa';
import { useAuthStore } from '../store/authStore';

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  const sidebarItems = [
    { path: '/admin', icon: <FaHome />, label: 'Dashboard' },
    // Vehicle Group
    {
      group: 'Vehicle Management',
      items: [
        { path: '/admin/vehicles', icon: <FaBus />, label: 'Vehicles' },
        { path: '/admin/documents', icon: <FaFileAlt />, label: 'Vehicle Documents' },
        { path: '/admin/maintenance', icon: <FaTools />, label: 'Maintenance' },
      ]
    },
    // Customer Service Group
    {
      group: 'Customer Service',
      items: [
        { path: '/admin/faqs', icon: <FaQuestion />, label: 'FAQs' },
        { path: '/admin/feedback', icon: <FaComments />, label: 'Feedback' },
      ]
    }
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    await logout();
    navigate('/adminlogin');
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <motion.div
        initial={{ x: -250 }}
        animate={{ x: isSidebarOpen ? 0 : -250 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="fixed h-full z-40"
      >
        <div className="w-64 h-full bg-gradient-to-br from-white to-blue-50 text-gray-800 shadow-2xl border-r border-gray-100">
          <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-blue-100/50 to-white">
            <Link to="/admin" className="flex items-center space-x-3 group">
              <img src="/logo.jpg" alt="Logo" className="w-10 h-10 rounded-xl shadow-sm group-hover:shadow-md transform group-hover:scale-105 transition-all duration-300" />
              <span className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent group-hover:from-blue-600 group-hover:to-blue-400 transition-all duration-300">Admin Panel</span>
            </Link>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-2 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-all duration-300 lg:hidden"
            >
              <FaTimes className="text-gray-600" />
            </button>
          </div>

          <nav className="mt-8 px-4">
            <Link
              to="/admin"
              className={`flex items-center px-4 py-3.5 my-1.5 rounded-xl text-gray-700 transition-all duration-300 ${
                isActive('/admin')
                  ? 'bg-gradient-to-r from-blue-500/10 to-blue-500/5 text-blue-600 shadow-sm'
                  : 'hover:bg-blue-50/50 hover:translate-x-1 hover:shadow-sm'
              }`}
            >
              <span className={`text-xl mr-4 transition-transform duration-300 ${
                isActive('/admin') ? 'text-blue-500 scale-110' : 'group-hover:scale-110'
              }`}>
                <FaHome />
              </span>
              <span className="font-medium">Dashboard</span>
            </Link>

            {sidebarItems.slice(1).map((group, groupIndex) => (
              <div key={groupIndex} className="mt-6">
                <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  {group.group}
                </h3>
                {group.items.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center px-4 py-3 my-1 rounded-xl text-gray-700 transition-all duration-300 ${
                      isActive(item.path)
                        ? 'bg-gradient-to-r from-blue-500/10 to-blue-500/5 text-blue-600 shadow-sm'
                        : 'hover:bg-blue-50/50 hover:translate-x-1 hover:shadow-sm'
                    }`}
                  >
                    <span className={`text-xl mr-4 transition-transform duration-300 ${
                      isActive(item.path) ? 'text-blue-500 scale-110' : 'group-hover:scale-110'
                    }`}>
                      {item.icon}
                    </span>
                    <span className="font-medium">{item.label}</span>
                  </Link>
                ))}
              </div>
            ))}

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center px-4 py-3.5 my-1.5 rounded-xl text-red-600 w-full transition-all duration-300 hover:bg-red-50/50 hover:translate-x-1 hover:shadow-sm mt-8"
            >
              <span className="text-xl mr-4">
                <FaSignOutAlt />
              </span>
              <span className="font-medium">Logout</span>
            </button>
          </nav>
        </div>
      </motion.div>

      {/* Mobile sidebar toggle */}
      <button
        onClick={() => setIsSidebarOpen(true)}
        className={`fixed top-4 left-4 z-50 p-3 rounded-xl bg-white/90 backdrop-blur-sm text-gray-800 shadow-lg hover:bg-blue-50 hover:text-blue-600 transition-all duration-300 lg:hidden ${
          isSidebarOpen ? 'hidden' : 'block'
        }`}
      >
        <FaBars />
      </button>

      {/* Main content */}
      <div 
        className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}
      >
        <div className="p-8 min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
          <Outlet />
        </div>
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminLayout;