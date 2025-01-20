import { IContent } from "./content.interface";


const createContent = async (file: any, content: IContent) => {
    console.log('file', file);

    if (file) {
        if (file.mimetype.startsWith("image/")) {
            content.imageUrl = file.path;
        } else if (file.mimetype.startsWith("video/")) {
            content.videoUrl = file.path;
        } else {
            throw new Error("Invalid file type. Only images and videos are allowed.");
        }
    }
    console.log(content);

}
export const contentServices = {
    createContent,
}
