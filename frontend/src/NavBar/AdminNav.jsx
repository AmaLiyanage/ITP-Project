import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import "./NavBar.css";

const UserNav = () => {
  const { isAuthenticated, logout, user } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/adminlogin"); // Redirect to login page after logout
  };

  return (
    <nav className="navbar">
      {isAuthenticated ? (
        <div className="nav-links">
           <Link to="/admindashboard" className="nav-item">Dashboard</Link>
           <Link to="/adminaddFAQs" className="nav-item">Add FAQs</Link>
           <Link to="/adminDisplayFAQ" className="nav-item">FAQs</Link>
          <button onClick={handleLogout} className="nav-item logout-button">Logout</button>
        </div>
      ) : (
        <div className="nav-links">
          <Link to="/adminlogin" className="nav-item">Login</Link>
          <Link to="/adminsignup" className="nav-item">Sign Up</Link>
        </div>
      )}
    </nav>
  );
};

export default UserNav;
