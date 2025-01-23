import { NextFunction, Request, Response } from "express";
import { contentServices } from "./content.services";
import { contentValidatedSchema } from "./content.validation";

const createContent = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const file = req.file
        const user = req.user
        const data = JSON.parse(req.body.data)
        const content = contentValidatedSchema.parse(data)
        // console.log('file',file);
        // console.log('content',content);
        console.log('user',user);

        const result = await contentServices.createContent(file, content, user)
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