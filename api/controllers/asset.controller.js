import mongoose from "mongoose";
import Asset from "../models/asset.model.js"
import Category from "../models/category.model.js";
import { bytesToSize } from "../utils/bytesToSize.js";
import { errorHandler } from "../utils/error.js";
import { generateS3FileUrl, s3 } from "../utils/s3UploadClient.js";



// Create a Single Asset
export const createAsset = async (req, res, next) => {
  try {
if (!req.files) res.status(400).json({ error: 'No files were uploaded.' })
    const uploadedFiles=req.files;
    const {assetName,price,description}=req.body;
    const categoryId=req.params.categoryId;
    const assetCategory=await Category.findById(categoryId);
if(!assetCategory){
  res.status(404).json({message:"Category not found"})
}
const files =  uploadedFiles.map((file) => ({
  name: file.originalname,
  type: file.mimetype,
  size: bytesToSize(file.size),
  format: getFileExtension(file.originalname),
  url:generateS3FileUrl(file.key),
  key:file.key

 
}));

const asset = new Asset({
  assetName,
  price,
  description,
  category:assetCategory,
  files
})

const createdAssets = await Asset.insertMany(asset);

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
export const deleteFiles = async (req, res, next) => {
  try {
const assetId=req.params.assetId;
const asset=await Asset.findById(assetId)
if (!asset) {
  throw new Error('Asset not found');
}

const fileKeys = asset.files.map((file) => file.key);

const params = {
      Bucket: `${process.env.AWS_BUCKET}`, 
      Delete: {
        Objects: fileKeys.map((key) => ({ Key: key })),
        Quiet: true 
      }
    };

    const data = await s3.deleteObjects(params).promise();
    await Asset.findByIdAndDelete(req.params.assetId)

    res.status(200).json({ message: 'Files deleted successfully', deleted: data.Deleted });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete files' });
  }
};


//get Assets by Category 
export const assetsByCategory=async(req,res,next)=>{
  try {
    const { categoryId } = req.params;
console.log(categoryId);
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
    // if (!req.user.isAdmin || req.user._id != req.params.userId) {
    //   return next(errorHandler(403, "You are not allowed to edit this post"));
    // }
    try {
      const { assetId } = req.params;
      const { assetName, price, description, categoryId, files } = req.body;
  
      if (!mongoose.Types.ObjectId.isValid(assetId)) {
        return res.status(400).json({ error: 'Invalid asset ID' });
      }
  
      const asset = await Asset.findById(assetId);
      if (!asset) {
        return res.status(404).json({ error: 'Asset not found' });
      }
  
      if (assetName) {
        asset.assetName = assetName;
      }
      if (price) {
        asset.price = price;
      }
      if (description) {
        asset.description = description;
      }
      if (categoryId) {
        const category = await Category.findById(categoryId);
        if (!category) {
          return res.status(404).json({ error: 'Category not found' });
        }
        asset.category = category;
      }
  
      // Handle file updates in S3
      if (files && Array.isArray(files) && files.length > 0) {
        const updatedFiles = [];
  
        for (const file of files) {
          const { name, type, data } = file;
  
          const params = {
            Bucket: `${process.env.AWS_BUCKET}`,
            Key: `${assetId}/${name}`, // Use a unique key per asset (e.g., assetId/filename)
            Body: data
          };
  
          const uploadedFile = await s3.upload(params).promise();
  
          const fileUrl = generateS3FileUrl(uploadedFile.Key);
  
          const updatedFileMetadata = {
            name,
            type,
            size: bytesToSize(data.length), // Assuming 'data' is a Buffer or Uint8Array
            format: getFileExtension(name),
            url: fileUrl,
            key: uploadedFile.Key
          };
  
          updatedFiles.push(updatedFileMetadata);
        }
  
        asset.files = updatedFiles;
      }
  
      const updatedAsset = await asset.save();
  
      res.status(200).json({ message: 'Asset updated successfully', asset: updatedAsset });
    } catch (error) {
      console.error('Error updating asset:', error);
      next(errorHandler(error));
    }
  };

export const getAssetsById = async (req, res, next) => {
  const assets = await Asset.findById(req.params.id)
  if (!assets) {
    res.status(500).json({ success: false });
  }
  res.send(assets);
};









