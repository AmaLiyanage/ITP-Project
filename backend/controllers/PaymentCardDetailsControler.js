import PaymentCard from "../models/PaymentCardModel.js";

// Create
export const AddPaymentCardDetails = async (req, res, next) => {
  const { cardNumber, cardHolderName, expiryDate, cvv } = req.body;

  try {
    const paymentCards = new PaymentCard({
      cardNumber,
      cardHolderName,
      expiryDate,
      cvv,
    });

    const savedCard = await paymentCards.save();

    return res.status(200).json({
      message: "Payment card details saved successfully",
      paymentCards: savedCard,
    });
  } catch (error) {
    return res.status(404).json({ message: "Your payment card details cannot be saved" });
  }
};

// Read All
export const getAllPaymentCardDetails = async (req, res, next) => {
  try {
    const paymentCards = await PaymentCard.find();
    return res.status(200).json({ paymentCards });
  } catch (error) {
    return res.status(404).json({ message: "Cannot find payment card details" });
  }
};

// Read One
export const getPaymentCardById = async (req, res, next) => {
  const id = req.params.id;

  try {
    const paymentCards = await PaymentCard.findById(id);
    return res.status(200).json({ paymentCards });
  } catch (error) {
    return res.status(404).json({ message: "Cannot find payment card details" });
  }
};

// Update
export const UpdatePaymentCardDetails = async (req, res, next) => {
  const id = req.params.id;
  const { cardNumber, cardHolderName, expiryDate, cvv } = req.body;

  try {
    const updatedCard = await PaymentCard.findByIdAndUpdate(
      id,
      {
        cardNumber,
        cardHolderName,
        expiryDate,
        cvv,
      },
      { new: true }
    );

    if (!updatedCard) {
      return res.status(404).json({ message: "Payment card not found" });
    }

    return res.status(200).json({
      message: "Payment card details updated successfully",
      paymentCards: updatedCard,
    });
  } catch (error) {
    return res.status(404).json({ message: "Payment card details cannot be updated" });
  }
};

// Delete
export const DeletePaymentCardDetails = async (req, res, next) => {
  const id = req.params.id;

  try {
    await PaymentCard.findByIdAndDelete(id);
    return res.status(200).json({ message: "Details deleted successfully" });
  } catch (error) {
    return res.status(404).json({ message: "Payment card details cannot be deleted" });
  }
};
