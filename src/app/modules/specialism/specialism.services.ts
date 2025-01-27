import { ISpecialism } from "./specialism.interface"
import { Specialism } from "./specialism.model"

const createSpecialism = async (id: string, data: Partial<ISpecialism>): Promise<ISpecialism> => {

    const finalData = {
        specialism: data?.specialism,
        trainer_id: id
    }

    const result = await Specialism.create(finalData)
    return result
}

export const specialismServices = {
    createSpecialism,
}