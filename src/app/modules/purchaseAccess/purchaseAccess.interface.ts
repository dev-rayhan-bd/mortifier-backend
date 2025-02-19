import { Types } from "mongoose";

export interface IPurchaseAccess {
    session_id?: Types.ObjectId;
    user_id?: Types.ObjectId;
    trainer_id?: Types.ObjectId;
    purchaseDate: Date;
    paymentStatus: "pending" | "paid" | "failed" | "free";
    paymentDetails?: {
        transactionId: string;
        amountPaid: number;
    };
}
