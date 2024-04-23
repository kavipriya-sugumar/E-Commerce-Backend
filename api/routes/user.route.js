import express from "express";
import { test } from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";
import { deleteUser } from "../controllers/user.controller.js";
import { logout } from "../controllers/user.controller.js";
import { getUsers } from "../controllers/user.controller.js";
// import { getAllGuestUsers } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/test", test);
//delete account functionality route
router.delete("/delete/:userId", deleteUser);
//logout functionality route
router.post("/logout", logout);
//get users information in admin side
router.get("/getusers", verifyToken, getUsers);
//get all guest users
// router.get("/getallguestusers", verifyToken, getAllGuestUsers);

export default router;
