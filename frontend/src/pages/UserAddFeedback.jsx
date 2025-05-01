import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaComments, FaPaperPlane, FaTimes, FaStar } from "react-icons/fa";
import { useAuthStore } from "../store/authStore";

axios.defaults.withCredentials = true;

const API_URL = import.meta.env.MODE === "development"
  ? "http://localhost:5000/api/feedback"
  : "/api/feedback";

function UserAddFeedback() {
  const { user } = useAuthStore();
  const [subject, setSubject] = useState("Positive feedback");
  const [message, setMessage] = useState("");
  const [messageError, setMessageError] = useState("");
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleMessageChange = (e) => {
    const inputValue = e.target.value;
    if (inputValue.length <= 500) {
      setMessage(inputValue);
      setMessageError("");
    } else {
      setMessageError("Message cannot exceed 500 characters.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please login to submit feedback.");
      return;
    }

    if (!subject || !message) {
      toast.error("Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(API_URL, {
        subject,
        message,
        rating,
      });

      if (response.status === 201) {
        toast.success("Thank you for your feedback!");
        setSubject("Positive feedback");
        setMessage("");
        setRating(0);
        navigate("/feedback/my-feedbacks");
      }
    } catch (error) {
      if (error.response) {
        toast.error(`Error: ${error.response.data.message || "Error submitting feedback."}`);
      } else if (error.request) {
        toast.error("No response from server. Please try again.");
      } else {
        toast.error("Error submitting feedback. Please check your connection.");
      }
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getSubjectStyles = (type) => {
    const baseStyles = "relative flex-1 p-4 text-center rounded-lg transition-all duration-200 cursor-pointer";
    const selectedStyles = {
      "Positive feedback": "bg-green-900 bg-opacity-70 text-green-200 border-2 border-green-500",
      "Negative feedback": "bg-red-900 bg-opacity-70 text-red-200 border-2 border-red-500",
      "Suggestion": "bg-blue-900 bg-opacity-70 text-blue-200 border-2 border-blue-500",
    };
    const unselectedStyles = "bg-gray-700 text-gray-300 border-2 border-transparent hover:bg-gray-600";

    return `${baseStyles} ${subject === type ? selectedStyles[type] : unselectedStyles}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900 relative overflow-hidden">
     

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto p-6 relative z-10"
      >
        <motion.div
          className="bg-gray-900 bg-opacity-80 backdrop-filter backdrop-blur-lg rounded-xl shadow-2xl border border-gray-800 p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 bg-emerald-900 bg-opacity-50 rounded-full">
                <FaComments className="text-2xl text-emerald-400" />
              </div>
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-600 text-transparent bg-clip-text">
              Share Your Feedback
            </h2>
            <p className="mt-2 text-gray-400">We value your opinion and want to hear from you!</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-400">Your Name</label>
              <input
                type="text"
                value={user?.name || ""}
                disabled
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-300 cursor-not-allowed"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-400">Your Email</label>
              <input
                type="email"
                value={user?.email || ""}
                disabled
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-300 cursor-not-allowed"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-400">Feedback Type</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {["Positive feedback", "Negative feedback", "Suggestion"].map((type) => (
                  <motion.button
                    key={type}
                    type="button"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setSubject(type)}
                    className={getSubjectStyles(type)}
                  >
                    {type}
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-400">Your Message</label>
              <div className="relative">
                <textarea
                  value={message}
                  onChange={handleMessageChange}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent min-h-[150px] resize-none text-gray-200"
                  placeholder="Share your thoughts with us..."
                  required
                />
                {message && (
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setMessage("")}
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-200"
                  >
                    <FaTimes />
                  </motion.button>
                )}
              </div>
              <p className="text-sm text-gray-500 text-right">
                {message.length}/500 characters
              </p>
              {messageError && <p className="text-sm text-red-400">{messageError}</p>}
            </div>

            {/* ⭐ Rating Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-400">Rating</label>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <motion.button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    className={`text-2xl focus:outline-none ${
                      star <= rating ? "text-yellow-400" : "text-gray-500"
                    }`}
                  >
                    <FaStar />
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-6">
              <Link
                to="/feedback/my-feedbacks"
                className="text-emerald-400 hover:text-emerald-300 transition-colors duration-200"
              >
                View My Feedbacks
              </Link>

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.05 }}
                whileTap={{ scale: loading ? 1 : 0.95 }}
                className={`px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-lg transition-all duration-200 
                  ${loading ? "opacity-70 cursor-not-allowed" : "hover:from-emerald-600 hover:to-green-700"
                } flex items-center space-x-2 shadow-lg`}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <FaPaperPlane />
                    <span>Submit Feedback</span>
                  </>
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default UserAddFeedback;
