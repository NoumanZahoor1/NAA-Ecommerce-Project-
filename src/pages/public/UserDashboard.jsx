import { useAuth } from '../../context/AuthContext';
import { useShop } from '../../context/ShopContext';
import { Link } from 'react-router-dom';
import { FaBox, FaUser, FaHeart, FaSignOutAlt, FaClock } from 'react-icons/fa';
import { useState, useEffect } from 'react';

const UserDashboard = () => {
    const { user, logout } = useAuth();
    const { wishlist } = useShop();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            if (!user) return;
            if (!user.token) {
                setLoading(false);
                return;
            }

            try {
                console.log('Fetching orders for dashboard with token:', user.token ? 'Token present' : 'No token');
                const response = await fetch('/api/orders/myorders', {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log('Dashboard orders fetched:', data.length, 'orders');
                    setOrders(data);
                    setError(null);
                } else {
                    const errorData = await response.json().catch(() => ({}));
                    console.error('Failed to fetch orders:', response.status, errorData);
                    setError(errorData.message || 'Failed to fetch orders');
                }
            } catch (err) {
                console.error('Error fetching dashboard orders:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [user]);

    if (!user) {
        return (
            <div className="min-h-screen pt-24 pb-12 flex flex-col items-center justify-center">
                <h2 className="text-2xl font-bold mb-4">Please log in to view your dashboard</h2>
                <Link to="/login" className="text-indigo-600 hover:underline">Go to Login</Link>
            </div>
        );
    }

    const recentOrder = orders.length > 0 ? orders[0] : null;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-24 min-h-screen">
            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar */}
                <div className="w-full md:w-64 flex-shrink-0">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center text-xl font-bold text-gray-600 dark:text-gray-300">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 dark:text-white text-sm truncate w-32">{user.name}</h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate w-32">{user.email}</p>
                            </div>
                        </div>
                        <nav className="space-y-2">
                            <Link to="/dashboard" className="flex items-center gap-3 px-4 py-2 bg-black text-white rounded-md text-sm">
                                <FaUser /> Profile
                            </Link>
                            <Link to="/orders" className="flex items-center gap-3 px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md transition-colors text-sm">
                                <FaBox /> Orders
                            </Link>
                            <Link to="/wishlist" className="flex items-center gap-3 px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md transition-colors text-sm">
                                <FaHeart /> Wishlist
                            </Link>
                            <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors mt-4 text-sm">
                                <FaSignOutAlt /> Logout
                            </button>
                        </nav>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">My Dashboard</h1>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
                            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-2">Total Orders</h3>
                            <p className="text-3xl font-bold text-gray-900 dark:text-white">{loading ? '...' : orders.length}</p>
                            {error && <p className="text-xs text-red-500 mt-1">Error loading orders</p>}
                        </div>
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
                            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-2">Wishlist Items</h3>
                            <p className="text-3xl font-bold text-gray-900 dark:text-white">{wishlist.length}</p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
                            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-2">Account Status</h3>
                            <p className="text-lg font-bold text-green-500">Active</p>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Recent Activity</h2>

                        {loading ? (
                            <p className="text-gray-500 dark:text-gray-400">Loading activity...</p>
                        ) : recentOrder ? (
                            <div className="space-y-4">
                                <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                                    <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 rounded-full">
                                        <FaClock />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-white">Placed a new order</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Order ID: {recentOrder._id}</p>
                                        <p className="text-xs text-gray-400 mt-1">{new Date(recentOrder.createdAt).toLocaleString()}</p>
                                    </div>
                                    <Link to="/orders" className="ml-auto text-xs text-indigo-600 font-bold hover:underline">VIEW</Link>
                                </div>
                                <div className="mt-6">
                                    <Link to="/shop" className="text-indigo-600 hover:underline font-medium text-sm">Continue Shopping &rarr;</Link>
                                </div>
                            </div>
                        ) : (
                            <>
                                <p className="text-gray-500 dark:text-gray-400">No recent activity to show.</p>
                                <div className="mt-6">
                                    <Link to="/shop" className="text-indigo-600 hover:underline font-medium text-sm">Start Shopping &rarr;</Link>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
