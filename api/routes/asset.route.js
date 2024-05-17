import express from "express";
import { verifyToken, verifyTokenAndAdmin } from "../utils/verifyUser.js";
import {getAssetsByCategory, createAsset, deleteAsset,  downloadAsset, getAssetById, updateAsset,  } from "../controllers/asset.controller.js";
import {  uploadFiles } from "../utils/s3UploadClient.js";
 
const router = express.Router();
 
router.post("/createAsset/:categoryId", uploadFiles, createAsset);
router.get("/getAssets/:assetId",getAssetById);
router.delete("/deleteasset/:assetId", deleteAsset);
router.get("/getByCategory/:id",getAssetsByCategory);
// router.get("/getAllAssets", getAllAssets);
router.put("/updateAsset/:categoryId/:assetId", updateAsset);
router.get("/:assetId/files/:fileIndex/download",downloadAsset);
 
export default router;