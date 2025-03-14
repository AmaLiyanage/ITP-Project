import express from "express";
import { addFAQ, getFAQs, getFAQById, updateFAQ, deleteFAQ } from "../controllers/FAQ.controller.js";

const router = express.Router();

router.post("/", addFAQ); // Add FAQ
router.get("/", getFAQs); // Get all FAQs
router.get("/:id", getFAQById); // Get FAQ by ID
router.put("/:id", updateFAQ); // Update FAQ
router.delete("/:id", deleteFAQ); // Delete FAQ

export default router;
