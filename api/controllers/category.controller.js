import Category from "../models/category.model.js";
import { errorHandler } from "../utils/error.js";
import multer from "multer";
import multerS3 from "multer-s3";
import { generateS3FileUrl, s3 } from "../utils/s3UploadClient.js";





const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: `${process.env.AWS_BUCKET}`, 
    key: function (req, file, cb) {
      const folderName = 'CategoryImages'; 
      const filename = `${folderName}/${Date.now().toString() + '-' + file.originalname}`;
      cb(null, filename);
    }
  })


});


// Create Category
export const createCategory = async (req, res, next) => {
  try {
    upload.single('image')(req, res, async function (error) {
      if (error) {
        console.error('Error uploading image:', error);
        return res.status(500).json({ error: 'Failed to upload image' });
      }

      if (!req.file) {
        return res.status(400).json({ error: 'No file was uploaded.' });
      }

      const { categoryName } = req.body;

      if (!categoryName) {
        return res.status(400).json({ error: 'Category name is required.' });
      }

      const newCategory = new Category({
        categoryName,
        key:req.file.key,
        imageUrl: generateS3FileUrl(req.file.key), // Assuming generateS3FileUrl() generates the correct URL
      });

      const savedCategory = await newCategory.save();

      res.status(201).json(savedCategory);
    });
  } catch (error) {
    console.error('Error creating category:', error);
    next(errorHandler(error));
  }
};



//Get all category
export const getAllCategory = async (req, res, next) => {
  try {
    const allCategory = await Category.find({});
    res.status(200).json({allCategory})
  } catch (error) {
    next(error)
  }
};



// Delete Category
export const deleteCategory = async (req, res, next) => {
  // if (!req.user.isAdmin || req.user._id !== req.params.userId) {
  //   return next(
  //     errorHandler(403, "You are not allowed to delete this category")
  //   );
  // }
  try{
  const categoryId=req.params.categoryId;
  const category=await Category.findById(categoryId);
  if (!category) {
    throw new Error('Asset not found');
  }
  
const fileKey=category.key;
    
    const Params = {
      Bucket: `${process.env.AWS_BUCKET}`,
      Key: fileKey,
    };
    await s3.deleteObject(Params).promise();

    const deletedAsset = await Category.findOneAndDelete(categoryId);

    if (!deletedAsset) {
      return res.status(404).json({ error: 'Asset not found' });
    }

    res.status(200).json({ message: 'File and metadata deleted successfully' });
  } catch (error) {
    console.error('Error deleting file and metadata:', error);
    next(errorHandler(error));
  };
};



// Edit Category
export const updateCategory = async (req, res, next) => {
  try {
    const { categoryId } = req.params;

    const category = await Category.findById(categoryId);

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    upload.single('image')(req, res, async function (error) {
      if (error) {
        console.error('Error uploading image:', error);
        return res.status(500).json({ error: 'Failed to upload image' });
      }

      if (req.file) {
        const deleteParams = {
          Bucket: `${process.env.AWS_BUCKET}`,
          Key: category.key,
        };
        await s3.deleteObject(deleteParams).promise();

        category.key = req.file.key;
        category.imageUrl = generateS3FileUrl(req.file.key);
      }

      if (req.body.categoryName) {
        category.categoryName = req.body.categoryName;
      }

      const updatedCategory = await category.save();

      res.status(200).json(updatedCategory);
    });
  } catch (error) {
    console.error('Error updating category:', error);
    next(errorHandler(error));
  }
};

// Get single category
export const getCategoryById = async(req,res,next)=>{
  const category = await Category.findById(req.params.id);
  if(!category){
    res.status(500).json({message: 'Category with the given id was not exist'});
  }
  res.status(200).send(category);

}