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
        console.log('user', user);

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

const getSingleContent = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id
        const result = await contentServices.getSingleContent(id)
        res.status(200).json({
            success: true,
            message: 'get single content successfully',
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

const getMyContent = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user
        console.log(user);
        const result = await contentServices.getMyContent(user)
        res.status(200).json({
            success: true,
            message: 'get my content successfully',
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

const getAllContent = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const { limit, page, sortBy, sortOrder, searchTerm, role, ...filters } = req.query;

        const paginationOptions = {
            limit: Number(limit) || 10,
            page: Number(page) || 1,
            sortBy: sortBy?.toString() || 'createdAt',
            sortOrder: sortOrder?.toString() === 'desc' ? 'desc' : 'asc',
        };
        console.log(paginationOptions);

        const result = await contentServices.getAllContent(paginationOptions,searchTerm,role, filters)
        res.status(200).json({
            success: true,
            message: 'get all content successfully',
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
    getSingleContent,
    getMyContent,
    getAllContent,
}