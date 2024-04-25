<<<<<<< HEAD
// import express from "express";
// import { verifyToken,verifyUser, verifyTokenAndAdmin} from "../utils/verifyUser.js";
// import { checkout } from "../controllers/payment.controller.js";
// const router = express.Router();

// router.post("/checkout",verifyUser, checkout);
// export default router;
=======
import express from "express";
import { verifyToken,verifyUser, verifyTokenAndAdmin} from "../utils/verifyUser.js";
import { checkout } from "../controllers/payment.controller.js";
const router = express.Router();

router.post("/checkout",verifyUser, checkout);
export default router;
>>>>>>> 38a86b5f93c26ff8c37e60353da82fb9e9a88823
