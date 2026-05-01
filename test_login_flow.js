
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './backend/config/db.js';
import userRoutes from './backend/routes/userRoutes.js';
import { notFound, errorHandler } from './backend/middleware/errorMiddleware.js';
import fetch from 'node-fetch';

dotenv.config();

const startServerAndTest = async () => {
    // 1. Start Server
    await connectDB();
    const app = express();
    app.use(cors());
    app.use(express.json());
    app.use('/api/users', userRoutes);
    app.use(notFound);
    app.use(errorHandler);

    const server = app.listen(4243, async () => {
        console.log('Test Server running on 4243');

        // 2. Make Request
        try {
            console.log('Testing Login...');
            const response = await fetch('http://localhost:4243/api/users/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: 'admin@naa.com', password: 'wrongpassword' })
            });

            const textSize = await response.text();
            console.log(`Response Status: ${response.status}`);
            console.log(`Response Body: ${textSize}`);

            try {
                JSON.parse(textSize);
                console.log("Response is valid JSON");
            } catch (e) {
                console.error("Response is NOT valid JSON");
            }

        } catch (err) {
            console.error('Fetch error:', err);
        } finally {
            server.close();
            process.exit(0);
        }
    });
};

startServerAndTest();
