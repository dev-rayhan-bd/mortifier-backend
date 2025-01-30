import AppError from "../../errors/AppError";
import { Trainee } from "../trainee/trainee.model";
import { Trainer } from "../trainer/trainer.model";
import { IInvitation } from "./invitation.interface";
import { Invitation } from "./invitation.model";


const sentInvitation = async (data: IInvitation): Promise<IInvitation> => {

    const isTrainerExist = await Trainer.findById({ _id: data?.trainer_id })
    if (!isTrainerExist) {
        throw new AppError(404, 'trainer does not exist!')
    }

    const isTraineeExist = await Trainee.findById({ _id: data?.trainee_id })
    if (!isTraineeExist) {
        throw new AppError(404, 'trainee does not exist!')
    }

    const alreadySent = await Invitation.findOne({
        trainer_id: data.trainer_id,
        trainee_id: data.trainee_id,
    });
    
    if (alreadySent) {
        throw new AppError(400, "Invitation has already been sent!");
    }
    
    const result = await Invitation.create(data)
    return result;
}

export const invitationServices = {
    sentInvitation,
}