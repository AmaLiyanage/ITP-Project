import express from "express";
import * as EmployeeController from "../controllers/EmployeeControllers.js";

const router = express.Router();

router.get("/", EmployeeController.getAllEmployees);
router.post("/", EmployeeController.addEmployees);
router.get("/:id", EmployeeController.getById);
router.put("/:id", EmployeeController.updateEmployee);
router.delete("/:id", EmployeeController.deleteEmployee);

export default router;