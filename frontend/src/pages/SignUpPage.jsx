import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaKey } from "react-icons/fa";
import PasswordStrengthMeter from "../components/PasswordStrengthMeter";

const SignUpPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");//Holds error message related to passwords
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signup, error } = useAuthStore();

  const handleSignUp = async (e) => {
    e.preventDefault();//// Prevent form submission from refreshing the page
    setLoading(true);//disable the button during the signup process

    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      setLoading(false);
      return;
    }

    setPasswordError("");//// Reset any existing error
    try {
      await signup(email, password, name);//Call the signup function from the auth store
      navigate("/login");
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full mx-auto mt-10 p-8 bg-white rounded-xl shadow-2xl border border-gray-800"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-green-600">Sign Up</h2>

        <motion.div
          className="p-4 bg-white rounded-lg border border-gray-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <form onSubmit={handleSignUp}>
            <div className="text-gray-900">
              {/* Name Field */}
              <div className="mb-4 flex items-start gap-3">
                <FaUser className="text-gray-600 mt-3" />
                <div className="flex flex-col w-full">
                  <label htmlFor="name" className="font-semibold mb-1">Full Name:</label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}// updates the state value every time the user types
                    className="bg-transparent text-black border-2 border-gray-500 rounded-md outline-none w-full py-2 px-3"
                    placeholder="Enter full name"
                  />
                </div>
              </div>

              {/* Email Field */}
              <div className="mb-4 flex items-start gap-3">
                <FaEnvelope className="text-gray-600 mt-3" />
                <div className="flex flex-col w-full">
                  <label htmlFor="email" className="font-semibold mb-1">Email:</label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-transparent text-black border-2 border-gray-500 rounded-md outline-none w-full py-2 px-3"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="mb-4 flex items-start gap-3">
                <FaKey className="text-gray-600 mt-3" />
                <div className="flex flex-col w-full">
                  <label htmlFor="password" className="font-semibold mb-1">Password:</label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-transparent text-black border-2 border-gray-500 rounded-md outline-none w-full py-2 px-3"
                    placeholder="Enter password"
                  />
                </div>
              </div>

              {/* Confirm Password Field */}
              <div className="mb-4 flex items-start gap-3">
                <FaKey className="text-gray-600 mt-3" />
                <div className="flex flex-col w-full">
                  <label htmlFor="confirmPassword" className="font-semibold mb-1">Confirm Password:</label>
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="bg-transparent text-black border-2 border-dotted border-gray-500 rounded-md outline-none w-full py-2 px-3"
                    placeholder="Confirm password"
                  />
                </div>
              </div>

              {/* Password Strength */}
              <PasswordStrengthMeter password={password} />

              {/* Error Message */}
              {passwordError && <p className="text-red-500 font-semibold text-sm mt-2">{passwordError}</p>}
              {error && <p className="text-red-500 font-semibold text-sm mt-2">{error}</p>}

              {/* Submit Button */}
              <div className="mt-6 flex flex-col gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                  disabled={loading}
                >
                  {loading ? "Signing Up..." : "Sign Up"}
                </motion.button>

                {/* Login Redirect */}
                <p className="text-center text-sm text-gray-500">
                  Already have an account?{" "}
                  <Link to="/login" className="text-green-600 hover:text-green-800 font-semibold">
                    Login
                  </Link>
                </p>
              </div>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default SignUpPage;
