import { useState } from "react";
import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore";
import { Link, useNavigate } from "react-router-dom";
import { FaEnvelope, FaKey } from "react-icons/fa";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState("");

  const navigate = useNavigate();
  const { login, error } = useAuthStore();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setLocalError(""); // Clear previous error

    // Only allow fixed credentials
    if (email === "admin@gmail.com" && password === "Admin12345@") {
      try {
        await login(email, password);
        navigate("/admindashboard");
      } catch (err) {
        console.error("Login error:", err);
        setLoading(false);
        setLocalError("Something went wrong. Please try again.");
      }
    } else {
      setLoading(false);
      setLocalError("Invalid admin credentials.");
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.4 }}
        className="max-w-md w-full p-8 bg-white rounded-xl shadow-2xl border border-gray-300"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-green-600">Admin Login</h2>

        <form onSubmit={handleLogin} className="space-y-6">
          {/* Email */}
          <div className="flex items-start gap-3">
            <FaEnvelope className="text-gray-600 mt-3" />
            <div className="w-full">
              <label htmlFor="admin-email" className="block font-semibold mb-1 text-gray-700">
                Email:
              </label>
              <input
                id="admin-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-black"
                placeholder="Enter admin email"
              />
            </div>
          </div>

          {/* Password */}
          <div className="flex items-start gap-3">
            <FaKey className="text-gray-600 mt-3" />
            <div className="w-full">
              <label htmlFor="admin-password" className="block font-semibold mb-1 text-gray-700">
                Password:
              </label>
              <input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-black"
                placeholder="Enter admin password"
              />
            </div>
          </div>

          {/* Error Message */}
          {(error || localError) && (
            <p className="text-red-500 font-semibold text-sm -mt-4">
              {localError || error}
            </p>
          )}

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-md hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            {loading ? "Logging in..." : "Login as Admin"}
          </motion.button>

          {/* User Login Link */}
          <p className="text-center text-sm text-gray-500">
            Login as User{" "}
            <Link to="/login" className="text-green-600 hover:text-green-800 font-semibold">
              User Login
            </Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
