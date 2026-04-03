import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEye, FaHeart, FaShoppingBag } from 'react-icons/fa';
import { useShop } from '../../context/ShopContext';

const ProductCard = ({ product, onQuickView }) => {
    const { addToCart, toggleWishlist, wishlist } = useShop();
    const [isHovered, setIsHovered] = useState(false);
    const [selectedColor, setSelectedColor] = useState(product.colors[0]);

    const isWishlisted = wishlist.some(item => item.id === product.id);

    // Find the image for the selected color if available, otherwise default
    // Ideally your data structure would map colors to images, but here we'll just simulate or use main image
    // For now, let's use the secondary image on hover if available
    const mainImage = product.image;
    const hoverImage = product.images && product.images.length > 1 ? product.images[1] : product.image;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="group relative flex flex-col"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Image Container */}
            <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-100 rounded-sm">
                <Link to={`/product/${product.id}`} className="block h-full w-full">
                    {/* Main Image */}
                    <img
                        src={mainImage}
                        alt={product.name}
                        className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-500 ease-in-out ${isHovered ? 'opacity-0' : 'opacity-100'}`}
                    />

                    {/* Hover Content (Video or Image) */}
                    {product.video ? (
                        <video
                            src={product.video}
                            muted
                            loop
                            playsInline
                            autoPlay={isHovered}
                            className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-500 ease-in-out ${isHovered ? 'opacity-100' : 'opacity-0'}`}
                            ref={(el) => {
                                if (el) {
                                    if (isHovered) {
                                        el.play().catch(e => console.log('Autoplay prevented', e));
                                    } else {
                                        el.pause();
                                        el.currentTime = 0;
                                    }
                                }
                            }}
                        />
                    ) : (
                        <img
                            src={hoverImage}
                            alt={product.name}
                            className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-500 ease-in-out ${isHovered ? 'opacity-100' : 'opacity-0'}`}
                        />
                    )}
                </Link>

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
                    {!!product.salePrice && (
                        <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-1 uppercase tracking-widest">
                            Sale
                        </span>
                    )}
                    {product.category === 'new' && (
                        <span className="bg-black text-white text-[10px] font-bold px-2 py-1 uppercase tracking-widest">
                            New
                        </span>
                    )}
                </div>

                {/* Wishlist Button - Always visible on mobile, hover on desktop */}
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        toggleWishlist(product);
                    }}
                    className={`absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-sm transition-all duration-300 z-20
                        ${isWishlisted ? 'text-red-500' : 'text-gray-400 hover:text-black'}
                        ${isHovered ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0 lg:translate-x-4 lg:opacity-0'}
                        lg:translate-x-4 lg:opacity-0 lg:group-hover:translate-x-0 lg:group-hover:opacity-100`}
                >
                    <FaHeart size={14} />
                </button>

                {/* Quick Add / Quick View - Slide Up on Hover */}
                <div className="absolute bottom-4 left-4 right-4 translate-y-full opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 flex gap-2">
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            addToCart(product, product.sizes[0], product.colors[0]);
                        }}
                        className="flex-1 bg-white text-black text-xs font-bold uppercase tracking-wider py-3 hover:bg-black hover:text-white transition-colors duration-300 shadow-lg flex items-center justify-center gap-2"
                    >
                        <FaShoppingBag size={12} /> Add
                    </button>
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            onQuickView(product);
                        }}
                        className="bg-white text-black p-3 hover:bg-black hover:text-white transition-colors duration-300 shadow-lg"
                        title="Quick View"
                    >
                        <FaEye size={14} />
                    </button>
                </div>
            </div>

            {/* Product Info */}
            <div className="mt-4 flex flex-col gap-1">
                <div className="flex justify-between items-start">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white uppercase tracking-wide truncate pr-2">
                        <Link to={`/product/${product.id}`}>
                            {product.name}
                        </Link>
                    </h3>
                </div>

                <div className="flex items-center gap-2">
                    {product.salePrice ? (
                        <>
                            <span className="text-sm font-bold text-red-600">${product.salePrice}</span>
                            <span className="text-xs text-gray-400 line-through">${product.price}</span>
                        </>
                    ) : (
                        <span className="text-sm font-bold text-gray-900 dark:text-gray-100">${product.price}</span>
                    )}
                </div>

                {/* Color Swatches (preview) */}
                {product.colors && product.colors.length > 0 && (
                    <div className="flex gap-1 mt-2">
                        {product.colors.map(color => (
                            <div
                                key={color}
                                className={`w-3 h-3 rounded-full border border-gray-300 ${color === 'white' ? 'bg-white' : ''}`}
                                style={{ backgroundColor: color !== 'white' ? color : 'white' }}
                                title={color}
                            />
                        ))}
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default ProductCard;
