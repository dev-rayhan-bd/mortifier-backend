import { IPaginationOptions } from "../../global/globalType";
import { paginationHelpers } from "../../helpers/pagination";
import { ITrainer } from "./trainer.interface";
import { Trainer } from "./trainer.model";


const updateTrainer = async (file: any, id: string, data: Partial<ITrainer>) => {
    if (file) {
        data.profileImageUrl = `/uploads/${file.filename}`;
    }

    const result = await Trainer.findByIdAndUpdate(
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

const getAllTrainer = async (paginationOptions: IPaginationOptions, searchTerm: any, filtersData: any): Promise<any> => {
    const { limit, page, skip, sortBy, sortOrder } = paginationHelpers.calculatePagination(paginationOptions);

    const andConditions = [];


    const contentSearchableFields = ["firstName", "lastName", "email", "consultationType"];

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

    const result = await Trainer.find(whereConditions)
        .sort(sortConditions)
        .skip(skip)
        .limit(limit)
    const total = await Trainer.countDocuments(whereConditions);

    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };

}


export const trainerServices = {
    updateTrainer,
    getAllTrainer,
}