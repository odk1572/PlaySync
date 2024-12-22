import mongoose from "mongoose";
import { Video } from "../models/video.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import fs from "fs";
import { Subscription } from "../models/subscription.models.js";
import deleteMedia from "../utils/deleteMediaFromCloud.js";
const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;

    const match = {};
    if (query) {
        match.$or = [
            { title: { $regex: query, $options: "i" } },
            { description: { $regex: query, $options: "i" } },
        ];
    }

    if (userId && mongoose.Types.ObjectId.isValid(userId)) {
        match.owner = mongoose.Types.ObjectId(userId);
    }

    const sort = {};
    if (sortBy && sortType) {
        sort[sortBy] = sortType === "asc" ? 1 : -1;
    } else {
        sort.createdAt = -1; 
    }

    const aggregate = Video.aggregate([
        { $match: match },
        { $sort: sort },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner",
            },
        },
        {
            $addFields: {
                owner: { $arrayElemAt: ["$owner", 0] },
            },
        },
    ]);

    const options = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
    };

    const videos = await Video.aggregatePaginate(aggregate, options);
    return res.status(200).json(new ApiResponse(200, videos, "Videos fetched successfully"));
});

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description, duration } = req.body;
    const { videoFile, thumbnail } = req.files;

    // Validate all required fields
    if (!title || !description || !videoFile || !thumbnail || !duration) {
        throw new ApiError(400, "All fields are required");
    }

    try {
        // Upload video and thumbnail to Cloudinary
        const videoUrl = await uploadOnCloudinary(videoFile[0].path);
        const thumbnailUrl = await uploadOnCloudinary(thumbnail[0].path);

        // Cleanup the uploaded files after they are uploaded to Cloudinary
        fs.unlink(videoFile[0].path, (err) => {
            if (err) console.error("Failed to delete local video file:", err);
        });

        fs.unlink(thumbnail[0].path, (err) => {
            if (err) console.error("Failed to delete local thumbnail file:", err);
        });

        // Create a new video entry in the database
        const video = await Video.create({
            title,
            description,
            duration,
            videoFile: videoUrl.url,
            thumbnail: thumbnailUrl.url,
            owner: req.user._id,
        });

        // Send a response with the created video including the videoId
        return res.status(201).json(new ApiResponse(201, {
            videoId: video._id,
            video: {
                title: video.title,
                description: video.description,
                duration: video.duration,
                videoFile: video.videoFile,
                thumbnail: video.thumbnail,
            }
        }, "Video published successfully"));
        

    } catch (error) {
        // Handle errors, such as Cloudinary upload or database errors
        console.error("Error publishing video:", error);
        throw new ApiError(500, "An error occurred while publishing the video. Please try again.");
    }
});
const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!videoId) {
        throw new ApiError(400, "Video ID is required");
    }

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    const video = await Video.findById(videoId).populate("owner", "username fullName avatar");

    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    return res.status(200).json(new ApiResponse(200, video, "Video fetched successfully"));
});

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { title, description } = req.body;

    if (!videoId) {
        throw new ApiError(400, "Video ID is required");
    }

    if ([title, description].some((fields) => fields.trim() === "")) {
        throw new ApiError(400, "Title and Description are required");
    }

    const thumbnailLocalPath = req.file?.path;
    if (!thumbnailLocalPath) {
        throw new ApiError(400, "Thumbnail is required");
    }

    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

    // Clean up the uploaded thumbnail after uploading to Cloudinary
    fs.unlink(thumbnailLocalPath, (err) => {
        if (err) console.error("Failed to delete local thumbnail file:", err);
    });

    if (!thumbnail) {
        throw new ApiError(500, "There was a problem while uploading the thumbnail to Cloudinary");
    }

    const updatedVideo = await Video.findByIdAndUpdate(
        videoId,
        {
            $set: {
                title,
                description,
                thumbnail: thumbnail.url,
            },
        },
        {
            new: true,
        }
    );

    if (!updatedVideo) {
        throw new ApiError(500, "Video was not updated due to an error");
    }

    return res.status(200).json(new ApiResponse(200, updatedVideo, "Video updated successfully"));
});

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!videoId) {
        throw new ApiError(400, "Video ID is required");
    }

    const deletedVideo = await Video.findByIdAndDelete(videoId);

    if (!deletedVideo) {
        throw new ApiError(500, "There was a problem while deleting the video");
    }

    return res.status(200).json(new ApiResponse(200, {}, "Video deleted successfully"));
});

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    const video = await Video.findById(videoId);

    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    if (video.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to update this video");
    }

    video.isPublished = !video.isPublished;
    await video.save();

    return res.status(200).json(new ApiResponse(200, video, "Video publish status toggled successfully"));
});

// New features added

const getSubscribedVideos = asyncHandler(async (req, res) => {
    try {
        const userId = req.user._id;

        // Step 1: Fetch the channels the user is subscribed to
        const subscribedChannels = await Subscription.find({ subscriber: userId })
            .select('channel')
            .lean();

        if (!subscribedChannels.length) {
            return res.status(200).json(
                new ApiResponse(200, [], "No subscriptions found for this user.")
            );
        }

        const channelIds = subscribedChannels.map(sub => sub.channel);

        // Validate that all channelIds are valid ObjectIds
        if (!channelIds.every(id => mongoose.Types.ObjectId.isValid(id))) {
            return res.status(400).json(
                new ApiResponse(400, null, "One or more channel IDs are invalid.")
            );
        }

        // Step 2: Fetch videos from these channels
        const videos = await Video.find({ owner: { $in: channelIds }, isPublished: true })
            .populate('owner', 'username fullName avatar')
            .sort({ createdAt: -1 }) // Sort by most recent
            .lean();

        // Check if videos were found
        if (!videos.length) {
            return res.status(200).json(
                new ApiResponse(200, [], "No videos found from subscribed channels.")
            );
        }

        return res.status(200).json(
            new ApiResponse(200, videos, "Subscribed videos fetched successfully.")
        );
    } catch (error) {
        console.error("Error fetching subscribed videos:", error.message || error);
        return res.status(500).json(
            new ApiResponse(500, null, "Failed to fetch subscribed videos.")
        );
    }
});


const getSearchResults = asyncHandler(async (req, res) => {
    const query = req.query.q;

    const results = await performSearch(query); // Assume performSearch is defined
    if (!results) {
        return res.status(200).json(new ApiResponse(200, [], "No results found"));
    }
    return res.status(200).json(new ApiResponse(200, results, "Search results fetched successfully"));
});

const getRelatedVideos = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(404, "Video not found");
    }
    const relatedVideos = await Video.find({
        _id: { $ne: videoId },
        owner: video.owner,
    }).limit(10).populate('owner', 'username fullname avatar');
    return res.status(200).json(new ApiResponse(200, relatedVideos, "Related videos fetched successfully"));
});

const incrementViewCount = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(404, "Video not found");
    }
    video.views += 1;
    await video.save();
    return res.status(200).json(new ApiResponse(200, video, "View count incremented successfully"));
});



const getAllVideosUploadedById = async (req, res) => {
    try {
      const userId = req.user?._id; // Ensure `req.user` contains the authenticated user ID
  
  
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized: User not authenticated",
        });
      }
  
      // Fetch all videos where `owner` matches the user's ID
      const allVideosUploadedByUser = await Video.find({ owner: userId });
  
      return res.status(200).json({
        success: true,
        data: allVideosUploadedByUser,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Failed to fetch videos",
      });
    }
  };
  
  const getAllVideosUploadedByUser = async (req, res) => {
    try {
      const { userId } = req.params;
  
      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'Bad Request: userId is required',
        });
      }
  
      const allVideosUploadedByUser = await Video.find({ owner: userId });
  
      return res.status(200).json({
        success: true,
        data: allVideosUploadedByUser,
      });
    } catch (err) {
      console.error('Error fetching user videos:', err);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch videos',
      });
    }
  };
  
  
  
  

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus,
    getSubscribedVideos,
    getSearchResults,
    getRelatedVideos,
    incrementViewCount,
    getAllVideosUploadedById,
    getAllVideosUploadedByUser
};
