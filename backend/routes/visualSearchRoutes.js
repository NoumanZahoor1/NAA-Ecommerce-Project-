import express from 'express';
import multer from 'multer';
import visualSearchService from '../services/visualSearchService.js';
import Product from '../models/Product.js';

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

router.get('/health', (req, res) => {
    res.json({
        success: true,
        status: 'operational',
        service: 'Visual Search API',
        version: '2.0.1'
    });
});

router.post('/visual-search', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            console.error('❌ No file in request');
            return res.status(400).json({ success: false, message: 'No image uploaded' });
        }

        console.log('🖼️ Visual Search v2.0 Started...');
        console.log('File info:', { size: req.file.size, mimetype: req.file.mimetype });

        const startTime = Date.now();

        // 1. AI Analysis
        console.log('Step 1: AI Analysis...');
        const analysis = await visualSearchService.analyzeImage(req.file.buffer);
        console.log('✅ AI Success:', JSON.stringify(analysis));

        // 2. Matching
        console.log('Step 2: DB Search...');
        const products = await Product.find({});
        console.log(`✅ DB Success: Found ${products.length} products`);

        console.log('Step 3: Finding matches...');
        const matchedProducts = await visualSearchService.findMatches(analysis, products);
        console.log(`✅ Matching Success: ${matchedProducts.length} matches`);

        const duration = Date.now() - startTime;
        res.json({
            success: true,
            analysis,
            matchedProducts,
            processingTime: duration
        });
    } catch (error) {
        console.error('❌ CRITICAL Visual Search Route Error:', error);
        res.status(500).json({
            success: false,
            message: `Visual search failed: ${error.message}`,
            stack: error.stack
        });
    }
});

export default router;
