import Wishlist from "../models/wishlist.model.js";
import Asset from "../models/asset.model.js";
import User from "../models/user.model.js";
import mongoose from "mongoose";
import constantValue from "../utils/const.js";
 
 
export const likeProductToWishList = async (req, res) => {
    try {
        if (!req?.query?.id) return res.status(406).json({ status: 406, message: "id required" });
 
        const verifyUser = await User.findOne({ _id: req.query.id });
        const verifyProducts = await Asset.findOne({_id : new mongoose.Types.ObjectId(req?.body?.productsId)})
        if(!verifyProducts) return res.status(500).json({status:406, message:"invaild products Id"})
        if (!verifyUser) {
            return res.status(500).json({ status: 406, message: "invalid userId" });
        } else {
            if (req?.body?.like == constantValue.LIKE) {
 
                const checkAlredyLikefalse = await Wishlist.findOne({userId: verifyUser?._id, productsId:req?.body?.productsId, isLike : false})
                if(checkAlredyLikefalse){
                    const updateLike  = await Wishlist.updateOne({userId: verifyUser?._id, productsId:req?.body?.productsId}, {$set:{isLike:req?.body?.like}})
                    if(updateLike){
                        return res.json({status:200, message:"liked"})
                    }
                }
                const checkAlredyLiketrue = await Wishlist.findOne({userId: verifyUser?._id, productsId:req?.body?.productsId, isLike : true})
                if(checkAlredyLiketrue){
                    return res.json({message:"already liked"})
                }
 
                const createLike = await Wishlist.create({
                    userId: verifyUser._id,
                    productsId: req?.body?.productsId,
                    isLike: req?.body?.like
                });
 
                if (createLike) {
                    return res.json({status:200, message:"liked"});
                }
            } else if (req?.body?.like == constantValue.UNLIKE) {
                const unLike = await Wishlist.updateOne({
                    userId: verifyUser._id,
                    productsId: req?.body?.productsId},{$set:{isLike: req?.body?.like} });
                if(unLike && unLike.modifiedCount == 1){
                    return res.json({status:200, message:"unliked"})
                }else{
                    return res.json({status:200, message:"alreadyUnliked"})
                }
            }else{
                return res.json({status:406, message:"invaild values"})
            }
        }
    } catch (err) {
        return res.status(500).json({ status: 500, message: err.message });
    }
}
 
export const getLikeProducts = async(req, res) => {
 
    const getAllLikeProducts = await Wishlist.find({isLike : true})
    if(getAllLikeProducts){
       return res.json({status:200, getAllLikeProducts})
    }else{
        return res.status(500).json({status:406, message:"something went wrong"})
    }
 
}
 
 
export const getParticularLikeProducts = async(req, res)=>{
    if(!req?.query?.id) return res.json({status:406, message:"id required"})
    const verifyUser = await User.findOne({_id: new mongoose.Types.ObjectId(req?.query?.id)})
    if(!verifyUser) return res.json({status:406, message:"invaild user"})
    const getParticularLikeProducts = await Wishlist.find({userId:verifyUser?._id, isLike:true})
    if(getParticularLikeProducts){
        return res.json({status:200, message:getParticularLikeProducts})
    }else{
        return res.json({status:406, message:"something went wrong"})
    }
}