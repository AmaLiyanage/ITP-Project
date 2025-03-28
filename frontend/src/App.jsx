import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import AdminNav from './NavBar/AdminNav';
import EmployeeDetails from './Admin/EmployeeDetails';
import AddEmployee from './Admin/AddEmployee';
import UpdateEmployee from './Admin/UpdateEmployeeDetails';
import DeleteEmployee from './Admin/DeleteEmployeeDetails';
import TaskDetails from './Admin/TaskDetails';
import UpdateTask from './Admin/UpdateTaskDetails';
import DeleteTask from './Admin/DeleteTask';
import AddTask from './Admin/AddTask';

function App() {
  return (
    <Router>
      <div>
        <AdminNav /> {/* This will always be visible */}
        <Routes>
          <Route path="/" element={<h1>Welcome to Admin Dashboard</h1>} />
          <Route path="/admindashboard" element={<h1>Dashboard Page</h1>} />
          <Route path="/adminaddFAQs" element={<h1>Add FAQs Page</h1>} />
          <Route path="/adminDisplayFAQ" element={<h1>FAQs Page</h1>} />
          <Route path="/adminAddEmployee" element={<AddEmployee/>} />
          <Route path="/adminEmployeeDetails" element={<EmployeeDetails/>} />
          <Route path="/adminEmployeeDetails/:id" element={<UpdateEmployee/>} />
          <Route path="/adminEmployeeDetails/delete/:id" element={<DeleteEmployee/>} />
          <Route path="/adminAddTask" element={<AddTask/>} />
          <Route path="/adminTaskDetails" element={<TaskDetails/>} />
          <Route path="/adminTaskDetails/:id" element={<UpdateTask/>} />
          <Route path="/adminTaskDetails/delete/:id" element={<DeleteTask/>} />
          
          
        </Routes>
      </div>
    </Router>
  );
}

export default App;
