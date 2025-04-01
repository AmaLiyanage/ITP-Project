import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { FaComments, FaStar, FaPaperPlane, FaTimes, FaArrowLeft } from "react-icons/fa";

const API_URL = import.meta.env.MODE === "development"
  ? "http://localhost:5000/api/feedback"
  : "/api/feedback";

function UserUpdateFeedback() {
  const [feedback, setFeedback] = useState({
    subject: "",
    message: "",
    rating: 5
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [hoverRating, setHoverRating] = useState(0);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchFeedback();
  }, [id]);

  const fetchFeedback = async () => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      setFeedback(response.data);
      setLoading(false);
    } catch (error) {
      setError("Failed to fetch feedback");
      setLoading(false);
      toast.error("Error loading feedback");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!feedback.subject || !feedback.message) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      setSubmitting(true);
      await axios.put(`${API_URL}/${id}`, feedback);
      toast.success("Feedback updated successfully!");
      navigate("/feedback/my-feedbacks");
    } catch (error) {
      if (error.response) {
        toast.error(`Error: ${error.response.data.message || "Error updating feedback"}`);
      } else if (error.request) {
        toast.error("No response from server. Please try again.");
      } else {
        toast.error("Error updating feedback. Please check your connection.");
      }
    } finally {
      setSubmitting(false);
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
    
    return `${baseStyles} ${feedback.subject === type ? selectedStyles[type] : unselectedStyles}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-red-600">
        <p className="text-lg">{error}</p>
        <button 
          onClick={fetchFeedback}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Retry
        </button>
      </div>
    );
  }

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
            <h2 className="text-3xl font-bold text-gray-900">Update Feedback</h2>
            <p className="mt-2 text-gray-600">Make changes to your feedback</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Feedback Type</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {["Positive feedback", "Negative feedback", "Suggestion"].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setFeedback(prev => ({ ...prev, subject: type }))}
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
                  value={feedback.message}
                  onChange={(e) => setFeedback(prev => ({ ...prev, message: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[150px] resize-none"
                  placeholder="Share your thoughts with us..."
                  required
                />
                {feedback.message && (
                  <button
                    type="button"
                    onClick={() => setFeedback(prev => ({ ...prev, message: "" }))}
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                  >
                    <FaTimes />
                  </button>
                )}
              </div>
              <p className="text-sm text-gray-500 text-right">
                {feedback.message.length}/500 characters
              </p>
            </div>

            <div className="flex items-center justify-between pt-6">
              <Link
                to="/feedback/my-feedbacks"
                className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors duration-200"
              >
                <FaArrowLeft />
                <span>Back to My Feedbacks</span>
              </Link>
              
              <button
                type="submit"
                disabled={submitting}
                className={`px-6 py-3 bg-blue-600 text-white rounded-lg transition-all duration-200 
                  ${submitting 
                    ? 'opacity-70 cursor-not-allowed' 
                    : 'hover:bg-blue-700 transform hover:scale-105'
                  } flex items-center space-x-2`}
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                    <span>Updating...</span>
                  </>
                ) : (
                  <>
                    <FaPaperPlane />
                    <span>Update Feedback</span>
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

export default UserUpdateFeedback;