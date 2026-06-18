import OpenAI from 'openai';
import dotenv from 'dotenv';
import Product from '../models/Product.js';

dotenv.config();

// Initialize OpenAI
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || 'dummy-key-placeholder'
});

export const chatWithAI = async (req, res) => {
    // Robust error handling for body
    if (!req.body || !req.body.messages) {
        return res.status(400).json({ error: "Invalid request body" });
    }

    const { messages } = req.body;
    const userMessage = messages[messages.length - 1].content.toLowerCase();

    // Use mock AI logic if no API key is set or if using a placeholder
    // OpenAI keys usually start with 'sk-' and are long. Quick check to avoid API errors.
    const isPlaceholderKey = !process.env.OPENAI_API_KEY ||
        openai.apiKey === 'dummy-key-placeholder' ||
        openai.apiKey.startsWith('your_') ||
        openai.apiKey.length < 20;

    // Force "Enhanced DB Mode" if placeholder or for stability
    if (isPlaceholderKey) {
        console.log("Processing with Enhanced DB Engine:", userMessage);
        const result = await getEnhancedReply(messages);
        return res.json(result);
    }

    // === REAL GPT-4 LOGIC ===
    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                {
                    role: "system",
                    content: `You are an expert AI Shopping Assistant for NAA. 
                    Context: Store Name: NAA (Premium Clothing)
                    Guidelines: Be helpful, mention prices, and suggest products.`
                },
                ...messages
            ],
            max_tokens: 300,
        });

        res.json({ reply: completion.choices[0].message.content });
    } catch (error) {
        console.error('OpenAI Error:', error);
        const result = await getEnhancedReply(messages);
        res.status(200).json(result);
    }
};

// === 🧠 DATABASE-DRIVEN EXPERT ENGINE ===

const getEnhancedReply = async (msgs) => {
    // Simulate network latency for realism
    await new Promise(r => setTimeout(r, 600));

    const recentHistory = msgs.slice(-3).map(m => m.content.toLowerCase()).join(' ');
    const lastMsg = msgs[msgs.length - 1].content.toLowerCase();

    // --- 1. CONTEXT EXTRACTION ---
    const isMen = /\b(men|man|boy|guy|him|male|mens)\b/i.test(lastMsg) || (/\b(men|man|boy|guy|him|male|mens)\b/i.test(recentHistory) && !/\b(women|woman|girl|lady|her|female|womens)\b/i.test(lastMsg));
    const isWomen = /\b(women|woman|girl|lady|her|female|womens)\b/i.test(lastMsg) || (/\b(women|woman|girl|lady|her|female|womens)\b/i.test(recentHistory) && !/\b(men|man|boy|guy|him|male|mens)\b/i.test(lastMsg));

    // --- 2. DB QUERY HELPER ---
    const searchDB = async (keywords, genderFilter = null, categoryFilter = null) => {
        let query = {};

        // 1. Text Search
        if (keywords && keywords.length > 0) {
            query.$or = keywords.map(k => ({
                $or: [
                    { name: { $regex: k, $options: 'i' } },
                    { description: { $regex: k, $options: 'i' } },
                    { category: { $regex: k, $options: 'i' } }
                ]
            }));
        }

        // 2. Gender/Category Filter
        if (genderFilter) {
            // If filtering for Men, allow "Men" category or "Accessories" (often unisex)
            // But if strict, maybe just Men?
            // Let's go strict for accuracy as requested
            if (categoryFilter) {
                query.category = categoryFilter;
            } else {
                // Hybrid: exact category match
                query.category = genderFilter;
            }
        }

        try {
            return await Product.find(query).limit(4);
        } catch (e) {
            console.error("DB Search Error:", e);
            return [];
        }
    };

    // --- 3. INTENT HANDLERS ---

    // > Category 3: SIZE & FIT
    const heightRegex = /(\d+)\s?(?:ft|'|feet)\s?(\d+)?/i;
    const weightRegex = /(\d+)\s?(?:kg|lbs)/i;
    const isShoeQuery = /\b(shoe|shoes|sneaker|sneakers|footwear|boots)\b/i.test(lastMsg);

    // Fix: 'fit' matched 'outfit'. Used regex `\bfit\b` for strict word boundary.
    if (heightRegex.test(lastMsg) || weightRegex.test(lastMsg) || lastMsg.includes('size') || /\bfit\b/i.test(lastMsg) || lastMsg.includes('measure')) {
        if (isShoeQuery) return { reply: "For shoes, our sizes depend on the region (US/UK). Generally, we recommend ordering your true size for sneakers." };
        if (heightRegex.test(lastMsg)) {
            return { reply: `Based on your height, a ${isMen ? 'Large (L)' : 'Medium (M)'} would likely be the best fit for length. Our cuts are modern and tailored.` };
        }
        return { reply: "Our sizing runs true-to-fit! 📏 For a relaxed look, size up. Check the Size Chart on the product page for exact measurements." };
    }

    // > Category 8: PRICE / BUDGET
    const budgetMatch = lastMsg.match(/under\s?\$?(\d+)/i) || lastMsg.match(/budget/);
    if (budgetMatch) {
        const budget = budgetMatch[1] ? parseInt(budgetMatch[1]) : 50;
        const products = await Product.find({ price: { $lte: budget } }).limit(4);

        if (products.length > 0) {
            const names = products.map(p => p.name).join(', ');
            return {
                reply: `I found these items under $${budget}: ${names}. Check them out! 💸`,
                products: products
            };
        }
        return { reply: `I couldn't find anything under $${budget}, but we have great T-Shirts starting at $25!` };
    }

    // > Category 10 & 11: POLICIES
    if (lastMsg.includes('return') || lastMsg.includes('exchange') || lastMsg.includes('refund')) {
        return { reply: "✅ **Return Policy**: You can return or exchange any unworn item within **30 days** of purchase. Just keep the tags on!" };
    }
    if (lastMsg.includes('ship') || lastMsg.includes('delivery')) {
        return { reply: "🚚 **Shipping Info**: \n- Free Shipping on orders over $100.\n- Standard Delivery: 3-5 business days." };
    }

    // > Trending products handler
    if (lastMsg.includes('trending')) {
        try {
            const products = await Product.find({
                $or: [
                    { name: { $regex: 'jacket|leather|hoodie|watch', $options: 'i' } },
                    { description: { $regex: 'jacket|leather|hoodie|watch', $options: 'i' } }
                ],
                name: { $ne: 'Gloves' }
            });

            // Sort to ensure Leather Jacket is first
            const leatherJacketIdx = products.findIndex(p => p.name.toLowerCase() === 'leather jacket');
            if (leatherJacketIdx > -1) {
                const [leatherJacket] = products.splice(leatherJacketIdx, 1);
                products.unshift(leatherJacket);
            }

            return {
                reply: "Here are our top picks for you:",
                products: products.slice(0, 5)
            };
        } catch (e) {
            console.error("Trending query error in backend:", e);
        }
    }

    // > Category 6: OCCASIONS (Dynamic Search)
    const occasionMap = {
        'wedding': {
            keywords: ['Blazer', 'Dress', 'Formal', 'Suit', 'Chino'],
            types: ['top', 'bottom', 'accessory']
        },
        'party': {
            keywords: ['Jacket', 'Dress', 'Leather', 'Top', 'Heel'],
            types: ['top', 'bottom', 'accessory']
        },
        'gym': {
            keywords: ['Running', 'Shoe', 'Active', 'Tee', 'Short', 'Sweat', 'Track', 'Sport', 'Tank', 'Legging', 'Vest', 'Bag'],
            types: ['top', 'bottom', 'accessory']
        },
        'office': {
            keywords: ['Blazer', 'Chino', 'Shirt', 'Blouse', 'Trousers', 'Loafer'],
            types: ['top', 'bottom', 'accessory']
        },
        'summer': {
            keywords: ['Dress', 'Shorts', 'Tee', 'Top', 'Sandal', 'Swim', 'Linen'],
            types: ['top', 'bottom', 'accessory']
        },
        'winter': {
            keywords: ['Hoodie', 'Jacket', 'Coat', 'Scarf', 'Boot', 'Wool'],
            types: ['top', 'bottom', 'accessory']
        }
    };

    for (const [occasion, config] of Object.entries(occasionMap)) {
        if (lastMsg.includes(occasion)) {
            // Build Contextual Query
            let genderTarget = isMen ? 'Men' : (isWomen ? 'Women' : null);

            // Strategy: Try to find a diverse set of items (Top, Bottom, Accessory)
            let outfitProducts = [];
            
            try {
                // Search for different categories to make a complete outfit
                const keywords = config.keywords;
                
                // 1. Get all potential matches
                let query = {
                    $or: keywords.map(k => ({ 
                        $or: [
                            { name: { $regex: k, $options: 'i' } },
                            { description: { $regex: k, $options: 'i' } }
                        ]
                    }))
                };

                if (genderTarget) {
                    query.category = { $in: [genderTarget, 'Accessories', 'new'] };
                }

                const allMatches = await Product.find(query);
                
                if (allMatches.length > 0) {
                    // Smart Selection: Pick one from different types
                    // We'll use simple string matching on name/description to guess types
                    const tops = allMatches.filter(p => /\b(tee|shirt|hoodie|jacket|blazer|vest|top|tank|sweater|blouse)\b/i.test(p.name));
                    const bottoms = allMatches.filter(p => /\b(pants|jeans|shorts|skirt|legging|trousers|chino|track pants|sweatpants)\b/i.test(p.name));
                    const accessories = allMatches.filter(p => p.category === 'Accessories' || /\b(shoe|sneaker|bag|watch|hat|cap|scarf|belt|glasses)\b/i.test(p.name));

                    if (tops.length > 0) outfitProducts.push(tops[0]);
                    if (bottoms.length > 0) outfitProducts.push(bottoms[0]);
                    if (accessories.length > 0) outfitProducts.push(accessories[0]);
                    
                    // Fill up to 4 if we have more matches
                    const remaining = allMatches.filter(p => !outfitProducts.find(op => op._id.toString() === p._id.toString()));
                    outfitProducts = [...outfitProducts, ...remaining].slice(0, 4);

                    return {
                        reply: `I've put together a premium ${occasion} outfit for you! ✨ It includes a coordinated top, bottom, and essential accessories.`,
                        products: outfitProducts
                    };
                }
            } catch (e) {
                console.error("Occasion Search Error:", e);
            }
        }
    }

    // > Category 1: DISCOVERY / BROWSING (General)
    // Map common terms to DB queries
    // E.g. "Show me dresses"

    // Explicit Category Mapping
    const termMap = [
        { term: 'dress', category: 'Women' },
        { term: 'skirt', category: 'Women' },
        { term: 'blouse', category: 'Women' },
        { term: 'suit', category: 'Men' },
        { term: 'tuxedo', category: 'Men' },
    ];

    // Check for explicit gendered terms validation
    for (const map of termMap) {
        if (lastMsg.includes(map.term)) {
            if (isMen && map.category === 'Women') {
                return { reply: `I don't show ${map.term}s for men, but maybe you'd like to see our **Blazers** or **Suits**?` };
            }
        }
    }

    // General Product Search
    const stopWords = ['show', 'me', 'some', 'the', 'a', 'an', 'i', 'want', 'need', 'looking', 'for', 'outfits', 'outfit', 'clothes', 'clothing', 'item', 'items'];

    // Normalize and clean keywords
    let keywords = lastMsg.split(/[\s,]+/).filter(w => !stopWords.includes(w) && w.length > 2);

    // Remove gender words from keywords if we already detected the gender context
    // This prevents searching for "mens" inside a title like "Leather Jacket" which would fail
    const genderWords = ['men', 'mens', 'man', 'male', 'women', 'womens', 'woman', 'female'];
    keywords = keywords.filter(k => !genderWords.includes(k));

    let genderFilter = isMen ? 'Men' : (isWomen ? 'Women' : null);

    // Special Case: Accessories
    // If user explicitly asks for "accessories" or specific items
    if (lastMsg.includes('accessories') || lastMsg.includes('accessory') || lastMsg.includes('watch') || lastMsg.includes('belt') || lastMsg.includes('bag') || lastMsg.includes('wallet') || lastMsg.includes('glasses')) {
        genderFilter = 'Accessories';
        // Remove 'accessories' from keywords so we don't search for it as a title word
        keywords = keywords.filter(k => !['accessories', 'accessory'].includes(k));
    }

    // 1. If keywords exist (e.g. "red hoodie"), search specifically
    if (keywords.length > 0) {
        const products = await searchDB(keywords, genderFilter);
        if (products.length > 0) {
            return {
                reply: `Here are some ${genderFilter || ''} items matching "${keywords.join(' ')}"! 🛍️`,
                products: products
            };
        }
    }
    // 2. If NO keywords but Gender is known (e.g. "show me men's outfits"), show generic popular items
    else if (genderFilter) {
        try {
            const products = await Product.find({ category: genderFilter }).limit(4);
            if (products.length > 0) {
                return {
                    reply: `Here are our latest trending items for **${genderFilter}**! 🔥`,
                    products: products
                };
            }
        } catch (e) {
            console.error("Generic Search Error:", e);
        }
    }

    // GREETING
    if (/\b(hello|hi|hey|greetings|start)\b/i.test(lastMsg) && !/\b(shipping|policy)\b/i.test(lastMsg)) {
        return { reply: "Hello! 👋 I'm your Personal Stylist. I can help with **Style Advice**, **Size Guesses**, **Finding Outfits**, and checking **Stock**. What are you looking for?" };
    }

    // FINAL FALLBACK
    return { reply: "I'm searching our inventory but couldn't find exactly that. try asking for specific categories like 'Leather Jackets', 'Summer Dresses', or 'Men's Hoodies'!" };
};
