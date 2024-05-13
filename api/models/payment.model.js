import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema(
  {
    razorpayDetails: {
    orderId: String,
    paymentId: String,
    signature: String,
  },
  success: Boolean,
  }
);

const PaymentModel = mongoose.model("PaymentModel", PaymentSchema);
export default PaymentModel;
