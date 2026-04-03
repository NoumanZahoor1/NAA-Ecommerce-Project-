import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Order from './backend/models/Order.js';

dotenv.config();

const checkOrders = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const orders = await Order.find({});
        console.log(`Found ${orders.length} total orders`);

        orders.forEach((order, index) => {
            console.log(`\nOrder ${index + 1}:`);
            console.log(`ID: ${order._id}`);
            console.log(`User: ${order.user ? `${order.user.name} (${order.user.email}) [${order.user._id}]` : 'GUEST (null)'}`);
            console.log(`Email: ${order.email}`);
            console.log(`Created At: ${order.createdAt}`);
        });

        await mongoose.connection.close();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

checkOrders();
