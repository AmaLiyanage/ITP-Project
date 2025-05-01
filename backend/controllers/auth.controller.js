import bcryptjs from "bcryptjs";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import { User } from "../models/user.model.js";


export const signup = async (req, res) => {
  // Extract email, password, and name from the request body
  const { email, password, name } = req.body;

  try {
    if (!email || !password || !name) {
      throw new Error("All fields are required");
    }
    const userAlreadyExists = await User.findOne({ email });
    if (userAlreadyExists) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    // Hash the password before saving to the database
    const hashedPassword = await bcryptjs.hash(password, 10); //10 salt rounds
    const user = new User({ email, password: hashedPassword, name });
    await user.save();

    // Generate JWT token and set it in an HTTP-only cookie
    generateTokenAndSetCookie(res, user._id);

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: { ...user._doc, password: undefined }, // remove password from response
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};


export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user in the database by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    // Update the lastLogin field with the current time
    user.lastLogin = new Date();

    // Save the updated user
    await user.save();
    generateTokenAndSetCookie(res, user._id);

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      user: { ...user._doc, password: undefined },
    });
  } catch (error) {
    console.log("Error in login:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

export const logout = async (req, res) => {
  // Clear the cookie named 'token' to log the user out
  res.clearCookie("token");
  res.status(200).json({ success: true, message: "Logged out successfully" });
};


export const checkAuth = async (req, res) => {
  try {
    // Find the user by ID set by authentication middleware
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res.status(400).json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    console.log("Error in checkAuth:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};


export const updateProfile = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (!name && !email && !password) {
      return res.status(400).json({
        success: false,
        message: "At least one field (name, email, password) is required to update.",
      });
    }

    // Find the user by ID from the token
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (name) user.name = name;
    if (email) user.email = email;

    if (password) user.password = await bcryptjs.hash(password, 10);

    await user.save();
    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: { ...user._doc, password: undefined },
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ success: false, message: "An error occurred while updating profile" });
  }
};

export const deleteProfile = async (req, res) => {
  try {
    // Find and delete user by ID
    const user = await User.findByIdAndDelete(req.userId);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Clear token cookie after deleting account
    res.clearCookie("token");

    res.status(200).json({ success: true, message: "Account deleted successfully" });
  } catch (error) {
    console.error("Error deleting profile:", error);
    res.status(500).json({ success: false, message: "An error occurred while deleting profile" });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    // Find all users and exclude password from result
    const users = await User.find({}, "-password");
    res.status(200).json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch users", error: error.message });
  }
};
