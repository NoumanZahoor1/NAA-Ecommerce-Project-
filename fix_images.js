import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './backend/models/Product.js';

dotenv.config();

const updateImages = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        const result = await Product.updateMany(
            { name: /Knit Polo Sweater/i },
            {
                $set: {
                    image: 'https://images.unsplash.com/photo-1598033129183-c4f50c7176c8?auto=format&fit=crop&w=800&q=80',
                    images: ['https://images.unsplash.com/photo-1598033129183-c4f50c7176c8?auto=format&fit=crop&w=800&q=80']
                }
            }
        );

        console.log(`Updated ${result.modifiedCount} products.`);
        mongoose.connection.close();
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
};

updateImages();
