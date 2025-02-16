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

const getTraineesByMonth = async () => {
    const result = await Trainee.aggregate([
      {
        $group: {
          _id: { $month: '$createdAt' },
          trainer: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          month: {
            $let: {
              vars: {
                months: [
                  'jan', 'feb', 'mar', 'apr', 'may', 'jun',
                  'jul', 'aug', 'sep', 'oct', 'nov', 'dec',
                ],
              },
              in: { $arrayElemAt: ['$$months', { $subtract: ['$_id', 1] }] },
            },
          },
          trainer: 1,
        },
      },
    ]);
  

    const allMonths = [
      { month: 'jan', trainer: 0 }, { month: 'feb', trainer: 0 },
      { month: 'mar', trainer: 0 }, { month: 'apr', trainer: 0 },
      { month: 'may', trainer: 0 }, { month: 'jun', trainer: 0 },
      { month: 'jul', trainer: 0 }, { month: 'aug', trainer: 0 },
      { month: 'sep', trainer: 0 }, { month: 'oct', trainer: 0 },
      { month: 'nov', trainer: 0 }, { month: 'dec', trainer: 0 },
    ];
  
    result.forEach(({ month, trainer }) => {
      const index = allMonths.findIndex((m) => m.month === month);
      if (index !== -1) {
        allMonths[index].trainer = trainer;
      }
    });
  
    return allMonths;
  };

export const traineeServices = {
    getAllTrainee,
    updateTrainee,
    getTraineesByMonth,
}