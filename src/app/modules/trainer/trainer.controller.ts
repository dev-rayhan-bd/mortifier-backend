import { NextFunction, Request, Response } from "express";
import { trainerServices } from "./trainer.services";

const updateTriner = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const file = req?.file
        const id = req.params.id
        // const user = req.user
        const data = JSON.parse(req.body.data)

        const result = await trainerServices.updateTrainer(file,id, data);

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

export const trainerController = {
    updateTriner,
}

