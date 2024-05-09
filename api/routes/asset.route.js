import express from "express";
import { verifyToken, verifyTokenAndAdmin } from "../utils/verifyUser.js";
import { assetsByCategory, createAsset, deleteFiles, getAllAssets, getAssetsById, updateAsset,  } from "../controllers/asset.controller.js";
import { uploadFiles } from "../utils/s3UploadClient.js";

const router = express.Router();

router.post("/createAsset/:categoryId",verifyTokenAndAdmin,uploadFiles, createAsset);
router.get("/getAssets/:assetId",getAssetsById);
router.delete("/deleteasset/:assetId",verifyTokenAndAdmin, deleteFiles);
router.get("/getByCategory/:id",assetsByCategory)
router.get("/getAllAssets", getAllAssets);
router.put("/updateAssets/:assetId",verifyTokenAndAdmin,  updateAsset);

export default router;
