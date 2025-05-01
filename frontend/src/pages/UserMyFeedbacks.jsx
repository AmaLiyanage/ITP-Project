import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaEdit,
  FaTrash,
  FaComments,
  FaThumbsUp,
  FaThumbsDown,
  FaLightbulb,
  FaCalendarAlt,
  FaChevronLeft,
  FaChevronRight,
  FaStar,
  FaRegStar,
} from "react-icons/fa";

// Add withCredentials configuration
axios.defaults.withCredentials = true;

const API_URL = import.meta.env.MODE === "development"
  ? "http://localhost:5000/api/feedback"
  : "/api/feedback";

function UserMyFeedbacks() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(4);
  const [expandedFeedback, setExpandedFeedback] = useState(null);

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const response = await axios.get(`${API_URL}/my-feedbacks`);
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
        return "bg-green-50 text-green-700 border-green-200";
      case "Negative feedback":
        return "bg-red-50 text-red-700 border-red-200";
      case "Suggestion":
        return "bg-blue-50 text-blue-700 border-blue-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getFeedbackIcon = (subject) => {
    switch (subject) {
      case "Positive feedback":
        return <FaThumbsUp className="mr-2 text-green-600" />;
      case "Negative feedback":
        return <FaThumbsDown className="mr-2 text-red-600" />;
      case "Suggestion":
        return <FaLightbulb className="mr-2 text-blue-600" />;
      default:
        return <FaComments className="mr-2 text-gray-600" />;
    }
  };

  const renderRatingStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        i <= rating
          ? <FaStar key={i} className="text-yellow-400" />
          : <FaRegStar key={i} className="text-gray-300" />
      );
    }
    return <div className="flex space-x-0.5">{stars}</div>;
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

  const indexOfLastFeedback = currentPage * itemsPerPage;
  const indexOfFirstFeedback = indexOfLastFeedback - itemsPerPage;
  const currentFeedbacks = feedbacks.slice(indexOfFirstFeedback, indexOfLastFeedback);
  const totalPages = Math.ceil(feedbacks.length / itemsPerPage);

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-7xl mx-auto"
      >
        <div className="bg-white rounded-md shadow-md p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-3">
            <div className="text-center sm:text-left">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">My Feedbacks</h2>
              <p className="mt-1 text-gray-600 text-sm">Manage your submitted feedbacks</p>
            </div>
            <Link
              to="/feedback/add"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200 flex items-center space-x-1"
            >
              <FaComments className="text-sm" />
              <span>Add Feedback</span>
            </Link>
          </div>

          <div className="mb-3 text-sm text-gray-500 flex justify-between">
            <span>Found {feedbacks.length} feedbacks</span>
            {feedbacks.length > 0 && <span>Page {currentPage} of {totalPages}</span>}
          </div>

          {currentFeedbacks.length === 0 ? (
            <div className="text-center py-8">
              <FaComments className="mx-auto text-3xl text-gray-400 mb-3" />
              <p className="text-gray-500 text-sm">You haven't submitted any feedback yet</p>
              <Link
                to="/feedback/add"
                className="mt-3 inline-block text-blue-500 hover:text-blue-700 transition-colors duration-200 text-sm"
              >
                Submit your first feedback
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              <AnimatePresence>
                {currentFeedbacks.map((feedback) => (
                  <motion.div
                    key={feedback._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`rounded-lg border p-5 transition-all duration-300 ${getFeedbackColor(feedback.subject)} hover:shadow-lg`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center">
                        {getFeedbackIcon(feedback.subject)}
                        <h3 className="text-lg font-semibold text-gray-800">{feedback.subject}</h3>
                      </div>
                    </div>

                    <div className="p-3 bg-white bg-opacity-60 rounded-md mb-3">
                      {feedback.createdAt && (
                        <div className="text-xs text-gray-500 flex items-center mb-2">
                          <FaCalendarAlt className="mr-1" />
                          Submitted: {new Date(feedback.createdAt).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </div>
                      )}

                      {/* Rating display */}
                      {typeof feedback.rating === 'number' && (
                        <div className="flex items-center mb-2 text-sm text-yellow-600">
                          <span className="mr-2 font-medium text-gray-700">Rating:</span>
                          {renderRatingStars(feedback.rating)}
                          <span className="ml-1 text-xs text-gray-500">({feedback.rating}/5)</span>
                        </div>
                      )}

                      <div className="relative">
                        <p className={`leading-relaxed text-gray-700 ${expandedFeedback === feedback._id ? '' : 'line-clamp-3'}`}>
                          {feedback.message}
                        </p>
                        {feedback.message && feedback.message.length > 150 && (
                          <button
                            onClick={() => setExpandedFeedback(expandedFeedback === feedback._id ? null : feedback._id)}
                            className="mt-1 text-xs font-medium text-blue-600 hover:text-blue-800"
                          >
                            {expandedFeedback === feedback._id ? "Show less" : "Read more"}
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="mt-3 flex justify-end space-x-2">                      <Link
                        to={`/feedback/update/${feedback._id}`}
                        className="px-3 py-1.5 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200 transition-colors duration-200 flex items-center text-sm"
                      >
                        <FaEdit className="mr-1" />
                        Edit
                      </Link>
                      <button
                        onClick={() => setShowDeleteConfirm(feedback._id)}
                        className="px-3 py-1.5 bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition-colors duration-200 flex items-center text-sm"
                      >
                        <FaTrash className="mr-1" />
                        Delete
                      </button>
                    </div>

                    {showDeleteConfirm === feedback._id && (
                      <div className="mt-3 p-3 bg-red-50 rounded-md border border-red-200">
                        <p className="text-sm text-red-700 mb-2">Are you sure you want to delete this feedback?</p>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleDelete(feedback._id)}
                            className="px-3 py-1.5 bg-red-600 text-white rounded hover:bg-red-700 transition-colors duration-200 text-sm"
                          >
                            Delete
                          </button>
                          <button
                            onClick={() => setShowDeleteConfirm(null)}
                            className="px-3 py-1.5 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors duration-200 text-sm"
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

          {/* Pagination */}
          {feedbacks.length > itemsPerPage && (
            <div className="mt-8 flex flex-col sm:flex-row justify-between items-center">
              <div className="text-xs text-gray-500 mb-3 sm:mb-0">
                Showing {Math.min(currentPage * itemsPerPage, feedbacks.length)} of {feedbacks.length} feedbacks
              </div>

              <div className="flex items-center space-x-1">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  aria-label="Previous page"
                >
                  <FaChevronLeft className="h-3 w-3" />
                </button>

                <div className="flex space-x-1">
                  {Array.from({ length: Math.min(totalPages, 5) }).map((_, idx) => {
                    let pageNumber;
                    if (totalPages <= 5) {
                      pageNumber = idx + 1;
                    } else if (currentPage <= 3) {
                      pageNumber = idx + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNumber = totalPages - 4 + idx;
                    } else {
                      pageNumber = currentPage - 2 + idx;
                    }
                    return (
                      <button
                        key={pageNumber}
                        onClick={() => setCurrentPage(pageNumber)}
                        className={`w-8 h-8 flex items-center justify-center rounded-md border text-sm
                          ${currentPage === pageNumber
                            ? 'bg-blue-100 border-blue-300 text-blue-700 font-medium'
                            : 'border-gray-300 hover:bg-gray-50 text-gray-700'
                          }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  aria-label="Next page"
                >
                  <FaChevronRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default UserMyFeedbacks;
