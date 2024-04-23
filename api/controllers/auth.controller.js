import User from "../models/user.model.js";
// import UserAsGuest from "../models/userasguest.model.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import Otp from "../models/otp.model.js";
import sendEmail from "../utils/nodemailer.js";
import utils from "../utils/generateOtp.js"


export const getOtp = async (req, res) => {
  try {
    if (!req.body?.email) return res.json({ status: 406, message: "Email is required" });
    const otp = utils.generateOtp();
    // time management start
    const localTime = new Date().toLocaleTimeString('en-IN', {
      timeZone: 'Asia/Kolkata'
    });
 
    const currentTime = new Date();
    const futureTime = new Date(currentTime.getTime() + 1 * 60000);
    const expiredTime = futureTime.toLocaleTimeString()
    // time management end
      let sendEmailOtp = await sendEmail(req.body?.email, otp);
      if(sendEmail){
        let verifyOtp = await Otp.findOne({email:req?.body?.email})
        if(verifyOtp){
          const updateOtp = await Otp.updateOne({email:req?.body?.email}, {$set:{otp:otp, createdTime:localTime, expiredTime:expiredTime}})
          if(updateOtp){
            return res.json({status:200,message: "OTP sent successfully" })
          }else{
            return res.json({status: 406, message: "OTP creation failed"})
          }
        }
        const createOtp = await Otp.create({email:req?.body?.email, otp:otp,createdTime:localTime, expiredTime:expiredTime})
        if(createOtp){
          res.json({ status: 200, message: "OTP sent successfully" });
        }else{
          return res.json({status: 406, message: "OTP creation failed"})
        }
      }else{
        return res.json("otp trigger failed")
      }
  } catch (error) {
      res.status(500).json({ status: 500, message: error.message });
  }
};
 
//signUp
 
export const createUser = async(req, res)=>{
 
try {
const { name, email, phone, password, confirmpassword, otp } = req.body;
const hashedPassword = bcryptjs.hashSync(password, 10);
if(!name || !email || !phone || !password || !confirmpassword || !otp) return res.json({status:406, status:"values required"})
if(password !== confirmpassword) return res.json({status:406, message:"confirmPassword is wrong"})
const checkUser = await User.findOne({email:email})
if(checkUser) return res.json({status:406, message:"this email id already have a account"})
 
let verifyOtp = await Otp.findOne({email:req?.body?.email, otp:req?.body?.otp})
const currentTime = new Date().toLocaleTimeString('en-IN', {
  timeZone: 'Asia/Kolkata'
});
 
if(currentTime > verifyOtp?.expiredTime) return res.json({status:200, message:"time verification time up please wait 5 minutes after resend otp"})
 
if(verifyOtp) {
  const createUser = await User.create({
    name : name,
    email:email,
    phone:phone,
    password:hashedPassword,
    confirmpassword:hashedPassword,
    verifiedEmail:true
  })
  if(createUser){
      return res.json(createUser)
  }else{
  return res.json({status:406, message:"user created failed"})
  }
}else{
  return res.json({status:406, message:"invaid otp"})
}
  } catch (err) {
    return res.json({status:500, message:err.message})
  }
 
}




//Signin functionality
//signin
export const signin = async (req, res, next) => {
  const { email, password, confirmpassword } = req.body;

  if (!email || !password || !email === "" || password === "") {
    next(errorHandler(400, "All fields are required"));
  }
  try {
    const validUser = await User.findOne({ email, });
    if (!validUser) {
      return next(errorHandler(404, "User not found"));
    }
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler(400, "Invalid password"));
    }
    const token = jwt.sign(
      { id: validUser._id, isAdmin: validUser.isAdmin },
      process.env.JWT_SECRET
    );

    if(token){
      return res.json({"token":token})
    }else{
      return res.json("err")
    }
  } catch (error) {
    next(error);
  }
};

//signup using google
export const google = async (req, res, next) => {
  const { email, name } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      const { password, ...rest } = user._doc;
      res
        .status(200)
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .json(rest);
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
      const newUser = new User({
        name,
        email,
        password: hashedPassword,
      });
      await newUser.save();
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
      const { password, ...rest } = newUser._doc;
      res
        .status(200)
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};

