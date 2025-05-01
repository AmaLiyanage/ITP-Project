//7Pii0U93enxU2hiM-password

const express=require("express");
const mongoose=require("mongoose");
const route=require("./Route/EmployeeRoute");
const route1=require("./Route/TaskRoute");
const app = express();
const cors = require("cors");
//Middleware
app.use(express.json());
app.use(cors());
app.use("/employees",route);
app.use("/tasks",route1);


mongoose.connect("mongodb+srv://employeeManager:7Pii0U93enxU2hiM@cluster0.k1w9z.mongodb.net/")
.then(()=> console.log("Connect to MongoDB"))
.then(()=>{
    app.listen(5000);
})
.catch((err)=>console.log((err)));