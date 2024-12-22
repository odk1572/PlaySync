import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import { User } from "../models/user.models.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
    const {content}=req.body
    if(content?.trim()==="")
        {
            throw new ApiError(400,"Content is nessary")
        }
        const newTweet=await Tweet.create({
            content,owner:req.user?._id
        })
        if(!newTweet)
            {
                throw new ApiError(200,"There was a problem while creating the tweet")
            }
            return res.status(200).json(new ApiResponse(200,newTweet,"Tweet was created successfully"))
})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
    const tweets=await Tweet.find({owner:req.user?._id})
    return res.status(200).json(new ApiResponse(200,tweets,"Tweets are returned successfully"))
})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
    const {tweetId,content}=req.body
    if(!tweetId)
        {
            throw new ApiError(400,"Tweet id is nessary")
        }
        if(content?.trim()==="")
            {
                throw new ApiError(400,"Content is nessary")
            }
    const updatedTweet=await Tweet.findByIdAndUpdate(
        tweetId,
        {
            $set:{
                content
            }
        }
    )
    if(!updateTweet)
        {
            throw new ApiError(400,"There was a problem while updating tweet")
        }
        return res.status(200).json(new ApiResponse(200,updatedTweet,"Tweet was updated successfully"))
})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
    const {tweetId}=req.body
    if(!tweetId)
        {
            throw new ApiError(400,"Tweet id is nessary")
        }
    const deletedTweet=await Tweet.findByIdAndDelete(tweetId)

    if(!deletedTweet)
        {
            throw new ApiError(400,"There was a problem while deleting the tweet")
        }
        return res.status(200).json(new ApiResponse(200,deleteTweet,"Tweet was deleted successfully"))
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}