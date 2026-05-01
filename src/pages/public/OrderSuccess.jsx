import { Link } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { useAuth } from '../../context/AuthContext';

const OrderSuccess = () => {
    const { clearCart } = useShop();
    const { user } = useAuth();
    const [orderCreated, setOrderCreated] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const createOrder = async () => {
            try {
                // Get pending order data from sessionStorage
                const pendingOrderData = sessionStorage.getItem('pendingOrder');

                if (!pendingOrderData) {
                    console.log('No pending order data found');
                    return;
                }

                const orderData = JSON.parse(pendingOrderData);
                console.log('Creating order with data:', orderData);

                // Create order headers
                const headers = {
                    'Content-Type': 'application/json',
                };

                // Add token if user is logged in
                if (user && user.token) {
                    headers['Authorization'] = `Bearer ${user.token}`;
                }

                // Create order in database
                const response = await fetch('/api/orders', {
                    method: 'POST',
                    headers,
                    body: JSON.stringify(orderData),
                });

                if (!response.ok) {
                    const errorBody = await response.json().catch(() => ({}));
                    throw new Error(errorBody.message || `Failed to create order: ${response.statusText}`);
                }

                const createdOrder = await response.json();
                console.log('Order created successfully:', createdOrder);

                setOrderCreated(true);

                // Clear the pending order data
                sessionStorage.removeItem('pendingOrder');

                // Clear the cart
                clearCart();
            } catch (err) {
                console.error('Error creating order:', err);
                setError(err.message);
                // Still clear cart even if order creation fails
                clearCart();
            }
        };

        createOrder();
    }, [clearCart, user]);

    return (
        <div className="min-h-screen pt-24 pb-12 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg text-center max-w-md w-full">
                <FaCheckCircle className="text-green-500 text-6xl mx-auto mb-6" />
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Order Confirmed!</h1>
                <p className="text-gray-600 dark:text-gray-300 mb-8">
                    Thank you for your purchase. Your order has been successfully placed and is being processed.
                </p>

                {error && (
                    <div className="mb-4 p-3 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-md text-sm">
                        <p className="font-bold mb-1">Issue saving order details:</p>
                        <p className="opacity-90">{typeof error === 'string' ? error : 'Payment was successful, but there was an issue saving your order details. Please contact support with your payment confirmation.'}</p>
                    </div>
                )}

                {orderCreated && (
                    <div className="mb-4 p-3 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-md text-sm">
                        ✓ Order saved successfully!
                    </div>
                )}

                <div className="space-y-4">
                    <Link
                        to="/shop"
                        className="block w-full bg-black text-white py-3 rounded-md font-bold hover:bg-gray-800 transition-colors dark:bg-white dark:text-black dark:hover:bg-gray-200"
                    >
                        Continue Shopping
                    </Link>
                    <Link
                        to="/"
                        className="block w-full border border-gray-300 text-gray-700 py-3 rounded-md font-bold hover:bg-gray-50 transition-colors dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                        Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default OrderSuccess;
