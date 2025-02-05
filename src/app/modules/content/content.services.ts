import mongoose, { SortOrder } from "mongoose";
import { paginationHelpers } from "../../helpers/pagination";
import { IContent } from "./content.interface";
import { Content } from "./content.model";
import { Trainer } from "../trainer/trainer.model";
import { Trainee } from "../trainee/trainee.model";
import AppError from "../../errors/AppError";


const createContent = async (file: any, content: IContent, user: any): Promise<IContent> => {

    if (file) {
        if (file.mimetype.startsWith("image/")) {
            content.imageUrl = `/uploads/${file.filename}`;
            content.userId = user?.id;
        } else if (file.mimetype.startsWith("video/")) {
            content.videoUrl = `/uploads/${file.filename}`;
            content.userId = user?.id;
        } else {
            throw new Error("Invalid file type. Only images and videos are allowed.");
        }
    }
    const result = await Content.create(content)
    return result
}

const getSingleContent = async (id: string): Promise<IContent | null> => {
    const result = await Content.findById({ _id: id })
    return result
}

const getMyContent = async (
    user: any,
    paginationOptions: any,
    searchTerm: any
): Promise<any> => {
    const { limit, page, skip, sortBy, sortOrder } = paginationHelpers.calculatePagination(paginationOptions);

    const contentSearchableFields = ["title", "content", "specialism"];
    const andConditions: any[] = [
        {
            userId: user?.id,
        },
    ];

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

    const whereConditions = andConditions.length > 0 ? { $and: andConditions } : {};

    const result = await Content.find(whereConditions)
        .limit(limit)
        .skip(skip)
        .sort(sortBy ? { [sortBy]: sortOrder === "asc" || sortOrder === "ascending" ? 1 : -1 } : {});

    const total = await Content.countDocuments(whereConditions);

    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
};

const getAllContent = async (
    paginationOptions: any,
    searchTerm: any,
    role: any,
    filtersData: any,
    user: any
): Promise<any> => {
    const { limit, page, skip, sortBy, sortOrder } = paginationHelpers.calculatePagination(paginationOptions);
   const loggedInUserId = new mongoose.Types.ObjectId(user.id);

    const andConditions = [];

    const contentSearchableFields = ["title", "content", "specialism"];

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

    const aggregationPipeline = [
        { $match: whereConditions },
        {
            $lookup: {
                from: "users",
                localField: "userId",
                foreignField: "_id",
                as: "userDetails",
            },
        },
        { $unwind: { path: "$userDetails", preserveNullAndEmptyArrays: true } },
        {
            $lookup: {
                from: "trainers",
                localField: "userDetails._id",
                foreignField: "user",
                as: "trainerDetails",
            },
        },
        {
            $lookup: {
                from: "trainees",
                localField: "userDetails._id",
                foreignField: "user",
                as: "traineeDetails",
            },
        },
        { $match: role ? { "userDetails.role": role } : {} },
        {
            $lookup: {
                from: "likes",
                let: { contentId: "$_id" },
                pipeline: [
                    { 
                        $match: { 
                            $expr: { 
                                $and: [
                                    { $eq: ["$contentId", "$$contentId"] }, 
                                    { $eq: ["$userId", { $toObjectId: loggedInUserId }] } 
                                ] 
                            } 
                        } 
                    },
                    { $limit: 1 }
                ],
                as: "likedByUser",
            },
        },
        {
            $addFields: {
                userInfo: {
                    $arrayElemAt: [{ $concatArrays: ["$trainerDetails", "$traineeDetails"] }, 0],
                },
                isLiked: { $gt: [{ $size: "$likedByUser" }, 0] }, // Check if there is a like from the logged-in user
            },
        },
        {
            $project: {
                title: 1,
                content: 1,
                specialism: 1,
                status: 1,
                imageUrl: 1,
                userId: 1,
                createdAt: 1,
                updatedAt: 1,
                "userDetails.email": 1,
                "userDetails.role": 1,
                "userInfo.firstName": 1,
                "userInfo.lastName": 1,
                "userInfo.profileImageUrl": 1,
                isLiked: 1,
            },
        },
        { $sort: sortConditions },
    ];

    const totalResult = await Content.aggregate([
        ...aggregationPipeline,
        { $count: "total" },
    ]);

    const total = totalResult.length > 0 ? totalResult[0].total : 0;

    const result = await Content.aggregate([
        ...aggregationPipeline,
        { $skip: skip },
        { $limit: limit },
    ]);

    return {
        meta: { page, limit, total },
        data: result,
    };
};



const updateContent = async (file: any, content: IContent, user: any, id: string): Promise<IContent | null> => {

    if (file) {
        if (file.mimetype.startsWith("image/")) {
            content.imageUrl = `/uploads/${file.filename}`;
            content.userId = user?.id;
        } else if (file.mimetype.startsWith("video/")) {
            content.videoUrl = `/uploads/${file.filename}`;
            content.userId = user?.id;
        } else {
            throw new Error("Invalid file type. Only images and videos are allowed.");
        }
    }
    const result = await Content.findByIdAndUpdate(
        {
            _id: id
        },
        content,
        {
            new: true
        }
    )
    return result
}


const deleteContent = async (id: string, user: any): Promise<IContent | null> => {

    const content = await Content.findById(id);

    if (!content) {
        throw new Error("Content not found");
    }

    if (!content.userId) {
        throw new AppError(400, "Content userId is missing");
    }
    if (content?.userId.toString() as string !== user.id.toString()) {
        throw new AppError(403, "Unauthorized: You can't delete others' content");
    }
    const result = Content.findByIdAndDelete({ _id: id })

    return result;
}

export const contentServices = {
    createContent,
    getSingleContent,
    getMyContent,
    getAllContent,
    updateContent,
    deleteContent,
}
