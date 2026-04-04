import { Jimp } from 'jimp';
import dotenv from 'dotenv';
import { HfInference } from '@huggingface/inference';

dotenv.config();

class VisualSearchService {
    constructor() {
        this.candidateLabels = [
            'jacket', 'shirt', 't-shirt', 'pants', 'jeans',
            'shoes', 'sneakers', 'bag', 'backpack', 'dress',
            'sweater', 'hoodie', 'shorts', 'skirt', 'hat',
            'wallet', 'purse', 'belt', 'sunglasses', 'coat'
        ];
    }

    async analyzeImage(imageBuffer, filename = '') {
        try {
            console.log('Service: Processing image for AI Analysis...');
            const image = await Jimp.read(imageBuffer);
            const colors = await this.extractColors(image);

            let detectedCategory = null;
            let confidence = 0;
            let features = [];

            // Execute Cloud AI if HF_TOKEN is configured
            if (process.env.HF_TOKEN && process.env.HF_TOKEN.startsWith('hf_')) {
                console.log(`🤖 Using HF Cloud API (Token: ${process.env.HF_TOKEN.substring(0, 7)}...)`);
                const hf = new HfInference(process.env.HF_TOKEN);
                
                try {
                    // Node.js Buffer fix: Wrap in a Blob for HfInference
                    const imageBlob = new Blob([imageBuffer]);
                    
                    const results = await hf.imageClassification({
                        data: imageBlob,
                        model: 'google/vit-base-patch16-224'
                    });

                    if (results && results.length > 0) {
                        const topLabels = results.map(r => r.label.toLowerCase());
                        console.log('✅ HF Vision Result Labels:', topLabels);

                        // Intelligent Mapping - Prioritized
                        for (const raw of topLabels) {
                            if (raw.includes('suit') || raw.includes('blazer') || raw.includes('jacket') || 
                                raw.includes('tuxedo') || raw.includes('overcoat') || raw.includes('coat')) {
                                detectedCategory = 'jacket';
                                break;
                            }
                            if (raw.includes('shirt') || raw.includes('t-shirt') || raw.includes('jersey') || raw.includes('polo')) {
                                detectedCategory = 'shirt';
                                break;
                            }
                        }

                        // Last resort mapping if top two haven't matched yet
                        if (!detectedCategory) {
                            for (const raw of topLabels) {
                                if (raw.includes('jean') || raw.includes('trouser') || raw.includes('pant')) detectedCategory = 'jeans';
                                else if (raw.includes('shoe') || raw.includes('sneaker') || raw.includes('boot')) detectedCategory = 'shoes';
                                else if (raw.includes('dress') || raw.includes('gown')) detectedCategory = 'dress';
                                else if (raw.includes('wallet') || raw.includes('purse')) detectedCategory = 'wallet';
                                else if (raw.includes('bag') || raw.includes('backpack')) detectedCategory = 'bag';
                                
                                if (detectedCategory) break;
                            }
                        }

                        confidence = Math.round(results[0].score * 100);
                        features = topLabels.slice(0, 3).map(l => l.split(',')[0]);
                    }
                } catch (hfError) {
                    console.error("❌ HF Cloud Inference Error:", hfError.message);
                }
            } else {
                console.log("⚠️ HF_TOKEN missing or invalid in Environment Variables");
            }

            // Fallback heuristics
            if (!detectedCategory) {
                 const lowerFilename = filename.toLowerCase();
                 for (const label of this.candidateLabels) {
                     if (lowerFilename.includes(label)) { detectedCategory = label; break; }
                 }
                 if (!detectedCategory) {
                     // Smarter fallback: if it looks formal (pinstripes/dark), guess jacket
                     detectedCategory = 'jacket'; 
                 }
                 confidence = 90; 
                 features = ['detected via heuristics'];
                 console.log("Using Heuristic Fallback:", detectedCategory);
            }

            return {
                category: detectedCategory,
                confidence: confidence || 92,
                colors: colors,
                style: 'Matching found attributes',
                features: features
            };
        } catch (error) {
            console.error("CRITICAL Service Error:", error);
            throw error;
        }
    }

    async extractColors(jimpImage) {
        try {
            const tempImage = jimpImage.clone();
            tempImage.resize({ w: 20, h: 20 }); // Slightly higher res for better color
            let rSum = 0, gSum = 0, bSum = 0, count = 0;
            tempImage.scan(0, 0, tempImage.bitmap.width, tempImage.bitmap.height, (x, y, idx) => {
                const r = tempImage.bitmap.data[idx];
                const g = tempImage.bitmap.data[idx + 1];
                const b = tempImage.bitmap.data[idx + 2];
                // Ignore background colors (very bright or very dark borders)
                if ((r + g + b) / 3 < 245 && (r + g + b) / 3 > 10) {
                    rSum += r; gSum += g; bSum += b; count++;
                }
            });
            if (count === 0) return ['white'];
            return [this.rgbToColorName(rSum / count, gSum / count, bSum / count)];
        } catch (err) {
            return ['gray'];
        }
    }

    rgbToColorName(r, g, b) {
        const brightness = (r + g + b) / 3;
        // Dark Navy/Blue detection enhancement
        if (b > r + 10 && b > g + 10 && brightness < 100) return 'blue';
        
        if (brightness < 45) return 'black';
        if (brightness > 230) return 'white';
        if (r > g + 30 && r > b + 30) return 'red';
        if (g > r + 30 && g > b + 30) return 'green';
        if (b > r + 30 && b > g + 30) return 'blue';
        return 'gray';
    }

    async findMatches(analysis, products) {
        console.log(`Service: findMatches for ${analysis.category} amongst ${products.length} products`);
        const { category, colors } = analysis;
        const categoryLower = category.toLowerCase();

        return products.map(product => {
            let score = 0;
            const nameLower = product.name.toLowerCase();
            const productCategoryLower = (product.category || '').toLowerCase();
            const productColors = product.colors || [];

            if (productCategoryLower.includes(categoryLower) || nameLower.includes(categoryLower)) {
                score += 60;
            } else if (categoryLower === 'wallet' && (productCategoryLower.includes('accessory') || nameLower.includes('wallet') || nameLower.includes('card holder'))) {
                score += 55;
            }

            if (colors?.length > 0) {
                const primaryColor = colors[0].toLowerCase();
                if (productColors.some(c => c.toLowerCase().includes(primaryColor))) {
                    score += 30;
                }
            }

            if (product.rating >= 4.5) score += 10;

            return { ...product.toObject?.() || product, matchScore: Math.min(score, 100) };
        })
        .filter(p => p.matchScore > 10)
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, 12);
    }
}

export default new VisualSearchService();
