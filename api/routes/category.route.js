import express from "express";
import { verifyToken,verifyTokenAndAdmin } from "../utils/verifyUser.js";
import { createCategory, getCategoryById } from "../controllers/category.controller.js";
import { getCategory } from "../controllers/category.controller.js";
import { deleteCategory } from "../controllers/category.controller.js";
import { editCategory } from "../controllers/category.controller.js";

const router = express.Router();

router.post("/createCategory",verifyTokenAndAdmin, verifyToken, createCategory);
router.get("/getCategory", getCategory);
router.get("/getCategory/:id",getCategoryById) ///api/asset/getAssets?category=660a94246f6151fd1a190a6d
router.delete("/deleteCategory/:categoryId",verifyTokenAndAdmin, verifyToken, deleteCategory);
router.put("/editCategory/:categoryId",verifyTokenAndAdmin, verifyToken, editCategory);

export default router;
