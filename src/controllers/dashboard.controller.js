import mongoose from "mongoose"
import { Video } from "../models/video.model.js"
import { Subscription } from "../models/subscription.model.js"
import { Like } from "../models/like.model.js"
import { apiError } from "../utils/apiError.js"
import { apiResponse } from "../utils/apiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const getChannelStats = asyncHandler(async (req, res) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
    const channelId = req.user?._id

    if (!channelId) {
        throw new apiError(401, "Unauthorized request")
    }

    const videos = await Video.find({ owner: channelId })

    if (!videos) {
        throw new apiError(404, "No videos found")
    }

    const totalVideos = videos.length

    const totalViews = videos.reduce(
        (total, video) => total + video.views,
        0
    )

    const totalLikes = await Like.countDocuments({
        video: { $in: videos.map(video => video._id) }
    })

    const totalSubscribers = await Subscription.countDocuments({
        channel: channelId
    })

    return res.status(200).json(
        new apiResponse(
            200,
            {
                totalVideos,
                totalViews,
                totalLikes,
                totalSubscribers
            },
            "Channel stats fetched successfully"
        )
    )
})

const getChannelVideos = asyncHandler(async (req, res) => {
    // TODO: Get all the videos uploaded by the channel
    const channelId = req.user?._id

    if (!channelId) {
        throw new apiError(401, "Unauthorized request")
    }

    const videos = await Video.find({
        owner: channelId
    }).sort({ createdAt: -1 })

    if (!videos) {
        throw new apiError(404, "No videos found")
    }

    return res.status(200).json(
        new apiResponse(
            200,
            videos,
            "Channel videos fetched successfully"
        )
    )

})

export {
    getChannelStats,
    getChannelVideos
}