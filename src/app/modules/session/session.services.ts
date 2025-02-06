import { JwtPayload } from "jsonwebtoken";
import { Trainer } from "../trainer/trainer.model";
import { User } from "../users/user.model";
import { TrainingSession } from "./session.model";
import { IPaginationOptions } from "../../global/globalType";
import { paginationHelpers } from "../../helpers/pagination";
import mongoose from "mongoose";


const createSession = async (image: Express.Multer.File, video: Express.Multer.File, user: any, content: any) => {

    content.promo_image = `/uploads/${image.filename}`;
    content.promo_video = `/uploads/${video.filename}`;
    const isExistUser = await User.findOne({ email: user.email });

    if (!isExistUser) {
        throw new Error('User not found');
    }
    const isExistTrainer = await Trainer.findOne({ user: isExistUser._id });
    if (!isExistTrainer) {
        throw new Error('Trainer not found');
    }
    content.trainer_id = isExistTrainer._id;

    const result = await TrainingSession.create(content);
    return result;
}

const updateSession = async (id: string, file: any, user: any, content: any) => {
    const newVideo = {
        title: content.recordedContent.title,
        url: `/uploads/${file.filename}`,
        duration: content.recordedContent.duration,
    };

    const result = await TrainingSession.findByIdAndUpdate(
        { _id: id },
        {
            $push: { recordedContent: newVideo }
        },
        { new: true }
    );

    return result;
}

const getAllSession = async (
    paginationOptions: IPaginationOptions,
    searchTerm: string | undefined,
    filtersData: any,
) => {
    const { limit, page, skip, sortBy, sortOrder } = paginationHelpers.calculatePagination(paginationOptions);


    const andConditions = [];
    const contentSearchableFields = ["title", "otherFocus"];

    if (searchTerm) {
        andConditions.push({
            $or: contentSearchableFields.map((field) => ({
                [field]: {
                    $regex: searchTerm,
                    $options: "i",
                },
            })),
        });
    }

    if (Object.keys(filtersData).length) {
        andConditions.push({
            $and: Object.entries(filtersData).map(([field, value]) => ({
                [field]: value,
            })),
        });
    }

    const sortConditions: { [key: string]: 1 | -1 } = {};
    if (sortBy && sortOrder) {
        sortConditions[sortBy] = sortOrder === 'asc' || sortOrder === 'ascending' ? 1 : -1;
    }

    const whereConditions = andConditions.length > 0 ? { $and: andConditions } : {};
    const totalResult = await TrainingSession.aggregate([
        { $match: whereConditions },
        { $count: "total" },
    ]);
    const result = await TrainingSession.aggregate([
        { $match: whereConditions },
        { $sort: sortConditions },
        { $skip: skip },
        { $limit: limit },
        {
            $project: {
                recordedContent: 0
            }
        }
    ])
    const total = totalResult.length > 0 ? totalResult[0].total : 0;



    return {
        meta: { page, limit, total },
        data: result,
    };
}

export const sessionServices = {
    createSession,
    getAllSession,
    updateSession,
}