
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './backend/models/User.js';

dotenv.config();

const findUser = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const user = await User.findOne({ isAdmin: true });
        console.log('--- ADMIN USER ---');
        if (user) {
            console.log(`Email: ${user.email}`);
            // Note: I can't get the plain password, but usually it's admin@naa.com / admin
        } else {
            const anyUser = await User.findOne({});
            console.log(`Email: ${anyUser ? anyUser.email : 'No users found'}`);
        }
        mongoose.connection.close();
    } catch (err) {
        console.error('Error:', err);
    }
};

findUser();
