import { v2 as cloudinary } from "cloudinary"

// Configured from environment variables. Used by the admin app to upload
// menu images; the customer site simply reads the resulting image URLs.
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
})

export { cloudinary }
