import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    // Validate videoId
    if (!videoId) {
        throw new ApiError(400, "Video id is required");
    }

    // Check if the like already exists
    const likeExists = await Like.findOne({
        video: videoId,
        likedBy: req.user._id
    });

    if (likeExists) {
        // If like exists, remove it
        const removeLike = await Like.findByIdAndDelete(likeExists._id);
        if (!removeLike) {
            throw new ApiError(500, "There was a problem while removing the like");
        }
        return res.status(200).json(new ApiResponse(200, {}, "Like removed successfully"));
    }

    // If like does not exist, add it
    const addLike = await Like.create({
        video: videoId,
        likedBy: req.user._id
    });
    if (!addLike) {
        throw new ApiError(500, "There was a problem while adding the like");
    }
    return res.status(200).json(new ApiResponse(200, {}, "Like was added successfully"));
});

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    //TODO: toggle like on comment
    if(!commentId)
        {
            throw new ApiError(400,"Video id is required")
        }
        const LikeExists= await Like.findOne({
            $set:{
                comment:commentId,
                likedBy:req.user._id
            }
        })
        if(LikeExists)
        {
            const removeLike=await Like.findByIdAndDelete(LikeExists._id)
            if(!removeLike)
                {
                    throw new ApiError(500,"There was a problem while removing the like")
                }
            return res.status(200).json(new ApiResponse(200,{},"Like removed successfully"))
        }
        const addLike=await Like.create({
            comment:commentId,
            likedBy:req.user._id
        })
        if(!addLike)
            {
                throw new ApiError(500,"There was a problem while adding the like")
            }
            return res.status(200).json(new ApiResponse(200,{},"Like was added successfully"))

})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    //TODO: toggle like on tweet
    if(!tweetId)
        {
            throw new ApiError(400,"Video id is required")
        }
        const LikeExists= await Like.findOne({
            $set:{
                tweet:tweetId,
                likedBy:req.user._id
            }
        })
        if(LikeExists)
        {
            const removeLike=await Like.findByIdAndDelete(LikeExists._id)
            if(!removeLike)
                {
                    throw new ApiError(500,"There was a problem while removing the like")
                }
            return res.status(200).json(new ApiResponse(200,{},"Like removed successfully"))
        }
        const addLike=await Like.create({
            tweetId:tweetId,
            likedBy:req.user._id
        })
        if(!addLike)
            {
                throw new ApiError(500,"There was a problem while adding the like")
            }
            return res.status(200).json(new ApiResponse(200,{},"Like was added successfully"))
}
)

const getLikedVideos = asyncHandler(async (req, res) => {
    // Find all likes where the `likedBy` matches the user and `video` field exists
    const allLikes = await Like.find({
        likedBy: req.user._id,
        video: { $exists: true } // Check if the `video` field exists
    });

    return res.status(200).json(new ApiResponse(200, allLikes, "Liked videos were retrieved successfully"));
});


const getDislikedVideos = asyncHandler(async (req, res) => {
    const userId = req.user?._id;

    if (!userId) {
        throw new ApiError(401, "User not authenticated");
    }

    const dislikedVideos = await Like.find({ dislikedBy: userId })
        .populate('video', 'title description url')
        .exec();

    return res.status(200).json(new ApiResponse(200, { dislikedVideos }, "Disliked videos fetched successfully"));
});



export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos,
    getDislikedVideos
}