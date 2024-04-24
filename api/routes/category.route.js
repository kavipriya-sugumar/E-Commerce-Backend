import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import { createCategory, deleteCategory, getAllCategory, getCategoryById, updateCategory } from "../controllers/category.controller.js";

const router = express.Router();

router.post("/createCategory", createCategory);
router.get("/getAllCategory", getAllCategory);
router.get("/getCategory/:id",getCategoryById) 
router.delete("/deleteCategory/:categoryId", deleteCategory);
router.put("/editCategory/:categoryId", updateCategory);

export default router;
