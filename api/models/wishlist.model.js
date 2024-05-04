import mongoose from "mongoose";
 
const wishlistSchema = new mongoose.Schema(
  {
    userId: {
        type: String,
        required: true,
    },
    productId: {
        type: String,
        ref: "Assets",
      },
    isLike:{
      type:Boolean,
      default:false
     
    },
  },
  { timestamps: true }
);
 
const wishList = mongoose.model("wishlist", wishlistSchema);
 
export default wishList;