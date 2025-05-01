import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import emailjs from '@emailjs/browser';
import { motion } from 'framer-motion';

function UpdateTask() {
    const [inputs, setInputs] = useState({
        taskName: '',
        taskDescription: '',
        deadline: '',
        status: '',
        assignedEmployee: ''
    });

    const [employees, setEmployees] = useState([]);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [emailStatus, setEmailStatus] = useState(null);
    const history = useNavigate();
    const { id } = useParams();

    // Fetch employees and task details
    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                // Fetch task details by ID
                const taskResponse = await axios.get(`http://localhost:5000/api/tasks/${id}`);
                const taskData = taskResponse.data.task;

                // Fetch all employees
                const employeesResponse = await axios.get('http://localhost:5000/api/employees');
                setEmployees(employeesResponse.data.employees);

                // Set task data to form state
                setInputs({
                    taskName: taskData.taskName || '',
                    taskDescription: taskData.taskDescription || '',
                    deadline: taskData.deadline
                        ? new Date(taskData.deadline).toISOString().split('T')[0]
                        : '',
                    status: taskData.status || '',
                    assignedEmployee: taskData.employee?._id || ''
                });
            } catch (error) {
                console.error('Error fetching data:', error);
                window.alert('Failed to load task details. Please try again.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleChange = (e) => {
        setInputs((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value
        }));
    };

    const validate = () => {
        let formErrors = {};
        const today = new Date();
        const selectedDate = new Date(inputs.deadline);

        if (!inputs.taskName.trim()) {
            formErrors.taskName = 'Task Name is required';
        }

        if (!inputs.taskDescription.trim()) {
            formErrors.taskDescription = 'Task Description is required';
        }

        if (!inputs.deadline) {
            formErrors.deadline = 'Deadline is required';
        } else if (selectedDate < today) {
            formErrors.deadline = 'Deadline must be a future date';
        }

        if (!inputs.status) {
            formErrors.status = 'Status is required';
        }

        setErrors(formErrors);
        return Object.keys(formErrors).length === 0;
    };

    const sendEmail = async (employeeEmail, employeeName) => {
        try {
            const templateParams = {
                taskName: inputs.taskName,
                employeeName: employeeName,
                taskDescription: inputs.taskDescription,
                deadline: new Date(inputs.deadline).toLocaleDateString(),
                status: inputs.status,
                employee_email: employeeEmail,
            };

            await emailjs.send(
                "service_5lecc09",
                "template_xjx7fsk",
                templateParams,
                "9FexxmDIESDYNd0Ys"
            );
            console.log("Email sent successfully");
            window.alert(`Email notification sent to ${employeeEmail}`);
            return true;
        } catch (error) {
            console.error("Error sending email:", error);
            window.alert("Failed to send email notification");
            return false;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setEmailStatus(null);

        if (!validate()) return;

        try {
            const payload = {
                taskName: inputs.taskName.trim(),
                taskDescription: inputs.taskDescription.trim(),
                deadline: inputs.deadline,
                status: inputs.status
            };

            await axios.put(`http://localhost:5000/api/tasks/${id}`, payload);

            // Try to send email notification
            const assignedEmployee = employees.find(emp => emp._id === inputs.assignedEmployee);
            if (assignedEmployee) {
                await sendEmail(assignedEmployee.email, assignedEmployee.name);
            }

            window.alert('Task Details Updated Successfully!');
            history('/adminTaskDetails');
        } catch (error) {
            console.error('Error updating task:', error);
            window.alert('Failed to update task. Please try again.');
        }
    };

    if (isLoading) {
        return (
            <div className="EDT-container">
                <p>Loading task details...</p>
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
                    <h1 className="text-2xl font-bold text-gray-900 mb-8 text-center">Update Task</h1>
                    {emailStatus && (
                        <div className={`EDT-email-status ${emailStatus.type}`}>
                            {emailStatus.message}
                        </div>
                    )}
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

                            {/* Task Description */}
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
                            <div className="sm:col-span-2">
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
                            <div className="sm:col-span-2">
                                <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                                    Status <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="status"
                                    value={inputs.status}
                                    onChange={handleChange}
                                    className="block w-full px-4 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500 focus:outline-none focus:ring-1 transition duration-150 ease-in-out"
                                >
                                    <option value="">Select Status...</option>
                                    <option value="Pending">Pending</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Completed">Completed</option>
                                </select>
                                {errors.status && <p className="mt-1 text-sm text-red-600">{errors.status}</p>}
                            </div>

                            {/* Assigned Employee */}
                            <div className="sm:col-span-2">
                                <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                                    Assigned Employee
                                </label>
                                <input
                                    type="text"
                                    value={employees.find(emp => emp._id === inputs.assignedEmployee)?.name || "Unassigned"}
                                    readOnly
                                    className="block w-full px-4 py-3 text-gray-700 bg-gray-50 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500 focus:outline-none focus:ring-1 transition duration-150 ease-in-out"
                                />
                            </div>
                        </div>

                        <div className="mt-8 flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={() => history('/adminTaskDetails')}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Update Task
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </motion.div>
    );
}

export default UpdateTask;
