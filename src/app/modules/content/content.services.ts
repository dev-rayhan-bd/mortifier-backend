import { IContent } from "./content.interface";
import { Content } from "./content.model";


const createContent = async (file: any, content: IContent, user: any): Promise<IContent> => {

    if (file) {
        if (file.mimetype.startsWith("image/")) {
            content.imageUrl = `/uploads/${file.filename}`;
            content.userId = user?.id;
        } else if (file.mimetype.startsWith("video/")) {
            content.videoUrl = `/uploads/${file.filename}`;
            content.userId = user?.id;
        } else {
            throw new Error("Invalid file type. Only images and videos are allowed.");
        }
    }
    const result = await Content.create(content)
    return result
}

const getSingleContent = async (id: string): Promise<IContent | null> => {
    const result = await Content.findById({_id: id})
    return result
}
export const contentServices = {
    createContent,
    getSingleContent,
}
