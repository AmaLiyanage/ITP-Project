import React from 'react'
import { Link } from 'react-router-dom';
import "./AdminNav.css";

const AdminNav = () => {
  return (
    <nav className="navbar">
        <div className="nav-links">
        <Link to="/admindashboard" className="nav-item">Dashboard</Link>
        <Link to="/adminaddFAQs" className="nav-item">Add FAQs</Link>
        <Link to="/adminDisplayFAQ" className="nav-item">FAQs</Link>
        <Link to="/adminAddEmployee" className="nav-item">Add Employee</Link>
        <Link to="/adminEmployeeDetails" className="nav-item">Employee Details</Link>
        <Link to="/adminAddTask" className="nav-item">Add Task</Link>
        <Link to="/adminTaskDetails" className="nav-item">Task Details</Link>
        </div>
    </nav>
  )
}

export default AdminNav;
