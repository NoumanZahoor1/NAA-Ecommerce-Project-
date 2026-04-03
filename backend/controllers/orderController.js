import asyncHandler from 'express-async-handler';
import Order from '../models/Order.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = asyncHandler(async (req, res) => {
    console.log('Order creation request received');
    const {
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentResult,
        email,
    } = req.body;

    if (orderItems && orderItems.length === 0) {
        res.status(400);
        throw new Error('No order items');
        return;
    } else {
        const orderData = {
            orderItems: orderItems.map((x) => ({
                name: x.name,
                qty: x.quantity || x.qty || 1,
                image: x.image,
                price: x.price,
                product: x._id || x.id,
            })),
            shippingAddress,
            paymentMethod: paymentMethod || 'Stripe',
            taxPrice: taxPrice || 0,
            shippingPrice,
            totalPrice,
            isPaid: true,
            paidAt: new Date(),
        };

        // Add user if authenticated, otherwise store email
        if (req.user) {
            orderData.user = req.user._id;
            orderData.email = req.user.email;
        } else {
            orderData.user = null;
            orderData.email = email; // From req.body
        }

        if (paymentResult) {
            orderData.paymentResult = paymentResult;
        }

        try {
            const order = new Order(orderData);
            const createdOrder = await order.save();
            res.status(201).json(createdOrder);
        } catch (error) {
            console.error('Order saving failed:', error);
            res.status(400);
            throw new Error(error.message);
        }
    }
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
});

// @desc    Get all orders (Admin)
// @route   GET /api/orders/admin/all
// @access  Private/Admin
const getAllOrders = asyncHandler(async (req, res) => {
    console.log('Admin getAllOrders called by:', req.user.email);
    const orders = await Order.find({})
        .populate('user', 'id name email')
        .sort({ createdAt: -1 });
    console.log(`Found ${orders.length} orders for admin.`);
    res.json(orders);
});

// @desc    Update order status (Admin)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = asyncHandler(async (req, res) => {
    const { status, isDelivered } = req.body;
    const order = await Order.findById(req.params.id);

    if (order) {
        if (isDelivered !== undefined) {
            order.isDelivered = isDelivered;
            if (isDelivered) {
                order.deliveredAt = Date.now();
            }
        }

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

// @desc    Delete order (Admin)
// @route   DELETE /api/orders/:id
// @access  Private/Admin
const deleteOrder = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        await order.deleteOne();
        res.json({ message: 'Order removed' });
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

// @desc    Get order statistics (Admin)
// @route   GET /api/orders/admin/stats
// @access  Private/Admin
const getOrderStats = asyncHandler(async (req, res) => {
    console.log('Admin getOrderStats called by:', req.user.email);
    // Total orders
    const totalOrders = await Order.countDocuments();

    // Pending orders
    const pendingOrders = await Order.countDocuments({
        isPaid: true,
        isDelivered: false
    });

    // Total sales
    const salesAggregation = await Order.aggregate([
        { $match: { isPaid: true } },
        { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);
    const totalSales = salesAggregation.length > 0 ? salesAggregation[0].total : 0;

    console.log(`Stats calculated: ${totalOrders} orders, $${totalSales} sales`);

    // Sales last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const salesByDay = await Order.aggregate([
        {
            $match: {
                isPaid: true,
                createdAt: { $gte: sevenDaysAgo }
            }
        },
        {
            $group: {
                _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                sales: { $sum: '$totalPrice' },
                count: { $sum: 1 }
            }
        },
        { $sort: { _id: 1 } }
    ]);

    res.json({
        totalOrders,
        pendingOrders,
        totalSales,
        salesByDay
    });
});

export { addOrderItems, getMyOrders, getAllOrders, updateOrderStatus, deleteOrder, getOrderStats };
