import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import emailjs from 'emailjs-com';
import './UpdateTaskDetails.css';

function UpdateTask() {
    const [inputs, setInputs] = useState({
        taskName: '',
        taskDescription: '',
        deadline: '',
        status: '',
        assignedEmployee: '' // Store assignedEmployee value here
    });

    const [employees, setEmployees] = useState([]); // List of employees
    const [errors, setErrors] = useState({});
    const history = useNavigate();
    const { id } = useParams();

    // Fetch employees and task details
    useEffect(() => {
        const fetchHandler = async () => {
            try {
                // Fetch task details by ID
                const response = await axios.get(`http://localhost:5000/tasks/${id}`);
                const taskData = response.data.task;

                // Set task data to form state
                setInputs({
                    taskName: taskData.taskName,
                    taskDescription: taskData.taskDescription,
                    deadline: taskData.deadline
                        ? new Date(taskData.deadline).toISOString().split('T')[0]
                        : '',
                    status: taskData.status,
                    assignedEmployee: taskData.employee._id // Set assigned employee
                });

                // Fetch all employees
                const employeesResponse = await axios.get('http://localhost:5000/employees');
                setEmployees(employeesResponse.data.employees);
            } catch (error) {
                console.error('Error fetching task:', error);
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

        if (!inputs.taskName) {
            formErrors.taskName = 'Task Name is required';
        }

        if (!inputs.taskDescription) {
            formErrors.taskDescription = 'Task Description is required';
        }

        const currentDate = new Date().toISOString().split('T')[0];
        if (!inputs.deadline) {
            formErrors.deadline = 'Deadline is required';
        } else if (inputs.deadline <= currentDate) {
            formErrors.deadline = 'Deadline must be a future date';
        }

        if (!inputs.status) {
            formErrors.status = 'Status is required';
        }

        if (!inputs.assignedEmployee) {
            formErrors.assignedEmployee = 'Assigned Employee is required';
        }

        setErrors(formErrors);
        return Object.keys(formErrors).length === 0;
    };

    const sendEmail = async (employeeEmail, employeeName) => {
        const templateParams = {
            taskName: inputs.taskName,
            employeeName: employeeName,
            taskDescription: inputs.taskDescription,
            deadline: inputs.deadline,
            status: inputs.status,
            employee_email: employeeEmail,
        };

        try {
            await emailjs.send("service_5lecc09", "template_xjx7fsk", templateParams, "9FexxmDIESDYNd0Ys");
            console.log("Email sent successfully");
            window.alert("Email notification sent to " + templateParams.employee_email);
        } catch (error) {
            console.error("Error sending email:", error);
            window.alert("Failed to send email notification.");
        }
    };

    const sendRequest = async () => {
        try {
            await axios.put(`http://localhost:5000/tasks/${id}`, {
                taskName: String(inputs.taskName),
                taskDescription: String(inputs.taskDescription),
                deadline: String(inputs.deadline),
                status: String(inputs.status),
                assignedEmployee: String(inputs.assignedEmployee) // Ensure the updated employee ID is sent
            });
        } catch (error) {
            console.error('Error updating task:', error);
            throw new Error('Failed to update task');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (validate()) {
            sendRequest()
                .then(() => {
                    const assignedEmployee = employees.find(emp => emp._id === inputs.assignedEmployee);
                    if (assignedEmployee) {
                        sendEmail(assignedEmployee.email, assignedEmployee.name);
                    }
                    window.alert('Task Details Updated Successfully!');
                    history('/adminTaskDetails');
                })
                .catch((error) => {
                    console.error("Error updating task:", error);
                    window.alert("Failed to update task. Please try again.");
                });
        }
    };

    return (
        <div className="EDT-container">
            <h1 className="EDT-heading">Update Task</h1>
            <form onSubmit={handleSubmit}>
                <label className="EDT-label">Task Name:</label> <br />
                <input
                    type="text"
                    name="taskName"
                    onChange={handleChange}
                    value={inputs.taskName}
                    required
                    className="EDT-input"
                />
                {errors.taskName && <p className="EDT-error">{errors.taskName}</p>} <br /><br />
    
                <label className="EDT-label">Task Description:</label> <br />
                <textarea
                    name="taskDescription"
                    onChange={handleChange}
                    value={inputs.taskDescription}
                    required
                    className="EDT-textarea"
                />
                {errors.taskDescription && <p className="EDT-error">{errors.taskDescription}</p>} <br /><br />
    
                <label className="EDT-label">Deadline:</label> <br />
                <input
                    type="date"
                    name="deadline"
                    onChange={handleChange}
                    value={inputs.deadline}
                    required
                    min={new Date().toISOString().split('T')[0]} 
                    className="EDT-input"
                />
                {errors.deadline && <p className="EDT-error">{errors.deadline}</p>} <br /><br />
    
                <label className="EDT-label">Status:</label> <br />
                <select name="status" onChange={handleChange} value={inputs.status} required className="EDT-select">
                    <option value="">Select Status...</option>
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                </select>
                {errors.status && <p className="EDT-error">{errors.status}</p>} <br /><br />
    
                <label className="EDT-label">Assigned Employee:</label> <br />
                <select
                    name="assignedEmployee"
                    onChange={handleChange}
                    value={inputs.assignedEmployee}
                    required
                    disabled
                    className="EDT-select"
                >
                    <option value="">Select Employee</option>
                    {employees.map((emp) => (
                        <option key={emp._id} value={emp._id}>
                            {emp.name}
                        </option>
                    ))}
                </select>
                {errors.assignedEmployee && <p className="EDT-error">{errors.assignedEmployee}</p>} <br /><br />
    
                <button type="submit" className="EDT-submit-btn">Submit</button>
            </form>
        </div>
    );
    
}

export default UpdateTask;
