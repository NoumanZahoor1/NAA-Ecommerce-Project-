
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './backend/models/Product.js';
import User from './backend/models/User.js';
import Review from './backend/models/Review.js';

dotenv.config();

const checkDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        const productId = '5f4d1e2b4f1d4b0017a1a003';
        const product = await Product.findById(productId);

        if (product) {
            console.log('✅ Product found in DB:', product.name);
        } else {
            console.log('❌ Product NOT found in DB. Total products:', await Product.countDocuments());
        }

        const usersCount = await User.countDocuments();
        console.log('Users in DB:', usersCount);

        const reviewsCount = await Review.countDocuments();
        console.log('Reviews in DB:', reviewsCount);

        mongoose.connection.close();
    } catch (err) {
        console.error('Error:', err);
    }
};

checkDB();
