import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import connectDB from './backend/config/db.js';

import userRoutes from './backend/routes/userRoutes.js';
import productRoutes from './backend/routes/productRoutes.js';
import chatRoutes from './backend/routes/chatRoutes.js';
import paymentRoutes from './backend/routes/paymentRoutes.js';
import orderRoutes from './backend/routes/orderRoutes.js';
import reviewRoutes from './backend/routes/reviewRoutes.js';
import uploadRoutes from './backend/routes/uploadRoutes.js';
import visualSearchRoutes from './backend/routes/visualSearchRoutes.js';

import { notFound, errorHandler } from './backend/middleware/errorMiddleware.js';

dotenv.config();

// Global crash handlers
process.on('uncaughtException', (err) => {
    console.error('FATAL: Uncaught Exception:', err);
    // In production, you might want to restart the process
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('FATAL: Unhandled Rejection at:', promise, 'reason:', reason);
});

connectDB();

const app = express();

// Log incoming requests
app.use((req, res, next) => {
    console.log(`${req.method} ${req.originalUrl}`);
    next();
});

// Security: Helmet for security headers
app.use(helmet({
    contentSecurityPolicy: false, // Disable for development, enable in production
    crossOriginEmbedderPolicy: false
}));

// Security: CORS configuration - restrict to frontend URL
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (mobile apps, Postman, etc.)
        if (!origin) return callback(null, true);

        if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

// Security: Rate limiting - prevent brute force attacks
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: { message: 'Too many requests from this IP, please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
});

// Apply rate limiting to all routes
app.use(limiter);

// Stricter rate limit for auth routes
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 login requests per windowMs
    message: { message: 'Too many login attempts, please try again later.' },
    skipSuccessfulRequests: true,
});

// Body parser with size limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.get('/test', (req, res) => res.send('API is running...'));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api', visualSearchRoutes);

// Apply strict rate limiting to auth endpoints
app.use('/api/users/login', authLimiter);
app.use('/api/users/register', authLimiter);

// Error handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 4242;
app.listen(PORT, '0.0.0.0', () => console.log(`✅ Node server listening on port ${PORT}!`));
