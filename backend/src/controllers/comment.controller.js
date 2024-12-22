import mongoose,{isValidObjectId} from "mongoose"
import {Comment} from "../models/comment.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {Video} from "../models/video.models.js"
const getVideoComments = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    const skip = (page - 1) * limit;
    const comments = await Comment.find({ video: videoId })
        .skip(skip)
        .limit(limit)
        .populate('owner', 'username fullName avatar');  // Populate user details

    return res.status(200)
        .json(new ApiResponse(200, comments, "Fetch All Comments Successfully"));
});

const addComment = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { content } = req.body;

    if (!content || typeof content !== 'string' || content.trim() === "") {
        throw new ApiError(400, "Please add something to add to comment");
    }

    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(400, "Video not found with this id");
    }

    const newComment = await Comment.create({
        content,
        video: videoId,  // Correct field name is 'video', not 'videoId'
        owner: req.user?.id
    });

    if (!newComment) {
        throw new ApiError(400, "There was a problem while saving the comment");
    }

    res.status(200).json(new ApiResponse(200, newComment, "Comment was added successfully"));
});


const updateComment = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { content, commentId } = req.body;

    console.log("Received data:", { videoId, commentId, content });  // Add logging to check input

    // Ensure content is provided and is not just empty spaces
    if (!content || content.trim() === "") {
        throw new ApiError(400, "Please write updated comment to update it");
    }

    if (!commentId) {
        throw new ApiError(400, "Comment ID is required");
    }

    // Check if video exists
    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(400, "Video not found with the id");
    }

    // Update the comment in the database
    const updatedComment = await Comment.findByIdAndUpdate(
        commentId,
        { $set: { content } },
        { new: true }
    ).populate('owner', 'username fullName avatar');  // Populate user details

    // Log if the comment update failed
    if (!updatedComment) {
        throw new ApiError(500, "There was a problem while updating the comment");
    }

    // Respond with the updated comment
    return res.status(200).json(new ApiResponse(200, updatedComment, "Comment was updated"));
});

const deleteComment = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { commentId } = req.body;

    if (!commentId) {
        throw new ApiError(400, "Comment id is needed");
    }

    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(400, "Video was not found");
    }

    const commentToBeDeleted = await Comment.findByIdAndDelete(commentId).populate('owner', 'username fullName avatar'); // Populate user details

    if (!commentToBeDeleted) {
        throw new ApiError(400, "There was a problem while deleting the comment");
    }

    return res.status(200).json(new ApiResponse(200, {}, "Comment was deleted"));
});

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }