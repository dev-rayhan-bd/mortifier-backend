import { ITrainer } from "./trainer.interface";
import { Trainer } from "./trainer.model";


const updateTrainer = async (file: any, id: string, data: Partial<ITrainer>) => {
    if (file) {
        data.profileImageUrl = `/uploads/${file.filename}`;
    }

    const result = await Trainer.findByIdAndUpdate(
        {
            _id: id
        },
        data,
        {
            new: true
        }
    )
    return result

}

export const trainerServices = {
    updateTrainer,
}