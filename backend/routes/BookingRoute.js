import express from "express";
import {
  addBooking,
  getAllBookings,
  getBookingById,
  updateBooking,
  deleteBooking,
  getDirections
} from "../controllers/BookingControler.js";

const router = express.Router();

router.post("/", addBooking);
router.get("/", getAllBookings);
router.get("/:id", getBookingById);
router.put("/:id", updateBooking);
router.delete("/:id", deleteBooking);
router.post("/directions", getDirections);

export default router;
