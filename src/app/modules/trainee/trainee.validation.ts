import { Types } from "mongoose";
import { z } from "zod";


export const traineeValidatedSchema = z.object({
    firstName: z.string({
        required_error: "First name is required",
        invalid_type_error: "First name must be a string",
    }).min(1, "First name cannot be empty"),

    lastName: z.string({
        required_error: "Last name is required",
        invalid_type_error: "Last name must be a string",
    }).min(1, "Last name cannot be empty"),

    address: z.string({
        required_error: "Address is required",
        invalid_type_error: "Address must be a string",
    }).min(1, "Address is too short"),

    gender: z.enum(['male', 'female', 'others'], {
        required_error: "Gender is required",
        invalid_type_error: "Gender must be 'male', 'female', or 'others'",
    }).optional(),

    contactNo: z.string({
        required_error: "Contact number is required",
        invalid_type_error: "Contact number must be a string",
    }).min(5, "Contact number is too short").max(20, "Contact number is too long"),

    profileImageUrl: z.string().url("Profile image URL must be a valid URL").optional(),

    title: z.string({
        invalid_type_error: "Title must be a string",
    }),

    userName: z.string({
        required_error: "Username is required",
        invalid_type_error: "Username must be a string",
    }).min(1, "Username cannot be empty"),

    dob: z.preprocess(
        (val) => (typeof val === 'string' || val instanceof Date ? new Date(val) : undefined),
        z.date({
            required_error: "Date of birth is required",
            invalid_type_error: "Date of birth must be a valid date",
        })
    ),

    country: z.string({
        required_error: "Country is required",
        invalid_type_error: "Country must be a string",
    }).min(1, "Country cannot be empty"),

    city: z.string({
        required_error: "City is required",
        invalid_type_error: "City must be a string",
    }).min(1, "City cannot be empty"),

    height: z.number({
        invalid_type_error: "Height must be a number",
    }),

    weight: z.number({
        invalid_type_error: "Weight must be a number",
    }),

    fitterGoal: z.string({
        required_error: "Fitter goal is required",
        invalid_type_error: "Fitter goal must be a string",
    }).min(1, "Fitter goal cannot be empty"),

    interest: z.array(z.string({
        required_error: "Each interest must be a string",
        invalid_type_error: "Interest must be a string",
    }), {
        required_error: "Interest is required",
        invalid_type_error: "Interest must be an array of strings",
    }).min(1, "At least one interest is required"),

    towardsGoal: z.string({
        invalid_type_error: "Towards goal must be a string",
    }),

    achieveGoal: z.string({
        invalid_type_error: "Achieve goal must be a string",
    }),
    TikTok: z
        .string()
        .url("TikTok must be a valid URL")
        .optional(),
    Instagram: z
        .string()
        .url("Instagram must be a valid URL")
        .optional(),
    Facebook: z
        .string()
        .url("Facebook must be a valid URL")
        .optional(),
    Youtube: z
        .string()
        .url("Youtube must be a valid URL")
        .optional(),
    Twitter: z
        .string()
        .url("Twitter must be a valid URL")
        .optional(),
    user: z.custom<Types.ObjectId>((val) => Types.ObjectId.isValid(val), {
        message: 'Invalid user ID',
    }).optional(),
});
