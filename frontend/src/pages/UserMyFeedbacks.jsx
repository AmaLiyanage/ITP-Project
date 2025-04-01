import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { FaEdit, FaTrash, FaComments } from "react-icons/fa";

const API_URL = import.meta.env.MODE === "development"
  ? "http://localhost:5000/api/feedback"
  : "/api/feedback";

function UserMyFeedbacks() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const response = await axios.get(`${API_URL}/user`);
      setFeedbacks(response.data);
      setLoading(false);
    } catch (error) {
      setError("Failed to fetch feedbacks");
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      toast.success("Feedback deleted successfully!");
      setFeedbacks(feedbacks.filter(feedback => feedback._id !== id));
      setShowDeleteConfirm(null);
    } catch (error) {
      toast.error("Error deleting feedback");
    }
  };

  const getFeedbackColor = (subject) => {
    switch (subject) {
      case "Positive feedback":
        return "bg-green-100 text-green-800";
      case "Negative feedback":
        return "bg-red-100 text-red-800";
      case "Suggestion":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
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
          onClick={fetchFeedbacks}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-6xl mx-auto"
      >
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">My Feedbacks</h2>
              <p className="mt-2 text-gray-600">Manage your submitted feedbacks</p>
            </div>
            <Link
              to="/feedback/add"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 transform hover:scale-105 flex items-center space-x-2"
            >
              <FaComments />
              <span>Add Feedback</span>
            </Link>
          </div>

          {feedbacks.length === 0 ? (
            <div className="text-center py-12">
              <FaComments className="mx-auto text-4xl text-gray-400 mb-4" />
              <p className="text-gray-500 text-lg">You haven't submitted any feedback yet.</p>
              <Link
                to="/feedback/add"
                className="mt-4 inline-block text-blue-600 hover:text-blue-800 transition-colors duration-200"
              >
                Submit your first feedback
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {feedbacks.map((feedback) => (
                  <motion.div
                    key={feedback._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-200"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getFeedbackColor(feedback.subject)}`}>
                        {feedback.subject}
                      </span>
                      <div className="flex space-x-2">
                        <Link
                          to={`/feedback/edit/${feedback._id}`}
                          className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
                        >
                          <FaEdit className="text-xl" />
                        </Link>
                        <button
                          onClick={() => setShowDeleteConfirm(feedback._id)}
                          className="text-red-600 hover:text-red-800 transition-colors duration-200"
                        >
                          <FaTrash className="text-xl" />
                        </button>
                      </div>
                    </div>

                    <p className="text-gray-600 leading-relaxed mb-4">{feedback.message}</p>
                    
                    <div className="text-sm text-gray-500">
                      Submitted: {format(new Date(feedback.createdAt), 'MMM d, yyyy')}
                    </div>

                    {showDeleteConfirm === feedback._id && (
                      <div className="mt-4 p-4 bg-red-50 rounded-lg">
                        <p className="text-red-800 mb-3">Are you sure you want to delete this feedback?</p>
                        <div className="flex space-x-3">
                          <button
                            onClick={() => handleDelete(feedback._id)}
                            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors duration-200"
                          >
                            Delete
                          </button>
                          <button
                            onClick={() => setShowDeleteConfirm(null)}
                            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors duration-200"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default UserMyFeedbacks;