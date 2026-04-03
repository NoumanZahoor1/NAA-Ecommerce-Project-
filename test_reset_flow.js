import mongoose from 'mongoose';
import crypto from 'crypto';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import User from './backend/models/User.js';

dotenv.config();

const testFlow = async () => {
    console.log('--- TESTING RESET FLOW ---');

    // 1. Connect to DB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB');

    // 2. Find User
    const email = 'nomijatoi456@gmail.com';
    const user = await User.findOne({ email });

    if (!user) {
        console.log('User not found!');
        process.exit(1);
    }

    // 3. Manually Generate and Save Token
    const rawToken = '1234567890123456789012345678901234567890'; // 40 chars
    const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
    await user.save();
    console.log('Manually saved token to DB');

    // 4. Call Reset Endpoint
    console.log(`Attempting reset with token: ${rawToken}`);
    const res = await fetch(`http://localhost:4242/api/users/resetpassword/${rawToken}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: 'newpassword123' })
    });

    const data = await res.json();
    console.log('Response:', data);

    if (res.ok) {
        console.log('✅ SUCCESS: Logic works.');
    } else {
        console.log('❌ FAILED: Logic or Token mismatch.');
    }

    mongoose.disconnect();
};

testFlow();
