import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const AdminDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            // Fetch stats
            const statsRes = await fetch('/api/orders/admin/stats', {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            const statsData = await statsRes.json();
            setStats(statsData);

            // Fetch recent orders
            const ordersRes = await fetch('/api/orders/admin/all', {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            const ordersData = await ordersRes.json();
            setRecentOrders(ordersData.slice(0, 5)); // Get latest 5

            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
            setLoading(false);
        }
    };

    // Prepare chart data from real sales
    const prepareChartData = () => {
        if (!stats || !stats.salesByDay) {
            return {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Sales ($)',
                    data: [0, 0, 0, 0, 0, 0, 0],
                    borderColor: 'rgb(0, 0, 0)',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                }]
            };
        }

        // Map the last 7 days
        const labels = [];
        const salesData = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
            labels.push(dayName);

            const daySales = stats.salesByDay.find(s => s._id === dateStr);
            salesData.push(daySales ? daySales.sales : 0);
        }

        return {
            labels,
            datasets: [{
                label: 'Sales ($)',
                data: salesData,
                borderColor: 'rgb(0, 0, 0)',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
            }]
        };
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Sales Last 7 Days',
            },
        },
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black dark:border-white"></div>
            </div>
        );
    }

    return (
        <div>
            <h2 className="text-3xl font-bold mb-8 dark:text-white">Dashboard</h2>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
                    <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Sales</h3>
                    <p className="text-3xl font-bold mt-2 dark:text-white">${stats?.totalSales?.toFixed(2) || '0.00'}</p>
                    <span className="text-green-500 text-sm">All time</span>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
                    <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Orders</h3>
                    <p className="text-3xl font-bold mt-2 dark:text-white">{stats?.totalOrders || 0}</p>
                    <span className="text-green-500 text-sm">All time</span>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
                    <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Pending Orders</h3>
                    <p className="text-3xl font-bold mt-2 dark:text-white">{stats?.pendingOrders || 0}</p>
                    <span className="text-yellow-500 text-sm">Requires attention</span>
                </div>
            </div>

            {/* Chart */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 mb-8 transition-colors">
                <Line options={options} data={prepareChartData()} className="dark:invert dark:hue-rotate-180 dark:sepia-0" />
            </div>

            {/* Recent Orders */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors">
                <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
                    <h3 className="font-bold dark:text-white">Recent Orders</h3>
                </div>
                {recentOrders.length === 0 ? (
                    <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                        No orders yet
                    </div>
                ) : (
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 dark:bg-gray-700/50">
                            <tr>
                                <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Order ID</th>
                                <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Customer</th>
                                <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Total</th>
                                <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {recentOrders.map(order => (
                                <tr key={order._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                    <td className="px-6 py-4 dark:text-gray-300">#{order._id.slice(-8)}</td>
                                    <td className="px-6 py-4 dark:text-gray-300">{order.user?.name || order.email || 'Guest'}</td>
                                    <td className="px-6 py-4 dark:text-gray-300">${order.totalPrice.toFixed(2)}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs rounded-full ${order.isDelivered ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'}`}>
                                            {order.isDelivered ? 'Delivered' : 'Processing'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
