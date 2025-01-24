import AppError from '../../errors/AppError';
import { Trainee } from '../trainee/trainee.model';
import { ITrainee } from '../trainee/trainee.interface';
import { IUser } from "./user.interface";
import { User } from "./user.model"
import { ITrainer } from '../trainer/trainer.interface';
import { Trainer } from '../trainer/trainer.model';
import mongoose from 'mongoose';

const createTrainee = async (validateUserInfo: Partial<IUser>, validateTraineeData: ITrainee, file:any): Promise<ITrainee | undefined> => {
    const userData = {
        email: validateUserInfo?.email,
        password: validateUserInfo?.password,
        role: "trainee",
        status: 'in-progress',
    }
    
    const userNameExist = await Trainee.findOne({ userName: validateTraineeData.userName })
    if (userNameExist) {
        throw new AppError(400, 'User Name already exists!')
    }
    const isExist = await User.findOne({ email: userData.email })

    if (isExist) {
        throw new AppError(400, 'User already exists!')
    }

    const result = await User.create(userData);


    if (result?._id) {
        validateTraineeData.user = result?._id
        validateTraineeData.profileImageUrl = `/uploads/${file.filename}`;
        const traineeResult = await Trainee.create(validateTraineeData)
        return traineeResult
    }
}

const createTrainer = async (validateUserInfo: Partial<IUser>, validateTrainerData: ITrainer): Promise<ITrainer | undefined> => {
    const userData = {
        email: validateUserInfo?.email,
        password: validateUserInfo?.password,
        role: "trainer",
        status: 'in-progress',
    }
    const isExist = await User.findOne({ email: userData.email })

    if (isExist) {
        throw new AppError(400, 'User already exists!')
    }

    const result = await User.create(userData);


    if (result?._id) {
        validateTrainerData.user = result?._id
        const trainerResult = await Trainer.create(validateTrainerData)
        return trainerResult
    }
}

const getMe = async (user: any) => {
    const userId = new mongoose.Types.ObjectId(user.id);
    const result = await User.aggregate([
        {
            $match: { _id: userId },
        },
        {
            $lookup: {
                from: 'trainers',
                localField: '_id',
                foreignField: 'user',
                as: 'trainerDetails',
            },
        },
        {
            $lookup: {
                from: 'trainees',
                localField: '_id',
                foreignField: 'user',
                as: 'traineeDetails',
            },
        },
        // Filter out empty arrays before returning the result
        {
            $addFields: {
                trainerDetails: {
                    $cond: { if: { $ne: ["$trainerDetails", []] }, then: "$trainerDetails", else: "$$REMOVE" },
                },
                traineeDetails: {
                    $cond: { if: { $ne: ["$traineeDetails", []] }, then: "$traineeDetails", else: "$$REMOVE" },
                },
            },
        },
    ]);
    return result;
};

// const getMeTrainee = async (user: any) => {
//     const userId = new mongoose.Types.ObjectId(user.id);
//     const result = await User.aggregate([
//         {
//             $match: { _id: userId },
//         },
//         {
//             $lookup: {
//                 from: 'trainees',
//                 localField: '_id',
//                 foreignField: 'user',
//                 as: 'traineeDetails',
//             },
//         },
//     ]);
//     return result
// }

export const userServices = {
    createTrainee,
    createTrainer,
    getMe,
    // getMeTrainee,
}