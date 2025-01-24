import { NextFunction, Request, Response } from "express";
import { userServices } from "./user.services";
import { userValidationSchema } from "./user.validation";
import { traineeValidatedSchema } from "../trainee/trainee.validation";
import { trainerValidatedSchema } from "../trainer/trainer.validation";


const createTrainee = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const file = req.file
        const data = JSON.parse(req.body.data)
        console.log('sadfasfsaf',data);
        const { userInfo, traineeData } = data;
        console.log(userInfo, traineeData);
        const validateUserInfo = userValidationSchema.parse(userInfo)
        const validateTraineeData = traineeValidatedSchema.parse(traineeData)
        const result = await userServices.createTrainee(validateUserInfo, validateTraineeData,file);
        res.status(200).json({
            success: true,
            message: 'trainee created successfully',
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

const createTrainer = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userInfo, trainerData } = req.body;
        console.log(userInfo, trainerData);
        const validateUserInfo = userValidationSchema.parse(userInfo)
        const validateTrainerData = trainerValidatedSchema.parse(trainerData)
        const result = await userServices.createTrainer(validateUserInfo, validateTrainerData);
        res.status(200).json({
            success: true,
            message: 'trainer created successfully',
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

const getMe = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user;
        console.log(user);
        const result = await userServices.getMe(user);
        res.status(200).json({
            success: true,
            message: 'get my data successfully',
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

// const getMeTrainee = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const user = req.user;
//         console.log(user);
//         const result = await userServices.getMeTrainee(user);
//         res.status(200).json({
//             success: true,
//             message: 'get my data successfully',
//             data: result,
//         })
//         // sendResponse(res, {
//         //     statusCode: httpStatus.OK,
//         //     success: true,
//         //     message: 'user created successfully',
//         //     data: result,
//         // });
//     }
//     catch (error) {
//         next(error)
//     }
// }

export const userController = {
    createTrainee,
    createTrainer,
    getMe,
    // getMeTrainee,
}