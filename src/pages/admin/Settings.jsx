import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const Settings = () => {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        email: user?.email || 'admin@buram.com',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [message, setMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
            setMessage('New passwords do not match!');
            return;
        }

        // In a real app, this would call an API
        setMessage('Settings updated successfully!');
        setTimeout(() => setMessage(''), 3000);
    };

    return (
        <div>
            <h2 className="text-3xl font-bold mb-6 dark:text-white">Account Settings</h2>

            {message && (
                <div className={`mb-4 p-4 rounded ${message.includes('success') ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'}`}>
                    {message}
                </div>
            )}

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 max-w-2xl transition-colors border border-gray-100 dark:border-gray-700">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium mb-2 dark:text-gray-200">Email Address</label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black dark:bg-gray-700 dark:text-white transition-colors"
                        />
                    </div>

                    <div className="border-t border-gray-100 dark:border-gray-700 pt-6">
                        <h3 className="text-lg font-semibold mb-4 dark:text-white">Change Password</h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2 dark:text-gray-200">Current Password</label>
                                <input
                                    type="password"
                                    value={formData.currentPassword}
                                    onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black dark:bg-gray-700 dark:text-white transition-colors"
                                    placeholder="Enter current password"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 dark:text-gray-200">New Password</label>
                                <input
                                    type="password"
                                    value={formData.newPassword}
                                    onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black dark:bg-gray-700 dark:text-white transition-colors"
                                    placeholder="Enter new password"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 dark:text-gray-200">Confirm New Password</label>
                                <input
                                    type="password"
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black dark:bg-gray-700 dark:text-white transition-colors"
                                    placeholder="Confirm new password"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 pt-4">
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, currentPassword: '', newPassword: '', confirmPassword: '' })}
                            className="px-6 py-2 text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 transition-colors"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Settings;
