import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from 'url';
import fs from 'fs';
import bookingRoutes from "./routes/BookingRoute.js";
import paymentCardRoutes from "./routes/PaymentCardDetailsRoute.js";
import { CONFIG } from "./config/config.js";
import { connectDB } from "./db/connectDB.js";
import authRoutes from "./routes/auth.route.js";
import faqRoutes from "./routes/FAQ.route.js";
import vehicleRoutes from "./routes/vehicle.route.js";
import maintenanceRoutes from "./routes/maintenance.route.js";
import vehicleDocumentRoutes from "./routes/vehicleDocument.route.js";
import feedbackRoutes from "./routes/feedback.route.js";
import employeeRoutes from "./routes/EmployeeRoute.js";
import taskRoutes from "./routes/TaskRoute.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, 'uploads/documents');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/faqs", faqRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/maintenance", maintenanceRoutes);
app.use("/api/vehicle-documents", vehicleDocumentRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/bookings", bookingRoutes);
app.use("/paymentCards", paymentCardRoutes);

// Serve frontend in production
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "/frontend/dist")));
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
    });
}

app.listen(PORT, () => {
    connectDB();
    console.log(`Server is running on port: ${PORT}`);
});
