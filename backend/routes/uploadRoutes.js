import express from 'express';
import multer from 'multer';
import { uploadImage, deleteImage } from '../controllers/uploadController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import visualSearchService from '../services/aiService.js';

const router = express.Router();

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        // Accept images only
        if (!file.mimetype.startsWith('image/')) {
            return cb(new Error('Only image files are allowed'), false);
        }
        cb(null, true);
    },
});

// Upload single image (admin only)
router.post('/', protect, admin, upload.single('image'), uploadImage);

/**
 * 🚀 GOD-LEVEL VISUAL SEARCH v2.0
 * Ultra-fast parallel processing with detailed results
 */
router.post('/visual-search', upload.single('image'), async (req, res) => {
    const startTime = Date.now();

    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No image file uploaded'
            });
        }

        console.log('🖼️ Visual Search Request - Size:', (req.file.size / 1024).toFixed(1), 'KB');

        // Run classification and color extraction in parallel
        const [classificationResult, extractedColors] = await Promise.all([
            visualSearchService.classifyImage(req.file.buffer),
            visualSearchService.extractColors(req.file.buffer)
        ]);

        const totalTime = Date.now() - startTime;
        console.log(`🏁 Visual Search Complete in ${totalTime}ms`);

        res.json({
            success: true,
            prediction: {
                label: classificationResult.label,
                score: classificationResult.score,
                confidence: classificationResult.score,
                models: classificationResult.models || ['AI Ensemble'],
                allScores: classificationResult.allScores
            },
            colors: extractedColors,
            processingTime: totalTime,
            version: '2.0'
        });
    } catch (error) {
        console.error('❌ Visual Search Error:', error);
        res.status(500).json({
            success: false,
            message: 'Error processing visual search',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Delete image (admin only)
router.delete('/:publicId', protect, admin, deleteImage);

export default router;
