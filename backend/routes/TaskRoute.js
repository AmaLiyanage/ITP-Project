import express from "express";
import * as TaskController from "../controllers/TaskControllers.js";

const router = express.Router();

router.get("/", TaskController.getAllTasks);
router.post("/", TaskController.addTasks);
router.get("/:id", TaskController.getById);
router.put("/:id", TaskController.updateTask);
router.delete("/:id", TaskController.deleteTask);

export default router;