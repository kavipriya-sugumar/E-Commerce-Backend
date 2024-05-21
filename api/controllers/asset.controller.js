import mongoose from "mongoose";
import Asset from "../models/asset.model.js"
import Category from "../models/category.model.js";
import { bytesToSize, convertToBytes } from "../utils/bytesToSize.js";
import { errorHandler } from "../utils/error.js";
import { deleteFileFromS3, generateS3FileUrl, getSignedUrl, s3, uploadFiles } from "../utils/s3UploadClient.js";
import { getFileExtension } from "../utils/fileExtension.js";
 
 
 
// Create asset
export const createAsset = async (req, res, next) => {
  console.log(req);
  try {
if (!req.files) res.status(400).json({ error: 'No files were uploaded.' })
    const uploadedFiles=req.files;
    const {assetName,assetID,price,description,quads,totalTriangles,vertices,materials,rigged,fileFormats}=req.body;
    const categoryId=req.params.categoryId;
    const assetCategory=await Category.findById(categoryId);
if(!assetCategory){
  res.status(404).json({message:"Category not found"})
}
console.log(uploadedFiles);
const folderName = `assets/${Date.now()}`;
let totalSizeBytes = 0;
 
 
const files =  uploadedFiles.map((file) => {
  const fileSizeBytes = file.size;
  totalSizeBytes += fileSizeBytes;
 
return{
  name: file.originalname,
  type: file.mimetype,
  size: bytesToSize(file.size),
  format: getFileExtension(file.originalname),
  url:generateS3FileUrl(file.key),
  key:file.key
 };
});
 
const asset = new Asset({
  assetName,
  assetID,
  price,
  description,
  quads,
  totalTriangles,
  vertices,
  materials,
  rigged,
  fileFormats,
  category:assetCategory,
  files,
  totalFileSize:bytesToSize(totalSizeBytes)
})
 
const createdAssets = await Asset.create(asset);
if(!createdAssets.ok){
  console.log("res");
}
console.log(asset);
res.status(201).json({
    message: 'Successfully uploaded ' + req.files.length + ' files!',
    files: req.files
  })
}
 
  catch (error) {
      console.error('Error creating assets:', error);
 
      if (error.name === 'ValidationError') {
        return res.status(400).json({ error: 'Validation error. Please check your input data.' });
      }
 
      next(errorHandler(error));
   
  }
};
 
 
 
 
 
 
// Update asset
export const updateAsset = async (req, res, next) => {
  try {
    const { categoryId, assetId } = req.params;
 
    // Check if the category exists
    const assetCategory = await Category.findById(categoryId);
    if (!assetCategory) {
      return res.status(404).json({ message: "Category not found" });
    }
 
    // Retrieve existing asset data from MongoDB
    const existingAsset = await Asset.findById(assetId);
    if (!existingAsset) {
      return res.status(404).json({ message: "Asset not found" });
    }
 
    // Delete existing files from the Wasabi bucket
    for (const file of existingAsset.files) {
      await deleteFileFromS3(file.key);
    }
 
    // Upload new files to the Wasabi bucket
    await uploadFiles(req, res, async (err) => {
      if (err) {
        console.error("Error uploading files:", err);
        return res.status(500).json({ error: "Failed to upload files" });
      }
 
      const uploadedFiles = req.files || [];
     
      // Update asset metadata with new files information
      const updatedFiles = uploadedFiles.map((file) => ({
        name: file.originalname,
        type: file.mimetype,
        format: getFileExtension(file.originalname),
        size: bytesToSize(file.size),
        url: generateS3FileUrl(file.key),
        key: file.key
      }));
      const totalFileSize = uploadedFiles.reduce((acc, file) => acc + file.size, 0);
 
      // Update asset metadata in MongoDB
      existingAsset.assetName = req.body.assetName;
      existingAsset.price = req.body.price;
      existingAsset.description = req.body.description;
      existingAsset.quads = req.body.quads;
      existingAsset.totalTriangles = req.body.totalTriangles;
      existingAsset.vertices = req.body.vertices;
      existingAsset.materials = req.body.materials;
      existingAsset.rigged = req.body.rigged;
      existingAsset.fileFormats = req.body.fileFormats;
      existingAsset.category = assetCategory;
      existingAsset.files = updatedFiles;
      existingAsset.totalFileSize = bytesToSize(totalFileSize);
 
      const updatedAsset = await existingAsset.save();
 
      // Respond with success message
      res.status(200).json({
        message: "Asset updated successfully",
        updatedAsset
      });
    });
  } catch (error) {
    console.error("Error updating asset:", error);
    next(error);
  }
};
 
 
 
// Delete asset
export const deleteAsset = async (req, res, next) => {
  try {
    const {assetId} = req.params;
 
    // Retrieve existing asset data from MongoDB
    const existingAsset = await Asset.findById(assetId);
    if (!existingAsset) {
      return res.status(404).json({ message: "Asset not found" });
    }
 
    // Delete files from the Wasabi bucket
    for (const file of existingAsset.files) {
      await deleteFileFromS3(`${file.key}`);
    }
 
    // Delete asset entry from MongoDB
    await Asset.findByIdAndDelete(assetId);
 
    // Respond with success message
    res.status(200).json({ message: "Asset deleted successfully" });
  } catch (error) {
    console.error("Error deleting asset:", error);
    next(error);
  }
};
 
 
 
 
 
 
 
// Get Single asset
// Get Single asset
 
export const getAssetById = async (req, res) => {
  try {
    const { assetId } = req.params;
   
    const asset = await Asset.findById(assetId);
 
    if (!asset) {
      return res.status(404).json({ message: 'Asset not found' });
    }
 
    // Generate signed URL for the GLB file
    // const glbFile = asset.files.find(file => file.format === 'glb');
    // if (!glbFile) {
    //   return res.status(400).json({ message: 'GLB file not found for this asset' });
    // }
 
    // const signedGlbUrl = await getSignedUrl(glbFile.key);
    // console.log(signedGlbUrl);
 
    // Find the first JPEG, JPG, or PNG file and generate signed URL if present
    const imageFile = asset.files.find(file => ['jpg', 'jpeg', 'png'].includes(file.format));
    let signedImageUrl = null;
    if (imageFile) {
      signedImageUrl = await getSignedUrl(imageFile.key);
    }
 
    console.log(signedImageUrl);
 
    // Return asset metadata and signed URLs
    res.json({
      id: asset._id,
      assetName: asset.assetName,
      assetID: asset.assetID,
      price: asset.price,
      description: asset.description,
      quads: asset.quads,
      totalTriangles: asset.totalTriangles,
      vertices: asset.vertices,
      materials: asset.materials,
      rigged: asset.rigged,
      totalFileSize: asset.totalFileSize,
      fileFormats: asset.fileFormats,
      category: asset.category,
      // signedImageUrl: signedGlbUrl, // The signed URL for the GLB file
      signedImageSingleUrl: signedImageUrl // Signed URL for the first JPEG, JPG, or PNG file
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getSignedGlbUrl = async (req, res) => {
  try {
    const { assetId } = req.params;
 
    const asset = await Asset.findById(assetId);
 
    if (!asset) {
      return res.status(404).json({ message: 'Asset not found' });
    }
 
    // Find GLB file for the asset
    const glbFile = asset.files.find(file => file.format === 'glb');
    if (!glbFile) {
      return res.status(400).json({ message: 'GLB file not found for this asset' });
    }
 
    // Generate signed URL for the GLB file
    const signedGlbUrl = await getSignedUrl(glbFile.key);
 
    // Return signed URL for GLB file
    res.json({ signedGlbUrl });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
 
 
 
// Asset Download
export const downloadAsset = async (req, res) => {
  try {
    const { assetId } = req.params;
    const asset = await Asset.findById(assetId);
 
    if (!asset) {
      return res.status(404).json({ message: "Asset not found" });
    }
 
    const signedUrls = {};
 
    for (const file of asset.files) {
      const { format, key } = file;
 
      const params = {
        Bucket: process.env.WASABI_BUCKET,
        Key: key,
        Expires: 500,
      };
 
      const url = await s3.getSignedUrlPromise('getObject', params);
      signedUrls[format] = url;
    }
 
    res.json(signedUrls); // Send signed URLs mapped by file format
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to serve asset files" });
  }
};
 
 
 
 
 
 
// get assets by category
export const getAssetsByCategory = async (req, res, next) => {
  try {
    const { categoryId } = req.params;
 
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    // Retrieve assets by category ID from MongoDB
    const assets = await Asset.find({ category: categoryId });
 
    // Generate signed URLs for JPG/PNG files and attach to assets
    const assetsWithSignedUrls = await Promise.all(assets.map(async (asset) => {
      const imageFile = asset.files.find(file => ['jpg', 'jpeg', 'png'].includes(file.format));
      if (imageFile) {
        const signedUrl = await getSignedUrl(imageFile.key);
        // Include files array only if an image file exists
        return {
          ...asset.toObject(),
          imageUrl: signedUrl,
          categoryName:category.categoryName,
          files: undefined // Exclude files array from assets without image files
        };
      }
      // If no image file found, include all metadata without imageUrl and files array
      return {
        ...asset.toObject(),
        imageUrl: null,
        files: undefined
      };
    }));
 
    // Respond with assets containing signed image URLs and other metadata
    res.status(200).json(assetsWithSignedUrls);
  } catch (error) {
    console.error("Error getting assets by category:", error);
    next(error);
  }
};
 
 
 
 
// Get all assets
export const getAllAssets = async (req, res, next) => {
  try {
    // Retrieve all assets from MongoDB
    const assets = await Asset.find();
 
    // Generate signed URLs for JPG/PNG files and attach to assets
    const assetsWithSignedUrls = await Promise.all(assets.map(async (asset) => {
      const imageFile = asset.files.find(file => ['jpg', 'jpeg', 'png'].includes(file.format));
      if (imageFile) {
        const signedUrl = await getSignedUrl(imageFile.key);
        // Include files array only if an image file exists
        return {
          ...asset.toObject(),
          imageUrl: signedUrl,
          files: undefined // Exclude files array from assets without image files
        };
      }
      // If no image file found, include all metadata without imageUrl and files array
      return {
        ...asset.toObject(),
        imageUrl: null,
        files: undefined
      };
    }));
 
    // Respond with assets containing signed image URLs and other metadata
    res.status(200).json(assetsWithSignedUrls);
  } catch (error) {
    console.error("Error getting all assets:", error);
    next(error);
  }
};