import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore";
import { formatDate } from "../utils/date";
import { useNavigate } from "react-router-dom";
import { FaUser, FaRegEdit, FaSignOutAlt } from "react-icons/fa";  
import UserNav from "../NavBar/UserNav";

const DashboardPage = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
  };

  const handleUpdateProfile = () => {
    navigate("/profileUpdate");
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full mx-auto mt-10 p-8 bg-white shadow-xl rounded-xl border border-gray-200"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-green-700">
          Dashboard
        </h2>

        <div className="space-y-6">
          {/* Profile Information Box */}
          <motion.div
            className="p-4 bg-white shadow-md rounded-lg border border-gray-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-xl font-semibold text-green-600 mb-3 flex items-center">
              <FaUser className="mr-2 text-green-600" /> Profile Information
            </h3>
            <p className="text-gray-800">Name: {user.name}</p>
            <p className="text-gray-800">Email: {user.email}</p>

            {/* Update Profile Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-4"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleUpdateProfile} // Call the navigate function on click
                className="w-full py-3 px-4 bg-green-600 text-white 
                font-bold rounded-lg shadow-lg hover:bg-green-700
                focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-white"
              >
                <FaRegEdit className="mr-2 text-white" /> Update Profile
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Account Activity Box */}
          <motion.div
            className="p-4 bg-white shadow-md rounded-lg border border-gray-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h3 className="text-xl font-semibold text-green-600 mb-3">Account Activity</h3>
            <p className="text-gray-800">
              <span className="font-bold">Joined: </span>
              {new Date(user.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
            <p className="text-gray-800">
              <span className="font-bold">Last Login: </span>
              {formatDate(user.lastLogin)}
            </p>
          </motion.div>
        </div>

        {/* Logout Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-4"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="w-full py-3 px-4 bg-red-600 text-white 
            font-bold rounded-lg shadow-lg hover:bg-red-700
            focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-white"
          >
            <FaSignOutAlt className="mr-2 text-white" /> Logout
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default DashboardPage;
