import { Schema, model, Types } from "mongoose";
import { ITrainingSession } from "./session.interface";

const videoSchema: Schema = new Schema({
    title: { type: String, required: true },
    url: { type: String, required: true },
    duration: { type: String, required: true },
});


const trainingSessionSchema: Schema<ITrainingSession> = new Schema({
    trainer_id: { type: Types.ObjectId, ref: "Trainer"},
    title: { type: String, required: true},
    sessionType: { type: String, enum: ["live", "recorded"], required: true },
    sessionMode: { type: String, enum: ["group", "1on1"], required: true },
    fitnessFocus: { type: [String], required: true },
    otherFocus: { type: String, required: true },
    recordedContent: { type: [videoSchema] }, 
    accessType: { type: String, enum: ["free", "membership", "followers"], required: true },
    frequency: { type: String, enum: ["weekly", "monthly"], required: true },
    membership_fee: { type: Number, required: false },
    promo_image: { type: String },
    promo_video: { type: String },
}, { timestamps: true }); 

// Create the TrainingSession model
export const TrainingSession = model<ITrainingSession>("TrainingSession", trainingSessionSchema);
