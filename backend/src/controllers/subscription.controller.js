import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.models.js"
import { Subscription } from "../models/subscription.models.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const toggleSubscription = asyncHandler(async (req, res) => {
    const { channelId } = req.params;

    // Ensure the channel ID is provided
    if (!channelId) {
        throw new ApiError(400, "Channel id is required");
    }

    // Check if the user is already subscribed
    const subscriber = await Subscription.findOne({
        subscriber: req.user?._id,
        channel: channelId,
    });

    if (!subscriber) {
        // If not subscribed, create a new subscription
        const newSubscriber = await Subscription.create({
            subscriber: req.user?._id,
            channel: channelId,
        });

        if (!newSubscriber) {
            throw new ApiError(400, "There was a problem while adding the subscription");
        }

        // Return success response
        return res.status(200).json(new ApiResponse(200, newSubscriber, "Subscription is added to the channel"));
    }

    // If already subscribed, remove the subscription
    const deleteSubscriber = await Subscription.findByIdAndDelete(subscriber._id);

    if (!deleteSubscriber) {
        throw new ApiError(400, "There was a problem while removing the subscription");
    }

    // Return success response for subscription removal
    return res.status(200).json(new ApiResponse(200, deleteSubscriber, "Subscription was removed"));
});

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params

    const subscriberList=await User.aggregate([
        {
            $match:{
                _id:new mongoose.Schema.Types.ObjectId(req.user?._Id)
            }
        },
        {
            $lookup:{
                from:"subscriptions",
                localField:"_id",
                foreignField:"channel",
                as:"subscriberList",
                pipeline:[
                    {
                        $lookup:{
                            from:"users",
                            localField:"subscriber",
                            foreignField:"_id",
                            as:"subscriber",
                            pipeline:[
                                {
                                    $project:{
                                        fullname:1,
                                        username:1,
                                        email:1,
                                        avatar:1
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $addFields:{
                            subscriber:{
                                $first:"subscriber"
                            }
                        }
                    },
                    {
                        $lookup:{
                            from:"users",
                            localField:"channel",
                            foreignField:"_id",
                            as:"channel",
                            pipeline:[
                                {
                                    $project:{
                                        fullname:1,
                                        username:1,
                                        email:1,
                                        avatar:1
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $addFields:{
                            channel:{
                                $first:"channel"
                            }
                        }
                    },
                ]
            }
        },
        {
            $project:{
                subscriberList:1
            }
        }
    ])
    return res.status(200).json(new ApiResponse(200,subscriberList[0].subscriberList))
})

const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params;

    // Aggregate query to get the subscribed channels
    const ChannelList = await User.aggregate([
        {
            $match: {
                _id: new mongoose.Schema.Types.ObjectId(subscriberId),
            },
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "subscriber",
                as: "ChannelList",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "subscriber",
                            foreignField: "_id",
                            as: "subscriber",
                            pipeline: [
                                {
                                    $project: {
                                        fullname: 1,
                                        username: 1,
                                        email: 1,
                                        avatar: 1,
                                    },
                                },
                            ],
                        },
                    },
                    {
                        $addFields: {
                            subscriber: {
                                $first: "$subscriber", // Extract the first element
                            },
                        },
                    },
                    {
                        $lookup: {
                            from: "users",
                            localField: "channel",
                            foreignField: "_id",
                            as: "channel",
                            pipeline: [
                                {
                                    $project: {
                                        fullname: 1,
                                        username: 1,
                                        email: 1,
                                        avatar: 1,
                                    },
                                },
                            ],
                        },
                    },
                    {
                        $addFields: {
                            channel: {
                                $first: "$channel", // Extract the first element
                            },
                        },
                    },
                ],
            },
        },
    ]);

    // Check if ChannelList exists and has data
    if (!ChannelList || ChannelList.length === 0 || !ChannelList[0].ChannelList) {
        return res.status(404).json(new ApiResponse(404, null, "No subscribed channels found"));
    }

    return res.status(200).json(new ApiResponse(200, ChannelList[0].ChannelList, "Subscribed Channel list returned successfully"));
});

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}