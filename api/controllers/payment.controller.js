// import Razorpay from 'razorpay';
// import dotenv from 'dotenv';
// import PaymentModel from '../models/payment.model.js';

// import crypto from 'crypto';

// dotenv.config();

// const instance = new Razorpay({
//     key_id: process.env.RAZORPAY_API_KEY_ID|| "",
//     key_secret: process.env.RAZORPAY_KEY_SECRET,
// });


// export const checkout =async (req,res,next)=>{
//     const {amount}=Number(req.body *100);

//     const options={
//         amount :amount,
//         currency:"INR",
//         receipt:"recp1"
//     };
//    const order = await instance.orders.create(options)
//    console.log(order);
//    return res.status(200).json({
//     success: true,
//     order,
//    });

// }


// export const paymentVerification =async (req,res,next)=>{
//     const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
//     req.body;

//   const body_data = razorpay_order_id + "|" + razorpay_payment_id;

//   const expect = crypto
//     .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "")
//     .update(body_data)
//     .digest("hex");

//   const isValid = expect === razorpay_signature;

//   if (isValid) {
//     console.log("payment is successful");

//     await PaymentModel.findOneAndUpdate(
//       { order_id: razorpay_order_id },
//       {
//         $set: { razorpay_payment_id, razorpay_order_id, razorpay_signature },
//       }
//     );
   
//     return;
//   } else {
    
//    return res.status(200).json({
//     success: true,
//     order,
//    });

// }
// }

