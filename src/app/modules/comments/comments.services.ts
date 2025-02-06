import { JwtPayload } from "jsonwebtoken";
import { IComments } from "./comments.interface";
import { Comments } from "./comments.model";
import AppError from "../../errors/AppError";


const doComment = async (data: Partial<IComments>, user: JwtPayload | null): Promise<IComments | null> => {
    data.user_id = user?.id
    const result = await Comments.create(data);
    return result;
};

const getAllComments = async (id: string): Promise<IComments[] | null> => {
    const result = await Comments.find({ content_id: id });
    return result;
};

const deleteMyComment = async (id: string, user: JwtPayload | null): Promise<IComments | null> => {
    const comment = await Comments.findById(id);
    if (!comment) throw new AppError(400, "Comment not found");

    if (!user || comment.user_id.toString() !== user.id ) {
        throw new AppError(400, "You are not authorized to delete this comment");
    }
    const result = await Comments.findByIdAndDelete({ _id: id });
    return result;
};

export const commentsServices = {
    doComment,
    getAllComments,
    deleteMyComment,
};
