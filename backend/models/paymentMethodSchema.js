const { required } = require("joi");
const mongoose = require("mongoose");

const paymentMethodSchema = new mongoose.Schema({
  cash: {
    type: Boolean,
    required: true,
  },

});
module.exports = mongoose.model("PaymentMethod", paymentMethodSchema);
