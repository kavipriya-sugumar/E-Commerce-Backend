import mongoose from "mongoose";
 
const categorySchema = new mongoose.Schema(
  {
    categoryName: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    imageKey:{
      type: String,
      required:true
    },
 
    iconUrl:{
      type: String,
      required: true,
    },
    iconKey:{
      type: String,
      required:true
    }
  },
  { timestamps: true }
);
const Category = mongoose.model("Category", categorySchema);
 
export default Category;