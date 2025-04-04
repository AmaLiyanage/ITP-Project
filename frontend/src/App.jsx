import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import Vehicle from "./pages/Vehicle";
import FAQs from "./pages/FAQs";
import AdminDashboard from "./Admin/AdminDashboard";
import AdminSignUp from "./Admin/AdminSignUp";
import AdminLogin from "./Admin/AdminLogin";
import AdminAddFAQ from "./Admin/AdminAddFAQ";
import UpdateProfile from "./pages/UpdateProfile";
import LoadingSpinner from "./components/LoadingSpinner";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/authStore";
import { useEffect } from "react";
import UserNav from "./NavBar/UserNav";
import AdminNav from "./NavBar/AdminNav";
import AdminDisplayFAQs from "./Admin/AdminDisplayFAQs";
import AdminUpdateFaqs from "./Admin/AdminUpdateFaqs";

// Protect user routes (redirect to login if not authenticated)
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

//  Protect admin routes (redirect to admin login if not authenticated)
const AdminProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) {
    return <Navigate to="/adminlogin" replace />;
  }
  return children;
};

function App() {
  const { isCheckingAuth, checkAuth, isAuthenticated } = useAuthStore();
  const location = useLocation(); // Get current route

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Show loading spinner if authentication is still being checked
  if (isCheckingAuth) return <LoadingSpinner />;

  return (
    <div>
      {/* Show AdminNav for admin routes, UserNav for user routes */}
      {location.pathname.startsWith("/admin") ? <AdminNav /> : <UserNav />}

      <Routes>
        {/*  User Signup & Login */}
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/*  Admin Signup & Login */}
        <Route path="/adminsignup" element={<AdminSignUp />} />
        <Route path="/adminlogin" element={<AdminLogin />} />

        {/* User Dashboard (protected) */}
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/vehicle" element={<ProtectedRoute><Vehicle /></ProtectedRoute>} />
        <Route path="/faqs" element={<ProtectedRoute><FAQs /></ProtectedRoute>} />
        
        {/*  Admin Dashboard (protected) */}
        <Route path="/admindashboard" element={<AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute>} />
        <Route path="/adminaddFAQs" element={<AdminProtectedRoute><AdminAddFAQ /></AdminProtectedRoute>} />
        <Route path="/adminDisplayFAQ" element={<AdminProtectedRoute><AdminDisplayFAQs /></AdminProtectedRoute>} />
         <Route path="/adminupdateFAQ" element={<AdminProtectedRoute><AdminUpdateFaqs /></AdminProtectedRoute>} />

        {/*  Profile Update Page (only for users) */}
        <Route path="/profileUpdate" element={<ProtectedRoute><UpdateProfile /></ProtectedRoute>} />

        {/*  Fallback for unknown routes */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>

      <Toaster />
    </div>
  );
}

export default App;
