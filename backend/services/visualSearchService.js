import { Jimp } from 'jimp';
import dotenv from 'dotenv';
import { HfInference } from '@huggingface/inference';
import Anthropic from '@anthropic-ai/sdk';

dotenv.config();

class VisualSearchService {
    constructor() {
        this.candidateLabels = [
            'jacket', 'leather jacket', 'blazer', 'suit', 'shirt', 't-shirt', 'pants', 'jeans',
            'shoes', 'sneakers', 'bag', 'backpack', 'dress',
            'sweater', 'hoodie', 'shorts', 'skirt', 'hat',
            'wallet', 'purse', 'belt', 'sunglasses', 'coat',
            'watch', 'jewelry', 'bracelet', 'accessory'
        ];

        // Aliases: maps common variations Claude might return → canonical label
        this.labelAliases = {
            'tshirt': 't-shirt', 't shirt': 't-shirt', 'tee': 't-shirt', 'tee shirt': 't-shirt',
            'top': 'shirt', 'polo': 'shirt', 'blouse': 'shirt', 'button-up': 'shirt', 'button up': 'shirt',
            'blazer': 'blazer', 'suit jacket': 'suit', 'suit': 'suit', 'bomber': 'jacket',
            'biker jacket': 'leather jacket', 'moto jacket': 'leather jacket',
            'trousers': 'pants', 'slacks': 'pants', 'chinos': 'pants', 'denim': 'jeans',
            'sneaker': 'sneakers', 'boot': 'shoes', 'sandal': 'shoes', 'heel': 'shoes', 'footwear': 'shoes',
            'backpack': 'bag', 'purse': 'bag', 'handbag': 'bag', 'tote': 'bag',
            'sweatshirt': 'hoodie', 'pullover': 'sweater', 'cardigan': 'sweater',
            'shorts': 'shorts', 'jean shorts': 'shorts',
            'overcoat': 'coat', 'trench': 'coat', 'parka': 'jacket',
            'gown': 'dress', 'sundress': 'dress', 'minidress': 'dress',
            'sunglasses': 'sunglasses', 'glasses': 'sunglasses',
        };

        this.anthropic = process.env.ANTHROPIC_API_KEY && process.env.ANTHROPIC_API_KEY.startsWith('sk-ant-') 
            ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
            : null;
    }

    /**
     * Detect MIME type from buffer magic bytes
     */
    detectMimeType(buffer) {
        if (buffer[0] === 0xFF && buffer[1] === 0xD8) return 'image/jpeg';
        if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47) return 'image/png';
        if (buffer[0] === 0x47 && buffer[1] === 0x49 && buffer[2] === 0x46) return 'image/gif';
        if (buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46) return 'image/webp';
        return 'image/jpeg'; // Safe default
    }

    /**
     * Normalize a raw label string to a canonical candidate label.
     * First checks exact match, then alias map, then partial/substring match.
     */
    normalizeLabel(raw) {
        const cleaned = raw.toLowerCase().trim().replace(/[^a-z\s-]/g, '');

        // Exact match
        if (this.candidateLabels.includes(cleaned)) return cleaned;

        // Alias map
        if (this.labelAliases[cleaned]) return this.labelAliases[cleaned];

        // Partial match: does the raw string contain any candidate label?
        for (const label of this.candidateLabels) {
            if (cleaned.includes(label)) return label;
        }

        // Partial match: does any candidate label contain the raw string?
        for (const label of this.candidateLabels) {
            if (label.includes(cleaned) && cleaned.length > 2) return label;
        }

        // Alias partial match
        for (const [alias, canonical] of Object.entries(this.labelAliases)) {
            if (cleaned.includes(alias) || alias.includes(cleaned)) return canonical;
        }

        return null; // Cannot normalize
    }

    async analyzeImage(imageBuffer, filename = '') {
        try {
            console.log('Service: Routing through God-Level AI Service v2.0...');
            const godModeAI = (await import('./aiService.js')).default;
            
            const [classificationResult, extractedColors] = await Promise.all([
                godModeAI.classifyImage(imageBuffer),
                godModeAI.extractColors(imageBuffer)
            ]);

            return {
                category: classificationResult.label,
                confidence: Math.round(classificationResult.score * 100),
                colors: extractedColors,
                style: `AI Analysis: ${classificationResult.label}`,
                features: [classificationResult.label],
                rawLabels: classificationResult.allScores ? classificationResult.allScores.map(s => s.label) : [classificationResult.label]
            };
        } catch (error) {
            console.error("CRITICAL Service Error routing to God Mode AI:", error);
            throw error;
        }
    }

    calculateBrightness(image) {
        let rSum = 0, gSum = 0, bSum = 0, count = 0;
        const width = image.bitmap.width;
        const height = image.bitmap.height;
        const step = 10;

        image.scan(0, 0, width, height, (x, y, idx) => {
            if (x % step === 0 && y % step === 0) {
                rSum += image.bitmap.data[idx];
                gSum += image.bitmap.data[idx + 1];
                bSum += image.bitmap.data[idx + 2];
                count++;
            }
        });
        return (rSum + gSum + bSum) / (3 * count);
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
                // Ignore background colors (pure white or very bright borders)
                // We no longer ignore dark pixels so black clothing is detected properly
                if ((r + g + b) / 3 < 245) {
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
        
        // Deep Navy/Blue detection (even if very dark)
        if (b > r + 15 && b > g + 15 && b > 30) return 'blue'; 
        
        if (brightness < 70) return 'black';
        if (brightness > 230) return 'white';
        if (r > g + 25 && r > b + 25) return 'red';
        if (g > r + 25 && g > b + 25) return 'green';
        if (b > r + 25 && g > b + 25) return 'blue';
        return 'gray';
    }

    async findMatches(analysis, products) {
        console.log(`Service: findMatches for ${analysis.category} amongst ${products.length} products`);
        const { category, colors, rawLabels = [] } = analysis;
        const categoryLower = category.toLowerCase();

        // Semantic Synonyms Mapping
        const synonyms = {
            'suit': ['suit', 'blazer', 'tuxedo', 'formal', 'three piece', 'set'],
            'blazer': ['blazer', 'suit', 'jacket', 'formal'],
            'jacket': ['blazer', 'coat', 'suit', 'outerwear', 'bomber', 'puff', 'tuxedo', 'leather', 'biker'],
            'leather jacket': ['leather', 'jacket', 'bomber', 'biker', 'moto'],
            'coat': ['coat', 'jacket', 'outerwear', 'trench', 'overcoat', 'peacoat', 'parka'],
            'shirt': ['t-shirt', 'polo', 'jersey', 'top', 'blouse', 'button-up'],
            't-shirt': ['t-shirt', 'tee', 'top', 'graphic'],
            'jeans': ['pants', 'trousers', 'denim', 'bottoms', 'shorts'],
            'shoes': ['sneakers', 'boots', 'sandals', 'footwear'],
            'dress': ['gown', 'skirt', 'jumpsuit'],
            'watch': ['timepiece', 'chronograph', 'analog', 'smartwatch', 'bracelet'],
            'accessory': ['jewelry', 'belt', 'sunglasses', 'wallet', 'bag', 'bracelet']
        };

        const colorFamilies = {
            'blue': ['navy', 'indigo', 'azure', 'cyan', 'blue'],
            'black': ['charcoal', 'ebony', 'black', 'dark gray'],
            'white': ['cream', 'off-white', 'white', 'beige'],
            'gray': ['silver', 'gray', 'charcoal']
        };

        const relatedTerms = synonyms[categoryLower] || [];
        const detectedColor = colors?.[0]?.toLowerCase();
        const detectedColorFamily = colorFamilies[detectedColor] || [detectedColor];

        return products.map(product => {
            let score = 0;
            let hasCategoryMatch = false;
            const nameLower = product.name.toLowerCase();
            const productCategoryLower = (product.category || '').toLowerCase();
            const productColors = (product.colors || []).map(c => c.toLowerCase());

            // 1. Direct Category Match (65 pts)
            if (productCategoryLower.includes(categoryLower) || nameLower.includes(categoryLower)) {
                score += 65;
                hasCategoryMatch = true;
            } 
            // 2. Semantic Synonym Match (55 pts)
            else if (relatedTerms.some(term => productCategoryLower.includes(term) || nameLower.includes(term))) {
                score += 55;
                hasCategoryMatch = true;
            }

            // ❌ STRICT FILTER: If we detected a category, but this product doesn't match it or its synonyms,
            // we reject it early to prevent "Sneakers" search showing "Scarves" just because they're blue.
            if (!hasCategoryMatch) return null;

            // 3. Raw Label Super-Boost (Extra 25 pts)
            if (rawLabels.some(label => nameLower.includes(label) || productCategoryLower.includes(label))) {
                score += 25;
            }

            // 4. Smart Color Match (35 pts)
            if (detectedColor) {
                const hasColorMatch = productColors.some(c => 
                    detectedColorFamily.includes(c) || c.includes(detectedColor)
                );
                if (hasColorMatch) {
                    score += 35;
                }
            }

            // 5. Quality/Rating (10 pts)
            if (product.rating >= 4.5) score += 10;

            return { ...product.toObject?.() || product, matchScore: Math.min(score, 100) };
        })
        .filter(p => p !== null && p.matchScore > 15)
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, 12);
    }
}

export default new VisualSearchService();
