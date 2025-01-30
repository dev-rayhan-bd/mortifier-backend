import { NextFunction, Request, Response } from "express"
import { followAndUnfollowServices } from "./follower.services"


const followAndUnfollow = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = req.body
        const result = await followAndUnfollowServices.followAndUnfollow(data)

        res.status(200).json({
            success: true,
            message: result?.message,
            data: result,
        })
        // sendResponse(res, {
        //     statusCode: httpStatus.OK,
        //     success: true,
        //     message: 'user created successfully',
        //     data: result,
        // });
    }
    catch (error) {
        next(error)
    }
}

const getMyfollower = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user

        const result = await followAndUnfollowServices.getMyfollower(user)

        res.status(200).json({
            success: true,
            message: 'get follower successfully',
            data: result,
        })
        // sendResponse(res, {
        //     statusCode: httpStatus.OK,
        //     success: true,
        //     message: 'user created successfully',
        //     data: result,
        // });
    }
    catch (error) {
        next(error)
    }
}


export const followAndUnfollowController = {
    followAndUnfollow,
    getMyfollower,
}