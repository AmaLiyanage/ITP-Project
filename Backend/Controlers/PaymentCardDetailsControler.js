
const PaymentCard = require("../Model/PaymentCardModel");

const AddPaymentCardDetails = async (req,res,next) => {

    const { cardNumber ,cardHolderName ,expiryDate, cvv } = req.body;

    let paymentCards;

    try{

        paymentCards = new PaymentCard({
            cardNumber,
            cardHolderName,
            expiryDate,
            cvv

        });

        paymentCards = await paymentCards.save();

        return res.status(200).json({message: "Payment card details save successfully ",paymentCards});

    }catch(error)
    {
        return res.status(404).json({message:"your payment card details cannot save"});
    }
    
};

const getAllPaymentCardDetails = async (req,res,next) => {

    let paymentCards;

    try{
        paymentCards = await PaymentCard.find();

        return res.status(200).json({ paymentCards });

    }catch(error)
    {
        return res.status(404).json({message:"Cannot find payment card details"});

    }
    
};

const getPaymentCardById = async (req,res,next) => {
      
    const id = req.params.id;

    let paymentCards;

    try{
        paymentCards = await PaymentCard.findById(id);

        return res.status(200).json({paymentCards});

    }catch(error)
    {
        return res.status(404).json({message:"Cannot find payment card details"});
    }

};

const UpdatePaymentCardDetails = async (req,res,next) => {

    const id = req.params.id;

    const { cardNumber ,cardHolderName ,expiryDate, cvv } = req.body;

    let paymentCards;
    
    try{
         
        paymentCards = await PaymentCard.findByIdAndUpdate(id,
            {cardNumber:cardNumber,cardHolderName:cardHolderName,expiryDate:expiryDate,cvv :cvv });

            return res.status(200).json({message:"Update details successfully", paymentCards});

    }catch(error)
    {
        return res.status(404).json({message:"Cannot update payment card details"});
    }
    
};

const DeletePaymentCardDetails = async (req,res,next) => {
    
    const id = req.params.id;

    let paymentCards;

    try{
        paymentCards = await PaymentCard.findByIdAndDelete(id);
        return res.status(200).json({message:"Details delete successfully "});
    }catch(error)
    {
        return res.status(404).json({message:"payment card details cannot delete"});
    }

};

exports.AddPaymentCardDetails = AddPaymentCardDetails;
exports.getAllPaymentCardDetails = getAllPaymentCardDetails;
exports.getPaymentCardById = getPaymentCardById;
exports.UpdatePaymentCardDetails = UpdatePaymentCardDetails;
exports.DeletePaymentCardDetails = DeletePaymentCardDetails;