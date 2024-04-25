import User from "../models/user.model.js";
import UserAsGuest from "../models/userasguest.model.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

//signup Functionality
export const signup = async (req, res, next) => {
  const { name, email, phone, password, confirmpassword } = req.body;

  if (
    !name ||
    !email ||
    !phone ||
    !password ||
    !confirmpassword ||
    name === "" ||
    email === "" ||
    phone === "" ||
    password === "" ||
    confirmpassword === ""
  ) {
    next(errorHandler(400, "All fields are required"));
  }

  if (password !== confirmpassword) {
    next(errorHandler(400, "Password do not match"));
  }

  const hashedPassword = bcryptjs.hashSync(password, 10);

  const newUser = new User({
    name,
    email,
    phone,
    password: hashedPassword,
    confirmpassword: hashedPassword,
  });
  try {
    await newUser.save();
    res.json("Signup successful");
  } catch (error) {
    next(error);
  }
};


//signin
export const signin = async (req, res, next) => {
  const { email, password, confirmpassword } = req.body;

  if (!email || !password || !email === "" || password === "") {
    next(errorHandler(400, "All fields are required"));
  }
  try {
    const validUser = await User.findOne({ email });
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


//signin as guest

export const signinasguest = async (req, res, next) => {
  const { name, phone } = req.body;

  if (!name || !phone || !name === "" || phone === "") {
    next(errorHandler(400, "All fields are required"));
  }
  try {
    const validGuestname = await UserAsGuest.findOne({ name });
    if (!validGuestname) {
      return next(errorHandler(404, "Invalid name"));
    }
    const validGuestPhone = await UserAsGuest.findOne({ phone });
    if (!validGuestPhone) {
      return next(errorHandler(400, "Phone number not exist"));
    }
    const token = jwt.sign({ id: validGuestname._id }, process.env.JWT_SECRET);

    //to hide the password from the returned signin information and return the same for security purpose
    //separating password and rest of the information and sending the rest.
    const {
      password: pass,
      confirmpassword: confirmpassword,
      ...rest
    } = validGuestname._doc;

    res
      .status(200)
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .json(rest);
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
