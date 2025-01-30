import { Schema, model, Types } from "mongoose";
import { IFollower } from "./follower.interface";

const followerSchema: Schema<IFollower> = new Schema({
    follower_id: { type: Types.ObjectId, ref: "User"},
    following_id: { type: Types.ObjectId, ref: "User"},
}, { timestamps: true });

export const Follower = model<IFollower>("Follower", followerSchema);
