import mongoose from 'mongoose';
import dotenv from 'dotenv';
import colors from 'express'; // using colors from console if available, or just standard logs
import users from './data/users.js';
import products from './data/products.js';
import User from './models/User.js';
import Product from './models/Product.js';
import Order from './models/Order.js';
import connectDB from './config/db.js';

dotenv.config();
dotenv.config();
// Connect DB inside functions to ensure await

const importData = async () => {
    try {
        await connectDB();
        await Order.deleteMany();
        await Product.deleteMany();
        await User.deleteMany();

        const createdUsers = [];
        for (const user of users) {
            const createdUser = await User.create(user);
            createdUsers.push(createdUser);
        }
        const adminUser = createdUsers[0]._id;

        const sampleProducts = products.map((product) => {
            return { ...product, user: adminUser };
        });

        await Product.insertMany(sampleProducts);

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await connectDB();
        await Order.deleteMany();
        await Product.deleteMany();
        await User.deleteMany();

        console.log('Data Destroyed!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}
