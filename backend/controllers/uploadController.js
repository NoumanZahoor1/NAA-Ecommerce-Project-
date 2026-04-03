import asyncHandler from 'express-async-handler';
import cloudinary from '../config/cloudinary.js';
import { Readable } from 'stream';

// @desc    Upload image to Cloudinary
// @route   POST /api/upload
// @access  Private/Admin
const uploadImage = asyncHandler(async (req, res) => {
    if (!req.file) {
        res.status(400);
        throw new Error('No image file provided');
    }

    try {
        // Convert buffer to stream
        const stream = Readable.from(req.file.buffer);

        // Upload to Cloudinary
        const result = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: 'naa-products',
                    resource_type: 'auto',
                    transformation: [
                        { width: 1200, height: 1200, crop: 'limit' },
                        { quality: 'auto', fetch_format: 'auto' }
                    ]
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );

            stream.pipe(uploadStream);
        });

        res.json({
            url: result.secure_url,
            public_id: result.public_id
        });
    } catch (error) {
        console.error('Cloudinary upload error:', error);
        res.status(500);
        throw new Error('Image upload failed');
    }
});

// @desc    Delete image from Cloudinary
// @route   DELETE /api/upload/:publicId
// @access  Private/Admin
const deleteImage = asyncHandler(async (req, res) => {
    try {
        const { publicId } = req.params;

        await cloudinary.uploader.destroy(publicId);

        res.json({ message: 'Image deleted successfully' });
    } catch (error) {
        console.error('Cloudinary delete error:', error);
        res.status(500);
        throw new Error('Image deletion failed');
    }
});

export { uploadImage, deleteImage };
