import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

function UpdateEmployee() {
    const [inputs, setInputs] = useState({
        name: '',
        age: '',
        gender: '',
        designation: '',
        address: '',
        email: '',
        phone: '',
        nicNo: '',
        date_joined: ''
    });

    const [errors, setErrors] = useState({});
    const history = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        const fetchHandler = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/employees/${id}`);
                const employeeData = response.data.employee;

                setInputs({
                    ...employeeData,
                    date_joined: employeeData.date_joined
                        ? new Date(employeeData.date_joined).toISOString().split('T')[0]
                        : ''
                });
            } catch (error) {
                console.error('Error fetching employee:', error);
            }
        };

        fetchHandler();
    }, [id]);

    const handleChange = (e) => {
        setInputs((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value
        }));
    };

    const validate = () => {
        let formErrors = {};

        if (!inputs.name) {
            formErrors.name = "Name is required";
        }

        if (!inputs.age) {
            formErrors.age = "Age is required";
        } else if (isNaN(inputs.age)) {
            formErrors.age = "Age must be a number";
        } else if (Number(inputs.age) < 18) {
            formErrors.age = "Age must be greater than 18";
        }

        if (!inputs.gender) {
            formErrors.gender = "Gender is required";
        }

        if (!inputs.designation) {
            formErrors.designation = "Designation is required";
        }

        if (!inputs.address) {
            formErrors.address = "Address is required";
        }

        if (!inputs.email) {
            formErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(inputs.email)) {
            formErrors.email = "Email is invalid";
        }

        if (!inputs.phone) {
            formErrors.phone = "Phone number is required";
        } else if (!/^\d{10}$/.test(inputs.phone)) {
            formErrors.phone = "Phone number must be 10 digits";
        }

        if (!inputs.nicNo) {
            formErrors.nicNo = "NIC No is required";
        }

        if (!inputs.date_joined) {
            formErrors.date_joined = "Date Joined is required";
        }

        setErrors(formErrors);
        return Object.keys(formErrors).length === 0;
    };

    const sendRequest = async () => {
        await axios.put(`http://localhost:5000/api/employees/${id}`, {
            name: String(inputs.name),
            age: Number(inputs.age),
            gender: String(inputs.gender),
            designation: String(inputs.designation),
            address: String(inputs.address),
            email: String(inputs.email),
            phone: String(inputs.phone),
            nicNo: String(inputs.nicNo),
            date_joined: String(inputs.date_joined)
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (validate()) {
            sendRequest().then(() => {
                window.alert("Employee Details Updated Successfully!");
                history('/adminEmployeeDetails');
            });
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
                    <h1 className="text-2xl font-bold text-gray-900 mb-8 text-center">Update Employee</h1>
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
                                <input
                                    type="text"
                                    name="gender"
                                    value={inputs.gender}
                                    readOnly
                                    className="block w-full px-4 py-3 text-gray-700 bg-gray-50 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500 focus:outline-none focus:ring-1 transition duration-150 ease-in-out"
                                />
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
                                    placeholder="Enter email"
                                />
                                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                            </div>

                            {/* Phone */}
                            <div className="sm:col-span-2">
                                <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                                    Mobile No <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="phone"
                                    value={inputs.phone}
                                    onChange={handleChange}
                                    className="block w-full px-4 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500 focus:outline-none focus:ring-1 transition duration-150 ease-in-out"
                                    placeholder="Enter mobile number"
                                />
                                {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                            </div>

                            {/* NIC No */}
                            <div className="sm:col-span-2">
                                <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                                    NIC No <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="nicNo"
                                    value={inputs.nicNo}
                                    readOnly
                                    className="block w-full px-4 py-3 text-gray-700 bg-gray-50 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500 focus:outline-none focus:ring-1 transition duration-150 ease-in-out"
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
                                    readOnly
                                    className="block w-full px-4 py-3 text-gray-700 bg-gray-50 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500 focus:outline-none focus:ring-1 transition duration-150 ease-in-out"
                                />
                                {errors.date_joined && <p className="mt-1 text-sm text-red-600">{errors.date_joined}</p>}
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
                                className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Update Employee
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </motion.div>
    );
}

export default UpdateEmployee;
