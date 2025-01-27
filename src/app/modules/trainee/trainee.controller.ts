import { NextFunction, Request, Response } from "express";
import { traineeServices } from "./trainee.services";
import { IPaginationOptions } from "../../global/globalType";

const getAllTrainee = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { limit, page, sortBy, sortOrder, searchTerm } = req.query;

        const paginationOptions: IPaginationOptions = {
            limit: Number(limit) || 10,
            page: Number(page) || 1,
            sortBy: sortBy?.toString() || 'createdAt',
            sortOrder: sortOrder?.toString() === 'desc' ? 'desc' : 'asc',
        };

        const result = await traineeServices.getAllTrainee(paginationOptions, searchTerm);

        res.status(200).json({
            success: true,
            message: 'get all trainee successfully',
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

export const traineeController = {
    getAllTrainee,
}

