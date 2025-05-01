import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from 'framer-motion';
import { toast } from "react-hot-toast";
import emailjs from '@emailjs/browser';

function DeleteTaskConfirmation() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/tasks/${id}`);
        setTask(response.data.task);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch task details");
        setLoading(false);
      }
    };

    fetchTask();
  }, [id]);

  const handleDeleteClick = () => {
    setShowConfirmDialog(true);
  };

  const sendEmail = async () => {
    if (!task.employee || !task.employee.email) {
      console.log("No employee email found for notification");
      return;
    }

    const templateParams = {
      taskName: task.taskName,
      employeeName: task.employee.name,
      taskDescription: task.taskDescription,
      deadline: new Date(task.deadline).toLocaleDateString(),
      status: task.status,
      employee_email: task.employee.email,
    };

    try {
      await emailjs.send(
        "service_5lecc09",
        "template_wjmnvbt",
        templateParams,
        "9FexxmDIESDYNd0Ys"
      );
      console.log("Email sent successfully to:", task.employee.email);
      toast.success("Notification email sent successfully!", {
        duration: 3000,
        position: "top-center",
        style: {
          background: "#4CAF50",
          color: "#fff",
          padding: "16px",
          borderRadius: "8px",
        },
      });
      return true;
    } catch (error) {
      console.error("Error sending email:", error);
      toast.error("Failed to send notification email.", {
        duration: 3000,
        position: "top-center",
        style: {
          background: "#f44336",
          color: "#fff",
          padding: "16px",
          borderRadius: "8px",
        },
      });
      return false;
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      // First send email notification
      const emailSent = await sendEmail();
      
      // Then delete the task
      await axios.delete(`http://localhost:5000/api/tasks/${id}`);
      
      // Show success message
      toast.success("Task deleted successfully!", {
        duration: 3000,
        position: "top-center",
        style: {
          background: "#4CAF50",
          color: "#fff",
          padding: "16px",
          borderRadius: "8px",
        },
      });

      // Wait for 3 seconds before navigating
      setTimeout(() => {
        navigate("/adminTaskDetails");
      }, 3000);
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error("Failed to delete task. Please try again.", {
        duration: 3000,
        position: "top-center",
        style: {
          background: "#f44336",
          color: "#fff",
          padding: "16px",
          borderRadius: "8px",
        },
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancel = () => {
    navigate("/adminTaskDetails");
  };

  const handleCloseDialog = () => {
    setShowConfirmDialog(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-gray-600">Task not found</div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-8 text-center">Delete Task</h1>
          
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  Are you sure you want to delete this task? This action cannot be undone.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
              {/* Task Name */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                  Task Name
                </label>
                <input
                  type="text"
                  value={task.taskName}
                  readOnly
                  className="block w-full px-4 py-3 text-gray-700 bg-gray-50 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500 focus:outline-none focus:ring-1 transition duration-150 ease-in-out"
                />
              </div>

              {/* Task Description */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                  Description
                </label>
                <textarea
                  value={task.taskDescription}
                  readOnly
                  rows="4"
                  className="block w-full px-4 py-3 text-gray-700 bg-gray-50 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500 focus:outline-none focus:ring-1 transition duration-150 ease-in-out"
                />
              </div>

              {/* Deadline */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                  Deadline
                </label>
                <input
                  type="text"
                  value={new Date(task.deadline).toLocaleDateString()}
                  readOnly
                  className="block w-full px-4 py-3 text-gray-700 bg-gray-50 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500 focus:outline-none focus:ring-1 transition duration-150 ease-in-out"
                />
              </div>

              {/* Status */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                  Status
                </label>
                <input
                  type="text"
                  value={task.status}
                  readOnly
                  className="block w-full px-4 py-3 text-gray-700 bg-gray-50 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500 focus:outline-none focus:ring-1 transition duration-150 ease-in-out"
                />
              </div>

              {/* Assigned Employee */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                  Assigned Employee
                </label>
                <input
                  type="text"
                  value={task.employee ? task.employee.name : "Unassigned"}
                  readOnly
                  className="block w-full px-4 py-3 text-gray-700 bg-gray-50 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500 focus:outline-none focus:ring-1 transition duration-150 ease-in-out"
                />
              </div>
            </div>

            <div className="mt-8 flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteClick}
                disabled={isDeleting}
                className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                {isDeleting ? 'Deleting...' : 'Delete Task'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {showConfirmDialog && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Deletion</h3>
            <p className="text-sm text-gray-500 mb-6">
              Are you absolutely sure you want to delete this task? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleCloseDialog}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                {isDeleting ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default DeleteTaskConfirmation; 