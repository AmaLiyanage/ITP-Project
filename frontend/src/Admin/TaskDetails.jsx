import React, { useEffect, useState } from "react";
import axios from "axios";
import Task from "./Task";
import { motion } from 'framer-motion';
import "./TaskDetails.css";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const URL = "http://localhost:5000/api/tasks";

// Function to fetch tasks from the server
const fetchHandler = async () => {
  try {
    const response = await axios.get(URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return { tasks: [] };
  }
};

function TaskDetails() {
  const [tasks, setTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [noResults, setNoResults] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load tasks from the API
  const loadTasks = async () => {
    try {
      setIsLoading(true);
      const data = await fetchHandler();
      setTasks(data.tasks || []);
      setError(null);
    } catch (err) {
      console.error("Error loading tasks:", err);
      setError("Failed to load tasks. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch tasks when the component mounts
  useEffect(() => {
    loadTasks();
  }, []);

  // Handle task deletion
  const handleDelete = (taskId) => {
    setTasks(tasks.filter(task => task._id !== taskId));
  };

  // Generate PDF report
  const generatePDF = (tasks) => {
    const doc = new jsPDF({ orientation: "landscape" });

    // Add business logo to the PDF
    const img = new Image();
    img.src = '/buisness-logo.png'; // Note: Make sure this path matches your actual logo file name

    // Ensure image is loaded before continuing
    img.onload = () => {
      // Add logo
      doc.addImage(img, 'PNG', 14, 10, 30, 30);

      // Add header (company name and report title)
      doc.setFontSize(20);
      doc.setTextColor(0, 0, 0);
      doc.text('MALSHAN MOTORS', 50, 25);
      doc.setFontSize(16);
      doc.text('Task Management Report', 50, 35);

      // Add generation date
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 45);

      // Add table for task details
      const columns = ["Task Name", "Description", "Deadline", "Status", "Assigned Employee"];
      const rows = tasks.map((task) => [
        task.taskName,
        task.taskDescription,
        new Date(task.deadline).toLocaleDateString(),
        task.status,
        task.employee ? task.employee.name : "Unassigned",
      ]);

      autoTable(doc, {
        head: [columns],
        body: rows,
        startY: 50,
        styles: {
          fontSize: 10,
          cellPadding: 5,
        },
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: 255,
          fontStyle: 'bold',
        },
      });

      // Save the generated PDF
      doc.save("Task_Report.pdf");
    };

    // Handle image loading error
    img.onerror = () => {
      // If image fails to load, generate PDF without logo
      doc.setFontSize(20);
      doc.setTextColor(0, 0, 0);
      doc.text('MALSHAN MOTORS', 14, 25);
      doc.setFontSize(16);
      doc.text('Task Management Report', 14, 35);

      // Add generation date
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 45);

      // Add table for task details
      const columns = ["Task Name", "Description", "Deadline", "Status", "Assigned Employee"];
      const rows = tasks.map((task) => [
        task.taskName,
        task.taskDescription,
        new Date(task.deadline).toLocaleDateString(),
        task.status,
        task.employee ? task.employee.name : "Unassigned",
      ]);

      autoTable(doc, {
        head: [columns],
        body: rows,
        startY: 50,
        styles: {
          fontSize: 10,
          cellPadding: 5,
        },
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: 255,
          fontStyle: 'bold',
        },
      });

      // Save the generated PDF
      doc.save("Task_Report.pdf");
    };
  };

  // Handle search query and filter tasks
  const handleSearch = async () => {
    try {
      setIsLoading(true);
      const data = await fetchHandler();
      const filteredTasks = data.tasks.filter((task) =>
        Object.values(task).some((field) =>
          field?.toString().toLowerCase().includes(searchQuery.toLowerCase())
        )
      );

      setTasks(filteredTasks);
      setNoResults(filteredTasks.length === 0);
      setError(null);
    } catch (err) {
      console.error("Error searching tasks:", err);
      setError("Failed to search tasks. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle search on Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Task Details</h1>
            <button
              onClick={() => generatePDF(tasks)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download Report
            </button>
          </div>

          <div className="mb-6">
            <div className="flex gap-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Search tasks..."
                className="flex-1 min-w-0 block w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
              <button
                onClick={handleSearch}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Search
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-4 text-sm text-red-700 bg-red-100 rounded-lg">
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : noResults ? (
            <div className="text-center py-8 text-gray-500">
              No tasks found matching your search.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Task Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Description</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Deadline</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Assigned Employee</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {tasks.map((task) => (
                    <Task key={task._id} task={task} onDelete={handleDelete} />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default TaskDetails;
