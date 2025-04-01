import { Link, useLocation } from "react-router-dom";
import { motion } from 'framer-motion';
import './NavBar.css';
import { useAuthStore } from "../store/authStore";

const UserNav = () => {
  const location = useLocation();
  const { user, logout } = useAuthStore();

  const navLinks = [
    { to: "/vehicle-cards", text: "Browse Vehicles" },
    { to: "/browse-maintenance", text: "Browse Maintenance" },
    { to: "/faqs", text: "FAQs" },
    { to: "/feedback", text: "Feedback" },
  ];

  return (
    <motion.nav 
      className="bg-white fixed w-full z-20 top-0 border-b border-gray-200 shadow-sm"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Link to="/" className="flex items-center space-x-3 rtl:space-x-reverse">
            <img src="/logo.jpg" className="h-10 rounded-lg shadow-sm" alt="Logo" />
            <span className="self-center text-2xl font-bold whitespace-nowrap text-gray-800 logo-text">
              BusBooking
            </span>
          </Link>
        </motion.div>

        <div className="flex items-center md:order-2 space-x-4">
          {user ? (
            <>
              <motion.div className="flex items-center space-x-4">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={logout}
                  className="text-white bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center shadow-md transition-all duration-300"
                >
                  Logout
                </motion.button>
              </motion.div>
            </>
          ) : (
            <div className="flex space-x-3">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/login"
                  className="text-white bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center shadow-md transition-all duration-300"
                >
                  Login
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/signup"
                  className="text-gray-700 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center shadow-md transition-all duration-300"
                >
                  Sign Up
                </Link>
              </motion.div>
            </div>
          )}
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              to="/admin"
              className="text-white bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-6 py-2.5 text-center shadow-md transition-all duration-300"
            >
              Admin Panel
            </Link>
          </motion.div>
        </div>

        <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1">
          <ul className="flex flex-col md:flex-row md:space-x-8 rtl:space-x-reverse">
            {navLinks.map((item) => (
              <motion.li key={item.to}>
                <Link
                  to={item.to}
                  className={`nav-link block py-2 px-3 text-gray-700 rounded-lg hover:bg-gray-50 md:hover:bg-transparent ${
                    location.pathname === item.to ? 'text-blue-600 font-semibold' : ''
                  }`}
                >
                  {item.text}
                </Link>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </motion.nav>
  );
};

export default UserNav;
