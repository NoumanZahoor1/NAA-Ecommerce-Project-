import { useState, useEffect } from 'react';
import { FaEnvelope, FaPhone } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

const Customers = () => {
    const { user } = useAuth();
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const response = await fetch('/api/users', {
                    headers: { Authorization: `Bearer ${user.token}` }
                });
                const data = await response.json();
                setCustomers(data);
                setLoading(false);
            } catch (error) {
                console.error('Failed to fetch customers:', error);
                setLoading(false);
            }
        };

        fetchCustomers();
    }, [user.token]);

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
                <h2 className="text-3xl font-bold dark:text-white">Customers</h2>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                    Total: {customers.length} users
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden transition-colors border border-gray-100 dark:border-gray-700">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
                        <tr>
                            <th className="p-4 dark:text-gray-300">Name</th>
                            <th className="p-4 dark:text-gray-300">Contact</th>
                            <th className="p-4 dark:text-gray-300">Role</th>
                            <th className="p-4 dark:text-gray-300">Orders</th>
                            <th className="p-4 dark:text-gray-300">Total Spent</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                        {customers.map((customer) => (
                            <tr key={customer._id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                <td className="p-4 font-medium">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-300 font-bold uppercase">
                                            {customer.name && customer.name.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="dark:text-white">{customer.name}</div>
                                            <div className="text-xs text-gray-400">ID: {customer._id.slice(-6)}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <div className="flex flex-col text-sm text-gray-500 dark:text-gray-400">
                                        <div className="flex items-center gap-2"><FaEnvelope size={12} /> {customer.email}</div>
                                        {/* Phone is not currently in User schema, placeholder or remove if strict */}
                                        {/* <div className="flex items-center gap-2 mt-1"><FaPhone size={12} /> {customer.phone || '-'}</div> */}
                                    </div>
                                </td>
                                <td className="p-4 text-sm dark:text-gray-300">
                                    {customer.isAdmin ? (
                                        <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs">Admin</span>
                                    ) : (
                                        <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs">Customer</span>
                                    )}
                                </td>
                                <td className="p-4 dark:text-gray-300">{customer.orderCount || 0}</td>
                                <td className="p-4 dark:text-gray-300">${(customer.totalSpent || 0).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Customers;
