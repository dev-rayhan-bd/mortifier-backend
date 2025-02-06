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
    }
    catch (error) {
        next(error)
    }
}

const getAllSession = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { limit, page, sortBy, sortOrder, searchTerm, ...filters } = req.query;

        const paginationOptions = {
            limit: Number(limit) || 10,
            page: Number(page) || 1,
            sortBy: sortBy?.toString() || 'createdAt',
            sortOrder: sortOrder?.toString() === 'desc' ? 'desc' : 'desc',
        };
        console.log(paginationOptions);

        const result = await sessionServices.getAllSession(paginationOptions, searchTerm as string , filters)
        res.status(200).json({
            success: true,
            message: 'get all session successfully',
            data: result,
        })
    }
    catch (error) {
        next(error)
    }
}

const updateSession = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const file = req.file
        const user = req.user
        const id = req.params.id
        const content = JSON.parse(req.body.data)

        const result = await sessionServices.updateSession(id,file, user, content)
        res.status(200).json({
            success: true,
            message: 'session updated successfully',
            data: result,
        })
    }
    catch (error) {
        next(error)
    }
}

export const sessionController = {
    createSession,
    getAllSession,
    updateSession,
}