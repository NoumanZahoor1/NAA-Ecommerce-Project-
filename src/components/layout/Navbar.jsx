import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaSearch, FaUser, FaShoppingBag, FaBars, FaMoon, FaSun, FaTimes, FaArrowRight, FaMicrophone, FaCamera } from 'react-icons/fa';
import { useShop } from '../../context/ShopContext';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import VisualSearchModal from '../VisualSearch/VisualSearchModal';
import { parseNaturalLanguageQuery, filterProductsByNLQuery } from '../../utils/searchUtils';

const Navbar = () => {
    const [searchSuggestions, setSearchSuggestions] = useState([]);
    const { cart, setIsCartOpen, products } = useShop();
    const { user, logout, isAdmin } = useAuth();
    const { darkMode, toggleTheme } = useTheme();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isScrolled, setIsScrolled] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [isVisualSearchOpen, setIsVisualSearchOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close menus on route change
    useEffect(() => {
        setIsMenuOpen(false);
        setIsSearchOpen(false);
    }, [location]);

    const handleSearchSubmit = (e) => {
        if (e.key === 'Enter') {
            // Parse natural language query
            const parsedFilters = parseNaturalLanguageQuery(searchQuery);

            // Build URL with filters
            const params = new URLSearchParams();
            if (parsedFilters.colors.length > 0) params.set('colors', parsedFilters.colors.join(','));
            if (parsedFilters.categories.length > 0) params.set('category', parsedFilters.categories[0]);
            if (parsedFilters.maxPrice) params.set('maxPrice', parsedFilters.maxPrice);
            if (parsedFilters.minPrice) params.set('minPrice', parsedFilters.minPrice);
            if (parsedFilters.vibes.length > 0) params.set('vibe', parsedFilters.vibes[0]);
            params.set('search', searchQuery);

            navigate(`/shop?${params.toString()}`);
            setIsSearchOpen(false);
            setSearchQuery('');
            setSearchSuggestions([]);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleVoiceSearch = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            alert('Voice search is not supported in your browser. Please try Chrome or Edge.');
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onstart = () => {
            setIsListening(true);
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setSearchQuery(transcript);
            setIsListening(false);
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            setIsListening(false);
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognition.start();
    };

    const navLinks = [
        { name: 'New Arrivals', path: '/shop?category=new' },
        { name: 'Men', path: '/shop?category=Men' },
        { name: 'Women', path: '/shop?category=Women' },
        { name: 'Accessories', path: '/shop?category=Accessories' },
        { name: 'Sale', path: '/shop?category=Sale', isSale: true },
        { name: 'The Archive', path: '/shop?category=archive' },
        { name: 'Blog', path: '/blog' },
    ];

    const menuVars = {
        initial: { scaleY: 0 },
        animate: {
            scaleY: 1,
            transition: { duration: 0.5, ease: [0.12, 0, 0.39, 0] }
        },
        exit: {
            scaleY: 0,
            transition: { delay: 0.5, duration: 0.5, ease: [0.22, 1, 0.36, 1] }
        }
    };

    const containerVars = {
        initial: { transition: { staggerChildren: 0.09, staggerDirection: -1 } },
        open: { transition: { delayChildren: 0.3, staggerChildren: 0.09, staggerDirection: 1 } }
    };

    const linkVars = {
        initial: { y: "30vh", transition: { duration: 0.5, ease: [0.37, 0, 0.63, 1] } },
        open: { y: 0, transition: { duration: 0.7, ease: [0, 0.55, 0.45, 1] } }
    };

    return (
        <>
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5 }}
                className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 border-b ${isScrolled
                    ? 'bg-white/80 dark:bg-black/80 backdrop-blur-md border-gray-200 dark:border-white/10 py-4'
                    : 'bg-transparent border-transparent py-6'
                    }`}
            >
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex justify-between items-center">
                        {/* Left: Mobile Menu Trigger & Logo */}
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setIsMenuOpen(true)}
                                className="md:hidden text-black dark:text-white p-2"
                            >
                                <FaBars size={20} />
                            </button>

                            <Link to="/" className="relative z-50 group">
                                <span className="text-3xl font-black tracking-tighter uppercase text-black dark:text-white mix-blend-difference">
                                    NAA
                                </span>
                            </Link>
                        </div>

                        {/* Center: Desktop Navigation */}
                        <div className="hidden md:flex items-center gap-8">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    className="relative group overflow-hidden"
                                >
                                    <span className={`block text-xs font-bold uppercase tracking-[0.2em] transition-colors duration-300 ${link.isSale
                                        ? 'text-red-600 hover:text-red-700 dark:text-red-500 dark:hover:text-red-400'
                                        : 'text-gray-600 dark:text-gray-300 group-hover:text-black dark:group-hover:text-white'
                                        }`}>
                                        {link.name}
                                    </span>
                                    <span className={`absolute bottom-0 left-0 w-full h-[1px] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ${link.isSale ? 'bg-red-600 dark:bg-red-500' : 'bg-black dark:bg-white'
                                        }`} />
                                </Link>
                            ))}
                        </div>

                        {/* Right: Actions */}
                        <div className="flex items-center gap-6">
                            {/* Search Bar or Icon */}
                            {isSearchOpen ? (
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder={isListening ? "Listening..." : "Search..."}
                                        value={searchQuery}
                                        onChange={(e) => {
                                            setSearchQuery(e.target.value);
                                            // Use NLP to filter products for suggestions
                                            if (e.target.value.trim()) {
                                                const parsedFilters = parseNaturalLanguageQuery(e.target.value);
                                                let filtered = filterProductsByNLQuery(products, parsedFilters);

                                                // If no NLP matches, fall back to simple name search
                                                if (filtered.length === 0) {
                                                    filtered = products.filter(p =>
                                                        p.name.toLowerCase().includes(e.target.value.toLowerCase())
                                                    );
                                                }

                                                setSearchSuggestions(filtered.slice(0, 5));
                                            } else {
                                                setSearchSuggestions([]);
                                            }
                                        }}
                                        onKeyDown={handleSearchSubmit}
                                        autoFocus
                                        className="w-64 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 pr-16 text-sm text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all"
                                    />
                                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                                        <button
                                            onClick={() => {
                                                setIsVisualSearchOpen(true);
                                                setIsSearchOpen(false);
                                            }}
                                            className="p-1.5 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
                                            title="Visual Search"
                                        >
                                            <FaCamera size={14} />
                                        </button>
                                        <button
                                            onClick={handleVoiceSearch}
                                            disabled={isListening}
                                            className={`p-1.5 rounded-full transition-all duration-300 ${isListening
                                                ? 'bg-red-500 text-white animate-pulse'
                                                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                                                }`}
                                            title="Voice Search"
                                        >
                                            <FaMicrophone size={14} />
                                        </button>
                                        <button
                                            onClick={() => {
                                                setIsSearchOpen(false);
                                                setSearchQuery('');
                                                setSearchSuggestions([]);
                                            }}
                                            className="p-1.5 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-all"
                                            title="Close Search"
                                        >
                                            <FaTimes size={14} />
                                        </button>
                                    </div>

                                    {/* Search Suggestions Dropdown */}
                                    {searchSuggestions.length > 0 && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="absolute top-full right-0 mt-2 w-80 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-xl overflow-hidden z-50"
                                        >
                                            {searchSuggestions.map((product) => (
                                                <Link
                                                    key={product.id}
                                                    to={`/product/${product.id}`}
                                                    onClick={() => {
                                                        setIsSearchOpen(false);
                                                        setSearchQuery('');
                                                        setSearchSuggestions([]);
                                                    }}
                                                    className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border-b border-gray-100 dark:border-gray-800 last:border-b-0"
                                                >
                                                    <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded" />
                                                    <div className="flex-1">
                                                        <p className="text-sm font-medium text-black dark:text-white">{product.name}</p>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400">${product.price}</p>
                                                    </div>
                                                </Link>
                                            ))}
                                        </motion.div>
                                    )}
                                </div>
                            ) : (
                                <button
                                    onClick={() => setIsSearchOpen(true)}
                                    className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors"
                                >
                                    <FaSearch size={18} />
                                </button>
                            )}

                            <button
                                onClick={toggleTheme}
                                className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors"
                            >
                                {darkMode ? <FaSun size={18} /> : <FaMoon size={18} />}
                            </button>

                            {user ? (
                                <Link to={isAdmin ? "/admin/dashboard" : "/dashboard"} className="hidden sm:block text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors" >
                                    <FaUser size={18} />
                                </Link>
                            ) : (
                                <Link to="/login" className="hidden sm:block text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors">
                                    <FaUser size={18} />
                                </Link>
                            )}

                            <button
                                onClick={() => setIsCartOpen(true)}
                                className="relative text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors"
                            >
                                <FaShoppingBag size={18} />
                                {cartCount > 0 && (
                                    <motion.span
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="absolute -top-2 -right-2 bg-black dark:bg-white text-white dark:text-black text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full"
                                    >
                                        {cartCount}
                                    </motion.span>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </motion.nav >


            {/* Mobile Menu Overlay */}
            < AnimatePresence >
                {isMenuOpen && (
                    <motion.div
                        variants={menuVars}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className="fixed inset-0 z-[60] bg-black text-white origin-top flex flex-col"
                    >
                        <div className="flex justify-between items-center p-6">
                            <span className="text-3xl font-black tracking-tighter uppercase text-white">NAA</span>
                            <button onClick={() => setIsMenuOpen(false)} className="text-white p-2">
                                <FaTimes size={24} />
                            </button>
                        </div>

                        <div className="flex-1 flex flex-col justify-center px-6">
                            <motion.div
                                variants={containerVars}
                                initial="initial"
                                animate="open"
                                exit="initial"
                                className="flex flex-col gap-6"
                            >
                                {navLinks.map((link) => (
                                    <div key={link.name} className="overflow-hidden">
                                        <motion.div variants={linkVars}>
                                            <Link
                                                to={link.path}
                                                className="text-5xl font-black uppercase tracking-tighter hover:text-gray-400 transition-colors"
                                                onClick={() => setIsMenuOpen(false)}
                                            >
                                                {link.name}
                                            </Link>
                                        </motion.div>
                                    </div>
                                ))}
                            </motion.div>
                        </div>

                        <div className="p-6 border-t border-white/10 flex justify-between items-center text-sm font-medium tracking-widest text-gray-400 uppercase">
                            <span>© {new Date().getFullYear()} NAA</span>
                            <div className="flex gap-4">
                                <Link
                                    to={user ? (isAdmin ? "/admin/dashboard" : "/dashboard") : "/login"}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {user ? 'My Account' : 'Login'}
                                </Link>
                                <button onClick={() => { toggleTheme(); setIsMenuOpen(false); }}>
                                    {darkMode ? 'Light Mode' : 'Dark Mode'}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )
                }
            </AnimatePresence >

            {/* Visual Search Modal v2.0 */}
            < VisualSearchModal
                isOpen={isVisualSearchOpen}
                onClose={() => setIsVisualSearchOpen(false)}
            />
        </>
    );
};

export default Navbar;
