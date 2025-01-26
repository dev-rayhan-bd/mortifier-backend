import { Types } from "mongoose";

export interface IPurchaseAccess {
    session_id?: Types.ObjectId;
    user_id?: Types.ObjectId;
    purchaseDate: Date;
    paymentStatus: "pending" | "paid" | "failed";
    paymentDetails?: {
        transactionId: string;
        amountPaid: number;
    };
}
