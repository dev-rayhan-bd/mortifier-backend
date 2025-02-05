import { IPaginationOptions } from "../../global/globalType";
import { paginationHelpers } from "../../helpers/pagination";
import { ITrainee } from "./trainee.interface";
import { Trainee } from "./trainee.model";


const getAllTrainee = async (paginationOptions: IPaginationOptions, searchTerm: any) => {
    const { limit, page, skip, sortBy, sortOrder } = paginationHelpers.calculatePagination(paginationOptions);

    const andConditions = [];


    const contentSearchableFields = ["firstName", "lastName", "email"];

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


    const sortConditions: { [key: string]: 1 | -1 } = {};
    if (sortBy && sortOrder) {
        sortConditions[sortBy] = sortOrder === 'asc' || sortOrder === 'ascending' ? 1 : -1;
    }

    const whereConditions = andConditions.length > 0 ? { $and: andConditions } : {};

    const result = await Trainee.find(whereConditions)
        .sort(sortConditions)
        .skip(skip)
        .limit(limit)
    const total = await Trainee.countDocuments(whereConditions);
    
        return {
            meta: {
                page,
                limit,
                total,
            },
            data: result,
        };

}

const updateTrainee = async (file: any, id: string, data: Partial<ITrainee>) => {
    if (file) {
        data.profileImageUrl = `/uploads/${file.filename}`;
    }

    const result = await Trainee.findByIdAndUpdate(
        {
            _id: id
        },
        data,
        {
            new: true
        }
    )
    return result

}

export const traineeServices = {
    getAllTrainee,
    updateTrainee,
}