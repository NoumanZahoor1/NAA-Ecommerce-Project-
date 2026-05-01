import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaHeart, FaEye, FaShoppingCart, FaStar } from 'react-icons/fa';
import { useShop } from '../../context/ShopContext';
import { useState } from 'react';

const ProductCard = ({ product }) => {
    const { toggleWishlist, wishlist, setQuickViewProduct, addToCart } = useShop();
    const isWishlisted = wishlist.some(item => item.id === product.id);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    // Use second image only if it exists and is different from the first
    const secondImage = product.images && product.images[1] && product.images[1] !== product.image
        ? product.images[1]
        : null;

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart({
            ...product,
            size: product.sizes ? product.sizes[0] : 'M',
            color: product.colors ? product.colors[0] : 'default',
            quantity: 1
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="group relative bg-white dark:bg-gray-900 rounded-3xl overflow-hidden border border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700 transition-all duration-500"
        >
            {/* Image Container with Enhanced Animations */}
            <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
                <Link to={`/product/${product.id}`} className="block w-full h-full">
                    {/* Primary Image */}
                    <motion.img
                        src={product.image}
                        alt={product.name}
                        loading="lazy"
                        onLoad={() => setImageLoaded(true)}
                        className={`w-full h-full object-cover ${secondImage ? 'transition-all duration-700' : ''}`}
                        style={{
                            transform: isHovered && secondImage ? 'scale(1.05)' : 'scale(1)',
                            opacity: isHovered && secondImage ? 0 : 1,
                        }}
                    />

                    {/* Secondary Image - Only if available */}
                    {secondImage && (
                        <motion.img
                            src={secondImage}
                            alt={`${product.name} alternate view`}
                            loading="lazy"
                            className="absolute inset-0 w-full h-full object-cover transition-all duration-700"
                            style={{
                                transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                                opacity: isHovered ? 1 : 0,
                            }}
                        />
                    )}

                    {/* Gradient Overlay on Hover */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: isHovered ? 1 : 0 }}
                        transition={{ duration: 0.3 }}
                        className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none"
                    />

                    {/* Shine Effect */}
                    <motion.div
                        initial={{ x: '-100%', opacity: 0 }}
                        animate={{ x: isHovered ? '100%' : '-100%', opacity: isHovered ? 0.3 : 0 }}
                        transition={{ duration: 0.8, ease: "easeInOut" }}
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent skew-x-12 pointer-events-none"
                    />
                </Link>

                {/* Enhanced Action Buttons */}
                <div className="absolute top-4 right-4 flex flex-col gap-3 z-10">
                    <motion.button
                        initial={{ x: 60, opacity: 0 }}
                        animate={{
                            x: isHovered ? 0 : 60,
                            opacity: isHovered ? 1 : 0
                        }}
                        transition={{ delay: 0.1, type: "spring", stiffness: 300, damping: 20 }}
                        onClick={(e) => {
                            e.preventDefault();
                            toggleWishlist(product);
                        }}
                        className={`p-3.5 rounded-full backdrop-blur-xl shadow-2xl transition-all duration-300 transform hover:scale-110 ${isWishlisted
                            ? 'bg-gradient-to-br from-red-500 to-pink-600 text-white shadow-red-500/50'
                            : 'bg-white/90 dark:bg-gray-900/90 text-gray-900 dark:text-white hover:bg-gradient-to-br hover:from-red-500 hover:to-pink-600 hover:text-white'
                            }`}
                    >
                        <FaHeart size={18} className={isWishlisted ? "animate-pulse" : ""} />
                    </motion.button>

                    <motion.button
                        initial={{ x: 60, opacity: 0 }}
                        animate={{
                            x: isHovered ? 0 : 60,
                            opacity: isHovered ? 1 : 0
                        }}
                        transition={{ delay: 0.15, type: "spring", stiffness: 300, damping: 20 }}
                        onClick={(e) => {
                            e.preventDefault();
                            setQuickViewProduct(product);
                        }}
                        className="p-3.5 rounded-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl text-gray-900 dark:text-white shadow-2xl hover:bg-gradient-to-br hover:from-blue-500 hover:to-purple-600 hover:text-white transition-all duration-300 transform hover:scale-110"
                    >
                        <FaEye size={18} />
                    </motion.button>

                    <motion.button
                        initial={{ x: 60, opacity: 0 }}
                        animate={{
                            x: isHovered ? 0 : 60,
                            opacity: isHovered ? 1 : 0
                        }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 20 }}
                        onClick={handleAddToCart}
                        className="p-3.5 rounded-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl text-gray-900 dark:text-white shadow-2xl hover:bg-gradient-to-br hover:from-green-500 hover:to-emerald-600 hover:text-white transition-all duration-300 transform hover:scale-110"
                    >
                        <FaShoppingCart size={18} />
                    </motion.button>
                </div>

                {/* Enhanced Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                    {product.stock < 5 && (
                        <motion.div
                            initial={{ scale: 0, rotate: -10 }}
                            animate={{ scale: 1, rotate: 0 }}
                            className="px-4 py-2 rounded-full bg-gradient-to-r from-red-500 to-orange-600 text-white text-xs font-black uppercase tracking-wider shadow-lg backdrop-blur-sm"
                        >
                            🔥 Low Stock
                        </motion.div>
                    )}

                    {product.rating >= 4.5 && (
                        <motion.div
                            initial={{ scale: 0, rotate: 10 }}
                            animate={{ scale: 1, rotate: 0 }}
                            className="px-4 py-2 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-black uppercase tracking-wider shadow-lg backdrop-blur-sm flex items-center gap-1"
                        >
                            <FaStar size={10} /> Trending
                        </motion.div>
                    )}
                </div>

                {/* Quick Add to Cart Button - Bottom */}
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{
                        y: isHovered ? 0 : 100,
                        opacity: isHovered ? 1 : 0
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className="absolute bottom-4 left-4 right-4 z-10"
                >
                    <button
                        onClick={handleAddToCart}
                        className="w-full py-4 px-6 bg-gradient-to-r from-gray-900 to-black dark:from-white dark:to-gray-100 text-white dark:text-black font-black uppercase tracking-wider rounded-2xl shadow-2xl hover:shadow-gray-900/50 dark:hover:shadow-white/50 transition-all duration-300 transform hover:scale-[1.02] backdrop-blur-xl border-2 border-white/20"
                    >
                        Add to Cart
                    </button>
                </motion.div>
            </div>

            {/* Enhanced Product Info */}
            <motion.div
                className="p-6 space-y-3"
                animate={{
                    backgroundColor: isHovered
                        ? 'rgba(0, 0, 0, 0.02)'
                        : 'transparent'
                }}
                transition={{ duration: 0.3 }}
            >
                {/* Category Badge */}
                <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-full">
                        {product.category}
                    </span>

                    {/* Rating */}
                    {product.rating && (
                        <div className="flex items-center gap-1.5">
                            <FaStar className="text-yellow-500" size={14} />
                            <span className="text-sm font-bold text-gray-900 dark:text-white">
                                {product.rating}
                            </span>
                        </div>
                    )}
                </div>

                {/* Product Name */}
                <Link to={`/product/${product.id}`}>
                    <h3 className="font-black text-xl mb-2 dark:text-white line-clamp-2 leading-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-gray-900 group-hover:to-gray-600 dark:group-hover:from-white dark:group-hover:to-gray-400 transition-all duration-300">
                        {product.name}
                    </h3>
                </Link>

                {/* Price and Colors */}
                <div className="flex justify-between items-end">
                    <div className="flex flex-col gap-1">
                        <span className="text-3xl font-black text-gray-900 dark:text-white">
                            ${product.price.toFixed(2)}
                        </span>

                        {/* Color Options */}
                        {product.colors && product.colors.length > 0 && (
                            <div className="flex gap-1.5 mt-1">
                                {product.colors.slice(0, 3).map((color, idx) => (
                                    <motion.div
                                        key={idx}
                                        whileHover={{ scale: 1.3 }}
                                        className="w-5 h-5 rounded-full border-2 border-gray-300 dark:border-gray-600 shadow-sm cursor-pointer"
                                        style={{ backgroundColor: color }}
                                        title={color}
                                    />
                                ))}
                                {product.colors.length > 3 && (
                                    <span className="text-xs text-gray-500 dark:text-gray-400 self-center font-bold">
                                        +{product.colors.length - 3}
                                    </span>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Stock Indicator */}
                    <div className="flex flex-col items-end">
                        <span className={`text-xs font-bold uppercase tracking-wider ${product.stock > 10
                            ? 'text-green-600 dark:text-green-400'
                            : product.stock > 5
                                ? 'text-orange-600 dark:text-orange-400'
                                : 'text-red-600 dark:text-red-400'
                            }`}>
                            {product.stock > 10 ? 'In Stock' : product.stock > 0 ? `${product.stock} Left` : 'Out of Stock'}
                        </span>
                    </div>
                </div>
            </motion.div>

            {/* Corner Accent */}
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: isHovered ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                className="absolute top-0 right-0 w-20 h-20"
            >
                <div className="absolute top-0 right-0 w-0 h-0 border-t-[40px] border-t-gradient-to-r border-t-red-500/20 border-r-[40px] border-r-transparent" />
            </motion.div>
        </motion.div>
    );
};

export default ProductCard;
