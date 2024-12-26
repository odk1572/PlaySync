import {asyncHandler} from "../utils/asyncHandler.js"; 
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import { v2 as cloudinary} from "cloudinary";
import fs from "fs";
import mongoose from "mongoose";
import { Video } from "../models/video.models.js";
import {Comment} from "../models/comment.model.js";
import {Subscription} from "../models/subscription.models.js";
import {Like} from "../models/like.model.js";
import {Playlist} from "../models/playlist.model.js";


const generateAccessAndRefreshToken = (async(userId)=>{
    try {

        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return {accessToken, refreshToken}
    } catch (error) {
        throw new ApiError(500,"something went wrong while generating access and refresh tokens")
    }
})


const registerUser = asyncHandler( async (req, res) => {
    // get user details from frontend
    // validation - not empty
    // check if user already exists: username, email
    // check for images, check for avatar
    // upload them to cloudinary, avatar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return res


    const {fullName, email, username, password } = req.body
    //console.log("email: ", email);

    if (
        [fullName, email, username, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (existedUser) {
        throw new ApiError(409, "User with email or username already exists")
    }
    //console.log(req.files);

    const avatarLocalPath = req.files?.avatar[0]?.path;
    //const coverImageLocalPath = req.files?.coverImage[0]?.path;

    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }
    

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!avatar) {
        throw new ApiError(400, "Avatar file is required")
    }
   

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email, 
        password,
        username: username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered Successfully")
    )

} )

const loginUser = asyncHandler(async (req, res) =>{
    // req body -> data
    // username or email
    //find the user
    //password check
    //access and referesh token
    //send cookie

    
        const {email, username, password} = req.body
    
            console.log(req.body);
            

        // if (!username && !email) {
        //     throw new ApiError(400, "username or email is required")
        // }
        
        // Here is an alternative of above code based on logic discussed in video:
         if (!(username || email)) {
             throw new ApiError(400, "username or email is required")
            
         }
    
        const user = await User.findOne({
            $or: [{username}, {email}]
        })
    
        if (!user) {
            throw new ApiError(404, "User does not exist")
        }
    

   const isPasswordValid = await user.isPasswordCorrect(password)

   if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials")
    }

   const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200, 
            {
                user: loggedInUser, accessToken, refreshToken
            },
            "User logged In Successfully"
        )
    )

})

const logoutUser = asyncHandler(async(req,res)=>{
    User.findByIdAndUpdate(
        req.user._id,
        {
            $set:{
                refreshToken:undefined
            },
        },
        {
            new:true
        }
    )

    const options = {
        httpOnly : true,
        secure : true
    }

    return res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie('refreshToken',options)
    .json(
        new ApiResponse(200,{},"User loggedout successfully")
    )
})

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!incomingRefreshToken) {
        throw new ApiError(401, "unauthorized request")
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
    
        const user = await User.findById(decodedToken?._id)
    
        if (!user) {
            throw new ApiError(401, "Invalid refresh token")
        }
    
        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used")
            
        }
    
        const options = {
            httpOnly: true,
            secure: true
        }
    
        const {accessToken, newRefreshToken} = await generateAccessAndRefreshToken(user._id)
    
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(
            new ApiResponse(
                200, 
                {accessToken, refreshToken: newRefreshToken},
                "Access token refreshed"
            )
        )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }

})

const changeCurrentPassword = asyncHandler(async(req, res) => {
    const {oldPassword, newPassword} = req.body

    

    const user = await User.findById(req.user?._id)
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

    if (!isPasswordCorrect) {
        throw new ApiError(400, "Invalid old password")
    }

    user.password = newPassword
    await user.save({validateBeforeSave: false})

    return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"))
})


const getCurrentUser = asyncHandler(async(req, res) => {
    return res
    .status(200)
    .json(new ApiResponse(
        200,
        req.user,
        "User fetched successfully"
    ))
})

const updateAccountDetails = asyncHandler(async(req, res) => {
    const {fullName, email} = req.body

    if (!fullName || !email) {
        throw new ApiError(400, "All fields are required")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                fullName,
                email: email
            }
        },
        {new: true}
        
    ).select("-password")

    return res
    .status(200)
    .json(new ApiResponse(200, user, "Account details updated successfully"))
});

const updateUserAvatar = asyncHandler(async (req, res) => {
    const avatarLocalPath = req.file?.path;

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is missing");
    }

    // Find the user to get the current avatar URL
    const user = await User.findById(req.user._id);
    const oldAvatarUrl = user.avatar;

    const avatar = await uploadOnCloudinary(avatarLocalPath);

    if (!avatar || !avatar.url) {
        throw new ApiError(400, "Error while uploading avatar");
    }

    // Delete the old avatar from Cloudinary, if exists
    if (oldAvatarUrl) {
        const publicId = oldAvatarUrl.split('/').pop().split('.')[0]; // Extract publicId from URL
        await cloudinary.uploader.destroy(publicId); // Corrected call to delete image
    }

    const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: { avatar: avatar.url }
        },
        { new: true }
    ).select("-password");

    return res
        .status(200)
        .json(
            new ApiResponse(200, updatedUser, "Avatar image updated successfully")
        );
});


const updateUserCoverImage = asyncHandler(async(req, res) => {
    const coverImageLocalPath = req.file?.path;

    if (!coverImageLocalPath) {
        throw new ApiError(400, "Cover image file is missing");
    }

    // Find the user to get the current cover image URL
    const user = await User.findById(req.user._id);
    const oldCoverImageUrl = user.coverImage;

    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if (!coverImage.url) {
        throw new ApiError(400, "Error while uploading on avatar");
    }

    // Delete the old cover image from Cloudinary, if exists
    if (oldCoverImageUrl) {
        const publicId = oldCoverImageUrl.split('/').pop().split('.')[0]; // Extract publicId from URL
        await cloudinary.uploader.destroy(publicId); // Delete image
    }

    const updatedUser = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                coverImage: coverImage.url
            }
        },
        {new: true}
    ).select("-password");

    return res
    .status(200)
    .json(
        new ApiResponse(200, updatedUser, "Cover image updated successfully")
    );
});



const getUserChannelProfile = asyncHandler(async (req, res) => {
    const { username } = req.params;

    // Validate username input
    if (!username?.trim()) {
        throw new ApiError(400, "Username is missing or invalid");
    }

    const channel = await User.aggregate([
        {
            $match: {
                username: username.toLowerCase() // Directly use toLowerCase after validation
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "channel",
                as: "subscribers"
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "subscriber",
                as: "subscribedTo"
            }
        },
        {
            $addFields: {
                subscribersCount: { $size: "$subscribers" },
                channelsSubscribedToCount: { $size: "$subscribedTo" },
                isSubscribed: {
                    $cond: {
                        if: { $in: [req.user?._id, "$subscribers.subscriber"] },
                        then: true,
                        else: false
                    }
                }
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "_id",
                foreignField: "userId",
                as: "videos"
            }
        },
        {
            $project: {
                fullName: 1,
                username: 1,
                subscribersCount: 1,
                channelsSubscribedToCount: 1,
                isSubscribed: 1,
                avatar: 1,
                coverImage: 1,
                email: 1,
                videos: 1
            }
        }
    ]);

    if (!channel?.length) {
        throw new ApiError(404, "Channel does not exist");
    }

    return res.status(200).json(
        new ApiResponse(200, channel[0], "User channel fetched successfully")
    );
});


const getWatchHistory = asyncHandler(async (req, res) => {
    if (!req.user?.id) {
        throw new ApiError(400, "User ID not provided");
    }

    try {
        const user = await User.findById(req.user._id);

        console.log("User Data:", user);

        // Return a success response even if watchHistory is empty
        if (!user?.watchHistory || user.watchHistory.length === 0) {
            return res.status(200).json(
                new ApiResponse(200, [], "No watch history found for this user")
            );
        }

        return res.status(200).json(
            new ApiResponse(200, user.watchHistory, "Watch history fetched successfully")
        );
    } catch (error) {
        console.error("Error fetching watch history:", error.message, error.stack);
        
        // Return server error only for unexpected issues
        if (error instanceof ApiError) {
            throw error; // Retain original error for client issues
        }

        throw new ApiError(500, "Internal server error");
    }
});



const deleteUserAccount = asyncHandler(async (req, res, next) => {
    try {
        const userId = req.user?._id; // Ensure userId exists from middleware

        if (!userId) {
            console.error("User ID not provided in req.user");
            throw new ApiError(400, "User ID is missing from request");
        }

        // Check if the user exists
        const user = await User.findById(userId);
        if (!user) {
            console.error(`User with ID ${userId} not found`);
            throw new ApiError(404, "User not found");
        }

        // Delete all related data in parallel
        await Promise.all([
            Video.deleteMany({ owner: userId }),
            Comment.deleteMany({ user: userId }),
            Subscription.deleteMany({ $or: [{ subscriber: userId }, { channel: userId }] }),
            Like.deleteMany({ user: userId }),
            Playlist.deleteMany({ owner: userId }),
        ]);

        // Delete user account
        const deleteResult = await User.deleteOne({ _id: userId });
        if (deleteResult.deletedCount === 0) {
            console.error(`Failed to delete user with ID ${userId}`);
            throw new ApiError(500, "Failed to delete user account");
        }

        console.log(`User account and related data deleted successfully for ID: ${userId}`);

        return res.status(200).json({ message: "User account and all related data deleted successfully" });
    } catch (error) {
        console.error("Error in deleteUserAccount:", error.message || error);
        next(error); // Pass the error to global error handler
    }
});

const getUserVideos = async (req, res) => {
    try {
      // Get the username from the request parameters
      const { username } = req.params;
  
      if (!username) {
        return res.status(400).json({
          success: false,
          message: 'Username is missing in request params',
        });
      }
  
      console.log('Fetching videos for username:', username);
  
      // Find the user by username
      const user = await User.findOne({ username });
  
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }
  
      // Fetch videos by the user's _id and populate owner details
      const videos = await Video.find({ owner: user._id })
        .populate('owner', 'avatar fullName username coverImage') // Populating specific fields from User
        .exec();
  
      if (!videos || videos.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'No videos found for this user',
        });
      }
  
      return res.status(200).json({
        success: true,
        data: videos,
      });
    } catch (err) {
      console.error('Error fetching user videos:', err.message);
  
      return res.status(500).json({
        success: false,
        message: 'Internal Server Error',
        error: err.message || 'Something went wrong',
      });
    }
  };
  
const deleteWatchHistory = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { videoId } = req.body;

    // Validate videoId if provided
    if (videoId && !isValidObjectId(videoId)) {
        return res.status(400).json(new ApiResponse(400, {}, "Invalid video ID"));
    }

    let updateQuery;

    if (videoId) {
        // Remove specific video from watch history
        updateQuery = { $pull: { watchHistory: { _id: videoId } } };
    } else {
        // Clear all watch history
        updateQuery = { $set: { watchHistory: [] } };
    }

    const user = await User.findByIdAndUpdate(
        userId,
        updateQuery,
        { new: true }
    );

    if (!user) {
        return res.status(404).json(new ApiResponse(404, {}, "User not found"));
    }

    const message = videoId
        ? "Video removed from watch history successfully"
        : "Watch history cleared successfully";

    return res.status(200).json(new ApiResponse(200, {}, message));
});

const updateWatchHistory = asyncHandler(async (req, res) => {
    const { videoId } = req.body;
    const userId = req.user._id;

    // Validate the videoId
    if (!videoId) {
        return res.status(400).json({ message: 'Video ID is required' });
    }

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if videoId already exists in watchHistory
        if (user.watchHistory.includes(videoId)) {
            return res.status(200).json({ message: 'Video is already in watch history' });
        }

        // Add videoId to watchHistory and save
        user.watchHistory.push(videoId);
        await user.save();

        return res.status(200).json({ message: 'Video added to watch history' });
    } catch (error) {
        console.error('Error updating watch history:', error.message, error.stack);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage,
    getUserChannelProfile,
    getWatchHistory,
    updateWatchHistory,
    deleteWatchHistory,
    getUserVideos,
    deleteUserAccount,
}
