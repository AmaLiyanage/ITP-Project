import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaComments, FaStar, FaPaperPlane, FaTimes } from "react-icons/fa";

const API_URL = import.meta.env.MODE === "development"
  ? "http://localhost:5000/api/feedback"
  : "/api/feedback";

function UserAddFeedback({ user }) {
  const [subject, setSubject] = useState("Positive feedback");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!subject || !message) {
      toast.error("Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(API_URL, {
        name: user.name,
        email: user.email,
        subject,
        message,
        rating
      });

      if (response.status === 201) {
        toast.success("Thank you for your feedback!");
        setSubject("Positive feedback");
        setMessage("");
        setRating(5);
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
      "Positive feedback": "bg-green-100 text-green-800 border-2 border-green-300",
      "Negative feedback": "bg-red-100 text-red-800 border-2 border-red-300",
      "Suggestion": "bg-blue-100 text-blue-800 border-2 border-blue-300"
    };
    const unselectedStyles = "bg-gray-50 text-gray-600 border-2 border-transparent hover:bg-gray-100";
    
    return `${baseStyles} ${subject === type ? selectedStyles[type] : unselectedStyles}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto"
      >
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <FaComments className="text-2xl text-blue-600" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Share Your Feedback</h2>
            <p className="mt-2 text-gray-600">We value your opinion and want to hear from you!</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Your Name</label>
              <input
                type="text"
                value={user?.name || ""}
                disabled
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 cursor-not-allowed"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Your Email</label>
              <input
                type="email"
                value={user?.email || ""}
                disabled
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 cursor-not-allowed"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Feedback Type</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {["Positive feedback", "Negative feedback", "Suggestion"].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setSubject(type)}
                    className={getSubjectStyles(type)}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Your Message</label>
              <div className="relative">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[150px] resize-none"
                  placeholder="Share your thoughts with us..."
                  required
                />
                {message && (
                  <button
                    type="button"
                    onClick={() => setMessage("")}
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                  >
                    <FaTimes />
                  </button>
                )}
              </div>
              <p className="text-sm text-gray-500 text-right">
                {message.length}/500 characters
              </p>
            </div>

            <div className="flex items-center justify-between pt-6">
              <Link
                to="/feedback/my-feedbacks"
                className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
              >
                View My Feedbacks
              </Link>
              
              <button
                type="submit"
                disabled={loading}
                className={`px-6 py-3 bg-blue-600 text-white rounded-lg transition-all duration-200 
                  ${loading 
                    ? 'opacity-70 cursor-not-allowed' 
                    : 'hover:bg-blue-700 transform hover:scale-105'
                  } flex items-center space-x-2`}
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
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

export default UserAddFeedback;