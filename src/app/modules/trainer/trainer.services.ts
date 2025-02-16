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

const getTrainersByMonth = async () => {
    const result = await Trainer.aggregate([
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


export const trainerServices = {
    updateTrainer,
    getAllTrainer,
    getTrainersByMonth,
}