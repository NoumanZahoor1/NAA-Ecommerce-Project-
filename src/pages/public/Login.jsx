import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
    const [isSignUp, setIsSignUp] = useState(false);
    const [formData, setFormData] = useState({ email: '', password: '', name: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const { login, signup, guestLogin } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        let result;

        if (isSignUp) {
            // Sign up logic
            result = await signup(formData.name, formData.email, formData.password);
        } else {
            // Sign in logic
            result = await login(formData.email, formData.password);
        }

        setIsLoading(false);

        if (result.success) {
            if (result.user.isAdmin) {
                navigate('/admin/dashboard');
            } else {
                navigate('/');
            }
        } else {
            setError(result.error || 'Authentication failed');
        }
    };

    const handleGuestCheckout = () => {
        guestLogin();
        navigate('/shop');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-bold text-gray-900 dark:text-white">
                        {isSignUp ? 'Create your account' : 'Sign in to your account'}
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                        {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
                        <button
                            onClick={() => {
                                setIsSignUp(!isSignUp);
                                setError(null);
                            }}
                            className="font-medium text-black dark:text-white hover:underline"
                        >
                            {isSignUp ? 'Sign in' : 'Sign up'}
                        </button>
                    </p>
                </div>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                        <span className="block sm:inline">{error}</span>
                    </div>
                )}

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm space-y-4">
                        {isSignUp && (
                            <div>
                                <label htmlFor="name" className="sr-only">Full Name</label>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    required={isSignUp}
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white dark:bg-gray-800 rounded-md focus:outline-none focus:ring-black focus:border-black focus:z-10 sm:text-sm"
                                    placeholder="Full Name"
                                />
                            </div>
                        )}
                        <div>
                            <label htmlFor="email-address" className="sr-only">Email address</label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white dark:bg-gray-800 rounded-md focus:outline-none focus:ring-black focus:border-black focus:z-10 sm:text-sm"
                                placeholder="Email address"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">Password</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white dark:bg-gray-800 rounded-md focus:outline-none focus:ring-black focus:border-black focus:z-10 sm:text-sm"
                                placeholder="Password"
                            />
                        </div>
                    </div>
                    {!isSignUp && (
                        <div className="text-right">
                            <Link
                                to="/forgot-password"
                                className="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
                            >
                                Forgot your password?
                            </Link>
                        </div>
                    )}

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black dark:bg-white dark:text-black dark:hover:bg-gray-200 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {isLoading ? 'Processing...' : (isSignUp ? 'Sign up' : 'Sign in')}
                        </button>
                    </div>

                    {!isSignUp && (
                        <div className="text-center">
                            <button
                                type="button"
                                onClick={handleGuestCheckout}
                                className="text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white underline"
                            >
                                Continue as Guest
                            </button>
                        </div>
                    )}
                </form>
            </div >
        </div >
    );
};

export default Login;
