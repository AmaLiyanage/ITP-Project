import React, { useState, useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "react-hot-toast";
import { FaUser, FaEnvelope, FaKey, FaTrashAlt } from "react-icons/fa";

function Profile() {
  const { user, updateUser, logout } = useAuthStore();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (password && password !== confirmPassword) {
      toast.error("Passwords do not match");
      setLoading(false);
      return;
    }

    toast.custom((t) => (
      <div className="bg-white text-gray-800 p-4 rounded-lg shadow-lg max-w-sm w-full">
        <p>Are you sure you want to update your profile?</p>
        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                const updatedData = {
                  name,
                  email,
                  ...(password && { password }),
                };
                await updateUser(updatedData);
                toast.success("Profile updated successfully!");
                setTimeout(() => navigate("/dashboard"), 1000);
              } catch (error) {
                console.error("Error updating profile:", error);
                toast.error("Error updating profile");
              } finally {
                setLoading(false);
              }
            }}
            className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
          >
            Yes
          </button>
          <button
            onClick={() => {
              toast.dismiss(t.id);
              setLoading(false);
            }}
            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
          >
            No
          </button>
        </div>
      </div>
    ));
  };

  const handleDeleteProfile = async () => {
    toast.custom((t) => (
      <div className="bg-white text-gray-800 p-4 rounded-lg shadow-lg max-w-sm w-full">
        <p>Are you sure you want to delete your account? This action is irreversible!</p>
        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                await axios.delete("http://localhost:5000/api/auth/delete-profile", {
                  withCredentials: true,
                });
                toast.success("Profile deleted successfully!");
                logout();
                navigate("/signup");
              } catch (error) {
                console.error("Error deleting profile:", error);
                toast.error("Error deleting profile. Please try again.");
              }
            }}
            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
          >
            Yes
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            No
          </button>
        </div>
      </div>
    ));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md border border-gray-400 rounded-lg shadow-xl p-6 bg-white"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-green-600">
          Profile
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-1 flex items-center gap-2">
              <FaUser className="text-gray-600" />
              Name
            </label>
            <input
              type="text"
              value={name}
              disabled
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded border border-gray-400 bg-gray-100 outline-none text-black"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1 flex items-center gap-2">
              <FaEnvelope className="text-gray-600" />
              Email
            </label>
            <input
              type="email"
              value={email}
              disabled
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 rounded border border-gray-400 bg-gray-100 outline-none text-black"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1 flex items-center gap-2">
              <FaKey className="text-gray-600" />
              New Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
              className="w-full px-3 py-2 rounded border border-gray-400 outline-none text-black"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1 flex items-center gap-2">
              <FaKey className="text-gray-600" />
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className="w-full px-3 py-2 rounded border border-gray-400 outline-none text-black"
            />
          </div>

          <div className="space-y-3 mt-6">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              className="w-full py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700"
            >
              {loading ? "Updating..." : "Save Changes"}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              type="button"
              onClick={() => navigate("/dashboard")}
              className="w-full py-3 bg-gray-600 text-white font-bold rounded-lg hover:bg-gray-700"
            >
              Cancel
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              type="button"
              onClick={handleDeleteProfile}
              className="w-full py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 flex items-center justify-center gap-2"
            >
              <FaTrashAlt />
              Delete Account
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default Profile;
