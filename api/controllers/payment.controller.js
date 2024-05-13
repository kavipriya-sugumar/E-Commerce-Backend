import Razorpay from 'razorpay';
import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();

export const RazorOrder=async (req,res)=>{
    try {
        const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_API_KEY_ID,
            key_secret:process.env.RAZORPAY_KEY_SECRET
        });
    
        const options= req.body;
        const order= await razorpay.orders.create(options);
         if(!order){
            return res.status(500).send("Error");
         }
         res.json(order);
        
    } catch (error) {
        console.log(error);
        res.status(500).send("Error");
        
    }
}



export const RazorValidate = async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    
    // Constructing the message
    const message = `${razorpay_order_id}|${razorpay_payment_id}`;
    
    // Generating signature
    const generated_signature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
                                      .update(message)
                                      .digest('hex');

    // Logging
    console.log("Generated Signature:", generated_signature);
    console.log("Received Signature:", razorpay_signature);

    // Comparing signatures
    if (generated_signature !== razorpay_signature) {
        return res.status(400).json({ message: "Transaction is not legit!" });
    }

    // If signatures match, returning success response
    res.json({
        message: "success",
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id
    });
}