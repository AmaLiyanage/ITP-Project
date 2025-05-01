import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import "./NavBar.css"; 

const UserNav = () => {
  const { isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login"); // Redirect to login page after logout
  };

  return (
    <nav className="navbar">
      {isAuthenticated ? (
        <div className="nav-links">
          <Link to="/dashboard" className="nav-item">Dashboard</Link>
          <Link to="/profileUpdate" className="nav-item">Profile</Link> 
          <Link to="/vehicles" className="nav-item">Vehicles</Link>
          <Link to="/browse-maintenance" className="nav-item">Maintenance</Link>
          <Link to="/AddCard" className="nav-item">Payment Card</Link>
          <Link to="/feedback/view" className="nav-item">Feedbacks</Link>
          <Link to="/faqs" className="nav-item">FAQs</Link>
          <button onClick={handleLogout} className="nav-item logout-button">Logout</button>
        </div>
      ) : (
        <div className="nav-links">
          <Link to="/login" className="nav-item">Login</Link>
          <Link to="/signup" className="nav-item">Sign Up</Link>

        </div>
      )}
    </nav>
  );
};

export default UserNav;
