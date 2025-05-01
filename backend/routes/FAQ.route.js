import express from "express";
import { addFAQ, getFAQs, getFAQById, updateFAQ, deleteFAQ } from "../controllers/FAQ.controller.js";

const router = express.Router();

router.post("/", addFAQ); 
router.get("/", getFAQs); 
router.get("/:id", getFAQById); 
router.put("/:id", updateFAQ); 
router.delete("/:id", deleteFAQ); 

export default router;
