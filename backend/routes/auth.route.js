import express from "express";
import { 
  login, 
  logout, 
  signup, 
  checkAuth, 
  updateProfile, 
  deleteProfile 
} from "../controllers/auth.controller.js";
import { getAllUsers } from "../controllers/auth.controller.js"; // Import getAllUsers function
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/check-auth", verifyToken, checkAuth);
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.put("/update-profile", verifyToken, updateProfile);
router.delete("/delete-profile", verifyToken, deleteProfile);
router.get("/users", getAllUsers); // New route to fetch all users

export default router;
