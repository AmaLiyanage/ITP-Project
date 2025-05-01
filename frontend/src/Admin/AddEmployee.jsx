import React, { useState } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './AddEmployee.css';

function AddEmployee() {
    const [inputs, setInputs] = useState({
        name: "",
        age: "",
        gender: "",
        designation: "",
        address: "",
        email: "",
        phone: "",
        nicNo: "",
        date_joined: "",
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setInputs((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    // Helper to validate Sri Lankan NIC (old and new formats)
    const isValidSriLankanNIC = (nic) => {
        nic = nic.trim().toUpperCase();
        const oldNICPattern = /^\d{9}[V]$/;   // e.g., 123456789V
        const newNICPattern = /^\d{12}$/;      // e.g., 200012345678
        return oldNICPattern.test(nic) || newNICPattern.test(nic);
    };

    const validate = () => {
        let formErrors = {};

        // Name validation
        if (!inputs.name) {
            formErrors.name = "Name is required";
        }

        // Age validation
        if (!inputs.age) {
            formErrors.age = "Age is required";
        } else if (isNaN(inputs.age)) {
            formErrors.age = "Age must be a number";
        } else if (Number(inputs.age) < 18) {
            formErrors.age = "Age must be greater than 18";
        }

        // Gender validation
        if (!inputs.gender) {
            formErrors.gender = "Gender is required";
        }

        // Designation validation
        if (!inputs.designation) {
            formErrors.designation = "Designation is required";
        }

        // Address validation
        if (!inputs.address) {
            formErrors.address = "Address is required";
        }

        // Email validation
        if (!inputs.email) {
            formErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(inputs.email)) {
            formErrors.email = "Email is invalid";
        }

        // Phone validation
        if (!inputs.phone) {
            formErrors.phone = "Phone number is required";
        } else if (!/^\d{10}$/.test(inputs.phone)) {
            formErrors.phone = "Phone number must be 10 digits";
        }

        // NIC No validation (Sri Lankan format)
        if (!inputs.nicNo) {
            formErrors.nicNo = "NIC No is required";
        } else if (!isValidSriLankanNIC(inputs.nicNo)) {
            formErrors.nicNo = "Invalid NIC number (should be 9 digits + V or 12 digits)";
        }

        // Date Joined validation
        if (!inputs.date_joined) {
            formErrors.date_joined = "Date Joined is required";
        }

        setErrors(formErrors);
        return Object.keys(formErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        if (validate()) {
            try {
                await sendRequest();
                window.alert("Employee Added Successfully!");
                navigate('/adminEmployeeDetails');
            } catch (error) {
                console.error("Error adding employee:", error);
                window.alert("Failed to add employee. Please try again.");
            }
        }
        setIsSubmitting(false);
    };

    const sendRequest = async () => {
        try {
            const response = await axios.post("http://localhost:5000/api/employees", {
                name: inputs.name,
                age: Number(inputs.age),
                gender: inputs.gender,
                designation: inputs.designation,
                address: inputs.address,
                email: inputs.email,
                phone: String(inputs.phone),
                nicNo: inputs.nicNo,
                date_joined: inputs.date_joined,
            });
            return response.data;
        } catch (error) {
            console.error("Error in sendRequest:", error);
            throw error;
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
                    <h1 className="text-2xl font-bold text-gray-900 mb-8 text-center">Add New Employee</h1>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                            {/* Name */}
                            <div className="sm:col-span-2">
                                <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                                    Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={inputs.name}
                                    onChange={handleChange}
                                    className="block w-full px-4 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500 focus:outline-none focus:ring-1 transition duration-150 ease-in-out"
                                    placeholder="Enter employee name"
                                />
                                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                            </div>

                            {/* Age */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                                    Age <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    name="age"
                                    value={inputs.age}
                                    onChange={handleChange}
                                    className="block w-full px-4 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500 focus:outline-none focus:ring-1 transition duration-150 ease-in-out"
                                    placeholder="Enter age"
                                />
                                {errors.age && <p className="mt-1 text-sm text-red-600">{errors.age}</p>}
                            </div>

                            {/* Gender */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                                    Gender <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="gender"
                                    value={inputs.gender}
                                    onChange={handleChange}
                                    className="block w-full px-4 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500 focus:outline-none focus:ring-1 transition duration-150 ease-in-out"
                                >
                                    <option value="">Select gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                                {errors.gender && <p className="mt-1 text-sm text-red-600">{errors.gender}</p>}
                            </div>

                            {/* Designation */}
                            <div className="sm:col-span-2">
                                <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                                    Designation <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="designation"
                                    value={inputs.designation}
                                    onChange={handleChange}
                                    className="block w-full px-4 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500 focus:outline-none focus:ring-1 transition duration-150 ease-in-out"
                                    placeholder="Enter designation"
                                />
                                {errors.designation && <p className="mt-1 text-sm text-red-600">{errors.designation}</p>}
                            </div>

                            {/* Address */}
                            <div className="sm:col-span-2">
                                <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                                    Address <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="address"
                                    value={inputs.address}
                                    onChange={handleChange}
                                    className="block w-full px-4 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500 focus:outline-none focus:ring-1 transition duration-150 ease-in-out"
                                    placeholder="Enter address"
                                />
                                {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
                            </div>

                            {/* Email */}
                            <div className="sm:col-span-2">
                                <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                                    Email <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={inputs.email}
                                    onChange={handleChange}
                                    className="block w-full px-4 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500 focus:outline-none focus:ring-1 transition duration-150 ease-in-out"
                                    placeholder="Enter email address"
                                />
                                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                            </div>

                            {/* Phone */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                                    Phone Number <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="phone"
                                    value={inputs.phone}
                                    onChange={handleChange}
                                    className="block w-full px-4 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500 focus:outline-none focus:ring-1 transition duration-150 ease-in-out"
                                    placeholder="Enter phone number"
                                />
                                {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                            </div>

                            {/* NIC No */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                                    NIC Number <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="nicNo"
                                    value={inputs.nicNo}
                                    onChange={handleChange}
                                    className="block w-full px-4 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500 focus:outline-none focus:ring-1 transition duration-150 ease-in-out"
                                    placeholder="Enter NIC number"
                                />
                                {errors.nicNo && <p className="mt-1 text-sm text-red-600">{errors.nicNo}</p>}
                            </div>

                            {/* Date Joined */}
                            <div className="sm:col-span-2">
                                <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                                    Date Joined <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    name="date_joined"
                                    value={inputs.date_joined}
                                    onChange={handleChange}
                                    className="block w-full px-4 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500 focus:outline-none focus:ring-1 transition duration-150 ease-in-out"
                                />
                                {errors.date_joined && <p className="mt-1 text-sm text-red-600">{errors.date_joined}</p>}
                            </div>
                        </div>

                        <div className="mt-8 flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={() => navigate('/adminEmployeeDetails')}
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
                                    'Add Employee'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </motion.div>
    );
}

export default AddEmployee;
