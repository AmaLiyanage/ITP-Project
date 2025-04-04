import bcryptjs from "bcryptjs"; 
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js"; 
import { User } from "../models/user.model.js"; 


export const signup = async (req, res) => {
  const { email, password, name } = req.body; // Destructuring user data from the request body

  try {
    
    if (!email || !password || !name) {
      throw new Error("All fields are required");
    }
 
    const userAlreadyExists = await User.findOne({ email });
 
    if (userAlreadyExists) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }
 
    const hashedPassword = await bcryptjs.hash(password, 10);

    const user = new User({ email, password: hashedPassword, name });
    await user.save();

    // Generate a token for the user and set it as a cookie
    generateTokenAndSetCookie(res, user._id);

    // Send a success response with user details (excluding password)
    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: { ...user._doc, password: undefined },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body; 

  try {
    
    const user = await User.findOne({ email });
 
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    // Generate a token and set it as a cookie
    generateTokenAndSetCookie(res, user._id);

    // Update the user's last login time
    user.lastLogin = new Date();
    await user.save(); 

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      user: { ...user._doc, password: undefined }, 
    });
  } catch (error) {
    console.log("Error in login ", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

export const logout = async (req, res) => {
  res.clearCookie("token"); // Clear the token cookie to log out the user
  res.status(200).json({ success: true, message: "Logged out successfully" });
};

// Check if the user is authenticated (by verifying token)
export const checkAuth = async (req, res) => {
  try {
    // Find the user based on the user ID stored in the token (req.userId)
    const user = await User.findById(req.userId).select("-password"); 

    if (!user) {
      return res.status(400).json({ success: false, message: "User not found" });
    }

    // Send the user details if authenticated
    res.status(200).json({ success: true, user });
  } catch (error) {
    
    console.log("Error in checkAuth ", error);
    res.status(400).json({ success: false, message: error.message });
  }
};


export const updateProfile = async (req, res) => {
  const { name, email, password } = req.body; 

  try {
    
    if (!name && !email && !password) {
      return res.status(400).json({ success: false, message: "At least one field (name, email, password) is required to update." });
    }

    // Find the user by userId from the token
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
    console.log("Error updating profile:", error);
    res.status(500).json({ success: false, message: "An error occurred while updating profile" });
  }
};

export const deleteProfile = async (req, res) => {
  try {
    
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    await User.findByIdAndDelete(req.userId);

    // Clear the token cookie
    res.clearCookie("token");

    res.status(200).json({ success: true, message: "Account deleted successfully" });
  } catch (error) {
    
    console.error('Error deleting profile:', error);
    res.status(500).json({ success: false, message: "An error occurred while deleting profile" });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    res.status(200).json({ success: true, users });
  } catch (error) {
    
    console.error("Error fetching users:", error);
    res.status(500).json({ success: false, message: "An error occurred while fetching users" });
  }
};
