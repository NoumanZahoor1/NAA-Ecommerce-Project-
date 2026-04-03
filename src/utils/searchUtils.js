/**
 * AI-Powered Search Utilities
 * Handles natural language processing, color extraction, and search parsing
 */

// Color keywords mapping
const COLOR_KEYWORDS = {
    red: ['red', 'crimson', 'scarlet', 'burgundy', 'maroon'],
    blue: ['blue', 'navy', 'azure', 'cobalt', 'indigo'],
    green: ['green', 'olive', 'emerald', 'sage', 'forest'],
    yellow: ['yellow', 'gold', 'mustard', 'amber'],
    black: ['black', 'ebony', 'charcoal', 'onyx'],
    white: ['white', 'ivory', 'cream', 'beige', 'off-white'],
    gray: ['gray', 'grey', 'silver', 'slate'],
    brown: ['brown', 'tan', 'khaki', 'camel', 'sand'],
    pink: ['pink', 'rose', 'blush', 'coral'],
    purple: ['purple', 'violet', 'lavender', 'plum'],
    orange: ['orange', 'rust', 'copper', 'peach'],
    multi: ['multi', 'multicolor', 'pattern', 'print', 'floral']
};

// Category keywords
const CATEGORY_KEYWORDS = {
    Men: ['men', 'mens', "men's", 'male', 'guy', 'boys'],
    Women: ['women', 'womens', "women's", 'female', 'lady', 'ladies', 'girls'],
    Accessories: ['accessories', 'accessory', 'bag', 'watch', 'belt', 'hat', 'cap', 'scarf', 'sunglasses', 'shoes', 'sneakers']
};

// Product type keywords
const PRODUCT_KEYWORDS = {
    dress: ['dress', 'gown', 'frock'],
    shirt: ['shirt', 'blouse', 'top', 'tee', 't-shirt'],
    pants: ['pants', 'trousers', 'jeans', 'chinos'],
    jacket: ['jacket', 'coat', 'blazer', 'cardigan'],
    shoes: ['shoes', 'sneakers', 'boots', 'sandals'],
    accessories: ['bag', 'watch', 'belt', 'hat', 'scarf']
};

// Vibe/Aesthetic keywords
const VIBE_KEYWORDS = {
    minimalist: ['minimalist', 'minimal', 'simple', 'clean', 'basic', 'essential'],
    streetwear: ['streetwear', 'street', 'urban', 'casual', 'hip-hop', 'skate'],
    vintage: ['vintage', 'retro', 'classic', 'old-school', 'archive'],
    formal: ['formal', 'professional', 'business', 'office', 'smart'],
    casual: ['casual', 'everyday', 'relaxed', 'comfortable'],
    athletic: ['athletic', 'sport', 'gym', 'active', 'performance'],
    luxury: ['luxury', 'premium', 'high-end', 'designer', 'exclusive'],
    bohemian: ['bohemian', 'boho', 'hippie', 'free-spirited'],
    edgy: ['edgy', 'punk', 'grunge', 'alternative', 'bold'],
    elegant: ['elegant', 'sophisticated', 'classy', 'refined', 'chic']
};

/**
 * Parse natural language search query
 * Example: "red summer dress under $50" -> { colors: ['red'], maxPrice: 50, keywords: ['summer', 'dress'] }
 */
export const parseNaturalLanguageQuery = (query) => {
    const lowerQuery = query.toLowerCase();
    const words = lowerQuery.split(/\s+/);

    const filters = {
        colors: [],
        categories: [],
        vibes: [],
        keywords: [],
        minPrice: null,
        maxPrice: null,
        productTypes: []
    };

    // Extract colors
    Object.entries(COLOR_KEYWORDS).forEach(([color, synonyms]) => {
        if (synonyms.some(syn => lowerQuery.includes(syn))) {
            filters.colors.push(color);
        }
    });

    // Extract categories
    Object.entries(CATEGORY_KEYWORDS).forEach(([category, keywords]) => {
        if (keywords.some(kw => lowerQuery.includes(kw))) {
            filters.categories.push(category);
        }
    });

    // Extract vibes/aesthetics
    Object.entries(VIBE_KEYWORDS).forEach(([vibe, keywords]) => {
        if (keywords.some(kw => lowerQuery.includes(kw))) {
            filters.vibes.push(vibe);
        }
    });

    // Extract product types
    Object.entries(PRODUCT_KEYWORDS).forEach(([type, keywords]) => {
        if (keywords.some(kw => lowerQuery.includes(kw))) {
            filters.productTypes.push(type);
            filters.keywords.push(type);
        }
    });

    // Extract price constraints
    const pricePatterns = [
        /under\s+\$?(\d+)/i,
        /below\s+\$?(\d+)/i,
        /less\s+than\s+\$?(\d+)/i,
        /cheaper\s+than\s+\$?(\d+)/i,
        /max\s+\$?(\d+)/i,
        /maximum\s+\$?(\d+)/i
    ];

    pricePatterns.forEach(pattern => {
        const match = query.match(pattern);
        if (match) {
            filters.maxPrice = parseInt(match[1]);
        }
    });

    const minPricePatterns = [
        /over\s+\$?(\d+)/i,
        /above\s+\$?(\d+)/i,
        /more\s+than\s+\$?(\d+)/i,
        /min\s+\$?(\d+)/i,
        /minimum\s+\$?(\d+)/i
    ];

    minPricePatterns.forEach(pattern => {
        const match = query.match(pattern);
        if (match) {
            filters.minPrice = parseInt(match[1]);
        }
    });

    // Extract general keywords (words not matched to specific filters)
    const usedWords = new Set([
        ...filters.colors,
        ...filters.categories.map(c => c.toLowerCase()),
        ...filters.vibes,
        ...filters.productTypes,
        'under', 'over', 'below', 'above', 'than', 'less', 'more', 'max', 'min', 'maximum', 'minimum'
    ]);

    words.forEach(word => {
        const cleanWord = word.replace(/[^a-z0-9]/g, '');
        if (cleanWord.length > 2 && !usedWords.has(cleanWord)) {
            filters.keywords.push(cleanWord);
        }
    });

    return filters;
};

/**
 * 🎨 ADVANCED COLOR EXTRACTION with K-Means Clustering
 * Extract dominant colors from an image with god-level accuracy
 */
export const extractColorsFromImage = (imageFile) => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        img.onload = () => {
            // OPTIMIZATION: Reduce max size for faster processing (300 -> 150)
            const maxSize = 150;
            const scale = Math.min(maxSize / img.width, maxSize / img.height);
            canvas.width = img.width * scale;
            canvas.height = img.height * scale;

            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const pixels = imageData.data;

            // Extract RGB pixels for k-means clustering
            const rgbPixels = [];
            const edgeDetection = {
                edgePixels: [],
                centerPixels: []
            };

            const edgeThreshold = Math.min(canvas.width, canvas.height) * 0.1;
            const centerRadius = Math.min(canvas.width, canvas.height) * 0.35;

            // OPTIMIZATION: Increase step size (3 -> 5) to sample fewer pixels
            const step = 5;

            // Collect pixels with spatial information
            for (let y = 0; y < canvas.height; y += step) {
                for (let x = 0; x < canvas.width; x += step) {
                    const i = (y * canvas.width + x) * 4;
                    const r = pixels[i];
                    const g = pixels[i + 1];
                    const b = pixels[i + 2];
                    const a = pixels[i + 3];

                    // Skip transparent and extreme pixels
                    if (a < 200) continue;
                    const brightness = (r + g + b) / 3;
                    if (brightness < 15 || brightness > 245) continue;

                    // Calculate position relative to center
                    const dx = x - canvas.width / 2;
                    const dy = y - canvas.height / 2;
                    const distFromCenter = Math.sqrt(dx * dx + dy * dy);

                    const pixel = { r, g, b };

                    // Categorize by location
                    const isEdge = x < edgeThreshold || x > canvas.width - edgeThreshold ||
                        y < edgeThreshold || y > canvas.height - edgeThreshold;

                    if (isEdge) {
                        edgeDetection.edgePixels.push(pixel);
                    } else if (distFromCenter < centerRadius) {
                        edgeDetection.centerPixels.push(pixel);
                        // Weight center pixels more
                        rgbPixels.push(pixel, pixel, pixel); // Triple weight for center
                    } else {
                        rgbPixels.push(pixel);
                    }
                }
            }

            if (rgbPixels.length === 0) {
                resolve(['white']);
                return;
            }

            // K-Means clustering to find dominant colors
            const k = 5; // Find top 5 color clusters
            // OPTIMIZATION: Reduce max iterations (15 -> 10)
            const clusters = kMeansClustering(rgbPixels, k, 10);

            // Identify likely background color from edges
            const edgeClusters = edgeDetection.edgePixels.length > 0
                // OPTIMIZATION: Fewer iterations for edge detection
                ? kMeansClustering(edgeDetection.edgePixels, 3, 5)
                : [];

            const likelyBackgroundRGB = edgeClusters[0]?.centroid;

            // Convert clusters to color names and filter background
            const dominantColors = clusters
                .map(cluster => {
                    const colorName = rgbToColorName(
                        cluster.centroid.r,
                        cluster.centroid.g,
                        cluster.centroid.b
                    );
                    return {
                        name: colorName,
                        weight: cluster.points.length,
                        rgb: cluster.centroid,
                        isLikelyBackground: likelyBackgroundRGB &&
                            colorDistance(cluster.centroid, likelyBackgroundRGB) < 50
                    };
                })
                .filter(color => {
                    // Filter out likely background unless it's very dominant
                    if (color.isLikelyBackground) {
                        const percentage = color.weight / rgbPixels.length;
                        return percentage > 0.5; // Keep only if >50% of image
                    }
                    return true;
                })
                .sort((a, b) => b.weight - a.weight)
                .map(c => c.name);

            // Remove duplicates while preserving order
            const uniqueColors = [...new Set(dominantColors)];

            resolve(uniqueColors.slice(0, 3).length > 0 ? uniqueColors.slice(0, 3) : ['white']);
        };

        img.onerror = reject;
        img.src = URL.createObjectURL(imageFile);
    });
};

/**
 * K-Means Clustering Algorithm for Color Quantization
 */
const kMeansClustering = (pixels, k, maxIterations = 20) => {
    if (pixels.length === 0) return [];

    // Initialize centroids randomly from pixel set
    const centroids = [];
    const step = Math.floor(pixels.length / k);
    for (let i = 0; i < k; i++) {
        centroids.push({ ...pixels[i * step] });
    }

    let iterations = 0;
    let hasConverged = false;

    while (!hasConverged && iterations < maxIterations) {
        // Assign pixels to nearest centroid
        const clusters = centroids.map(() => []);

        pixels.forEach(pixel => {
            let minDist = Infinity;
            let closestCluster = 0;

            centroids.forEach((centroid, i) => {
                const dist = colorDistance(pixel, centroid);
                if (dist < minDist) {
                    minDist = dist;
                    closestCluster = i;
                }
            });

            clusters[closestCluster].push(pixel);
        });

        // Recalculate centroids
        hasConverged = true;
        centroids.forEach((centroid, i) => {
            if (clusters[i].length === 0) return;

            const newCentroid = {
                r: Math.round(clusters[i].reduce((sum, p) => sum + p.r, 0) / clusters[i].length),
                g: Math.round(clusters[i].reduce((sum, p) => sum + p.g, 0) / clusters[i].length),
                b: Math.round(clusters[i].reduce((sum, p) => sum + p.b, 0) / clusters[i].length)
            };

            if (colorDistance(centroid, newCentroid) > 5) {
                hasConverged = false;
            }

            centroids[i] = newCentroid;
        });

        iterations++;
    }

    // Return clusters with their points
    return centroids.map((centroid, i) => ({
        centroid,
        points: clusters[i] || []
    })).filter(cluster => cluster.points.length > 0)
        .sort((a, b) => b.points.length - a.points.length);
};

/**
 * Calculate color distance in RGB space
 */
const colorDistance = (color1, color2) => {
    const dr = color1.r - color2.r;
    const dg = color1.g - color2.g;
    const db = color1.b - color2.b;
    return Math.sqrt(dr * dr + dg * dg + db * db);
};

/**
 * Convert RGB to color name with improved accuracy
 */
const rgbToColorName = (r, g, b) => {
    // Calculate brightness and saturation
    const brightness = (r + g + b) / 3;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const saturation = max - min;

    // Check for grayscale (low saturation)
    const isGrayscale = saturation < 25;

    if (isGrayscale) {
        if (brightness < 40) return 'black';
        if (brightness > 220) return 'white';
        if (brightness > 160) return 'white'; // Light gray counts as white for clothing
        if (brightness < 100) return 'black'; // Dark gray counts as black
        return 'gray';
    }

    // For saturated colors, determine hue
    // Calculate hue angle
    let hue = 0;
    if (max === r) {
        hue = ((g - b) / saturation) % 6;
    } else if (max === g) {
        hue = ((b - r) / saturation) + 2;
    } else {
        hue = ((r - g) / saturation) + 4;
    }
    hue = hue * 60;
    if (hue < 0) hue += 360;

    // Map hue to color names
    if (saturation < 40) {
        // Low saturation - muted colors
        if (brightness > 200) return 'white';
        if (brightness < 60) return 'black';
        return 'gray';
    }

    // High saturation - vivid colors
    if (hue < 15 || hue >= 345) return 'red';
    if (hue < 45) return 'orange';
    if (hue < 70) return 'yellow';
    if (hue < 150) return 'green';
    if (hue < 250) return 'blue';
    if (hue < 330) return 'purple';
    return 'red';
};

/**
 * 🎯 ADVANCED VISUAL SIMILARITY CALCULATION
 * Multi-factor scoring with AI type matching, color harmony, and metadata
 */
export const calculateVisualSimilarity = (product1, product2, searchColors = [], detectedType = null, confidence = 1.0) => {
    let score = 0;
    const breakdown = {}; // For debugging

    // 🤖 AI DETECTED TYPE MATCH (Primary Filter - 45% weight)
    if (detectedType) {
        const type2 = getProductType(product2.name);

        if (detectedType === type2) {
            const typeScore = 45 * confidence; // Scale by AI confidence
            score += typeScore;
            breakdown.exactTypeMatch = typeScore;
        } else if (isSimilarType(detectedType, type2)) {
            const similarScore = 22 * confidence; // Partial credit
            score += similarScore;
            breakdown.similarTypeMatch = similarScore;
        } else {
            // Penalty for type mismatch (prevents wrong category items)
            score -= 25;
            breakdown.typeMismatch = -25;
        }
    }

    // 🎨 COLOR HARMONY MATCHING (35% weight)
    const product2Colors = product2.colors || [];
    if (searchColors && searchColors.length > 0) {
        let colorScore = 0;

        // Primary color (dominant) match is most important
        if (product2Colors.includes(searchColors[0])) {
            colorScore += 25; // Dominant color match
            breakdown.dominantColorMatch = 25;

            // Bonus for additional color matches
            const otherSearchColors = searchColors.slice(1);
            if (otherSearchColors.length > 0) {
                const otherMatches = otherSearchColors.filter(c => product2Colors.includes(c)).length;
                const bonusScore = (otherMatches / otherSearchColors.length) * 10;
                colorScore += bonusScore;
                breakdown.additionalColors = bonusScore;
            }
        } else {
            // Secondary color matches (less valuable)
            const matchCount = searchColors.filter(c => product2Colors.includes(c)).length;
            if (matchCount > 0) {
                const secondaryScore = (matchCount / searchColors.length) * 20;
                colorScore += secondaryScore;
                breakdown.secondaryColorMatch = secondaryScore;
            } else {
                // Check for color harmony (complementary colors)
                const harmonyScore = calculateColorHarmony(searchColors[0], product2Colors);
                if (harmonyScore > 0) {
                    colorScore += harmonyScore * 10;
                    breakdown.colorHarmony = harmonyScore * 10;
                }
            }
        }

        score += colorScore;
    }

    // 📦 CATEGORY MATCH (10% weight)
    if (product1.category && product2.category && product1.category === product2.category) {
        score += 10;
        breakdown.categoryMatch = 10;
    }

    // 👕 FIT/STYLE SIMILARITY (5% weight)
    if (product1.fit && product2.fit && product1.fit === product2.fit) {
        score += 5;
        breakdown.fitMatch = 5;
    }

    // 🏆 POPULARITY BOOST (5% weight)
    // Boost popular/highly-rated items slightly
    if (product2.rating && product2.rating >= 4.5) {
        score += 3;
        breakdown.popularityBoost = 3;
    }
    if (product2.numReviews && product2.numReviews > 50) {
        score += 2;
        breakdown.reviewCountBoost = 2;
    }

    // Store breakdown for debugging
    product2._scoreBreakdown = breakdown;

    return Math.max(0, Math.round(score));
};

/**
 * 🌈 Calculate Color Harmony Score
 * Checks if colors are complementary/analogous for better recommendations
 */
const calculateColorHarmony = (searchColor, productColors) => {
    const harmonyMap = {
        'blue': ['orange', 'yellow', 'white', 'gray'],
        'red': ['green', 'blue', 'white', 'black'],
        'yellow': ['purple', 'blue', 'gray', 'black'],
        'green': ['red', 'brown', 'white', 'beige'],
        'orange': ['blue', 'teal', 'navy', 'black'],
        'purple': ['yellow', 'gold', 'white', 'gray'],
        'black': ['white', 'red', 'yellow', 'any'],
        'white': ['any'],
        'gray': ['any']
    };

    const harmonious = harmonyMap[searchColor] || [];
    const hasHarmony = productColors.some(c => harmonious.includes(c) || harmonious.includes('any'));

    return hasHarmony ? 0.5 : 0;
};

/**
 * Extract product type from name
 */
export const getProductType = (name) => {
    const lowerName = name.toLowerCase();

    // Tops
    if (lowerName.includes('t-shirt') || lowerName.includes('tee') || lowerName.includes('tank')) return 'tshirt';
    if (lowerName.includes('shirt') || lowerName.includes('blouse')) return 'shirt';
    if (lowerName.includes('hoodie') || lowerName.includes('sweatshirt')) return 'hoodie';
    if (lowerName.includes('sweater') || lowerName.includes('cardigan')) return 'sweater';
    if (lowerName.includes('jacket') || lowerName.includes('coat') || lowerName.includes('blazer')) return 'jacket';
    if (lowerName.includes('top')) return 'top';

    // Bottoms
    if (lowerName.includes('jeans') || lowerName.includes('pants') || lowerName.includes('trousers')) return 'pants';
    if (lowerName.includes('shorts')) return 'shorts';
    if (lowerName.includes('skirt')) return 'skirt';

    // Dresses
    if (lowerName.includes('dress')) return 'dress';
    if (lowerName.includes('jumpsuit')) return 'jumpsuit';

    // Accessories
    if (lowerName.includes('shoes') || lowerName.includes('sneakers') || lowerName.includes('boots')) return 'shoes';
    if (lowerName.includes('bag') || lowerName.includes('backpack')) return 'bag';
    if (lowerName.includes('watch')) return 'watch';
    if (lowerName.includes('belt')) return 'belt';
    if (lowerName.includes('hat') || lowerName.includes('cap') || lowerName.includes('beanie')) return 'hat';
    if (lowerName.includes('scarf')) return 'scarf';
    if (lowerName.includes('sunglasses')) return 'sunglasses';

    return 'other';
};

/**
 * Check if two product types are similar
 */
export const isSimilarType = (type1, type2) => {
    const similarGroups = [
        ['tshirt', 'shirt', 'top'],
        ['hoodie', 'sweater', 'jacket'],
        ['pants', 'shorts'],
        ['shoes', 'sneakers'],
        ['bag', 'backpack']
    ];

    return similarGroups.some(group => group.includes(type1) && group.includes(type2));
};

/**
 * Filter products based on parsed natural language query
 */
export const filterProductsByNLQuery = (products, filters) => {
    return products.filter(product => {
        // Color filter
        if (filters.colors.length > 0) {
            const hasColor = product.colors.some(c => filters.colors.includes(c));
            if (!hasColor) return false;
        }

        // Category filter
        if (filters.categories.length > 0) {
            if (!filters.categories.includes(product.category)) return false;
        }

        // Price filter
        if (filters.minPrice !== null && product.price < filters.minPrice) return false;
        if (filters.maxPrice !== null && product.price > filters.maxPrice) return false;

        // Keyword filter (search in name and description)
        if (filters.keywords.length > 0) {
            const searchText = `${product.name} ${product.description}`.toLowerCase();
            const hasKeyword = filters.keywords.some(kw => searchText.includes(kw));
            if (!hasKeyword) return false;
        }

        return true;
    });
};

/**
 * Get vibe/aesthetic for a product based on its attributes
 */
export const getProductVibe = (product) => {
    const vibes = [];
    const name = product.name.toLowerCase();
    const desc = (product.description || '').toLowerCase();
    const searchText = `${name} ${desc}`;

    // Check for vibe keywords in product name/description
    Object.entries(VIBE_KEYWORDS).forEach(([vibe, keywords]) => {
        if (keywords.some(kw => searchText.includes(kw))) {
            vibes.push(vibe);
        }
    });

    // Infer vibes from product attributes
    if (product.colors.includes('black') && product.fit === 'Slim') {
        vibes.push('minimalist');
    }

    if (product.category === 'archive') {
        vibes.push('vintage');
    }

    if (name.includes('graphic') || name.includes('oversized')) {
        vibes.push('streetwear');
    }

    if (name.includes('blazer') || name.includes('oxford') || name.includes('trench')) {
        vibes.push('formal');
    }

    if (product.price > 100) {
        vibes.push('luxury');
    }

    return [...new Set(vibes)]; // Remove duplicates
};

export default {
    parseNaturalLanguageQuery,
    extractColorsFromImage,
    calculateVisualSimilarity,
    filterProductsByNLQuery,
    getProductVibe,
    getProductType,
    isSimilarType
};
