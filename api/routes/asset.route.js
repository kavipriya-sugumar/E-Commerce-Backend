import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import { assetsByCategory, createAsset, deleteFiles, getAllAssets, getAssetsById, updateAsset,  } from "../controllers/asset.controller.js";
import { uploadFiles } from "../utils/s3UploadClient.js";

const router = express.Router();

router.post("/createAsset/:categoryId",uploadFiles, createAsset);
router.get("/getAssets/:assetId",getAssetsById);
router.delete("/deleteasset/:assetId", deleteFiles);
router.get("/getByCategory/:categoryId",assetsByCategory)
router.get("/getAllAssets", getAllAssets);
router.put("/updateAssets/:assetId",  updateAsset);

export default router;
