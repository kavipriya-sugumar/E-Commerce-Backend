<<<<<<< HEAD
// import mongoose from "mongoose";

// const PaymentSchema = new mongoose.Schema(
//   {
//     amount: {
//       type: String,
//     },
//     order_id: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref:"Orders"
//     },
//     razorpay_payment_id: {
//       type: String,
//       default: null,
//     },
//     razorpay_order_id: {
//       type: String,
//       default: null,
//     },
//     razorpay_signature: {
//       type: String,
//       default: null,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// const PaymentModel = mongoose.model("PaymentModel", PaymentSchema);
// export default PaymentModel;
=======
import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema(
  {
    amount: {
      type: String,
    },
    order_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref:"Orders"
    },
    razorpay_payment_id: {
      type: String,
      default: null,
    },
    razorpay_order_id: {
      type: String,
      default: null,
    },
    razorpay_signature: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const PaymentModel = mongoose.model("PaymentModel", PaymentSchema);
export default PaymentModel;
>>>>>>> 38a86b5f93c26ff8c37e60353da82fb9e9a88823
