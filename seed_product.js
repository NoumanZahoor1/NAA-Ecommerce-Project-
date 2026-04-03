
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './backend/models/Product.js';
import User from './backend/models/User.js';

dotenv.config();

const seedSpecificProduct = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        const adminUser = await User.findOne({ isAdmin: true });
        if (!adminUser) {
            console.error('No admin user found. Please create one.');
            process.exit(1);
        }

        const productId = '5f4d1e2b4f1d4b0017a1a003';
        const existing = await Product.findById(productId);

        if (existing) {
            console.log('Product already exists');
        } else {
            const product = new Product({
                _id: productId,
                user: adminUser._id,
                name: 'Summer Dress',
                image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=600&q=80',
                brand: 'NAA',
                category: 'Women',
                description: 'Flowy summer dress',
                price: 39.99,
                countInStock: 20,
                sizes: ['XS', 'S', 'M'],
                colors: ['red', 'white']
            });
            await product.save();
            console.log('✅ Seeded Summer Dress with ID:', productId);
        }

        mongoose.connection.close();
    } catch (err) {
        console.error('Error:', err);
    }
};

seedSpecificProduct();
