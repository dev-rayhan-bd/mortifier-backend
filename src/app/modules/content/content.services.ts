import { IContent } from "./content.interface";


const createContent = async (file: any, content: IContent) => {
    console.log('file', file),
    console.log('content', content);
}


export const contentServices = {
    createContent,
}
