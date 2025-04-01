import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { FaComments, FaUser, FaSearch, FaFilter } from "react-icons/fa";
import { useAuthStore } from "../store/authStore";

const API_URL = import.meta.env.MODE === "development"
  ? "http://localhost:5000/api/feedback"
  : "/api/feedback";

function UserViewFeedback() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuthStore();
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [dateFilter, setDateFilter] = useState("all");
  const [filtersExpanded, setFiltersExpanded] = useState(false);

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    try {
      const response = await axios.get(`${API_URL}/all`);
      setFeedbacks(response.data);
      setLoading(false);
    } catch (error) {
      setError("Failed to fetch feedback");
      setLoading(false);
    }
  };

  // Filter feedbacks
  const filteredFeedbacks = feedbacks.filter(feedback => {
    const matchesSearch = searchTerm === "" || 
      feedback.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSubject = selectedSubject === "" || feedback.subject === selectedSubject;
    
    const feedbackDate = new Date(feedback.createdAt);
    const now = new Date();
    const daysDiff = (now - feedbackDate) / (1000 * 60 * 60 * 24);
    
    const matchesDate = dateFilter === "all" ||
      (dateFilter === "today" && daysDiff < 1) ||
      (dateFilter === "week" && daysDiff < 7) ||
      (dateFilter === "month" && daysDiff < 30);

    return matchesSearch && matchesSubject && matchesDate;
  });

  // Get current feedbacks for pagination
  const indexOfLastFeedback = currentPage * itemsPerPage;
  const indexOfFirstFeedback = indexOfLastFeedback - itemsPerPage;
  const currentFeedbacks = filteredFeedbacks.slice(indexOfFirstFeedback, indexOfLastFeedback);
  const totalPages = Math.ceil(filteredFeedbacks.length / itemsPerPage);

  const getFeedbackColor = (subject) => {
    switch (subject) {
      case "Positive feedback":
        return "bg-green-100 text-green-800 border-green-200";
      case "Negative feedback":
        return "bg-red-100 text-red-800 border-red-200";
      case "Suggestion":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
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
          onClick={fetchFeedback}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 py-12 px-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-7xl mx-auto"
      >
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <div className="text-center md:text-left">
              <h2 className="text-3xl font-bold text-gray-900">Community Feedback</h2>
              <p className="mt-2 text-gray-600">See what others are saying about our service</p>
            </div>
            {isAuthenticated && (
              <div className="flex space-x-4">
                <Link
                  to="/feedback/my-feedbacks"
                  className="px-6 py-3 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-colors duration-200 flex items-center space-x-2"
                >
                  <FaUser />
                  <span>My Feedbacks</span>
                </Link>
                <Link
                  to="/feedback/add"
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
                >
                  <FaComments />
                  <span>Add Feedback</span>
                </Link>
              </div>
            )}
          </div>

          {/* Search and Filters */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative flex-1 max-w-lg">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search feedback..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={() => setFiltersExpanded(!filtersExpanded)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <FaFilter />
                <span>Filters</span>
              </button>
            </div>

            <AnimatePresence>
              {filtersExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4"
                >
                  <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Types</option>
                    <option value="Positive feedback">Positive Feedback</option>
                    <option value="Negative feedback">Negative Feedback</option>
                    <option value="Suggestion">Suggestion</option>
                  </select>

                  <select
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Time</option>
                    <option value="today">Today</option>
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                  </select>

                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedSubject("");
                      setDateFilter("all");
                    }}
                    className="w-full p-2 text-blue-600 hover:bg-blue-50 rounded-lg border border-blue-200"
                  >
                    Reset Filters
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Results count */}
          <div className="mb-4 text-sm text-gray-600">
            Found {filteredFeedbacks.length} feedbacks
          </div>

          {currentFeedbacks.length === 0 ? (
            <div className="text-center py-12">
              <FaComments className="mx-auto text-4xl text-gray-400 mb-4" />
              <p className="text-gray-500 text-lg">No feedback available yet</p>
              {isAuthenticated && (
                <Link
                  to="/feedback/add"
                  className="mt-4 inline-block text-blue-600 hover:text-blue-800 transition-colors duration-200"
                >
                  Be the first to give feedback
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {currentFeedbacks.map((feedback) => (
                  <motion.div
                    key={feedback._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className={`rounded-lg border-2 p-6 transition-shadow duration-200 hover:shadow-lg ${getFeedbackColor(feedback.subject)}`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-semibold">{feedback.subject}</h3>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <p className="text-sm font-medium">From: {feedback.name}</p>
                      <p className="text-sm opacity-75">{feedback.email}</p>
                    </div>

                    <p className="leading-relaxed mb-4">{feedback.message}</p>
                    
                    <div className="text-sm opacity-75">
                      Submitted: {format(new Date(feedback.createdAt), 'MMM d, yyyy')}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          {/* Pagination */}
          {filteredFeedbacks.length > itemsPerPage && (
            <div className="mt-8 flex justify-center items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`px-3 py-1 rounded-lg border ${
                    currentPage === index + 1
                      ? 'bg-blue-50 border-blue-300 text-blue-600'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default UserViewFeedback;