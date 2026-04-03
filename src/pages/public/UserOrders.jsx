import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { FaBox, FaShoppingBag, FaSpinner, FaExclamationTriangle } from 'react-icons/fa';
import { useState, useEffect } from 'react';

const UserOrders = () => {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            if (!user) return;
            if (!user.token) {
                setLoading(false);
                setError('Authentication session expired. Please log out and log back in to view your orders.');
                return;
            }

            try {
                setLoading(true);
                const response = await fetch('/api/orders/myorders', {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch orders');
                }

                const data = await response.json();
                setOrders(data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching orders:', err);
                setError(err.message);
                setLoading(false);
            }
        };

        fetchOrders();
    }, [user]);

    if (!user) {
        return (
            <div className="min-h-screen pt-24 pb-12 flex flex-col items-center justify-center">
                <h2 className="text-2xl font-bold mb-4">Please log in to view your orders</h2>
                <Link to="/login" className="text-indigo-600 hover:underline">Go to Login</Link>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen pt-24 pb-12 flex flex-col items-center justify-center">
                <FaSpinner className="animate-spin text-4xl text-indigo-600 mb-4" />
                <p className="text-gray-500">Loading your orders...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen pt-24 pb-12 flex flex-col items-center justify-center">
                <FaExclamationTriangle className="text-4xl text-red-500 mb-4" />
                <h2 className="text-2xl font-bold mb-2">Error</h2>
                <p className="text-gray-500 mb-4">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="bg-black text-white px-6 py-2 rounded-md"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-24 min-h-screen">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">My Orders</h1>

            {orders.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <FaBox className="mx-auto text-4xl text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">No orders yet</h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">You haven't placed any orders yet.</p>
                    <Link to="/shop" className="inline-block bg-black text-white px-6 py-3 rounded-md font-bold hover:bg-gray-800 transition-colors dark:bg-white dark:text-black dark:hover:bg-gray-200">
                        Start Shopping
                    </Link>
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map(order => (
                        <div key={order._id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                            <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 flex flex-wrap justify-between items-center gap-4">
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Order ID</p>
                                    <p className="font-bold text-gray-900 dark:text-white">{order._id}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Date</p>
                                    <p className="font-medium text-gray-900 dark:text-white">{new Date(order.createdAt).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Total</p>
                                    <p className="font-medium text-gray-900 dark:text-white">${order.totalPrice.toFixed(2)}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${order.isDelivered ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                                        order.isPaid ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                                            'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                        }`}>
                                        {order.isDelivered ? 'Delivered' : order.isPaid ? 'Paid' : 'Pending'}
                                    </span>
                                </div>
                            </div>
                            <div className="p-6">
                                <h4 className="font-medium text-gray-900 dark:text-white mb-4">Items</h4>
                                <div className="space-y-4">
                                    {order.orderItems.map((item, index) => (
                                        <div key={index} className="flex justify-between items-center">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-md flex items-center justify-center overflow-hidden">
                                                    {item.image ? (
                                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <FaShoppingBag className="text-gray-400" />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900 dark:text-white">{item.name}</p>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">Qty: {item.qty}</p>
                                                </div>
                                            </div>
                                            <p className="font-medium text-gray-900 dark:text-white">${item.price.toFixed(2)}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default UserOrders;
