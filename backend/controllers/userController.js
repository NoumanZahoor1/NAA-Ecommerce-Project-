import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    console.log(`Login attempt for: ${email}`);

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        console.log('User found and password matches.');
        if (!process.env.JWT_SECRET) {
            console.error('FATAL: JWT_SECRET is not defined!');
        }

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id),
        });
        console.log('Response sent successfully.');
    } else {
        console.log('Invalid credentials.');
        res.status(401);
        throw new Error('Invalid email or password');
    }
});

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    const user = await User.create({
        name,
        email,
        password,
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id),
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
    const users = await User.aggregate([
        {
            $lookup: {
                from: 'orders',
                localField: '_id',
                foreignField: 'user',
                as: 'orders'
            }
        },
        {
            $project: {
                _id: 1,
                name: 1,
                email: 1,
                isAdmin: 1,
                createdAt: 1,
                orderCount: { $size: '$orders' },
                totalSpent: { $sum: '$orders.totalPrice' }
            }
        },
        { $sort: { createdAt: -1 } }
    ]);
    res.json(users);
});

export { authUser, registerUser, getUsers };
