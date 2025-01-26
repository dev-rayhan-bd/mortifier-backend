import { NextFunction, Request, Response } from "express"
import { trainingSessionValidatedSchema } from "./session.validation"
import { sessionServices } from "./session.services"


const createSession = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const files = req.files as {
            [fieldname: string]: Express.Multer.File[];
        };

        const image = files.image?.[0];
        const video = files.video?.[0];

        if (!image || !video) {
            throw new Error("Both image and video files are required.");
        }
        const user = req.user
        const data = JSON.parse(req.body.data)
        const content = trainingSessionValidatedSchema.parse(data)
        // console.log('file',file);
        // console.log('content',content);
        console.log('user', user);

        const result = await sessionServices.createSession(image, video, user, content)
        res.status(200).json({
            success: true,
            message: 'session created successfully',
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

export const sessionController = {
    createSession,
}