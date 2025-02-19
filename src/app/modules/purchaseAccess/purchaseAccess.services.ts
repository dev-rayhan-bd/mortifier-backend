import { JwtPayload } from "jsonwebtoken";
import AppError from "../../errors/AppError";
import { IPurchaseAccess } from "./purchaseAccess.interface"
import { PurchaseAccess } from "./purchaseAccess.model";
import mongoose from "mongoose";


const checkEnrollment = async (data: IPurchaseAccess): Promise<{ enrolled: boolean }> => {
    const result = await PurchaseAccess.findOne({
        session_id: data?.session_id,
        user_id: data?.user_id
    })

    return result ? { enrolled: true } : { enrolled: false };
}

const enrollNow = async (data: IPurchaseAccess): Promise<IPurchaseAccess> => {
    const isExist = await PurchaseAccess.findOne({
        session_id: data?.session_id,
        user_id: data?.user_id
    })

    if (isExist) {
        throw new AppError(400, "User already enrolled in this session");
    }

    const result = await PurchaseAccess.create(data);
    return result;
}

const myEnrolledSesion = async (data: JwtPayload | null) => {

    const session = await PurchaseAccess.aggregate([
        { $match: { user_id: new mongoose.Types.ObjectId(String(data?.id)) } },
        {
            $lookup: {
                from: "trainingsessions",
                localField: "session_id",
                foreignField: "_id",
                as: "sessionDetails"
            }
        },
        {
            $project: {
                "sessionDetails.recordedContent": 0
            }
        }
    ])

    return session;
}

const getTotalEnrollment = async (sessionId: string) => {
    const result = await PurchaseAccess.aggregate([
        {
            $match: { session_id: new mongoose.Types.ObjectId(sessionId) }
        },
        {
            $lookup: {
                from: "users",
                localField: "user_id",
                foreignField: "_id",
                as: "userInfo"
            }
        },
        { $unwind: "$userInfo" },
        {
            $lookup: {
                from: "trainees",
                localField: "userInfo._id",
                foreignField: "user",
                as: "traineeInfo"
            }
        },
        { $unwind: { path: "$traineeInfo", preserveNullAndEmptyArrays: true } },
        {
            $lookup: {
                from: "trainers",
                localField: "userInfo._id",
                foreignField: "user",
                as: "trainerInfo"
            }
        },
        { $unwind: { path: "$trainerInfo", preserveNullAndEmptyArrays: true } },
        {
            $addFields: {
                additionalInfo: {
                    $cond: {
                        if: { $gt: [{ $type: "$trainerInfo" }, "missing"] },
                        then: "$trainerInfo",
                        else: "$traineeInfo"
                    }
                }
            }
        },
        {
            $project: {
                userInfo: 0,
                trainerInfo: 0,
                traineeInfo: 0
            }
        }
    ]);

    return result;
};



export const purchaseAccessServices = {
    checkEnrollment,
    enrollNow,
    myEnrolledSesion,
    getTotalEnrollment,
}