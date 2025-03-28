const express = require("express");
const router = express.Router();
const BookingControler = require("../Controlers/BookingControler");

router.post("/", BookingControler.addBooking);
router.get("/", BookingControler.getAllBookings);
router.get("/:id", BookingControler.getBookingById);
router.put("/:id", BookingControler.updateBooking);
router.delete("/:id", BookingControler.deleteBooking);
router.post("/directions", BookingControler.getDirections)

module.exports = router;
