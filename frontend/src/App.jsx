import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import FAQs from "./pages/FAQs";
import AdminDashboard from "./Admin/AdminDashboard";
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
import React from 'react';



// Vehicle Management
import VehicleManagement from "./pages/Vehicle/VehicleManagement";
import VehicleCardView from "./pages/Vehicle/VehicleCardView";
import VehicleDocumentManagement from "./pages/Vehicle/VehicleDocumentManagement";

// Maintenance Management
import MaintenanceManagement from "./pages/maintenance/MaintenanceManagement";
import BrowseMaintenance from "./pages/maintenance/BrowseMaintenance";

// Feedback Management
import UserAddFeedback from "./pages/UserAddFeedback";
import UserMyFeedbacks from "./pages/UserMyFeedbacks";
import UserUpdateFeedback from "./pages/UserUpdateFeedback";
import UserViewFeedback from "./pages/UserViewFeedback";
import AdminDisplayFeedback from "./Admin/AdminDisplayFeedback";

//Employee Management
import EmployeeDetails from './Admin/EmployeeDetails';
import AddEmployee from './Admin/AddEmployee';
import UpdateEmployee from './Admin/UpdateEmployeeDetails';
import DeleteEmployee from './Admin/DeleteEmployeeDetails';
import TaskDetails from './Admin/TaskDetails';
import UpdateTask from './Admin/UpdateTaskDetails';
import DeleteTask from './Admin/DeleteTask';
import AddTask from './Admin/AddTask';
import DeleteTaskConfirmation from "./Admin/DeleteTaskConfirmation";

//Booking Management
import AddBooking from './components/AddBooking/AddBooking';
import BookingDetails from './components/BookingDetails/BookingDetails'; 
import UpdateBooking from './components/UpdateBooking/UpdateBooking';
import DeleteBooking from './components/DeleteBooking/DeleteBooking';

//Payment Card details Management
import AddCard from './components/AddCard/AddCard';
import ViewCard from './components/CardDetails/ViewCard';
import DeleteCard from './components/DeleteCard/DeleteCard';

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
  const location = useLocation();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) return <LoadingSpinner />;

  return (
    <div>
      {/* Show AdminNav for admin routes, UserNav for user routes */}
      {location.pathname.startsWith("/admin") ? <AdminNav /> : <UserNav />}
      
      <div className="pt-16"> {/* Added padding-top here */}
        <Routes>
          {/* User Signup & Login */}
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Admin Signup & Login */}
          <Route path="/adminlogin" element={<AdminLogin />} />

          {/* User Dashboard (protected) */}
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/faqs" element={<ProtectedRoute><FAQs /></ProtectedRoute>} />
          
          {/* Vehicle Management Routes */}
          <Route path="/admin/vehicles" element={<AdminProtectedRoute><VehicleManagement /></AdminProtectedRoute>} />
          <Route path="/vehicles" element={<ProtectedRoute><VehicleCardView /></ProtectedRoute>} />
          <Route path="/admin/vehicles/documents" element={<AdminProtectedRoute><VehicleDocumentManagement /></AdminProtectedRoute>} />        {/* Maintenance Management Routes */}
        <Route path="/admin/maintenance" element={<AdminProtectedRoute><MaintenanceManagement /></AdminProtectedRoute>} />
        <Route path="/browse-maintenance" element={<ProtectedRoute><BrowseMaintenance /></ProtectedRoute>} />

          {/* Feedback Management Routes */}
          <Route path="/feedback/add" element={<ProtectedRoute><UserAddFeedback /></ProtectedRoute>} />
          <Route path="/feedback/my-feedbacks" element={<ProtectedRoute><UserMyFeedbacks /></ProtectedRoute>} />
          <Route path="/feedback/update/:id" element={<ProtectedRoute><UserUpdateFeedback /></ProtectedRoute>} />
          <Route path="/feedback/view" element={<ProtectedRoute><UserViewFeedback /></ProtectedRoute>} />
          
          {/* Admin Dashboard & Features (protected) */}
          <Route path="/admindashboard" element={<AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute>} />
          <Route path="/adminaddFAQs" element={<AdminProtectedRoute><AdminAddFAQ /></AdminProtectedRoute>} />
          <Route path="/adminDisplayFAQ" element={<AdminProtectedRoute><AdminDisplayFAQs /></AdminProtectedRoute>} />
          <Route path="/adminupdateFAQ" element={<AdminProtectedRoute><AdminUpdateFaqs /></AdminProtectedRoute>} />
          <Route path="/admin/feedback" element={<AdminProtectedRoute><AdminDisplayFeedback /></AdminProtectedRoute>} />

          {/* Employee Management Routes */}
          <Route path="/adminAddEmployee" element={<AdminProtectedRoute><AddEmployee/></AdminProtectedRoute>} />
          <Route path="/adminEmployeeDetails" element={<AdminProtectedRoute><EmployeeDetails/></AdminProtectedRoute>} />
          <Route path="/adminEmployeeDetails/:id" element={<AdminProtectedRoute><UpdateEmployee/></AdminProtectedRoute>} />
          <Route path="/adminEmployeeDetails/delete/:id" element={<AdminProtectedRoute><DeleteEmployee/></AdminProtectedRoute>} />
          <Route path="/adminAddTask" element={<AdminProtectedRoute><AddTask/></AdminProtectedRoute>} />
          <Route path="/adminTaskDetails" element={<AdminProtectedRoute><TaskDetails/></AdminProtectedRoute>} />
          <Route path="/adminTaskDetails/:id" element={<AdminProtectedRoute><UpdateTask/></AdminProtectedRoute>} />
          <Route path="/adminTaskDetails/delete/:id" element={<AdminProtectedRoute><DeleteTask/></AdminProtectedRoute>} />
          <Route path="/deleteTask/:id" element={<DeleteTaskConfirmation />} />

          {/* Booking Management Routes */}
          <Route path="/AddBooking" element={<ProtectedRoute><AddBooking /></ProtectedRoute>} />
          <Route path="/BookingDetails" element={<ProtectedRoute><BookingDetails /></ProtectedRoute>} />
          <Route path="/BookingDetails/:id" element={<ProtectedRoute><UpdateBooking /></ProtectedRoute>} />
          <Route path="/DeleteBooking" element={<ProtectedRoute><DeleteBooking/></ProtectedRoute>}/>

          {/* Booking Management Routes */}
          <Route path = "/AddCard" element = {<ProtectedRoute><AddCard/></ProtectedRoute>}/>
          <Route path = "/ViewCard" element = {<ProtectedRoute><ViewCard/></ProtectedRoute>} />
          <Route path = "/DeleteCard" element = {<ProtectedRoute><DeleteCard/></ProtectedRoute>}/>
          
          {/* Profile Update Page (only for users) */}
          <Route path="/profileUpdate" element={<ProtectedRoute><UpdateProfile /></ProtectedRoute>} />

          {/* Fallback for unknown routes */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>

      <Toaster />
    </div>
  );
}

export default App;
