import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import emailjs from "emailjs-com";
import "./AddTask.css";

function AddTask() {
    const [inputs, setInputs] = useState({
        taskName: "",
        taskDescription: "",
        deadline: "",
        status: "",
        assignedEmployee: "",
    });

    const [employees, setEmployees] = useState([]);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        axios.get("http://localhost:5000/employees")
            .then((res) => setEmployees(res.data.employees))
            .catch((err) => console.error("Error fetching employees:", err));
    }, []);

    const handleChange = (e) => {
        setInputs((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const validate = () => {
        let formErrors = {};

        if (!inputs.taskName) formErrors.taskName = "Task Name is required";
        if (!inputs.taskDescription) formErrors.taskDescription = "Description is required";
        if (!inputs.deadline) formErrors.deadline = "Deadline is required";
        if (!inputs.status) formErrors.status = "Status is required";
        if (!inputs.assignedEmployee) formErrors.assignedEmployee = "Assigned Employee is required";

        setErrors(formErrors);
        return Object.keys(formErrors).length === 0;
    };

    const sendEmail = () => {
        const selectedEmployee = employees.find(emp => emp._id === inputs.assignedEmployee);

        if (!selectedEmployee) {
            window.alert("Selected employee not found");
            return;
        }

        if (!selectedEmployee.email) {
            window.alert("Employee email is missing.");
            return;
        }

        const templateParams = {
            taskName: inputs.taskName,
            employeeName: selectedEmployee.name,
            taskDescription: inputs.taskDescription,
            deadline: inputs.deadline,
            status: inputs.status,
            employee_email: selectedEmployee.email,
        };

        console.log("Sending email to:", selectedEmployee.email);
        console.log("Email parameters:", templateParams);

        emailjs.send("service_5lecc09", "template_wjmnvbt", templateParams, "9FexxmDIESDYNd0Ys")
            .then(response => {
                console.log("Email sent successfully!", response);
                window.alert("Email notification sent to " + templateParams.employee_email);
            })
            .catch(error => {
                console.error("Error sending email:", error);
                window.alert(`Failed to send email: ${error.text}`);
            });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (validate()) {
            try {
                const payload = {
                    taskName: inputs.taskName,
                    taskDescription: inputs.taskDescription,
                    deadline: inputs.deadline,
                    status: inputs.status,
                    id: inputs.assignedEmployee,
                };

                const response = await axios.post("http://localhost:5000/tasks", payload);
                if (response.data.task) {
                    sendEmail();  
                    window.alert("Task Added Successfully!");
                    navigate("/adminTaskDetails");
                }
            } catch (err) {
                console.error("Error adding task:", err);
                window.alert("An error occurred while adding the task. Please try again.");
            }
        }
    };

    return (
        <div className="task-container">
    <h1 className="task-title">Add Task</h1>
    <form className="task-form" onSubmit={handleSubmit}>
        <label className="task-label">Task Name:</label>
        <input className="task-input" type="text" name="taskName" onChange={handleChange} value={inputs.taskName} required />
        {errors.taskName && <p className="error-message">{errors.taskName}</p>}

        <label className="task-label">Description:</label>
        <textarea className="task-textarea" name="taskDescription" onChange={handleChange} value={inputs.taskDescription} required rows="5" />

        <label className="task-label">Deadline:</label>
        <input className="task-input" type="date" name="deadline" onChange={handleChange} value={inputs.deadline} required 
            min={new Date().toISOString().split('T')[0]} />

        <label className="task-label">Status:</label>
        <select className="task-select" name="status" onChange={handleChange} value={inputs.status} required>
            <option className="select-option" value="">Select...</option>
            <option className="select-option" value="Pending">Pending</option>
            <option className="select-option" value="In Progress">In Progress</option>
            <option className="select-option" value="Completed">Completed</option>
        </select>

        <label className="task-label">Assigned Employee:</label>
        <select className="task-select" name="assignedEmployee" onChange={handleChange} value={inputs.assignedEmployee} required>
            <option className="select-option" value="">Select Employee</option>
            {employees.map((emp) => (
                <option key={emp._id} className="select-option" value={emp._id}>{emp.name}</option>
            ))}
        </select>

        <button className="submit-button" type="submit">Add Task</button>
    </form>
</div>

    );
}

export default AddTask;
