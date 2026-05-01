import { useState, useEffect } from 'react';
import { FaEye, FaTrash, FaTimes } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

const AdminOrders = () => {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingOrderId, setEditingOrderId] = useState(null);
    const [viewingOrder, setViewingOrder] = useState(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await fetch('/api/orders/admin/all', {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            const data = await response.json();
            setOrders(data);
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch orders:', error);
            setLoading(false);
        }
    };

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            const response = await fetch(`/api/orders/${orderId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`
                },
                body: JSON.stringify({
                    status: newStatus,
                    isDelivered: newStatus === 'Delivered'
                })
            });

            if (response.ok) {
                const updatedOrder = await response.json();
                setOrders(prev => prev.map(order =>
                    order._id === orderId ? { ...order, ...updatedOrder, status: newStatus } : order
                ));
            }
        } catch (error) {
            console.error('Failed to update status:', error);
        }
        setEditingOrderId(null);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this order?')) {
            try {
                const response = await fetch(`/api/orders/${id}`, {
                    method: 'DELETE',
                    headers: { Authorization: `Bearer ${user.token}` }
                });

                if (response.ok) {
                    setOrders(prev => prev.filter(order => order._id !== id));
                }
            } catch (error) {
                console.error('Failed to delete order:', error);
            }
        }
    };

    const getStatusColor = (status, isDelivered) => {
        if (isDelivered || status === 'Delivered' || status === 'Completed') return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
        if (status === 'Processing') return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
        if (status === 'Cancelled') return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'; // Pending
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
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold dark:text-white">Orders</h2>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                    Total: {orders.length} orders
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden transition-colors border border-gray-100 dark:border-gray-700">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
                        <tr>
                            <th className="p-4 dark:text-gray-300">Order ID</th>
                            <th className="p-4 dark:text-gray-300">Customer</th>
                            <th className="p-4 dark:text-gray-300">Date</th>
                            <th className="p-4 dark:text-gray-300">Items</th>
                            <th className="p-4 dark:text-gray-300">Total</th>
                            <th className="p-4 dark:text-gray-300">Status</th>
                            <th className="p-4 dark:text-gray-300">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                        {orders.map((order) => (
                            <tr key={order._id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                <td className="p-4 font-medium dark:text-white">#{order._id.slice(-8)}</td>
                                <td className="p-4">
                                    <div>
                                        <div className="font-medium dark:text-white">{order.user?.name || order.shippingAddress?.fullName || 'Guest'}</div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400">{order.user?.email || order.email}</div>
                                    </div>
                                </td>
                                <td className="p-4 text-gray-600 dark:text-gray-300">{new Date(order.createdAt).toLocaleDateString()}</td>
                                <td className="p-4 dark:text-gray-300">{order.orderItems.length}</td>
                                <td className="p-4 font-medium dark:text-white">${order.totalPrice.toFixed(2)}</td>
                                <td className="p-4">
                                    {editingOrderId === order._id ? (
                                        <select
                                            value={order.isDelivered ? 'Delivered' : 'Processing'}
                                            onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                            className="px-3 py-1 rounded text-sm border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-black dark:bg-gray-700 dark:text-white"
                                            autoFocus
                                            onBlur={() => setEditingOrderId(null)}
                                        >
                                            <option value="Processing">Processing</option>
                                            <option value="Delivered">Delivered</option>
                                        </select>
                                    ) : (
                                        <button
                                            onClick={() => setEditingOrderId(order._id)}
                                            className={`px-3 py-1 rounded text-sm font-medium ${getStatusColor(order.status, order.isDelivered)} hover:opacity-80 transition-opacity`}
                                        >
                                            {order.isDelivered ? 'Delivered' : 'Processing'}
                                        </button>
                                    )}
                                </td>
                                <td className="p-4">
                                    <div className="flex gap-3 text-gray-500 dark:text-gray-400">
                                        <button
                                            onClick={() => setViewingOrder(order)}
                                            className="hover:text-blue-600 dark:hover:text-blue-400"
                                            title="View Details"
                                        >
                                            <FaEye />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(order._id)}
                                            className="hover:text-red-600 dark:hover:text-red-400"
                                            title="Delete Order"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Order Details Modal */}
            {viewingOrder && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto transition-colors">
                        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 p-6 flex justify-between items-center transition-colors">
                            <h3 className="text-2xl font-bold dark:text-white">Order #{viewingOrder._id}</h3>
                            <button
                                onClick={() => setViewingOrder(null)}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                            >
                                <FaTimes size={24} />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Customer Info */}
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <h4 className="font-bold mb-3 text-lg dark:text-white">Customer Information</h4>
                                    <div className="space-y-2 text-sm dark:text-gray-300">
                                        <p><span className="font-medium">Name:</span> {viewingOrder.user?.name || viewingOrder.shippingAddress?.fullName || 'Guest'}</p>
                                        <p><span className="font-medium">Email:</span> {viewingOrder.user?.email || viewingOrder.email}</p>
                                        {/* Phone not in default schema, keeping layout but handling missing data */}
                                        {viewingOrder.shippingAddress?.phone && <p><span className="font-medium">Phone:</span> {viewingOrder.shippingAddress.phone}</p>}
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-bold mb-3 text-lg dark:text-white">Order Details</h4>
                                    <div className="space-y-2 text-sm dark:text-gray-300">
                                        <p><span className="font-medium">Order Date:</span> {new Date(viewingOrder.createdAt).toLocaleDateString()} {new Date(viewingOrder.createdAt).toLocaleTimeString()}</p>
                                        <p><span className="font-medium">Status:</span>
                                            <span className={`ml-2 px-2 py-1 rounded text-xs ${getStatusColor(viewingOrder.status, viewingOrder.isDelivered)} dark:bg-opacity-20`}>
                                                {viewingOrder.isDelivered ? 'Delivered' : 'Processing'}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Shipping Address */}
                            <div>
                                <h4 className="font-bold mb-3 text-lg dark:text-white">Shipping Address</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                    {viewingOrder.shippingAddress?.address}, {viewingOrder.shippingAddress?.city}, {viewingOrder.shippingAddress?.postalCode}, {viewingOrder.shippingAddress?.country}
                                </p>
                            </div>

                            {/* Order Items */}
                            <div>
                                <h4 className="font-bold mb-3 text-lg dark:text-white">Order Items</h4>
                                <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                                    <table className="w-full text-sm">
                                        <thead className="bg-gray-50 dark:bg-gray-700/50">
                                            <tr>
                                                <th className="p-3 text-left dark:text-gray-300">Product</th>
                                                <th className="p-3 text-left dark:text-gray-300">Size</th>
                                                <th className="p-3 text-left dark:text-gray-300">Color</th>
                                                <th className="p-3 text-right dark:text-gray-300">Price</th>
                                                <th className="p-3 text-right dark:text-gray-300">Qty</th>
                                                <th className="p-3 text-right dark:text-gray-300">Total</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                            {viewingOrder.orderItems.map((item, index) => (
                                                <tr key={index} className="dark:text-gray-300">
                                                    <td className="p-3 font-medium">{item.name}</td>
                                                    <td className="p-3">{item.size || '-'}</td>
                                                    <td className="p-3">{item.color || '-'}</td>
                                                    <td className="p-3 text-right">${item.price.toFixed(2)}</td>
                                                    <td className="p-3 text-right">{item.qty}</td>
                                                    <td className="p-3 text-right font-medium">${(item.price * item.qty).toFixed(2)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Order Summary */}
                            <div className="border-t border-gray-100 dark:border-gray-700 pt-4">
                                <div className="flex justify-end">
                                    <div className="w-64 space-y-2 dark:text-gray-300">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600 dark:text-gray-400">Items Price:</span>
                                            <span className="font-medium">${viewingOrder.orderItems.reduce((acc, item) => acc + item.price * item.qty, 0).toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600 dark:text-gray-400">Tax:</span>
                                            <span className="font-medium">${viewingOrder.taxPrice?.toFixed(2) || '0.00'}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600 dark:text-gray-400">Shipping:</span>
                                            <span className="font-medium">${viewingOrder.shippingPrice?.toFixed(2) || '0.00'}</span>
                                        </div>
                                        <div className="flex justify-between text-lg font-bold border-t border-gray-100 dark:border-gray-700 pt-2 dark:text-white">
                                            <span>Total:</span>
                                            <span>${viewingOrder.totalPrice.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
                                <button
                                    onClick={() => setViewingOrder(null)}
                                    className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-white transition-colors"
                                >
                                    Close
                                </button>
                                <button
                                    className="px-6 py-2 bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 rounded transition-colors"
                                    onClick={() => window.print()}
                                >
                                    Print Invoice
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                    <strong>Tip:</strong> Click the eye icon to view full order details, or click on the status button to toggle between Processing and Delivered.
                </p>
            </div>
        </div>
    );
};

export default AdminOrders;
