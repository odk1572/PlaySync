import mongoose, {isValidObjectId} from "mongoose"
import {Playlist} from "../models/playlist.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createPlaylist = asyncHandler(async (req, res) => {
    const { name, description } = req.body;

    // Ensure `name` and `description` are defined and strings
    if (!name || typeof name !== 'string' || name.trim() === "" ||
        !description || typeof description !== 'string' || description.trim() === "") {
        throw new ApiError(400, "Name and description are required");
    }

    const playList = await Playlist.create({
        name,
        description,
        owner: req.user._id
    });

    if (!playList) {
        throw new ApiError(500, "There was a problem while creating the playlist");
    }

    return res.status(200).json(new ApiResponse(200, playList, "Playlist was created successfully"));
});


const getUserPlaylists = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    
    if (!userId) {
        throw new ApiError(400, "Id is required");
    }

    // Fix: Ensure userId is properly converted to ObjectId with 'new'
    const userObjectId = new mongoose.Types.ObjectId(userId);

    const playlists = await Playlist.aggregate([
        {
            $match: {
                owner: userObjectId // Use the userObjectId here
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "videos",
                foreignField: "_id",
                as: "videos",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "owner"
                        }
                    },
                    {
                        $addFields: {
                            owner: {
                                $first: "$owner" // $first should be used correctly within the context of an array
                            }
                        }
                    }
                ]
            },
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner"
            }
        },
        {
            $addFields: {
                owner: {
                    $first: "$owner" // $first to get the first owner element
                }
            }
        }
    ]);

    return res.status(200).json(new ApiResponse(200, playlists, "Play list is returned successfully"));
});

const getPlaylistById = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;

    const playlist = await Playlist.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(playlistId) // Match the playlist by ID
            }
        },
        {
            $lookup: {
                from: "videos", // Join with the "videos" collection
                localField: "videos", // Match "videos" field in Playlist
                foreignField: "_id", // Match with "_id" field in "videos" collection
                as: "videos", // Alias for the result
                pipeline: [
                    {
                        $lookup: {
                            from: "users", // Join with the "users" collection to get owner details
                            localField: "owner", // Match "owner" field in videos
                            foreignField: "_id", // Match with "_id" field in "users" collection
                            as: "owner" // Alias for owner details
                        }
                    },
                    {
                        $addFields: {
                            owner: { 
                                $arrayElemAt: ["$owner", 0] // Extract the first owner element
                            }
                        }
                    }
                ]
            }
        },
        {
            $lookup: {
                from: "users", // Join with the "users" collection to get playlist owner details
                localField: "owner", // Match "owner" field in Playlist
                foreignField: "_id", // Match with "_id" field in "users" collection
                as: "owner" // Alias for the owner details
            }
        },
        {
            $addFields: {
                owner: { 
                    $arrayElemAt: ["$owner", 0] // Extract the first owner element
                }
            }
        }
    ]);

    if (!playlist || playlist.length === 0) {
        throw new ApiError(400, "Playlist not found");
    }

    // Return the playlist along with all its videos and their owners
    return res.status(200).json(new ApiResponse(200, playlist[0], "Playlist is returned successfully"));
});


const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params;
    
    if (!playlistId || !videoId) {
        throw new ApiError(400, "Playlist Id and video Id were not found");
    }
    
    // Ensure the videoId is converted to an ObjectId
    const videoObjectId = new mongoose.Types.ObjectId(videoId);

    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        throw new ApiError(400, "Playlist was not found");
    }

    // Add the video ObjectId to the playlist's videos array
    playlist.videos.push(videoObjectId);
    const updatedPlayList = await playlist.save({ validateBeforeSave: false });

    if (!updatedPlayList) {
        throw new ApiError(400, "There was a problem while updating the playlist");
    }

    return res.status(200).json(new ApiResponse(200, updatedPlayList, "Video was added to Playlist"));
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params;

    if (!playlistId || !videoId) {
        throw new ApiError(400, "Playlist Id and video Id were not found");
    }

    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        throw new ApiError(400, "Playlist was not found");
    }

    playlist.videos = playlist.videos.filter(item => item._id != videoId);
    const updatedPlayList = await playlist.save({ validateBeforeSave: false });

    if (!updatedPlayList) {
        throw new ApiError(400, "There was a problem while updating the playlist");
    }

    return res.status(200).json(new ApiResponse(200, updatedPlayList, "Video was deleted from Playlist"));
});

const deletePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;
    
    if (!playlistId) {
        throw new ApiError(400, "Playlist id is required");
    }

    const deletedPlaylist = await Playlist.findByIdAndDelete(playlistId);

    if (!deletedPlaylist) {
        throw new ApiError(500, "There was a problem while deleting the playlist");
    }

    return res.status(200).json(new ApiResponse(200, {}, "Playlist was removed"));
});

const updatePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;
    const { name, description } = req.body;

    if (!playlistId) {
        throw new ApiError(400, "Playlist id is required");
    }

    if (name.trim() === "" || description.trim() === "") {
        throw new ApiError(400, "Name and Description are required");
    }

    const updatedPlayList = await Playlist.findByIdAndUpdate(playlistId, {
        name,
        description
    }, { new: true });

    if (!updatedPlayList) {
        throw new ApiError(500, "There was a problem while updating the Playlist");
    }

    return res.status(200).json(new ApiResponse(200, updatedPlayList, "Playlist was updated successfully"));
});

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
};
