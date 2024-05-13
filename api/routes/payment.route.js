import express from "express";
import { verifyToken,verifyUser, verifyTokenAndAdmin} from "../utils/verifyUser.js";
import { RazorOrder,RazorValidate } from "../controllers/payment.controller.js";
const router = express.Router();

router.post("/order",RazorOrder );
router.post("/ordervalidate",RazorValidate);
export default router;
