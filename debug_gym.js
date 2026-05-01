
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './backend/models/Product.js';

dotenv.config();

const simulateGym = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        // Simulating "gym for men"
        // Current Logic: category='Men', keywords=['Running', 'Shoe', 'Active', 'Tee']
        const keywords = ['Running', 'Shoe', 'Active', 'Tee'];

        console.log("Searching Men's Gym Items...");
        const products = await Product.find({
            category: 'Men',
            $or: keywords.map(k => ({ name: { $regex: k, $options: 'i' } }))
        });

        console.log(`Found ${products.length} items:`);
        products.forEach(p => console.log(` - ${p.name}`));

        // Check what actually EXISTS for men that should match
        console.log("\nChecking potential Men's Gym items (Sweatpants, etc)...");
        const potentials = await Product.find({
            category: 'Men',
            name: { $regex: /(sweat|track|short|sport)/i }
        });
        potentials.forEach(p => console.log(` [Potential] ${p.name}`));

        await mongoose.disconnect();
    } catch (e) { console.log(e); }
};

simulateGym();
