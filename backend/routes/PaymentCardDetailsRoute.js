import express from "express";
import {
  AddPaymentCardDetails,
  getAllPaymentCardDetails,
  getPaymentCardById,
  DeletePaymentCardDetails
} from "../controllers/PaymentCardDetailsControler.js";

const router = express.Router();

router.post("/", AddPaymentCardDetails);
router.get("/", getAllPaymentCardDetails);
router.get("/:id", getPaymentCardById);
router.delete("/:id", DeletePaymentCardDetails);

export default router;
