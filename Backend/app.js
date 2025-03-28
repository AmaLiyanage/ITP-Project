const express = require("express");
const mongoose = require("mongoose");
const CONFIG = require("./config/config"); 


require("dotenv").config(); 

const router = require("./Route/BookingRoute");
const routers = require("./Route/PaymentCardDetailsRoute");


const app = express();
const cors = require("cors");

// Middleware
app.use(cors());
app.use(express.json()); // Add middleware to parse JSON requests
app.use("/bookings", router);
app.use("/paymentCards",routers);


// Use MongoDB connection from environment variables
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://admin:JM8dk6C23TXZNo6a@cluster0.ii510.mongodb.net/";

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(CONFIG.port, () => {
      console.log(`🚀 Server running on port ${CONFIG.port}`);
    });
  })
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

 

