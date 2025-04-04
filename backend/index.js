import express from "express";
import dotenv from "dotenv";
import cors from "cors";// Importing CORS middleware to handle cross-origin requests
import cookieParser from "cookie-parser";
import path from "path";

import { connectDB } from "./db/connectDB.js";
import authRoutes from "./routes/auth.route.js";
import faqRoutes from "./routes/FAQ.route.js"; 

dotenv.config();//load .env
const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();// Getting the current directory path

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json()); // Allows  to parse incoming requests:req.body
app.use(cookieParser()); // Allows  to parse incoming cookies

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/faqs", faqRoutes); 

// Serve frontend in production
if (process.env.NODE_ENV === "production") {
  // Serve static files (HTML, CSS, JS) from the 'frontend/dist' directory
  app.use(express.static(path.join(__dirname, "/frontend/dist")));
  // Handle all other GET requests by returning the 'index.html' of the frontend
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}

app.listen(PORT, () => {
  connectDB();// Establish the connection
  console.log(`Server is running on port: ${PORT}`);
});
