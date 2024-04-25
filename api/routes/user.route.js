import express from "express";
import { test } from "../controllers/user.controller.js";
import { verifyToken,verifyUser,verifyTokenAndAdmin } from "../utils/verifyUser.js";
import { deleteUser } from "../controllers/user.controller.js";
import { logout } from "../controllers/user.controller.js";
import { getUsers } from "../controllers/user.controller.js";
// import { getAllGuestUsers } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/test", test);
//delete account functionality route
<<<<<<< HEAD
router.delete("/delete",verifyUser, deleteUser);
=======
router.delete("/delete/:userId", deleteUser);
>>>>>>> 38a86b5f93c26ff8c37e60353da82fb9e9a88823
//logout functionality route
router.post("/logout",verifyUser, logout);
//get users information in admin side
router.get("/getusers", verifyTokenAndAdmin, getUsers);
//get all guest users
// router.get("/getallguestusers", verifyToken, getAllGuestUsers);

export default router;
