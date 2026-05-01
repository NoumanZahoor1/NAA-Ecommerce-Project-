import { body, validationResult } from 'express-validator';

// Standardized error response
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400);
        throw new Error(errors.array()[0].msg);
    }
    next();
};

// User validations
const registerValidation = [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    validate
];

const loginValidation = [
    body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
    body('password').notEmpty().withMessage('Password is required'),
    validate
];

// Product validations
const productValidation = [
    body('name').trim().notEmpty().withMessage('Product name is required'),
    body('price').isNumeric().withMessage('Price must be a number'),
    body('category').notEmpty().withMessage('Category is required'),
    body('countInStock').optional().isNumeric(),
    validate
];

// Review validations
const reviewValidation = [
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('comment').trim().notEmpty().withMessage('Comment cannot be empty'),
    validate
];

// Password reset validations
const forgotPasswordValidation = [
    body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
    validate
];

const resetPasswordValidation = [
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    validate
];

export {
    registerValidation,
    loginValidation,
    productValidation,
    reviewValidation,
    forgotPasswordValidation,
    resetPasswordValidation
};
