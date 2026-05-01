
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './backend/models/Product.js';

dotenv.config();

// MOCK CONSTANTS from controller logic
const stopWords = ['show', 'me', 'some', 'the', 'a', 'an', 'i', 'want', 'need', 'looking', 'for', 'outfits', 'outfit', 'clothes', 'clothing', 'item', 'items'];
const genderWords = ['men', 'mens', 'man', 'male', 'women', 'womens', 'woman', 'female'];

const simulate = async (msg) => {
    console.log(`\nTesting: "${msg}"`);
    const lastMsg = msg.toLowerCase();

    // 1. Context
    const isMen = /\b(men|man|boy|guy|him|male|mens)\b/i.test(lastMsg);
    const isWomen = /\b(women|woman|girl|lady|her|female|womens)\b/i.test(lastMsg);
    let genderFilter = isMen ? 'Men' : (isWomen ? 'Women' : null);

    // 2. Accessories Check
    if (lastMsg.includes('accessories') || lastMsg.includes('accessory') || lastMsg.includes('watch')) {
        genderFilter = 'Accessories';
    }

    // 3. Keywords
    let keywords = lastMsg.split(/[\s,]+/).filter(w => !stopWords.includes(w) && w.length > 2);
    // Remove gender words
    keywords = keywords.filter(k => !genderWords.includes(k));
    // Remove accessory words
    keywords = keywords.filter(k => !['accessories', 'accessory'].includes(k));

    console.log(` - Filter: ${genderFilter}`);
    console.log(` - Keywords: [${keywords.join(', ')}]`);

    if (keywords.length === 0 && genderFilter) {
        console.log(" -> Triggering GENERIC Search...");
        try {
            await mongoose.connect(process.env.MONGO_URI);
            const products = await Product.find({ category: genderFilter }).limit(3);
            console.log(` -> Found ${products.length} items:`);
            products.forEach(p => console.log(`    * ${p.name} (${p.category})`));
            await mongoose.disconnect();
        } catch (e) { console.log(e); }
    } else {
        console.log(" -> Triggering SPECIFIC Keyword Search...");
    }
}

await simulate("show me accessories");
