import mongoose from "mongoose";

const { Schema } = mongoose;

const PaymentCardSchema = new Schema({
  cardNumber: {
    type: String,
    required: true,
  },
  cardHolderName: {
    type: String,
    required: true,
  },
  expiryDate: {
    type: String,
    required: true,
  },
  cvv: {
    type: String,
    required: true,
  },
});

const PaymentCard = mongoose.model("PaymentCard", PaymentCardSchema);
export default PaymentCard;
