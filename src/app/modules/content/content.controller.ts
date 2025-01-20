import { NextFunction, Request, Response } from "express";
import { contentServices } from "./content.services";

const createContent = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const file = req.file
        const { userInfo, traineeData } = req.body;
        console.log(userInfo, traineeData);

        const result = await contentServices.createContent()
        res.status(200).json({
            success: true,
            message: 'content created successfully',
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

export const contentController = {
    createContent,
}