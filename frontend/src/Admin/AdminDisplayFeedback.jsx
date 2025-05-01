import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaComments,
  FaThumbsUp,
  FaThumbsDown,
  FaLightbulb,
  FaCalendarAlt,
  FaChevronLeft,
  FaChevronRight,
  FaDownload,
  FaStar,
  FaRegStar,
} from "react-icons/fa";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/api/feedback"
    : "/api/feedback";

function AdminDisplayFeedback() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(4);
  const [expandedFeedback, setExpandedFeedback] = useState(null);
  const [showDownloadPopup, setShowDownloadPopup] = useState(false);

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

  const currentFeedbacks = feedbacks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(feedbacks.length / itemsPerPage);

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

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        i <= rating ? (
          <FaStar key={i} className="text-yellow-400 w-4 h-4 inline-block" />
        ) : (
          <FaRegStar key={i} className="text-yellow-300 w-4 h-4 inline-block" />
        )
      );
    }
    return stars;
  };

  const handleDownloadReport = () => {
    downloadAsPDF();
  };

  const downloadAsPDF = () => {
    const doc = new jsPDF();

    // Add logo
    const img = new Image();
    img.src = '/buisness-logo.png';
    doc.addImage(img, 'PNG', 14, 10, 30, 30);

    // Add header
    doc.setFontSize(20);
    doc.setTextColor(0, 0, 0);
    doc.text('MALSHAN MOTORS', 50, 25);
    doc.setFontSize(16);
    doc.text('Customer Feedback Report', 50, 35);

    // Add generation date
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 45);

    const tableData = feedbacks.map((feedback) => [
      feedback.name,
      feedback.email,
      feedback.subject,
      feedback.message,
      new Date(feedback.createdAt).toLocaleDateString(),
      feedback.rating || "N/A",
    ]);

    autoTable(doc, {
      head: [["Name", "Email", "Subject", "Message", "Date", "Rating"]],
      body: tableData,
      startY: 55,
      theme: "striped",
      headStyles: {
        fillColor: [51, 51, 51],
        textColor: 255,
        fontStyle: "bold"
      },
      margin: { top: 55 }
    });

    const finalY = (doc.lastAutoTable && doc.lastAutoTable.finalY) || 55;
    doc.text(`Total Records: ${feedbacks.length}`, 14, finalY + 10);

    doc.save("passenger_feedback.pdf");
    setShowDownloadPopup(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-100">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-red-500">
        <p className="text-lg mb-3">{error}</p>
        <button
          onClick={fetchFeedback}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full md:max-w-7xl mx-auto bg-white rounded-md shadow-md"
      >
        <div className="rounded-md p-6 sm:p-8">
          <div className="flex justify-between items-center mb-6">
            <div className="text-center sm:text-left">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
                Passengers Feedback
              </h2>
              <p className="mt-1 text-gray-600 text-sm">
                See what passengers are saying
              </p>
            </div>            <button
              onClick={() => setShowDownloadPopup(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-xl shadow-md hover:from-green-600 hover:to-green-700 transition duration-300"
            >
              <FaDownload className="text-white" />
              Download PDF Report
            </button>
          </div>

          {/* Results count */}
          <div className="mb-3 text-sm text-gray-500 flex justify-between">
            <span>Found {feedbacks.length} feedbacks</span>
            <span>Page {currentPage} of {totalPages}</span>
          </div>

          {currentFeedbacks.length === 0 ? (
            <div className="text-center py-8">
              <FaComments className="mx-auto text-3xl text-gray-400 mb-3" />
              <p className="text-gray-500 text-sm">No feedback available yet</p>
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
                    className={`rounded-lg border p-5 transition-all duration-300 ${getFeedbackColor(
                      feedback.subject
                    )} hover:shadow-lg`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex flex-col">
                        <div className="flex items-center">
                          {getFeedbackIcon(feedback.subject)}
                          <h3 className="text-lg font-semibold text-gray-800">
                            {feedback.subject}
                          </h3>
                        </div>
                        {typeof feedback.rating === 'number' && (
                            <div className="mt-1 text-sm text-yellow-500">
                                <span className="mr-2 font-medium text-gray-700">Rating:</span>
                                {renderStars(feedback.rating)}
                                <span className="ml-1 text-xs text-gray-500">({feedback.rating}/5)</span>
                            </div>
                        )}
                      </div>
                      {feedback.createdAt && (
                        <div className="text-xs text-gray-500 flex items-center">
                          <FaCalendarAlt className="mr-1" />
                          {new Date(feedback.createdAt).toLocaleDateString(
                            undefined,
                            { year: "numeric", month: "long", day: "numeric" }
                          )}
                        </div>
                      )}
                    </div>

                    <div className="p-3 bg-white bg-opacity-60 rounded-md mb-3">
                      <div className="space-y-1 mb-2 pb-2 border-b border-gray-200">
                        <p className="text-xs font-medium text-gray-700">
                          From: <span className="font-semibold">{feedback.name}</span>
                        </p>
                        <p className="text-xs text-gray-500">{feedback.email}</p>
                      </div>

                      <div className="relative">
                        <p
                          className={`leading-relaxed text-gray-700 break-words ${
                            expandedFeedback === feedback._id ? "" : "line-clamp-3"
                          }`}
                        >
                          {feedback.message}
                        </p>
                        {feedback.message && feedback.message.length > 150 && (
                          <button
                            onClick={() =>
                              setExpandedFeedback(
                                expandedFeedback === feedback._id
                                  ? null
                                  : feedback._id
                              )
                            }
                            className="mt-1 text-xs font-medium text-blue-600 hover:text-blue-800"
                          >
                            {expandedFeedback === feedback._id
                              ? "Show less"
                              : "Read more"}
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          {/* Enhanced Pagination */}
          {feedbacks.length > itemsPerPage && (
            <div className="mt-8 flex flex-col sm:flex-row justify-between items-center">
              <div className="text-xs text-gray-500 mb-3 sm:mb-0">
                Showing {Math.min(currentPage * itemsPerPage, feedbacks.length)} of{" "}
                {feedbacks.length} feedbacks
              </div>

              <div className="flex items-center space-x-1">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  aria-label="Previous page"
                >
                  <FaChevronLeft className="h-3 w-3" />
                </button>

                <div className="flex space-x-1">
                  {Array.from({ length: Math.min(totalPages, 5) }).map((_, idx) => {
                    let pageNumber;

                    // Calculate which page numbers to show
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
                                                ${
                                                  currentPage === pageNumber
                                                    ? "bg-blue-100 border-blue-300 text-blue-700 font-medium"
                                                    : "border-gray-300 hover:bg-gray-50 text-gray-700"
                                                }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() =>
                    setCurrentPage((prev) =>
                      Math.min(prev + 1, totalPages)
                    )
                  }
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
      {showDownloadPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-xl max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Download Report
            </h3>
            <p className="text-gray-600 mb-4">Generate a PDF report of all customer feedbacks</p>
            <div className="space-y-3">
              <button
                onClick={handleDownloadReport}
                className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-200 flex items-center justify-center space-x-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Download PDF Report</span>
              </button>
              <button
                onClick={() => setShowDownloadPopup(false)}
                className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDisplayFeedback;