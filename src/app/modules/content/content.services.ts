import { SortOrder } from "mongoose";
import { paginationHelpers } from "../../helpers/pagination";
import { IContent } from "./content.interface";
import { Content } from "./content.model";
import { Trainer } from "../trainer/trainer.model";
import { Trainee } from "../trainee/trainee.model";


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

const getMyContent = async (user: any,): Promise<IContent[] | null> => {
    const result = await Content.find({ userId: user?.id })
    return result
}

const getAllContent = async (
    paginationOptions: any,
    searchTerm: any,
    filtersData: any
): Promise<any> => {
    const { limit, page, skip, sortBy, sortOrder } = paginationHelpers.calculatePagination(paginationOptions);

    const andConditions = [];

    const contentSearchableFields = ["title", "content", "specialism"];

    if (searchTerm) {
        andConditions.push({
            $or: contentSearchableFields.map((field) => ({
                [field]: {
                    $regex: searchTerm,
                    $options: "i", // Case-insensitive search
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

    const sortConditions: { [key: string]: SortOrder } = {};
    if (sortBy && sortOrder) {
        sortConditions[sortBy] = sortOrder;
    }

    const whereConditions = andConditions.length > 0 ? { $and: andConditions } : {};

    // Fetch contents with populated fields
    const contents = await Content.find(whereConditions)
        .populate({
            path: "userId", // Populate userId field
            select: "email role status", // Select necessary fields
            // populate: [
            //     {
            //         path: "trainer", // Populate trainer if it exists
            //         select: "firstName lastName specialism qualification onlineSession faceToFace consultationType",
            //     },
            //     {
            //         path: "trainee", // Populate trainee if it exists
            //         select: "firstName lastName fitterGoal interest towardsGoal achieveGoal",
            //     },
            // ],
        })
        .sort(sortConditions)
        .skip(skip)
        .limit(limit)
        .lean(); // Use lean for plain JS objects (better performance)

    // Count total documents
    const total = await Content.countDocuments(whereConditions);

    return {
        meta: {
            page,
            limit,
            total,
        },
        data: contents,
    };
};

export const contentServices = {
    createContent,
    getSingleContent,
    getMyContent,
    getAllContent,
}
