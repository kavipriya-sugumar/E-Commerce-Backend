import express from "express";
import { verifyToken, verifyTokenAndAdmin,verifyUser } from "../utils/verifyUser.js";
import { assetsByCategory, createAsset, getAllAssets, getAssetsById, updateAsset,downloadAsset,deleteAsset  } from "../controllers/asset.controller.js";
import { uploadFiles } from "../utils/s3UploadClient.js";

const router = express.Router();

router.post("/createAsset/:categoryId",verifyTokenAndAdmin,uploadFiles, createAsset);
router.get("/getAssets/:assetId",getAssetsById);
router.delete("/deleteasset/:assetId",verifyTokenAndAdmin, deleteAsset);
router.get("/getByCategory/:id",assetsByCategory)
router.get("/getAllAssets", getAllAssets);
router.put("/updateAsset/:categoryId/:assetId",uploadFiles, updateAsset);
router.get("/:assetId/files/:fileIndex/download",verifyUser,downloadAsset);

export default router;
