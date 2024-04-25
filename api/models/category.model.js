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
<<<<<<< HEAD
    key:{
      type: String,
      required: true,
=======
    categoryImage:{
      type:String,
>>>>>>> 38a86b5f93c26ff8c37e60353da82fb9e9a88823
    }
  },
  { timestamps: true }
);
const Category = mongoose.model("Category", categorySchema);

export default Category;
