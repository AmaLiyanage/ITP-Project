import React, { useState } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
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
    const [errors, setErrors] = useState({});  // To hold validation errors
    const navigate = useNavigate();

    const handleChange = (e) => {
        setInputs((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const validate = () => {
        let formErrors = {};  // Hold validation errors

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

        // NIC No validation
        if (!inputs.nicNo) {
            formErrors.nicNo = "NIC No is required";
        }

        // Date Joined validation
        if (!inputs.date_joined) {
            formErrors.date_joined = "Date Joined is required";
        }

        setErrors(formErrors);  // Update error state
        return Object.keys(formErrors).length === 0;  // If no errors, return true
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (validate()) {  // Only submit if validation passes
            sendRequest().then(() => {
                window.alert("Employee Added Successfully!");
                navigate('/adminEmployeeDetails');
            });
        } 
    };

    const sendRequest = async () => {
        await axios.post("http://localhost:5000/employees", {
            name: inputs.name,
            age: Number(inputs.age),
            gender: inputs.gender,
            designation: inputs.designation,
            address: inputs.address,
            email: inputs.email,
            phone: Number(inputs.phone),
            nicNo: inputs.nicNo,
            date_joined: inputs.date_joined,
        });
    };

    return (
        <div className="div1">
            <h1 className="addE">Add Employee</h1>
            <form className="addef" onSubmit={handleSubmit}>
                Name: <br />
                <input type="text" name="name" onChange={handleChange} value={inputs.name} required />
                {errors.name && <p className="error">{errors.name}</p>} <br /><br />

                Age: <br />
                <input type="text" name="age" onChange={handleChange} value={inputs.age} required />
                {errors.age && <p className="error">{errors.age}</p>} <br /><br />

                Gender: <br />
                <select name="gender" onChange={handleChange} value={inputs.gender} required>
                    <option value="">Select...</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                </select>
                {errors.gender && <p className="error">{errors.gender}</p>} <br /><br />

                Designation: <br />
                <input type="text" name="designation" onChange={handleChange} value={inputs.designation} required />
                {errors.designation && <p className="error">{errors.designation}</p>} <br /><br />

                Address: <br />
                <input type="text" name="address" onChange={handleChange} value={inputs.address} required />
                {errors.address && <p className="error">{errors.address}</p>} <br /><br />

                Email: <br />
                <input type="email" name="email" onChange={handleChange} value={inputs.email} required />
                {errors.email && <p className="error">{errors.email}</p>} <br /><br />

                Mobile No: <br />
                <input type="text" name="phone" onChange={handleChange} value={inputs.phone} required />
                {errors.phone && <p className="error">{errors.phone}</p>} <br /><br />

                NIC No: <br />
                <input type="text" name="nicNo" onChange={handleChange} value={inputs.nicNo} required />
                {errors.nicNo && <p className="error">{errors.nicNo}</p>} <br /><br />

                Date Joined: <br />
                <input type="date" name="date_joined" onChange={handleChange} value={inputs.date_joined} required />
                {errors.date_joined && <p className="error">{errors.date_joined}</p>} <br /><br />

                <button className="bae1" type="submit">Submit</button>
            </form>
        </div>
    );
}

export default AddEmployee;
