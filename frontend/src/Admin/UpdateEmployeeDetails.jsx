import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './UpdateEmployeeDetails.css';

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
                const response = await axios.get(`http://localhost:5000/employees/${id}`);
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
        await axios.put(`http://localhost:5000/employees/${id}`, {
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
        <div className="UED-container">
            <h1 className="UED-heading">Update Employee</h1>
            <form onSubmit={handleSubmit}>
                <label className="UED-label">Name: </label><br />
                <input className="UED-input" type="text" name="name" onChange={handleChange} value={inputs.name} required />
                {errors.name && <p className="UED-error">{errors.name}</p>} <br /><br />
    
                <label className="UED-label">Age: </label><br />
                <input className="UED-input" type="text" name="age" onChange={handleChange} value={inputs.age} required />
                {errors.age && <p className="UED-error">{errors.age}</p>} <br /><br />
    
                <label className="UED-label">Gender: </label><br />
                <select className="UED-select" name="gender" onChange={handleChange} value={inputs.gender} required>
                    <option value="">Select...</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                </select>
                {errors.gender && <p className="UED-error">{errors.gender}</p>} <br /><br />
    
                <label className="UED-label">Designation: </label><br />
                <input className="UED-input" type="text" name="designation" onChange={handleChange} value={inputs.designation} required />
                {errors.designation && <p className="UED-error">{errors.designation}</p>} <br /><br />
    
                <label className="UED-label">Address: </label><br />
                <input className="UED-input" type="text" name="address" onChange={handleChange} value={inputs.address} required />
                {errors.address && <p className="UED-error">{errors.address}</p>} <br /><br />
    
                <label className="UED-label">Email: </label><br />
                <input className="UED-input" type="email" name="email" onChange={handleChange} value={inputs.email} required />
                {errors.email && <p className="UED-error">{errors.email}</p>} <br /><br />
    
                <label className="UED-label">Mobile No: </label><br />
                <input className="UED-input" type="text" name="phone" onChange={handleChange} value={inputs.phone} required />
                {errors.phone && <p className="UED-error">{errors.phone}</p>} <br /><br />
    
                <label className="UED-label">NIC No: </label><br />
                <input className="UED-input" type="text" name="nicNo" onChange={handleChange} value={inputs.nicNo} required />
                {errors.nicNo && <p className="UED-error">{errors.nicNo}</p>} <br /><br />
    
                <label className="UED-label">Date Joined: </label><br />
                <input className="UED-input" type="date" name="date_joined" onChange={handleChange} value={inputs.date_joined} required />
                {errors.date_joined && <p className="UED-error">{errors.date_joined}</p>} <br /><br />
    
                <button className="UED-submit-btn" type="submit">Submit</button>
            </form>
        </div>
    );
    
}

export default UpdateEmployee;
