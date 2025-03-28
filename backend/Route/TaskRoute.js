const express = require("express");
const router = express.Router();
//Insert Model
const Task=require("../Model/TaskModel");
//Insert User Controller
const TaskController=require("../Controlers/TaskControllers");

router.get("/",TaskController.getAllTasks);
router.post("/",TaskController.addTasks);
router.get("/:id",TaskController.getById);
router.put("/:id",TaskController.updateTask);
router.delete("/:id",TaskController.deleteTask);


//export
module.exports=router;