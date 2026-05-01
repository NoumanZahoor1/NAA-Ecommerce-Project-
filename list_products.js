
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './backend/models/Product.js';

dotenv.config();

const listProducts = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const products = await Product.find({}).limit(5);
        console.log('--- SAMPLE PRODUCTS ---');
        products.forEach(p => {
            console.log(`ID: ${p._id}, Name: ${p.name}`);
        });
        mongoose.connection.close();
    } catch (err) {
        console.error('Error:', err);
    }
};

listProducts();
