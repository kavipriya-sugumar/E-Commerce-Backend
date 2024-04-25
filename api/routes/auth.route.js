import express from "express";
import { createUser } from "../controllers/auth.controller.js";
import { signin } from "../controllers/auth.controller.js";
<<<<<<< HEAD
import { google } from "../controllers/auth.controller.js";
import { getOtp } from "../controllers/auth.controller.js";
=======
// import { signinasguest } from "../controllers/auth.controller.js";
import { google } from "../controllers/auth.controller.js";
import { getOtp } from "../controllers/auth.controller.js";
// import { signupasguest } from "../controllers/auth.controller.js";
>>>>>>> 38a86b5f93c26ff8c37e60353da82fb9e9a88823

const router = express.Router();

//all the functionalities for the routes will be present in respective controller file

//signup route
router.post("/signup", createUser);
//signupasguest
// router.post("/signupasguest", signupasguest);
//signin route
<<<<<<< HEAD
router.post("/signin", signin);
=======
router.get("/signin", signin);
>>>>>>> 38a86b5f93c26ff8c37e60353da82fb9e9a88823
//get OTP
router.post("/getotp",getOtp);
//signinasguest route
// router.post("/signinasguest", signinasguest);
//google
router.post("/google", google);

export default router;
