/**
 * Brand Size Comparison Data
 * Cross-brand size mapping for accurate size recommendations
 */

export const brandSizeCharts = {
    // Men's Tops (Chest in cm)
    mensTopsSizes: {
        S: { chest: '86-91', brands: { NAA: 'S', Zara: 'S', 'H&M': 'S', Uniqlo: 'S', Nike: 'S' } },
        M: { chest: '91-97', brands: { NAA: 'M', Zara: 'M', 'H&M': 'M', Uniqlo: 'M', Nike: 'M' } },
        L: { chest: '97-102', brands: { NAA: 'L', Zara: 'L', 'H&M': 'L', Uniqlo: 'L', Nike: 'L' } },
        XL: { chest: '102-107', brands: { NAA: 'XL', Zara: 'XL', 'H&M': 'XL', Uniqlo: 'XL', Nike: 'XL' } }
    },

    // Men's Bottoms (Waist in inches)
    mensBottomsSizes: {
        '30': { waist: '76cm', brands: { NAA: '30', Zara: '30', Levis: '30', 'H&M': '30' } },
        '32': { waist: '81cm', brands: { NAA: '32', Zara: '32', Levis: '32', 'H&M': '32' } },
        '34': { waist: '86cm', brands: { NAA: '34', Zara: '34', Levis: '34', 'H&M': '34' } },
        '36': { waist: '91cm', brands: { NAA: '36', Zara: '36', Levis: '36', 'H&M': '36' } }
    },

    // Women's Sizes (Bust in cm)
    // Women's Sizes (Bust in cm)
    womensTopsSizes: {
        XS: { bust: '81-84', brands: { NAA: 'XS', Zara: 'XS', 'H&M': 'XS', Mango: 'XS' } },
        S: { bust: '84-89', brands: { NAA: 'S', Zara: 'S', 'H&M': 'S', Mango: 'S' } },
        M: { bust: '89-94', brands: { NAA: 'M', Zara: 'M', 'H&M': 'M', Mango: 'M' } },
        L: { bust: '94-99', brands: { NAA: 'L', Zara: 'L', 'H&M': 'L', Mango: 'L' } }
    },

    // Women's Bottoms (Waist in cm)
    // Women's Bottoms (Waist in cm)
    womensBottomsSizes: {
        '24': { waist: '61cm', brands: { NAA: '24', Zara: '34', 'H&M': 'XS', Levis: '24' } },
        '26': { waist: '66cm', brands: { NAA: '26', Zara: '36', 'H&M': 'S', Levis: '26' } },
        '28': { waist: '71cm', brands: { NAA: '28', Zara: '38', 'H&M': 'M', Levis: '28' } },
        '30': { waist: '76cm', brands: { NAA: '30', Zara: '40', 'H&M': 'L', Levis: '30' } }
    }
};

/**
 * Fit notes for different brands
 */
export const brandFitNotes = {
    NAA: 'True to size with modern fit',
    Zara: 'Tends to run small, consider sizing up',
    'H&M': 'Generally true to size',
    Uniqlo: 'Asian sizing, runs smaller than US brands',
    Nike: 'Athletic fit, true to size',
    Levis: 'Classic fit, true to size',
    Mango: 'European sizing, may run small'
};

/**
 * Get size recommendation across brands
 */
export const getCrossBrandSize = (naaSize, category, gender) => {
    let sizeChart;

    if (gender === 'Men') {
        if (category.includes('pants') || category.includes('jeans') || category.includes('shorts')) {
            sizeChart = brandSizeCharts.mensBottomsSizes;
        } else {
            sizeChart = brandSizeCharts.mensTopsSizes;
        }
    } else {
        if (category.includes('pants') || category.includes('jeans') || category.includes('skirt')) {
            sizeChart = brandSizeCharts.womensBottomsSizes;
        } else {
            sizeChart = brandSizeCharts.womensTopsSizes;
        }
    }

    return sizeChart[naaSize] || null;
};

/**
 * User measurement profile structure
 */
export const createMeasurementProfile = (measurements) => {
    return {
        height: measurements.height || 175,
        weight: measurements.weight || 70,
        chest: measurements.chest || null,
        waist: measurements.waist || null,
        hips: measurements.hips || null,
        shoulders: measurements.shoulders || null,
        inseam: measurements.inseam || null,
        lastUpdated: new Date().toISOString(),
        measurementMethod: measurements.method || 'manual', // 'manual', 'photo', 'ai'
        confidence: measurements.confidence || 100
    };
};

/**
 * Calculate fit prediction based on measurements and product
 */
export const calculateFitPrediction = (userProfile, product) => {
    const bmi = userProfile.weight / Math.pow(userProfile.height / 100, 2);

    // Determine recommended size based on height and weight
    let sizeScore = 0;
    if (userProfile.height <= 160) sizeScore += 1;
    else if (userProfile.height <= 170) sizeScore += 2;
    else if (userProfile.height <= 180) sizeScore += 3;
    else sizeScore += 4;

    if (userProfile.weight <= 55) sizeScore = Math.max(sizeScore, 1);
    else if (userProfile.weight <= 65) sizeScore = Math.max(sizeScore, 2);
    else if (userProfile.weight <= 80) sizeScore = Math.max(sizeScore, 3);
    else sizeScore = Math.max(sizeScore, 4);

    const sizeMap = { 1: 'XS', 2: 'S', 3: 'M', 4: 'L', 5: 'XL' };
    const recommendedSize = sizeMap[sizeScore] || 'M';

    // Calculate confidence based on fit type
    let confidence = 85;
    if (product.fit === 'Oversized') confidence = 90;
    if (product.fit === 'Slim' && bmi > 25) confidence = 70;
    if (product.fit === 'Regular') confidence = 88;

    // Calculate return probability
    let returnProbability = 15;
    if (confidence < 75) returnProbability = 35;
    else if (confidence < 85) returnProbability = 20;

    return {
        recommendedSize,
        confidence,
        returnProbability,
        fitAdvice: getFitAdvice(bmi, product.fit, confidence)
    };
};

/**
 * Get fit advice based on BMI and product fit
 */
const getFitAdvice = (bmi, productFit, confidence) => {
    if (confidence > 85) {
        return `Excellent fit match! This ${productFit.toLowerCase()} fit should work perfectly for your measurements.`;
    } else if (confidence > 75) {
        return `Good fit expected. The ${productFit.toLowerCase()} fit may vary slightly based on personal preference.`;
    } else {
        return `Moderate fit confidence. Consider trying multiple sizes or checking detailed measurements.`;
    }
};

/**
 * Save user measurement profile to localStorage
 */
export const saveMeasurementProfile = (profile) => {
    try {
        localStorage.setItem('naa_measurement_profile', JSON.stringify(profile));
        return true;
    } catch (error) {
        console.error('Error saving measurement profile:', error);
        return false;
    }
};

/**
 * Load user measurement profile from localStorage
 */
export const loadMeasurementProfile = () => {
    try {
        const saved = localStorage.getItem('naa_measurement_profile');
        return saved ? JSON.parse(saved) : null;
    } catch (error) {
        console.error('Error loading measurement profile:', error);
        return null;
    }
};

/**
 * Track purchase for fit prediction improvement
 */
export const trackPurchase = (productId, size, userProfile) => {
    try {
        const purchases = JSON.parse(localStorage.getItem('naa_purchases') || '[]');
        purchases.push({
            productId,
            size,
            userProfile: { height: userProfile.height, weight: userProfile.weight },
            date: new Date().toISOString()
        });
        localStorage.setItem('naa_purchases', JSON.stringify(purchases));
    } catch (error) {
        console.error('Error tracking purchase:', error);
    }
};

/**
 * Get purchase history
 */
export const getPurchaseHistory = () => {
    try {
        return JSON.parse(localStorage.getItem('naa_purchases') || '[]');
    } catch (error) {
        console.error('Error getting purchase history:', error);
        return [];
    }
};

export default {
    brandSizeCharts,
    brandFitNotes,
    getCrossBrandSize,
    createMeasurementProfile,
    calculateFitPrediction,
    saveMeasurementProfile,
    loadMeasurementProfile,
    trackPurchase,
    getPurchaseHistory
};
