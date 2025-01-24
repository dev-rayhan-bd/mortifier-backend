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

const getMyContent = async (user: any,): Promise<IContent[] | null> => {
    const result = await Content.find({userId: user?.id})
    return result
}

const getAllContent = async (searchTerm: any): Promise<IContent[] | null> => {

    const andConditions = [];
  
    const contentSearchableFields = ['title', 'content', 'specialism'];
  
    const contentFilterableFields = [
    'specialism',
    'user',
   ]

   if (searchTerm) {
    andConditions.push({
      $or: contentSearchableFields.map(field => ({
        [field]: {
          $regex: searchTerm,
          $paginationOptions: 'i',
        },
      })),
    });
  }

    const result = await Content.find({
        $or: [
            {title: {$regex: searchTerm, $options: 'i'}},
            {content: {$regex: searchTerm, $options: 'i'}},
            {specialism: {$regex: searchTerm, $options: 'i'}},
        ]
    })
    return result
}

export const contentServices = {
    createContent,
    getSingleContent,
    getMyContent,
    getAllContent,
}
