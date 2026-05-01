import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check local storage for existing session
        const storedUser = localStorage.getItem('naa_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const response = await fetch('/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const text = await response.text();
            console.log("Raw login response:", text);

            let data;
            try {
                data = JSON.parse(text);
            } catch (e) {
                console.error("Failed to parse login response:", e);
                // If the response is HTML (common with 404/500 proxy errors), it implies backend issues
                if (text.trim().startsWith('<')) {
                    return { success: false, error: 'Cannot connect to server. Please ensure backend is running.' };
                }
                return { success: false, error: 'Server returned invalid response' };
            }

            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }

            console.log("Login Successful:", data);
            setUser(data);
            localStorage.setItem('naa_user', JSON.stringify(data));
            return { success: true, user: data };
        } catch (error) {
            console.error("Login Error:", error);
            return { success: false, error: error.message };
        }
    };

    const signup = async (name, email, password) => {
        try {
            const response = await fetch('/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Signup failed');
            }

            console.log("Signup Successful:", data);
            setUser(data);
            localStorage.setItem('naa_user', JSON.stringify(data));
            return { success: true, user: data };
        } catch (error) {
            console.error("Signup Error:", error);
            return { success: false, error: error.message };
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('naa_user');
    };

    const guestLogin = () => {
        const userData = { name: 'Guest', role: 'guest', email: 'guest@example.com' };
        setUser(userData);
        localStorage.setItem('naa_user', JSON.stringify(userData));
        return { success: true, user: userData };
    };

    return (
        <AuthContext.Provider value={{
            user,
            login,
            signup,
            logout,
            guestLogin,
            isAdmin: user?.isAdmin, // Backend returns isAdmin boolean now
            loading
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
