import { z } from "zod";
import { Types } from "mongoose";

const VideoSchema = z.object({
    title: z.string({
        required_error: "Video title is required",
        invalid_type_error: "Video title must be a string",
    }).min(1, "Video title cannot be empty"),
    url: z.string({
        required_error: "Video URL is required",
        invalid_type_error: "Video URL must be a string",
    }).url("Video URL must be a valid URL"),
    duration: z.string({
        required_error: "Video duration is required",
        invalid_type_error: "Video duration must be a string",
    }),
});

export const trainingSessionValidatedSchema = z.object({
    trainer_id: z.custom<Types.ObjectId>((val) => Types.ObjectId.isValid(val), {
        message: "Invalid trainer ID",
    }).optional(),

    sessionType: z.enum(["live", "recorded"], {
        required_error: "Session type is required",
        invalid_type_error: "Session type must be 'live' or 'recorded'",
    }),

    sessionMode: z.enum(["group", "1on1"], {
        required_error: "Session mode is required",
        invalid_type_error: "Session mode must be 'group' or '1on1'",
    }),

    fitnessFocus: z.array(z.string({
        required_error: "Fitness focus is required",
        invalid_type_error: "Fitness focus must be a string",
    })),

    otherFocus: z.string({
        required_error: "Other focus is required",
        invalid_type_error: "Other focus must be a string",
    }).min(1, "Other focus cannot be empty"),

    recordedContent: z.array(VideoSchema).optional(),

    accessType: z.enum(["free", "membership", "followers"], {
        required_error: "Access type is required",
        invalid_type_error: "Access type must be 'free', 'membership', or 'followers'",
    }),

    frequency: z.enum(["weekly", "monthly"], {
        required_error: "Frequency is required",
        invalid_type_error: "Frequency must be 'weekly' or 'monthly'",
    }),

    membership_fee: z.number({
        required_error: "Membership fee is required",
        invalid_type_error: "Membership fee must be a number",
    }).min(0, "Membership fee cannot be negative"),

    promo_image: z.string().url("Promo image must be a valid URL").optional(),

    promo_video: z.string().url("Promo video must be a valid URL").optional(),
});
