import { Types } from "mongoose";

interface Video {
    title: string;
    url: string;
    duration: string;
}

export interface ITrainingSession {
    trainer_id?: Types.ObjectId;
    title: string,
    sessionType: "live" | "recorded";
    sessionMode: "group" | "1on1";
    fitnessFocus: string[];
    otherFocus: string;
    recordedContent?: Video[];
    accessType: "free" | "membership" | "followers";
    frequency: "weekly" | "monthly";
    membership_fee: number;
    promo_image?: string;
    promo_video?: string;
}
