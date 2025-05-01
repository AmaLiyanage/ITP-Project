import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import emailjs from "@emailjs/browser";
import { motion } from 'framer-motion';
import "./AddTask.css";

function AddTask() {
    const [inputs, setInputs] = useState({
        taskName: "",
        taskDescription: "",
        deadline: "",
        status: "Pending", // Set default status
        assignedEmployee: "",
    });

    const [employees, setEmployees] = useState([]);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/employees");
                setEmployees(response.data.employees);
            } catch (err) {
                console.error("Error fetching employees:", err);
                window.alert("Failed to load employees. Please try again.");
            }
        };
        fetchEmployees();
    }, []);

    const handleChange = (e) => {
        setInputs((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const validate = () => {
        let formErrors = {};
        const today = new Date();
        const selectedDate = new Date(inputs.deadline);

        if (!inputs.taskName.trim()) formErrors.taskName = "Task Name is required";
        if (!inputs.taskDescription.trim()) formErrors.taskDescription = "Description is required";
        if (!inputs.deadline) formErrors.deadline = "Deadline is required";
        if (selectedDate < today) formErrors.deadline = "Deadline cannot be in the past";
        if (!inputs.assignedEmployee) formErrors.assignedEmployee = "Assigned Employee is required";

        setErrors(formErrors);
        return Object.keys(formErrors).length === 0;
    };

    const sendEmail = async (selectedEmployee) => {
        try {
            const templateParams = {
                taskName: inputs.taskName,
                employeeName: selectedEmployee.name,
                taskDescription: inputs.taskDescription,
                deadline: new Date(inputs.deadline).toLocaleDateString(),
                status: inputs.status,
                employee_email: selectedEmployee.email,
            };

            await emailjs.send(
                "service_5lecc09",
                "template_wjmnvbt",
                templateParams,
                "9FexxmDIESDYNd0Ys"
            );
            console.log("Email sent successfully!");
            window.alert(`Email notification sent to ${selectedEmployee.email}`);
            return true;
        } catch (error) {
            console.error("Error sending email:", error);
            window.alert("Failed to send email notification");
            return false;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validate() || isSubmitting) return;
        
        setIsSubmitting(true);

        try {
            const selectedEmployee = employees.find(emp => emp._id === inputs.assignedEmployee);
            
            const payload = {
                taskName: inputs.taskName.trim(),
                taskDescription: inputs.taskDescription.trim(),
                deadline: inputs.deadline,
                status: inputs.status,
                id: inputs.assignedEmployee, // This will be used as employee ID in the backend
            };

            const response = await axios.post("http://localhost:5000/api/tasks", payload);
            
            if (response.data.task) {
                // Try to send email notification
                if (selectedEmployee) {
                    await sendEmail(selectedEmployee);
                }
                
                window.alert("Task Added Successfully!");
                navigate("/adminTaskDetails");
            }
        } catch (err) {
            console.error("Error adding task:", err);
            const errorMessage = err.response?.data?.message || "An error occurred while adding the task. Please try again.";
            window.alert(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8"
        >
            <div className="max-w-3xl mx-auto">
                <div className="bg-white rounded-xl shadow-lg p-8">
                    <h1 className="text-2xl font-bold text-gray-900 mb-8 text-center">Add New Task</h1>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                            {/* Task Name */}
                            <div className="sm:col-span-2">
                                <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                                    Task Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="taskName"
                                    value={inputs.taskName}
                                    onChange={handleChange}
                                    className="block w-full px-4 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500 focus:outline-none focus:ring-1 transition duration-150 ease-in-out"
                                    placeholder="Enter task name"
                                />
                                {errors.taskName && <p className="mt-1 text-sm text-red-600">{errors.taskName}</p>}
                            </div>

                            {/* Description */}
                            <div className="sm:col-span-2">
                                <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                                    Description <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    name="taskDescription"
                                    value={inputs.taskDescription}
                                    onChange={handleChange}
                                    rows="4"
                                    className="block w-full px-4 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500 focus:outline-none focus:ring-1 transition duration-150 ease-in-out"
                                    placeholder="Enter task description"
                                />
                                {errors.taskDescription && <p className="mt-1 text-sm text-red-600">{errors.taskDescription}</p>}
                            </div>

                            {/* Deadline */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                                    Deadline <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    name="deadline"
                                    value={inputs.deadline}
                                    onChange={handleChange}
                                    min={new Date().toISOString().split('T')[0]}
                                    className="block w-full px-4 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500 focus:outline-none focus:ring-1 transition duration-150 ease-in-out"
                                />
                                {errors.deadline && <p className="mt-1 text-sm text-red-600">{errors.deadline}</p>}
                            </div>

                            {/* Status */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                                    Status <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="status"
                                    value={inputs.status}
                                    onChange={handleChange}
                                    className="block w-full px-4 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500 focus:outline-none focus:ring-1 transition duration-150 ease-in-out"
                                >
                                    <option value="Pending">Pending</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Completed">Completed</option>
                                </select>
                            </div>

                            {/* Assigned Employee */}
                            <div className="sm:col-span-2">
                                <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                                    Assigned Employee <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="assignedEmployee"
                                    value={inputs.assignedEmployee}
                                    onChange={handleChange}
                                    className="block w-full px-4 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500 focus:outline-none focus:ring-1 transition duration-150 ease-in-out"
                                >
                                    <option value="">Select Employee</option>
                                    {employees.map((emp) => (
                                        <option key={emp._id} value={emp._id}>
                                            {emp.name} - {emp.designation}
                                        </option>
                                    ))}
                                </select>
                                {errors.assignedEmployee && <p className="mt-1 text-sm text-red-600">{errors.assignedEmployee}</p>}
                            </div>
                        </div>

                        <div className="mt-8 flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={() => navigate('/adminTaskDetails')}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                            >
                                {isSubmitting ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Adding...
                                    </>
                                ) : (
                                    'Add Task'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </motion.div>
    );
}

export default AddTask;
