import { Trainer } from "../trainer/trainer.model";
import { User } from "../users/user.model";
import { TrainingSession } from "./session.model";


const createSession = async (image: Express.Multer.File, video: Express.Multer.File, user: any, content: any) => {

    console.log('image',image);
    console.log('video',video);
    console.log('user',user);
    console.log('content',content);
    content.promo_image = `/uploads/${image.filename}`;
    content.promo_video = `/uploads/${video.filename}`;
    const isExistUser = await User.findOne({ email: user.email });
    console.log("user Info",isExistUser);
    if (!isExistUser) {
        throw new Error('User not found');
    }
    const isExistTrainer = await Trainer.findOne({ user: isExistUser._id });
    if (!isExistTrainer) {
        throw new Error('Trainer not found');
    }
    content.trainer_id = isExistTrainer._id;
    console.log('full content',content);
    // const result = await TrainingSession.create(content);
    return content;
}

export const sessionServices = {
    createSession,
}