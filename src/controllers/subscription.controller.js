import mongoose, { isValidObjectId } from "mongoose"
import { User } from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import { apiError } from "../utils/apiError.js"
import { apiResponse } from "../utils/apiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    // TODO: toggle subscription
    const { channelId } = req.params

    if(!channelId){
        throw new apiError(400, "channelId is required")
    }

    if(!isValidObjectId(channelId)){
        throw new apiError(400, "Invalid channelId")
    }

    const channel = await User.findById(channelId)

    if(!channel){
        throw new apiError(404, "user does not exist")
    }

    const subscribed = await Subscription.exists(
        {
            subscriber: req.user._id,
            channel: channelId
        }
    )

    if(subscribed){
        await Subscription.findByIdAndDelete(subscribed._id)

        return res
        .status(200)
        .json(
            new apiResponse(
                200,
                null,
                "Unsubscribed Successfully"
            )
        )
    } else {
        const newSubscribed = await Subscription.create(
            {
                subscriber: req.user._id,
                channel: channelId
            }
        )

        return res.
        status(201)
        .json(
            new apiResponse(
                201,
                newSubscribed,
                "Subscribed Succesfully"
            )
        )
    }

})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const { channelId } = req.params
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}