import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import emailjs from 'emailjs-com';
import './DeleteTask.css';

function DeleteTask() {
    const [task, setTask] = useState(null);
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [emailError, setEmailError] = useState("");
    const history = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        const fetchTaskAndEmployees = async () => {
            try {
                // Fetch task details by ID
                const response = await axios.get(`http://localhost:5000/tasks/${id}`);
                const taskData = response.data.task;
                setTask(taskData);

                // Fetch all employees
                const employeesResponse = await axios.get('http://localhost:5000/employees');
                setEmployees(employeesResponse.data.employees);

                setLoading(false);
            } catch (error) {
                console.error('Error fetching task or employees:', error);
                setLoading(false);
            }
        };

        fetchTaskAndEmployees();
    }, [id]);

    const sendEmail = async (employeeEmail, employeeName) => {
        const templateParams = {
            taskName: task.taskName,
            employeeName: employeeName,
            taskDescription: task.taskDescription,
            deadline: task.deadline,
            status: task.status,
            employee_email: employeeEmail,
        };

        try {
            await emailjs.send("service_9ck9zyj", "template_3i4gkih", templateParams, "EYpS1R9pXsmUR4Odm");
            console.log("Email sent successfully");
            window.alert("Email notification sent to " + templateParams.employee_email);
        } catch (error) {
            console.error("Error sending email:", error);
            window.alert("Failed to send email notification.");
        }
    };

    const deleteTask = async () => {
        if (!task) {
            window.alert("No task found.");
            return;
        }

        const taskConfirmed = window.confirm("Are you sure you want to delete this task?");
        if (taskConfirmed) {
            try {
                const deleteResponse = await axios.delete(`http://localhost:5000/tasks/${id}`);
                console.log("Task deleted successfully:", deleteResponse);

                // Send email notification to assigned employee
                const assignedEmployee = employees.find(emp => emp._id === task.employee._id);
                if (assignedEmployee) {
                    sendEmail(assignedEmployee.email, assignedEmployee.name);
                }

                window.alert("Task deleted successfully!");
                history("/adminTaskDetails");
            } catch (error) {
                console.error("Error deleting task:", error);
                window.alert("Error deleting task. Please try again.");
            }
        }
    };

    if (loading) {
        return <p>Loading task details...</p>;
    }

    return (
        <div className="dtd-div1">
    <h1 className="dtd-h1">Delete Task</h1>
    {task ? (
        <div className="dtd-task-details">
            <p className="dtd-task-info"><strong>Task Name:</strong> {task.taskName}</p>
            <p className="dtd-task-info"><strong>Task Description:</strong> {task.taskDescription}</p>
            <p className="dtd-task-info"><strong>Deadline:</strong> {task.deadline}</p>
            <p className="dtd-task-info"><strong>Status:</strong> {task.status}</p>
            <p className="dtd-task-info"><strong>Assigned Employee:</strong> {task.employee?.name || "N/A"}</p>

            {emailError && <p className="dtd-error">{emailError}</p>}

            <button onClick={deleteTask} className="dtd-delete-btn">Delete Task</button>
        </div>
    ) : (
        <p className="dtd-task-not-found">Task not found or could not be loaded.</p>
    )}
</div>
    );
}

export default DeleteTask;
