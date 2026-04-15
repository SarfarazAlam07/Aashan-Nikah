import { v2 as cloudinary } from 'cloudinary';

// Configure using backend secrets
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const deleteCloudinaryImage = async (imageUrl: string) => {
  if (!imageUrl) return false;
  
  try {
    // Extract public ID from URL
    // e.g., https://res.cloudinary.com/dhn69yomz/image/upload/v12345/barkati/image.jpg
    // We need: barkati/image
    const parts = imageUrl.split('/upload/');
    if (parts.length < 2) return false;
    
    // Remove the version (v123456/) and the extension (.jpg)
    const publicId = parts[1].replace(/^v\d+\//, '').split('.')[0];
    
    console.log(`Attempting to delete Cloudinary image: ${publicId}`);
    
    const result = await cloudinary.uploader.destroy(publicId);
    console.log('Cloudinary delete result:', result);
    
    return result.result === 'ok' || result.result === 'not found';
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    return false;
  }
};