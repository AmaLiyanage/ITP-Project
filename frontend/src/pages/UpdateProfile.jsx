import React, { useState, useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios"; 
import FloatingShape from "../components/FloatingShape";
import { toast } from "react-hot-toast"; // Import toast

function Profile() {
  const { user, updateUser, logout } = useAuthStore();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("••••••••••"); 
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);  // Show loading indicator

    const confirmUpdateToast = toast.custom((t) => (
      <div className={`toast-confirmation ${t.visible ? "visible" : ""}`}>
        <p>Are you sure you want to update your profile?</p>
        <div className="toast-actions">
          <button
            onClick={async () => {
              toast.dismiss(t.id); // Dismiss the confirmation toast
              try {
                const updatedData = { name, email, password: password === "••••••••••" ? undefined : password };  
                await updateUser(updatedData);
                toast.success("Profile updated successfully!");
                setTimeout(() => navigate("/dashboard"), 1000);
              } catch (error) {
                console.error("Error updating profile:", error);
                toast.error("Error updating profile");
              } finally {
                setLoading(false);  // Hide loading indicator
              }
            }}
          >
            Yes
          </button>
          <button
            onClick={() => toast.dismiss(t.id)} 
          >
            No
          </button>
        </div>
      </div>
    ));
  };

  const handleDeleteProfile = async () => {
    const confirmDeleteToast = toast.custom((t) => (
      <div className={`toast-confirmation ${t.visible ? "visible" : ""}`}>
        <p>Are you sure you want to delete your account? This action is irreversible!</p>
        <div className="toast-actions">
          <button
            onClick={async () => {
              toast.dismiss(t.id); // Dismiss the confirmation toast
              try {
                const response = await axios.delete("http://localhost:5000/api/auth/delete-profile", { withCredentials: true });
                console.log(response.data);
                toast.success("Profile deleted successfully!");
                logout(); 
                navigate("/signup");
              } catch (error) {
                console.error("Error deleting profile:", error);
                toast.error("Error deleting profile. Please try again.");
              }
            }}
          >
            Yes
          </button>
          <button
            onClick={() => toast.dismiss(t.id)} 
          >
            No
          </button>
        </div>
      </div>
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900 flex items-center justify-center relative overflow-hidden">
      {/* Floating Shapes for UI */}
      <FloatingShape color="bg-green-500" size="w-64 h-64" top="-5%" left="10%" delay={0} />
      <FloatingShape color="bg-emerald-500" size="w-48 h-48" top="70%" left="80%" delay={5} />
      <FloatingShape color="bg-lime-500" size="w-32 h-32" top="40%" left="-10%" delay={2} />
    
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full mx-auto mt-10 p-8 bg-gray-900 bg-opacity-80 backdrop-filter backdrop-blur-lg rounded-xl shadow-2xl border border-gray-800"
      >
        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-600 text-transparent bg-clip-text">
          Profile
        </h2>

        <motion.div
          className="p-4 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <form onSubmit={handleSubmit}>
            <div className="text-gray-300">
              <div className="mb-4">
                <label htmlFor="name" className="font-semibold">Name:</label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-transparent text-white border-b-2 border-gray-500 outline-none w-full"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="email" className="font-semibold">Email:</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-transparent text-white border-b-2 border-gray-500 outline-none w-full"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="password" className="font-semibold">New Password:</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-transparent text-white border-b-2 border-gray-500 outline-none w-full"
                  placeholder="Enter new password"
                />
              </div>

              <div className="mt-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white 
                    font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700
                    focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                >
                  {loading ? "Updating..." : "Save Changes"}
                </motion.button>
              </div>

              {/* Delete Profile Button */}
              <div className="mt-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={handleDeleteProfile}
                  className="w-full py-3 px-4 bg-gradient-to-r from-red-500 to-red-700 text-white 
                    font-bold rounded-lg shadow-lg hover:from-red-600 hover:to-red-800
                    focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                >
                  Delete Account
                </motion.button>
              </div>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default Profile;
