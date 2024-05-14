import mongoose from "mongoose";
import Asset from "../models/asset.model.js"
import Category from "../models/category.model.js";
import { bytesToSize, convertToBytes } from "../utils/bytesToSize.js";
import { errorHandler } from "../utils/error.js";
import { deleteFileFromS3, generateS3FileUrl, s3, uploadFiles } from "../utils/s3UploadClient.js";
import { getFileExtension } from "../utils/fileExtension.js";
 
 
 
// Create a Single Asset
export const createAsset = async (req, res, next) => {
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
 
 
 
 
 
 
// Get All Assets
export const getAllAssets = async (req, res, next) => {
  try {
    const assets = await Asset.find();
    res.status(200).json({ assets });
  } catch (error) {
    console.error('Error fetching assets:', error);
    next(errorHandler(error));
  }
};
 
 
 
 
 
 
 
// Delete Asset
export const deleteAsset = async (req, res, next) => {
  try {
    const { assetId } = req.params;
 
    const asset = await Asset.findById(assetId);
    if (!asset) {
      return res.status(404).json({ message: 'Asset not found' });
    }
 
    await Promise.all(asset.files.map(async (file) => {
      await deleteFileFromS3(file.key); // Implement deleteFileFromStorage function according to your storage mechanism
    }));
 
    await Asset.findByIdAndDelete(assetId);
 
    res.status(200).json({ message: 'Asset deleted successfully' });
  } catch (error) {
    console.error('Error deleting asset:', error);
    next(error);
  }
};
 
 
//get Assets by Category
export const assetsByCategory=async(req,res,next)=>{
  try {
    const categoryId  = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({ error: 'Invalid category ID' });
    }
 
    const assets = await Asset.find({ category: categoryId }).populate('category');
 
    res.status(200).json({ assets });
  } catch (error) {
    console.error('Error fetching assets by category:', error);
    next (errorHandler(error));
  }
};
 
 
 
 
//update assets  
export const updateAsset = async (req, res, next) => {
  try {
    
    const { assetId } = req.params;
    console.log(assetId);
    const { assetName, assetID, price, description, quads, totalTriangles, vertices, materials, rigged, fileFormats } = req.body;
    const categoryId = req.params.categoryId;
 
    const existingAsset = await Asset.findById(assetId);
    if (!existingAsset) {
      return res.status(404).json({ message: "Asset not found" });
    }
 
    await Promise.all(existingAsset.files.map(async (file) => {
      await deleteFileFromS3(file.key); // Implement deleteFileFromS3 function according to your storage mechanism
    }));
 
    let totalSizeBytes = 0;
    const files = req.files.map((file) => {
      const fileSizeBytes = file.size;
      totalSizeBytes += fileSizeBytes;
      return {
        name: file.originalname,
        type: file.mimetype,
        size: bytesToSize(file.size),
        format: getFileExtension(file.originalname),
        url: generateS3FileUrl(file.key),
        key: file.key
      };
    });
 
    existingAsset.assetName = assetName;
    existingAsset.assetID = assetID;
    existingAsset.price = price;
    existingAsset.description = description;
    existingAsset.quads = quads;
    existingAsset.totalTriangles = totalTriangles;
    existingAsset.vertices = vertices;
    existingAsset.materials = materials;
    existingAsset.rigged = rigged;
    existingAsset.fileFormats = fileFormats;
    existingAsset.category = categoryId;
    existingAsset.files = files;
    existingAsset.totalFileSize = bytesToSize(totalSizeBytes);
 
    const updatedAsset = await existingAsset.save();
 
    res.status(200).json({
      message: 'Asset updated successfully',
      asset: updatedAsset
    });
  } catch (error) {
    console.error('Error updating asset:', error);
    // Pass error to error handler middleware
    next(error);
  }
};
 
 
 
  export const getAssetsById = async (req, res, next) => {
    try {
      const { assetId } = req.params;
      const asset = await Asset.findById(assetId);
     
      if (!asset) {
        return res.status(404).json({ message: 'Asset not found' });
      }
 
      res.status(200).json({ asset });
    } catch (error) {
      console.error('Error fetching asset by ID:', error);
      next(error);
    }
  };
 
 
 
  // Asset Download
  export const downloadAsset=async(req,res)=>{
    try{
const {assetId,fileIndex}=req.params;
const asset=await Asset.findById(assetId);
if(!asset){
  return res.status(404).json({message:"Asset not found"});
}
 
if(fileIndex<0||fileIndex>=asset.files.length){
  return res.status(400).json({message:"Invalid file Index"
  });
}
 
const file=asset.files[fileIndex];
 
const params={
  Bucket:process.env.WASABI_REGION,
  Key:file.key,
  Expires:500,
};
 
const url = await s3.getSignedUrlPromise('getObject', params);
console.log(url);
res.redirect(url);
  }catch(error){
    console.log(error);
    res.status(500).json({error:"failed to serve asset File"});
  }
 
  };