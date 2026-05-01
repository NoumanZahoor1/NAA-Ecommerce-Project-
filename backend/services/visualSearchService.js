import { Jimp } from 'jimp';
import dotenv from 'dotenv';
import { HfInference } from '@huggingface/inference';
import Anthropic from '@anthropic-ai/sdk';

dotenv.config();

class VisualSearchService {
    constructor() {
        this.candidateLabels = [
            'jacket', 'blazer', 'suit', 'shirt', 't-shirt', 'pants', 'jeans',
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
            console.log('Service: Processing image for AI Analysis...');
            const image = await Jimp.read(imageBuffer);
            const colors = await this.extractColors(image);

            let detectedCategory = null;
            let confidence = 0;
            let features = [];
            let analysisRawLabels = [];

            // 1. EXECUTE PREMIUM CLAUDE AI (v3.5 Sonnet Vision) - Highest Priority
            if (this.anthropic) {
                try {
                    console.log('🤖 Calling Claude 3.5 Sonnet Vision...');
                    const base64Image = imageBuffer.toString('base64');
                    const mimeType = this.detectMimeType(imageBuffer);
                    console.log(`📷 Detected MIME type: ${mimeType}`);
                    
                    const response = await this.anthropic.messages.create({
                        model: "claude-3-5-sonnet-20240620",
                        max_tokens: 50,
                        messages: [{
                            role: "user",
                            content: [
                                {
                                    type: "image",
                                    source: {
                                        type: "base64",
                                        media_type: mimeType,
                                        data: base64Image,
                                    },
                                },
                                {
                                    type: "text",
                                    text: `You are a fashion product classifier. Look at this image and identify the main clothing or accessory item.

Reply with ONLY a single word or short phrase chosen from this exact list:
${this.candidateLabels.join(' | ')}

Rules:
- Choose the MOST SPECIFIC matching label (e.g. "t-shirt" not "accessory" for a t-shirt)
- NEVER output anything except one of the labels above
- If it is clearly a shirt/t-shirt/top, output "t-shirt" or "shirt"
- If it is a jacket/blazer/coat, output "jacket"
- Output ONLY the label, no punctuation, no explanation`
                                }
                            ],
                        }],
                    });

                    const rawResult = response.content[0].text.toLowerCase().trim();
                    console.log(`🔍 Claude raw response: "${rawResult}"`);
                    
                    const normalized = this.normalizeLabel(rawResult);
                    if (normalized) {
                        detectedCategory = normalized;
                        confidence = 97;
                        features = [`Claude Vision: ${rawResult}`];
                        console.log('✅ Claude Success:', detectedCategory);
                    } else {
                        console.warn(`⚠️ Claude returned unrecognized label: "${rawResult}", falling through to HF`);
                    }
                } catch (claudeError) {
                    console.error("⚠️ Claude Vision Error:", claudeError.message);
                }
            }

            // 2. EXECUTE HUGGING FACE CLOUD AI - Secondary Priority
            if (!detectedCategory && process.env.HF_TOKEN && process.env.HF_TOKEN.startsWith('hf_')) {
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

                        // Capture raw labels for matching boost
                        analysisRawLabels = topLabels;

                        // Intelligent Mapping - Prioritized
                        // Try to normalize each HF label using our smart normalizer
                        for (const raw of topLabels) {
                            const normalized = this.normalizeLabel(raw);
                            if (normalized) {
                                detectedCategory = normalized;
                                break;
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

            // 3. ENHANCED FALLBACK HEURISTICS (Aspect Ratio & Colors)
            if (!detectedCategory) {
                console.log('🔍 Executing Advanced Local Heuristics...');
                const width = image.bitmap.width;
                const height = image.bitmap.height;
                const aspectRatio = height / width;
                const brightness = this.calculateBrightness(image);

                console.log(`Features: AspectRatio=${aspectRatio.toFixed(2)}, Brightness=${brightness.toFixed(0)}, Color=${colors[0]}`);

                // Filename check first (most reliable heuristic when no AI is available)
                const lowerFilename = filename.toLowerCase();
                for (const [alias, canonical] of Object.entries(this.labelAliases)) {
                    if (lowerFilename.includes(alias)) { detectedCategory = canonical; break; }
                }
                if (!detectedCategory) {
                    for (const label of this.candidateLabels) {
                        if (lowerFilename.includes(label)) { detectedCategory = label; break; }
                    }
                }

                // Aspect-ratio based clothing classification
                if (!detectedCategory) {
                    // 👟 SHOE HEURISTIC: very wide aspect ratio (landscape image)
                    if (aspectRatio < 0.65) {
                        detectedCategory = 'shoes';
                        features.push('Wide landscape silhouette (likely footwear)');
                    }
                    // 👜 BAG HEURISTIC: slightly wide + structured dark shape
                    else if (aspectRatio < 0.85 && (colors.includes('black') || colors.includes('gray'))) {
                        detectedCategory = 'bag';
                        features.push('Wide dark structured silhouette (likely bag)');
                    }
                    // 🧥 JACKET/SUIT HEURISTIC: tall vertical + dark/gray + high brightness contrast
                    else if (aspectRatio > 1.15 && (brightness < 110 || colors.includes('black') || colors.includes('gray') || colors.includes('blue'))) {
                        detectedCategory = aspectRatio > 1.4 ? 'suit' : 'jacket';
                        features.push('Tall structured silhouette (likely suit/jacket)');
                    }
                    // 👕 DEFAULT CLOTHING HEURISTIC: typical product shot (near-square or tall)
                    else if (aspectRatio >= 0.85) {
                        // Differentiate shirt vs jacket by brightness of garment
                        if (aspectRatio > 1.2 && (colors.includes('black') || colors.includes('blue') || colors.includes('gray'))) {
                            detectedCategory = 'jacket';
                            features.push('Vertical structured item (likely jacket/blazer)');
                        } else {
                            detectedCategory = 't-shirt'; // Most common uploaded garment
                            features.push('Standard product silhouette (likely shirt/top)');
                        }
                    } else {
                        // Final absolute fallback: default to shirt not accessory
                        detectedCategory = 'shirt';
                        features.push('Clothing assumed by default');
                    }
                }
                
                confidence = 75; 
                if (features.length === 0) features = ['detected via heuristics'];
                console.log("✅ Final Decision (Heuristic):", detectedCategory);
            }

            return {
                category: detectedCategory,
                confidence: confidence || 92,
                colors: colors,
                style: features[0] || 'Matching found attributes',
                features: features,
                rawLabels: analysisRawLabels
            };
        } catch (error) {
            console.error("CRITICAL Service Error:", error);
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
        
        // Deep Navy/Blue detection (even if very dark)
        if (b > r + 5 && b > g + 5 && b > 30) return 'blue'; 
        
        if (brightness < 40) return 'black';
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
            'jacket': ['blazer', 'coat', 'suit', 'outerwear', 'bomber', 'puff', 'tuxedo'],
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
