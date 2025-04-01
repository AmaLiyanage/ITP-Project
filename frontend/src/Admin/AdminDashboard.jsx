import { motion } from "framer-motion";
import FloatingShape from "../components/FloatingShape";
import { useState, useEffect } from "react";
import axios from "axios";
import { useVehicleStore } from "../store/vehicleStore";
import { useMaintenanceStore } from "../store/maintenanceStore";
import { FaCar, FaTools, FaCalendarAlt, FaExclamationTriangle, FaQuestion, FaComments } from "react-icons/fa";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.MODE === "development" ? "http://localhost:5000/api" : "/api";

function AdminDashboard() {
  const { vehicles, loading: vehiclesLoading, error: vehiclesError, fetchVehicles } = useVehicleStore();
  const { records, loading: maintenanceLoading, error: maintenanceError, fetchRecords } = useMaintenanceStore();
  const [upcomingMaintenance, setUpcomingMaintenance] = useState(0);
  const [faqCount, setFaqCount] = useState(0);
  const [feedbackCount, setFeedbackCount] = useState(0);
  const [upcomingMaintenanceList, setUpcomingMaintenanceList] = useState([]);

  useEffect(() => {
    fetchVehicles();
    fetchRecords();
    fetchFAQCount();
    fetchFeedbackData();
  }, []);

  const fetchFAQCount = async () => {
    try {
      const response = await axios.get(`${API_URL}/faqs`);
      setFaqCount(response.data.length);
    } catch (error) {
      console.error('Error fetching FAQs:', error);
    }
  };

  const fetchFeedbackData = async () => {
    try {
      const response = await axios.get(`${API_URL}/feedback`);
      setFeedbackCount(response.data.length);
    } catch (error) {
      console.error('Error fetching feedback:', error);
    }
  };

  useEffect(() => {
    if (records.length > 0) {
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);
      
      const upcoming = records.filter(record => {
        const dueDate = new Date(record.nextDueDate);
        return dueDate <= nextWeek && dueDate >= new Date();
      });

      setUpcomingMaintenance(upcoming.length);
      setUpcomingMaintenanceList(
        upcoming
          .sort((a, b) => new Date(a.nextDueDate) - new Date(b.nextDueDate))
          .slice(0, 3)
      );
    }
  }, [records]);

  if (vehiclesLoading || maintenanceLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (vehiclesError || maintenanceError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-red-600">
        <FaExclamationTriangle className="text-4xl mb-4" />
        <p className="text-lg">Error loading dashboard data. Please try again.</p>
        <button 
          onClick={() => {
            fetchVehicles();
            fetchRecords();
          }}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="w-full max-w-7xl mx-auto p-6"
    >
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 relative">
        <FloatingShape className="absolute top-0 right-0 -z-10" />
        
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
          Administration Dashboard
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          {/* Total Vehicles Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="col-span-1 md:col-span-2 bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-lg shadow-lg text-white"
          >
            <div className="flex items-center justify-between">
              <FaCar className="text-3xl" />
              <span className="text-3xl font-bold">{vehicles.length}</span>
            </div>
            <p className="mt-2 text-blue-100">Total Vehicles</p>
          </motion.div>

          {/* Total Maintenance Records Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="col-span-1 md:col-span-2 bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-lg shadow-lg text-white"
          >
            <div className="flex items-center justify-between">
              <FaTools className="text-3xl" />
              <span className="text-3xl font-bold">{records.length}</span>
            </div>
            <p className="mt-2 text-green-100">Maintenance Records</p>
          </motion.div>

          {/* FAQs Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="col-span-1 md:col-span-1 bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-lg shadow-lg text-white"
          >
            <div className="flex items-center justify-between">
              <FaQuestion className="text-3xl" />
              <span className="text-3xl font-bold">{faqCount}</span>
            </div>
            <p className="mt-2 text-purple-100">Total FAQs</p>
          </motion.div>

          {/* Feedback Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="col-span-1 md:col-span-1 bg-gradient-to-br from-yellow-500 to-yellow-600 p-6 rounded-lg shadow-lg text-white"
          >
            <div className="flex items-center justify-between">
              <FaComments className="text-3xl" />
              <span className="text-3xl font-bold">{feedbackCount}</span>
            </div>
            <p className="mt-2 text-yellow-100">Total Feedback</p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Quick Actions Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300"
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link to="/admin/vehicles" className="flex items-center justify-between p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-all group">
                <span className="text-blue-700">Manage Vehicles</span>
                <FaCar className="text-blue-500 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/admin/maintenance" className="flex items-center justify-between p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-all group">
                <span className="text-green-700">Manage Maintenance</span>
                <FaTools className="text-green-500 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/admin/faqs" className="flex items-center justify-between p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-all group">
                <span className="text-purple-700">Manage FAQs</span>
                <FaQuestion className="text-purple-500 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/admin/feedback" className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-all group">
                <span className="text-yellow-700">View Feedback</span>
                <FaComments className="text-yellow-500 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>

          {/* Upcoming Maintenance Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-800">Upcoming Maintenance</h3>
              <Link 
                to="/admin/maintenance" 
                className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
              >
                View All
              </Link>
            </div>
            <div className="space-y-3">
              {upcomingMaintenanceList.length > 0 ? (
                upcomingMaintenanceList.map(maintenance => (
                  <div
                    key={maintenance._id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                        <FaTools className="text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800">
                          {maintenance.busNumber}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {maintenance.maintenanceType}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-800">
                        Due: {new Date(maintenance.nextDueDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                  <FaCalendarAlt className="text-4xl mb-2 text-gray-400" />
                  <p>No upcoming maintenance</p>
                  <p className="text-sm">All vehicles are up to date</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

export default AdminDashboard;
