import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuthStore } from "./store/authStore";

// Auth Pages
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";

// User Pages
import UserAddFeedback from "./pages/UserAddFeedback";
import UserMyFeedbacks from "./pages/UserMyFeedbacks";
import UserUpdateFeedback from "./pages/UserUpdateFeedback";
import UserViewFeedback from "./pages/UserViewFeedback";

// Common Components
import UserNav from "./NavBar/UserNav";
import LoadingSpinner from "./components/LoadingSpinner";
import { Toaster } from "react-hot-toast";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  const location = useLocation();
  const { isCheckingAuth, checkAuth, user } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            theme: {
              primary: '#4CAF50',
            },
          },
          error: {
            duration: 4000,
            theme: {
              primary: '#E57373',
            },
          },
        }}
      />
      <div className="min-h-screen bg-white text-gray-800">
        <UserNav />
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />

          {/* Protected Routes */}
          <Route path="/" element={
            
              <UserViewFeedback />
            
          } />
          <Route path="/add-feedback" element={
            <ProtectedRoute>
              <UserAddFeedback />
            </ProtectedRoute>
          } />
          <Route path="/feedback" element={
            <ProtectedRoute>
              <UserMyFeedbacks />
            </ProtectedRoute>
          } />
          <Route path="/update-feedback/:id" element={
            <ProtectedRoute>
              <UserUpdateFeedback />
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </>
  );
}

export default App;
