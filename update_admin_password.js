import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './backend/models/User.js';

dotenv.config();

const updatePassword = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        const user = await User.findOne({ email: 'admin@naa.com' });
        if (user) {
            user.password = 'admin123';
            await user.save();
            console.log('✅ Admin password updated to: admin123');
        } else {
            console.log('❌ Admin user not found');
        }

        mongoose.connection.close();
    } catch (error) {
        console.error('Error:', error);
    }
};

updatePassword();
