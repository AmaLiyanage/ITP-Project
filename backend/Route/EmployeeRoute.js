const express = require("express");
const router = express.Router();
//Insert Model
const Employee=require("../Model/EmployeeModel");
//Insert User Controller
const EmployeeController=require("../Controlers/EmployeeControllers");

router.get("/",EmployeeController.getAllEmployees);
router.post("/",EmployeeController.addEmployees);
router.get("/:id",EmployeeController.getById);
router.put("/:id",EmployeeController.updateEmployee);
router.delete("/:id",EmployeeController.deleteEmployee);


//export
module.exports=router;