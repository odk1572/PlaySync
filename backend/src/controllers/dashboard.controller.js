import mongoose from "mongoose"
import {Video} from "../models/video.models.js"
import {Subscription} from "../models/subscription.models.js"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { User } from "../models/user.models.js"

const getChannelStats = asyncHandler(async (req, res) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
    const stats=await User.aggregate([
        {
            $match:{
                _id:new mongoose.Schema.Types.ObjectId(req.user._id)
            }
        },
        {
            $lookup:{
                from:"videos",
                localField:"_id",
                foreignField:"owner",
                as:"videos",
                pipeline:[
                    {
                        $lookup:{
                            from:"likes",
                            localField:"_id",
                            foreignField:"likedBy",
                            as:"likes"
                        }
                    }
                ]
            }
        },
        {
            $lookup:{
                from:"subscriptions",
                localField:"_id",
                foreignField:"channel",
                as:"subscribers"
            }
        },
        {
            $addFields:{
                totalVideoViews:{
                    $sum:"$videos.views"
                },
                totalSubscribers:{
                    $size:"$subscribers"
                },
                totalVideos:{
                    $size:"$videos"
                },
                totalLikes:{
                    $sum:"$videos.likes"
                }
            }
        },
        {
            $project:{
                totalVideoViews:1,
                totalSubscribers:1,
                totalVideos:1,
                totalLikes:1
            }
        }
    ])
    if(!stats)
        {
            throw new ApiError(400,"No data found")
        }
        return res.status(200).json(new ApiResponse(200,stats[0],"dashboard data returned successfully"))
})

const getChannelVideos = asyncHandler(async (req, res) => {
    // TODO: Get all the videos uploaded by the channel
    const videos=await Video.find({owner:req.user._id})
    return res.status(200).json(new ApiResponse(200,videos,"Videos returned successfully"))
})

export {
    getChannelStats, 
    getChannelVideos
    }