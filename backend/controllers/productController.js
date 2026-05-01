import asyncHandler from 'express-async-handler';
import Product from '../models/Product.js';

// @desc    Fetch all products with search, filter, and pagination
// @route   GET /api/products?search=&category=&minPrice=&maxPrice=&page=&limit=
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
    const pageSize = Number(req.query.limit) || 0; // 0 means no limit (all products)
    const page = Number(req.query.page) || 1;

    const keyword = req.query.search
        ? {
            name: {
                $regex: req.query.search,
                $options: 'i',
            },
        }
        : {};

    const filter = { ...keyword };

    // Category filter
    if (req.query.category) {
        filter.category = req.query.category;
    }

    // Price range filter
    if (req.query.minPrice || req.query.maxPrice) {
        filter.price = {};
        if (req.query.minPrice) {
            filter.price.$gte = Number(req.query.minPrice);
        }
        if (req.query.maxPrice) {
            filter.price.$lte = Number(req.query.maxPrice);
        }
    }

    const count = await Product.countDocuments(filter);

    const products = pageSize > 0
        ? await Product.find(filter)
            .limit(pageSize)
            .skip(pageSize * (page - 1))
            .sort({ createdAt: -1 })
        : await Product.find(filter).sort({ createdAt: -1 });

    res.json({
        products,
        page,
        pages: pageSize > 0 ? Math.ceil(count / pageSize) : 1,
        total: count,
    });
});

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (product) {
        res.json(product);
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

// @desc    Create a product (Admin)
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
    const { name, price, description, image, images, category, stock, sizes, colors, salePrice, saleStartDate, saleEndDate, brand } = req.body;

    const product = new Product({
        user: req.user._id,
        name: name || 'Sample Product',
        price: price || 0,
        description: description || '',
        image: image || '/images/sample.jpg',
        images: images || [image || '/images/sample.jpg'],
        brand: brand || 'NAA',
        category: category || 'Men',
        countInStock: stock || 0,
        sizes: sizes || ['S', 'M', 'L'],
        colors: colors || ['black'],
        rating: 0,
        salePrice,
        saleStartDate,
        saleEndDate
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
});

// @desc    Update a product (Admin)
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
    const { name, price, description, image, images, category, stock, sizes, colors, salePrice, saleStartDate, saleEndDate, brand } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
        product.name = name || product.name;
        product.price = price !== undefined ? price : product.price;
        product.description = description || product.description;
        product.image = image || product.image;
        product.images = images || product.images;
        product.brand = brand || product.brand;
        product.category = category || product.category;
        product.countInStock = stock !== undefined ? stock : product.countInStock;
        product.sizes = sizes || product.sizes;
        product.colors = colors || product.colors;
        product.salePrice = salePrice !== undefined ? salePrice : product.salePrice;
        product.saleStartDate = saleStartDate || product.saleStartDate;
        product.saleEndDate = saleEndDate || product.saleEndDate;

        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

// @desc    Delete a product (Admin)
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (product) {
        await product.deleteOne();
        res.json({ message: 'Product removed' });
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

export { getProducts, getProductById, createProduct, updateProduct, deleteProduct };
