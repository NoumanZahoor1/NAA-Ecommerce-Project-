import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [darkMode, setDarkMode] = useState(false); // Always start with light mode

    useEffect(() => {
        // Load saved preference on mount
        const saved = localStorage.getItem('darkMode');
        if (saved === 'true') {
            setDarkMode(true);
        }
    }, []);

    useEffect(() => {
        const root = document.documentElement;
        console.log('Dark mode:', darkMode); // Debug log

        if (darkMode) {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
        localStorage.setItem('darkMode', String(darkMode));
    }, [darkMode]);

    const toggleTheme = () => {
        console.log('Toggling theme from', darkMode, 'to', !darkMode); // Debug log
        setDarkMode(prev => !prev);
    };

    return (
        <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
