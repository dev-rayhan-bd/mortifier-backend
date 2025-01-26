import { Trainer } from "../trainer/trainer.model";
import { User } from "../users/user.model";
import { TrainingSession } from "./session.model";


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

export const sessionServices = {
    createSession,
    updateSession,
}