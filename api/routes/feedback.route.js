import express from "express";
import { sendFeedback} from "../controllers/feedback.controller.js";
 
const router = express.Router();
 
 
router.post("/userFeedback", sendFeedback);
 
export default router;