import express from "express";
<<<<<<< HEAD
import { verifyToken, verifyTokenAndAdmin } from "../utils/verifyUser.js";
import { assetsByCategory, createAsset, deleteFiles, getAllAssets, getAssetsById, updateAsset,  } from "../controllers/asset.controller.js";
import { uploadFiles } from "../utils/s3UploadClient.js";

const router = express.Router();

router.post("/createAsset/:categoryId",verifyTokenAndAdmin,uploadFiles, createAsset);
router.get("/getAssets/:assetId",getAssetsById);
router.delete("/deleteasset/:assetId",verifyTokenAndAdmin, deleteFiles);
router.get("/getByCategory/:categoryId",assetsByCategory)
router.get("/getAllAssets", getAllAssets);
router.put("/updateAssets/:assetId",verifyTokenAndAdmin,  updateAsset);
=======
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
>>>>>>> 38a86b5f93c26ff8c37e60353da82fb9e9a88823

export default router;
