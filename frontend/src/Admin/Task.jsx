import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Task.css";

function Task({ task }) {
  const { _id, taskName, taskDescription, deadline, status, employee } = task;
  const navigate = useNavigate();

  const handleDelete = () => {
    navigate(`/deleteTask/${_id}`);
  };

  return (
    <tr>
      <td className="task-name">{taskName}</td>
      <td className="task-description">{taskDescription}</td>
      <td className="task-deadline">{new Date(deadline).toLocaleDateString()}</td>
      <td className="task-status">{status}</td>
      <td className="task-employee">{employee ? employee.name : "Unassigned"}</td>
      <td className="task-actions">
        <Link className="task-b1" to={`/adminTaskDetails/${_id}`}>Update</Link>
        <button className="task-b2" onClick={handleDelete}>Delete</button>
      </td>
    </tr>
  );
}

export default Task;
