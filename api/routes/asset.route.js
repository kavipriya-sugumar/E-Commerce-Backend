import express from "express";
import { verifyToken ,verifyTokenAndAdmin} from "../utils/verifyUser.js";
import { createAsset, getAssetsById } from "../controllers/asset.controller.js";
import { deleteAsset } from "../controllers/asset.controller.js";
import { getAssets } from "../controllers/asset.controller.js";
import { editAssets } from "../controllers/asset.controller.js";

const router = express.Router();

router.post("/createAsset",verifyTokenAndAdmin, verifyToken, createAsset);
router.get("/getAssets/:id",getAssetsById);
router.delete("/deleteasset/:assetId",verifyTokenAndAdmin, verifyToken, deleteAsset);
router.get("/getAssets", getAssets);
router.put("/editAssets/:assetId",verifyTokenAndAdmin, verifyToken, editAssets);

export default router;
