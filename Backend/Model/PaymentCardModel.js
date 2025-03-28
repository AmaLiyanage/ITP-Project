
const mongoose = require("mongoose");
const schema = mongoose.Schema;

const PaymentCardSchema = new schema ({

      cardNumber : {
              type:String,
              require:true
      },

      cardHolderName : {
        type:String,
        require:true
      },

      expiryDate : {
        type:String,
        require:true
      },

      cvv : {
        type:String,
        require:true
        }
});

module.exports = mongoose.model(
    "PaymentCardModel",
    PaymentCardSchema

);