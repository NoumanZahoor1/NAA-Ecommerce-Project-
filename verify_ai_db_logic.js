
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './backend/models/Product.js';

dotenv.config();

const testLogic = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to DB");

        // Test 1: Men's Jacket (Should find items)
        const menJackets = await Product.find({
            category: 'Men',
            $or: [{ name: /jacket/i }, { description: /jacket/i }]
        }).limit(3);
        console.log("Men's Jackets Found:", menJackets.length);
        menJackets.forEach(p => console.log(` - ${p.name} ($${p.price})`));

        // Test 2: Men's Dress (Should find 0 items)
        const menDresses = await Product.find({
            category: 'Men',
            $or: [{ name: /dress/i }]
        }).limit(3);
        console.log("Men's Dresses Found:", menDresses.length); // Expect 0

        // Test 3: Budget under $40
        const cheapItems = await Product.find({ price: { $lte: 40 } }).limit(3);
        console.log("Items under $40:", cheapItems.length);
        cheapItems.forEach(p => console.log(` - ${p.name} ($${p.price})`));

    } catch (error) {
        console.error("Error:", error);
    } finally {
        await mongoose.disconnect();
    }
};

testLogic();
