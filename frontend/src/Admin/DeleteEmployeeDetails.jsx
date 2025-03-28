import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import './DeleteEmployee.css';

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
                const response = await axios.get(`http://localhost:5000/employees/${id}`);
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

    // Delete employee function
    const deleteHandler = async () => {
        const employeeConfirmed = window.confirm(
            "Are you sure you want to delete this Employee?"
        );
        if(employeeConfirmed){
        try {
            await axios.delete(`http://localhost:5000/employees/${id}`);
            window.alert("Employee Deleted Successfully!"),
            history("/adminEmployeeDetails"); // Redirect to the employee details page after delete
        } catch (error) {
            console.error("Error deleting employee:", error);
        }
    }
    };

    
    const handleSubmit = (e) => {
        e.preventDefault();
        deleteHandler(); // Call the delete handler when form is submitted
        
    };

    return (
        <div className="deleteE-div1">
    <h1 className="deleteE-h3">Delete Employee</h1>
    <form onSubmit={handleSubmit} className="deleteE-form">
        Name: <br />
        <input className="deleteE-input" type="text" name="name" value={inputs.name} readOnly /><br /><br />
        
        Age: <br />
        <input className="deleteE-input" type="number" name="age" value={inputs.age} readOnly /><br /><br />
        
        Gender: <br />
        <select className="deleteE-select" name="gender" value={inputs.gender} readOnly>
            <option className="deleteE-option" value="">Select...</option>
            <option className="deleteE-option" value="Male">Male</option>
            <option className="deleteE-option" value="Female">Female</option>
            <option className="deleteE-option" value="Other">Other</option>
        </select><br /><br />
        
        Designation: <br />
        <input className="deleteE-input" type="text" name="designation" value={inputs.designation} readOnly /><br /><br />
        
        Address: <br />
        <input className="deleteE-input" type="text" name="address" value={inputs.address} readOnly /><br /><br />
        
        Email: <br />
        <input className="deleteE-input" type="email" name="email" value={inputs.email} readOnly /><br /><br />
        
        Mobile No: <br />
        <input className="deleteE-input" type="text" name="phone" value={inputs.phone} readOnly /><br /><br />
        
        NIC No: <br />
        <input className="deleteE-input" type="text" name="nicNo" value={inputs.nicNo} readOnly /><br /><br />
        
        Date Joined: <br />
        <input className="deleteE-input" type="date" name="date_joined" value={inputs.date_joined} readOnly /><br /><br />
        
        <button className="deleteE-btn" type="submit">Delete</button>
    </form>
</div>

    );
}

export default DeleteEmployee;
