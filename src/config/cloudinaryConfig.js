import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    return {
      folder: "nutripet", 
      allowed_formats: ["jpg", "jpeg", "png", "webp"],
      public_id: file.originalname.split(".")[0], 
      transformation: [{ width: 800, height: 800, crop: "limit" }], 
    };
  },
});


export const upload = multer({ storage });

export default cloudinary;
