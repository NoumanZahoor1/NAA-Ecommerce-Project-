import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose';
import Review from '../models/Review.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';

// @desc    Create a new review
// @route   POST /api/reviews
// @access  Private
const createReview = asyncHandler(async (req, res) => {
    console.log(`[Review] Create attempt by user ${req.user._id} (${req.user.name})`);
    const { productId, rating, comment } = req.body;

    // Validation
    if (!productId || !rating || !comment) {
        console.warn('[Review] Missing fields:', { productId, rating, comment });
        res.status(400);
        throw new Error('Please provide product ID, rating, and comment');
    }

    if (rating < 1 || rating > 5) {
        res.status(400);
        throw new Error('Rating must be between 1 and 5');
    }

    // Check if productId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(productId)) {
        console.warn(`[Review] Invalid Product ID format: ${productId}`);
        res.status(400);
        throw new Error('Invalid product ID');
    }

    // Check if product exists
    console.log(`[Review] Checking if product exists: ${productId}`);
    const product = await Product.findById(productId);
    if (!product) {
        console.warn(`[Review] Product not found in DB: ${productId}`);
        res.status(404);
        throw new Error('Product not found in our database. It might be a fallback/placeholder product.');
    }

    // Check if user already reviewed this product
    console.log('[Review] Checking for existing review');
    const existingReview = await Review.findOne({
        user: req.user._id,
        product: productId
    });

    if (existingReview) {
        console.warn('[Review] Duplicate review attempt');
        res.status(400);
        throw new Error('You have already reviewed this product');
    }

    // Check if user purchased this product (optional verification)
    console.log('[Review] Checking purchase history');
    const hasPurchased = await Order.findOne({
        user: req.user._id,
        'orderItems.product': productId,
        isPaid: true
    });

    // Create review
    console.log('[Review] Creating review document');
    const review = await Review.create({
        user: req.user._id,
        product: productId,
        name: req.user.name,
        rating: Number(rating),
        comment,
        isVerified: !!hasPurchased
    });

    // Update product rating
    console.log('[Review] Triggering rating update');
    await updateProductRating(productId);

    res.status(201).json(review);
});

// @desc    Get reviews for a product
// @route   GET /api/reviews/product/:id
// @access  Public
const getProductReviews = asyncHandler(async (req, res) => {
    const reviews = await Review.find({ product: req.params.id })
        .populate('user', 'name')
        .sort({ createdAt: -1 });

    res.json(reviews);
});

// @desc    Update a review
// @route   PUT /api/reviews/:id
// @access  Private
const updateReview = asyncHandler(async (req, res) => {
    const { rating, comment } = req.body;

    const review = await Review.findById(req.params.id);

    if (!review) {
        res.status(404);
        throw new Error('Review not found');
    }

    // Check if user owns this review
    if (review.user.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error('Not authorized to update this review');
    }

    if (rating) {
        if (rating < 1 || rating > 5) {
            res.status(400);
            throw new Error('Rating must be between 1 and 5');
        }
        review.rating = rating;
    }

    if (comment) {
        review.comment = comment;
    }

    const updatedReview = await review.save();

    // Update product rating
    await updateProductRating(review.product);

    res.json(updatedReview);
});

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private
const deleteReview = asyncHandler(async (req, res) => {
    const review = await Review.findById(req.params.id);

    if (!review) {
        res.status(404);
        throw new Error('Review not found');
    }

    // Check if user owns this review or is admin
    if (review.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
        res.status(403);
        throw new Error('Not authorized to delete this review');
    }

    const productId = review.product;
    await review.deleteOne();

    // Update product rating
    await updateProductRating(productId);

    res.json({ message: 'Review removed' });
});

// @desc    Get user's reviews
// @route   GET /api/reviews/myreviews
// @access  Private
const getMyReviews = asyncHandler(async (req, res) => {
    const reviews = await Review.find({ user: req.user._id })
        .populate('product', 'name image')
        .sort({ createdAt: -1 });

    res.json(reviews);
});

// Helper function to update product rating
const updateProductRating = async (productId) => {
    const reviews = await Review.find({ product: productId });

    if (reviews.length === 0) {
        await Product.findByIdAndUpdate(productId, {
            rating: 0,
            numReviews: 0
        });
        return;
    }

    const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
    const avgRating = totalRating / reviews.length;

    await Product.findByIdAndUpdate(productId, {
        rating: avgRating.toFixed(1),
        numReviews: reviews.length
    });
};

export {
    createReview,
    getProductReviews,
    updateReview,
    deleteReview,
    getMyReviews
};
