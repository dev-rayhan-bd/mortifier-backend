import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';

cloudinary.config({
  cloud_name: 'dck3z93x5',
  api_key: '958848183433213',
  api_secret: 'hoZys5CcfirZpIrYgTQihz7fI6M',
});

// Upload file directly to Cloudinary from memory
export const uploadToCloudinary = async (file: Express.Multer.File) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'uploads', // Change the folder name as needed
        public_id: file.originalname.replace(/\s+/g, '_'), // Remove spaces in filenames
        resource_type: 'auto', // Auto-detect file type (image, video, etc.)
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary Upload Error:', error);
          reject(error);
        } else {
          console.log('Cloudinary Upload Success:', result);
          resolve(result);
        }
      }
    );

    uploadStream.end(file.buffer); // Upload file buffer directly to Cloudinary
  });
};

// Use memory storage instead of disk storage
const storage = multer.memoryStorage();
export const upload = multer({ storage: storage });
