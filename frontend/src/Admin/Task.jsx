import React from "react";
import { Link } from "react-router-dom";
import "./Task.css";

function Task({ task }) {
  const { _id, taskName, taskDescription, deadline, status, employee } = task;

  return (
    <tr>
  <td className="task-id">{_id}</td>
  <td className="task-name">{taskName}</td>
  <td className="task-description">{taskDescription}</td>
  <td className="task-deadline">{new Date(deadline).toLocaleDateString()}</td>
  <td className="task-status">{status}</td>
  <td className="task-employee">{employee ? employee.name : "Unassigned"}</td>
  <td className="task-actions">
    <Link className="task-b1" to={`/adminTaskDetails/${_id}`}>Update</Link>
    <Link className="task-b2" to={`/adminTaskDetails/delete/${_id}`}>Delete</Link>
  </td>
</tr>

  );
}

export default Task;
