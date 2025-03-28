import React, { useEffect, useState } from "react";
import axios from "axios";
import Task from "./Task";
import "./TaskDetails.css";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const URL = "http://localhost:5000/tasks";

const fetchHandler = async () => {
  return await axios.get(URL).then((res) => res.data);
};

function TaskDetails() {
  const [tasks, setTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [noResults, setNoResults] = useState(false);

  // Fetch tasks on component mount
  useEffect(() => {
    fetchHandler().then((data) => setTasks(data.tasks));
  }, []);

  // Generate PDF report
  const generatePDF = () => {
    const doc = new jsPDF({ orientation: "landscape" });
    doc.text("Task Report", 14, 14);

    const columns = ["ID", "Task Name", "Description", "Deadline", "Status", "Assigned Employee"];

    const rows = tasks.map((task) => [
      task._id,
      task.taskName,
      task.taskDescription,
      new Date(task.deadline).toLocaleDateString(),
      task.status,
      task.employee ? task.employee.name : "Unassigned",
    ]);

    autoTable(doc, {
      head: [columns],
      body: rows,
      startY: 20,
    });

    doc.save("Task_Report.pdf");
  };

  // Handle search query and filter tasks
  const handleSearch = () => {
    fetchHandler().then((data) => {
      const filteredTasks = data.tasks.filter((task) =>
        Object.values(task).some((field) =>
          field?.toString().toLowerCase().includes(searchQuery.toLowerCase())
        )
      );

      setTasks(filteredTasks);
      setNoResults(filteredTasks.length === 0);
    });
  };

  return (
    <div className="TDD-container">
      <h1 className="TDD-heading">Task Details</h1>
      <button className="TDD-download-btn" onClick={generatePDF}>Download Report</button>
  
      
      <input
        className="TDD-search-input"
        onChange={(e) => setSearchQuery(e.target.value)}
        type="text"
        name="search"
        placeholder="Search Task Details"
      />
      <button className="TDD-search-btn" onClick={handleSearch}>Search</button>
  
      
      {noResults ? (
        <div className="TDD-search-message">
          <p>No Task Found</p>
        </div>
      ) : (
        <div>
        
          {tasks.length === 0 ? (
            <p className="TDD-no-tasks">No tasks found!</p>
          ) : (
            <table className="TDD-table">
              <thead>
                <tr>
                  <th className="TDD-th">ID</th>
                  <th className="TDD-th">Task Name</th>
                  <th className="TDD-th">Task Description</th>
                  <th className="TDD-th">Deadline</th>
                  <th className="TDD-th">Status</th>
                  <th className="TDD-th">Assigned Employee</th>
                  <th className="TDD-th">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <Task key={task._id} task={task} />
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
  
}

export default TaskDetails;
