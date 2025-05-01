import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from 'framer-motion';
import emailjs from '@emailjs/browser';

function DeleteEmployee() {
    const [inputs, setInputs] = useState({
        name: "",
        age: "",
        gender: "",
        designation: "",
        address: "",
        email: "",
        phone: "",
        nicNo: "",
        date_joined: ""
    });

    const history = useNavigate();
    const { id } = useParams();

    // Fetch employee details by ID
    useEffect(() => {
        const fetchHandler = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/employees/${id}`);
                const employeeData = response.data.employee;

                setInputs({
                    ...employeeData,
                    date_joined: employeeData.date_joined
                        ? new Date(employeeData.date_joined).toISOString().split("T")[0]
                        : ""
                });
            } catch (error) {
                console.error("Error fetching employee:", error);
            }
        };
        fetchHandler();
    }, [id]);

    const sendEmail = async () => {
        const templateParams = {
            employeeName: inputs.name,
            employeeEmail: inputs.email,
            designation: inputs.designation,
            date_joined: inputs.date_joined,
            to_email: inputs.email,
        };

        try {
            await emailjs.send("service_9ck9zyj", "template_3i4gkih", templateParams, "EYpS1R9pXsmUR4Odm");
            console.log("Email sent successfully");
            window.alert("Email notification sent to " + templateParams.employeeEmail);
        } catch (error) {
            console.error("Error sending email:", error);
            window.alert("Failed to send email notification.");
        }
    };

    // Delete employee function
    const deleteHandler = async () => {
        const employeeConfirmed = window.confirm(
            "Are you sure you want to delete this Employee?"
        );
        if(employeeConfirmed){
            try {
                // Send email notification first
                await sendEmail();
                
                // Then delete the employee
                await axios.delete(`http://localhost:5000/api/employees/${id}`);
                window.alert("Employee Deleted Successfully!");
                history("/adminEmployeeDetails"); // Redirect to the employee details page after delete
            } catch (error) {
                console.error("Error deleting employee:", error);
                window.alert("Failed to delete employee. Please try again.");
            }
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        deleteHandler(); // Call the delete handler when form is submitted
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8"
        >
            <div className="max-w-3xl mx-auto">
                <div className="bg-white rounded-xl shadow-lg p-8">
                    <h1 className="text-2xl font-bold text-gray-900 mb-8 text-center">Delete Employee</h1>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                            {/* Name */}
                            <div className="sm:col-span-2">
                                <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={inputs.name}
                                    readOnly
                                    className="block w-full px-4 py-3 text-gray-700 bg-gray-50 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500 focus:outline-none focus:ring-1 transition duration-150 ease-in-out"
                                />
                            </div>

                            {/* Age */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                                    Age
                                </label>
                                <input
                                    type="number"
                                    name="age"
                                    value={inputs.age}
                                    readOnly
                                    className="block w-full px-4 py-3 text-gray-700 bg-gray-50 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500 focus:outline-none focus:ring-1 transition duration-150 ease-in-out"
                                />
                            </div>

                            {/* Gender */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                                    Gender
                                </label>
                                <select
                                    name="gender"
                                    value={inputs.gender}
                                    readOnly
                                    className="block w-full px-4 py-3 text-gray-700 bg-gray-50 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500 focus:outline-none focus:ring-1 transition duration-150 ease-in-out"
                                >
                                    <option value="">Select...</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            {/* Designation */}
                            <div className="sm:col-span-2">
                                <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                                    Designation
                                </label>
                                <input
                                    type="text"
                                    name="designation"
                                    value={inputs.designation}
                                    readOnly
                                    className="block w-full px-4 py-3 text-gray-700 bg-gray-50 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500 focus:outline-none focus:ring-1 transition duration-150 ease-in-out"
                                />
                            </div>

                            {/* Address */}
                            <div className="sm:col-span-2">
                                <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                                    Address
                                </label>
                                <input
                                    type="text"
                                    name="address"
                                    value={inputs.address}
                                    readOnly
                                    className="block w-full px-4 py-3 text-gray-700 bg-gray-50 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500 focus:outline-none focus:ring-1 transition duration-150 ease-in-out"
                                />
                            </div>

                            {/* Email */}
                            <div className="sm:col-span-2">
                                <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={inputs.email}
                                    readOnly
                                    className="block w-full px-4 py-3 text-gray-700 bg-gray-50 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500 focus:outline-none focus:ring-1 transition duration-150 ease-in-out"
                                />
                            </div>

                            {/* Phone */}
                            <div className="sm:col-span-2">
                                <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                                    Mobile No
                                </label>
                                <input
                                    type="text"
                                    name="phone"
                                    value={inputs.phone}
                                    readOnly
                                    className="block w-full px-4 py-3 text-gray-700 bg-gray-50 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500 focus:outline-none focus:ring-1 transition duration-150 ease-in-out"
                                />
                            </div>

                            {/* NIC No */}
                            <div className="sm:col-span-2">
                                <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                                    NIC No
                                </label>
                                <input
                                    type="text"
                                    name="nicNo"
                                    value={inputs.nicNo}
                                    readOnly
                                    className="block w-full px-4 py-3 text-gray-700 bg-gray-50 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500 focus:outline-none focus:ring-1 transition duration-150 ease-in-out"
                                />
                            </div>

                            {/* Date Joined */}
                            <div className="sm:col-span-2">
                                <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                                    Date Joined
                                </label>
                                <input
                                    type="date"
                                    name="date_joined"
                                    value={inputs.date_joined}
                                    readOnly
                                    className="block w-full px-4 py-3 text-gray-700 bg-gray-50 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500 focus:outline-none focus:ring-1 transition duration-150 ease-in-out"
                                />
                            </div>
                        </div>

                        <div className="mt-8 flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={() => history('/adminEmployeeDetails')}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            >
                                Delete Employee
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </motion.div>
    );
}

export default DeleteEmployee;
