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

    // > Category 6: OCCASIONS (Dynamic Search)
    const occasionMap = {
        'wedding': ['Blazer', 'Dress', 'Formal', 'Suit', 'Chino'],
        'party': ['Jacket', 'Dress', 'Leather', 'Top', 'Heel'],
        'gym': ['Running', 'Shoe', 'Active', 'Tee', 'Short', 'Sweat', 'Track', 'Sport', 'Tank', 'Legging'],
        'office': ['Blazer', 'Chino', 'Shirt', 'Blouse', 'Trousers', 'Loafer'],
        'summer': ['Dress', 'Shorts', 'Tee', 'Top', 'Sandal', 'Swim', 'Linen'],
        'winter': ['Hoodie', 'Jacket', 'Coat', 'Scarf', 'Boot', 'Wool']
    };

    for (const [occasion, keywords] of Object.entries(occasionMap)) {
        if (lastMsg.includes(occasion)) {
            // Build Contextual Query
            let genderTarget = isMen ? 'Men' : (isWomen ? 'Women' : null);

            // Query for Occasion
            // Strategy: Search for Gender-specific items OR Accessories (shoes/bags are universal)
            let query = {
                $or: keywords.map(k => ({ name: { $regex: k, $options: 'i' } }))
            };

            if (genderTarget) {
                // If gender is known, allow that Gender OR Accessories
                query.category = { $in: [genderTarget, 'Accessories'] };
            }

            try {
                const products = await Product.find(query).limit(4);
                if (products.length > 0) {
                    return {
                        reply: `For a ${occasion}, I picked these perfectly styled items for you! ✨`,
                        products: products
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
