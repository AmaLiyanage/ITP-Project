import { Route, Routes, useLocation, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/authStore";
import UserNav from "./NavBar/UserNav";
import DashboardPage from "./pages/DashboardPage";
import AdminLayout from "./Admin/AdminLayout";
import { useEffect } from "react";

// User Components
import Vehicle from "./pages/Vehicle";
import VehicleCardView from "./pages/Vehicle/VehicleCardView";
import BrowseMaintenance from "./pages/maintenance/BrowseMaintenance";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
// Admin Components
import AdminDashboard from "./Admin/AdminDashboard";
import AdminSignUp from "./Admin/AdminSignUp";
import AdminLogin from "./Admin/AdminLogin";
import VehicleManagement from "./pages/Vehicle/VehicleManagement";
import MaintenanceManagement from "./pages/maintenance/MaintenanceManagement";
import AddMaintenance from "./components/maintenance/AddMaintenance";
import UpdateMaintenance from "./components/maintenance/UpdateMaintenance";
import VehicleDocumentManagement from "./pages/Vehicle/VehicleDocumentManagement";

// Common Components
import FloatingShape from "./components/FloatingShape";
import LoadingSpinner from "./components/LoadingSpinner";
import { Toaster } from "react-hot-toast";

// Protected Route Components
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const AdminProtectedRoute = ({ children }) => {
  // Temporarily bypassing authentication check
  return children;
  
  // Original authentication logic commented out
  /*
  const { user, isAuthenticated } = useAuthStore();
  if (!isAuthenticated || !user?.isAdmin) {
    return <Navigate to="/adminlogin" replace />;
  }
  return children;
  */
};

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");
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
        {!isAdminRoute && <UserNav />}

        <main className={`${!isAdminRoute ? 'pt-20' : ''}`}>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/adminlogin" element={<AdminLogin />} />
            <Route path="/adminsignup" element={<AdminSignUp />} />
            

            {/* Protected user routes */}
            <Route path="/" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="/vehicle" element={<ProtectedRoute><Vehicle /></ProtectedRoute>} />
            <Route path="/vehicle-cards" element={<VehicleCardView />} />
            <Route path="/browse-maintenance" element={<ProtectedRoute><BrowseMaintenance /></ProtectedRoute>} />
            

            {/* Protected admin routes */}
            <Route path="/admin" element={<AdminProtectedRoute><AdminLayout /></AdminProtectedRoute>}>
              <Route index element={<AdminDashboard />} />
              <Route path="vehicles" element={<VehicleManagement />} />
              <Route path="maintenance" element={<MaintenanceManagement />} />
              <Route path="maintenance/add" element={<AddMaintenance />} />
              <Route path="maintenance/update/:id" element={<UpdateMaintenance />} />
              <Route path="documents" element={<VehicleDocumentManagement />} />
            </Route>
            
            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </>
  );
}

export default App;
