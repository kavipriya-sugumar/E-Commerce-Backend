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
    key:{
      type: String,
      required: true,
    }
  },
  { timestamps: true }
);
const Category = mongoose.model("Category", categorySchema);

export default Category;
