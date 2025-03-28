
const express = require("express");
const router = express.Router();

const PaymentCardModel = require("../Model/PaymentCardModel");
const PaymentCardDetailsControler = require("../Controlers/PaymentCardDetailsControler");

router.post("/",PaymentCardDetailsControler.AddPaymentCardDetails);
router.get("/",PaymentCardDetailsControler.getAllPaymentCardDetails);
router.get("/:id",PaymentCardDetailsControler.getPaymentCardById);
router.put("/:id",PaymentCardDetailsControler.UpdatePaymentCardDetails);
router.delete("/:id",PaymentCardDetailsControler.DeletePaymentCardDetails);

module.exports = router;