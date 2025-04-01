const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const path = require('path');

// Import routes
const vehicleRoutes = require('./routes/vehicleRoutes');
const maintenanceRoutes = require('./routes/maintenanceRoute');
const userRoutes = require('./routes/userRoutes');
const vehicleDocumentRoutes = require('./routes/vehicleDocumentRoutes');

dotenv.config();
connectDB();

const app = express();

// Middlewares
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(cookieParser());
app.use(express.json());

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/auth', userRoutes);
app.use('/api/vehicle-documents', vehicleDocumentRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
