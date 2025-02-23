import mongoose, { Types } from "mongoose";
import { IChat, IChatAdmin } from "./chats.interface"
import { Chats, ChatsAdmin } from "./chats.model"


const createMessage = async (data: IChat): Promise<any> => {
    console.log('service', data);

    // নতুন মেসেজ তৈরি করা
    const result = await Chats.create(data);

    // Trainer এবং Trainee থেকে sender ও receiver এর তথ্য আনতে aggregate ব্যবহার
    const populatedMessage = await Chats.aggregate([
        {
            $match: { _id: result._id }
        },
        {
            $lookup: {
                from: "trainers", // Trainer collection
                localField: "sender",
                foreignField: "_id",
                as: "senderTrainerInfo"
            }
        },
        {
            $lookup: {
                from: "trainees", // Trainee collection
                localField: "sender",
                foreignField: "_id",
                as: "senderTraineeInfo"
            }
        },
        {
            $lookup: {
                from: "trainers",
                localField: "receiver",
                foreignField: "_id",
                as: "receiverTrainerInfo"
            }
        },
        {
            $lookup: {
                from: "trainees",
                localField: "receiver",
                foreignField: "_id",
                as: "receiverTraineeInfo"
            }
        },
        {
            $addFields: {
                senderInfo: { $concatArrays: ["$senderTrainerInfo", "$senderTraineeInfo"] },
                receiverInfo: { $concatArrays: ["$receiverTrainerInfo", "$receiverTraineeInfo"] }
            }
        },
        {
            $unwind: {
                path: "$senderInfo",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $unwind: {
                path: "$receiverInfo",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $project: {
                _id: 1,
                message: 1,
                createdAt: 1,
                updatedAt: 1,
                sender: {
                    _id: "$senderInfo._id",
                    firstName: "$senderInfo.firstName",
                    lastName: "$senderInfo.lastName",
                    email: "$senderInfo.profileImageUrl",
                    profilePic: "$senderInfo.profilePic",
                    role: {
                        $cond: {
                            if: { $gt: [{ $size: "$senderTrainerInfo" }, 0] },
                            then: "Trainer",
                            else: "Trainee"
                        }
                    }
                },
                receiver: {
                    _id: "$receiverInfo._id",
                    firstName: "$receiverInfo.firstName",
                    lastName: "$receiverInfo.lastName",
                    email: "$receiverInfo.profileImageUrl",
                    profilePic: "$receiverInfo.profilePic",
                    role: {
                        $cond: {
                            if: { $gt: [{ $size: "$receiverTrainerInfo" }, 0] },
                            then: "Trainer",
                            else: "Trainee"
                        }
                    }
                }
            }
        }
    ]);

    return populatedMessage.length > 0 ? populatedMessage[0] : result;
};


const createAdminMessage = async (data: IChatAdmin): Promise<any> => {

    const result = await ChatsAdmin.create(data)
    return result;
}

const getUserChats = async (data: any): Promise<IChat[]> => {

    const result = await Chats.find({
        $or: [
            { sender: data?.sender, receiver: data?.receiver },
            { sender: data?.receiver, receiver: data?.sender }
        ]
    })
    return result
}

const getAdminChats = async (data: any) => {
    console.log(data);
    const sender = data?.sender;
    const receiver = data?.receiver;
    const result = await ChatsAdmin.find({
        $or: [
            { sender, receiver },
            { sender: receiver, receiver: sender }
        ]
    });

    return result;

};

const getAlUserWithIChats = async (currentUserId: string) => {
    console.log(currentUserId);
    try {
        const result = await Chats.aggregate([
            {
                $match: {
                    $or: [
                        { sender: new mongoose.Types.ObjectId(currentUserId) },
                        { receiver: new mongoose.Types.ObjectId(currentUserId) },
                    ],
                },
            },
            // {
            //     $project: {
            //         otherUser: {
            //             $cond: {
            //                 if: { $eq: ["$sender", new Types.ObjectId(currentUserId)] },
            //                 then: "$receiver",
            //                 else: "$sender",
            //             },
            //         },
            //         message: 1,
            //         createdAt: 1,
            //     },
            // },
            // {
            //     $sort: { createdAt: -1 },
            // },
            // {
            //     $group: {
            //         _id: "$otherUser",
            //         lastMessage: { $first: "$message" },
            //         lastMessageDate: { $first: "$createdAt" },
            //     },
            // },
            // {
            //     $lookup: {
            //         from: "customers",
            //         localField: "_id",
            //         foreignField: "_id",
            //         as: "userDetails",
            //     },
            // },
            // {
            //     $unwind: "$userDetails",
            // },
            // {
            //     $project: {
            //         _id: 1,
            //         firstName: "$userDetails.firstName",
            //         lastName: "$userDetails.lastName",
            //         contactNo: "$userDetails.contactNo",
            //         profileImageUrl: "$userDetails.profileImageUrl",
            //         lastMessage: 1,
            //         lastMessageDate: 1,
            //     },
            // },
            // {
            //     $sort: { lastMessageDate: -1 },
            // },
        ]);

        return result;

    } catch (error) {
        console.error("Error fetching chat users:", error);
        throw error;
    }
}


export const messageServices = {
    createMessage,
    createAdminMessage,
    getUserChats,
    getAdminChats,
    getAlUserWithIChats,
}