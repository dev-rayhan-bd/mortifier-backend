import { NextFunction, Request, Response } from "express";
import { specialismServices } from "./specialism.services";



const createSpecialism = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id
        const data = req.body

        const result = await specialismServices.createSpecialism(id, data);

        res.status(200).json({
            success: true,
            message: 'trainer updated successfully',
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

export const specialismController = {
    createSpecialism,
}