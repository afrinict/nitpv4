import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
cloudinary.config({
    cloud_name: 'your_cloud_name',
    api_key: '552423448998188',
    api_secret: 'tw0pXhDtuq9Rqv_bqqATJ3vcsdA',
    secure: true
});
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'nitp_documents',
        allowed_formats: ['jpg', 'jpeg', 'png', 'pdf'],
        resource_type: 'auto',
        transformation: [{ width: 1000, height: 1000, crop: 'limit' }]
    }
});
export const upload = multer({ storage: storage });
export const uploadToCloudinary = async (file) => {
    try {
        const result = await cloudinary.uploader.upload(file.path, {
            folder: 'nitp_documents',
            resource_type: 'auto'
        });
        return result.secure_url;
    }
    catch (error) {
        console.error('Error uploading to Cloudinary:', error);
        throw error;
    }
};
export default cloudinary;
