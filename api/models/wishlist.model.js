import mongoose from "mongoose";
 
const wishlistSchema = new mongoose.Schema(
  {
    userId: {
        type: String,
        required: true,
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
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