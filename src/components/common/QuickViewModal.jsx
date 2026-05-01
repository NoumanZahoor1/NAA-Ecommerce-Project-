import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaShoppingCart, FaHeart } from 'react-icons/fa';
import { useShop } from '../../context/ShopContext';

const QuickViewModal = () => {
    const { quickViewProduct, setQuickViewProduct, addToCart, toggleWishlist, wishlist } = useShop();
    const isWishlisted = wishlist.some(item => item.id === quickViewProduct?.id);

    if (!quickViewProduct) return null;

    return (
        <Transition.Root show={!!quickViewProduct} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={() => setQuickViewProduct(null)}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 z-10 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="relative transform overflow-hidden rounded-2xl bg-white dark:bg-gray-900 shadow-2xl transition-all w-full max-w-5xl">
                                {/* Close Button */}
                                <button
                                    onClick={() => setQuickViewProduct(null)}
                                    className="absolute top-4 right-4 z-20 p-3 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-all shadow-lg hover:scale-110"
                                >
                                    <FaTimes size={20} />
                                </button>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                                    {/* Image Section - Enhanced */}
                                    <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 overflow-hidden">
                                        {/* Decorative Elements */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-purple-500/5" />

                                        <motion.div
                                            className="relative h-full min-h-[400px] md:min-h-[600px] flex items-center justify-center p-8"
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <img
                                                src={quickViewProduct.image}
                                                alt={quickViewProduct.name}
                                                className="w-full h-full object-contain drop-shadow-2xl"
                                            />
                                        </motion.div>

                                        {/* Stock Badge */}
                                        {quickViewProduct.stock < 5 && (
                                            <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-4 py-2 rounded-full uppercase tracking-wider shadow-lg">
                                                Only {quickViewProduct.stock} Left
                                            </div>
                                        )}
                                    </div>

                                    {/* Details Section - Enhanced */}
                                    <div className="flex flex-col p-8 md:p-12 bg-white dark:bg-gray-900">
                                        <div className="flex-1">
                                            {/* Category Badge */}
                                            <span className="inline-block px-3 py-1 text-xs font-bold tracking-wider uppercase bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full mb-4">
                                                {quickViewProduct.category}
                                            </span>

                                            {/* Product Name */}
                                            <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-4 leading-tight">
                                                {quickViewProduct.name}
                                            </h2>

                                            {/* Rating */}
                                            {quickViewProduct.rating && (
                                                <div className="flex items-center gap-2 mb-6">
                                                    <div className="flex gap-1">
                                                        {[...Array(5)].map((_, i) => (
                                                            <svg
                                                                key={i}
                                                                className={`w-5 h-5 ${i < Math.floor(quickViewProduct.rating) ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
                                                                fill="currentColor"
                                                                viewBox="0 0 20 20"
                                                            >
                                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                            </svg>
                                                        ))}
                                                    </div>
                                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                                        {quickViewProduct.rating} / 5
                                                    </span>
                                                </div>
                                            )}

                                            {/* Price */}
                                            <div className="mb-6">
                                                {quickViewProduct.salePrice ? (
                                                    <div className="flex items-baseline gap-3">
                                                        <span className="text-4xl font-black text-red-600">
                                                            ${quickViewProduct.salePrice.toFixed(2)}
                                                        </span>
                                                        <span className="text-2xl text-gray-400 line-through">
                                                            ${quickViewProduct.price.toFixed(2)}
                                                        </span>
                                                        <span className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm font-bold rounded-full">
                                                            SAVE ${(quickViewProduct.price - quickViewProduct.salePrice).toFixed(2)}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <span className="text-4xl font-black text-gray-900 dark:text-white">
                                                        ${quickViewProduct.price.toFixed(2)}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Description */}
                                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                                                {quickViewProduct.description || "Premium quality product crafted with attention to detail. Perfect for any occasion."}
                                            </p>

                                            {/* Sizes */}
                                            {quickViewProduct.sizes && quickViewProduct.sizes.length > 0 && (
                                                <div className="mb-6">
                                                    <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3 uppercase tracking-wider">
                                                        Available Sizes
                                                    </h4>
                                                    <div className="flex flex-wrap gap-2">
                                                        {quickViewProduct.sizes.map((size) => (
                                                            <span
                                                                key={size}
                                                                className="px-4 py-2 border-2 border-gray-200 dark:border-gray-700 rounded-lg text-sm font-bold text-gray-700 dark:text-gray-300 hover:border-gray-900 dark:hover:border-white transition-colors"
                                                            >
                                                                {size}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Colors */}
                                            {quickViewProduct.colors && quickViewProduct.colors.length > 0 && (
                                                <div className="mb-8">
                                                    <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3 uppercase tracking-wider">
                                                        Available Colors
                                                    </h4>
                                                    <div className="flex flex-wrap gap-2">
                                                        {quickViewProduct.colors.map((color) => (
                                                            <span
                                                                key={color}
                                                                className="px-4 py-2 border-2 border-gray-200 dark:border-gray-700 rounded-lg text-sm font-bold text-gray-700 dark:text-gray-300 capitalize hover:border-gray-900 dark:hover:border-white transition-colors"
                                                            >
                                                                {color}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Actions */}
                                        <div className="space-y-3 mt-auto">
                                            <button
                                                onClick={() => {
                                                    addToCart(
                                                        quickViewProduct,
                                                        quickViewProduct.sizes?.[0] || 'M',
                                                        quickViewProduct.colors?.[0] || 'black'
                                                    );
                                                    setQuickViewProduct(null);
                                                }}
                                                className="w-full bg-gradient-to-r from-gray-900 to-black dark:from-white dark:to-gray-100 text-white dark:text-black py-4 px-8 rounded-xl font-bold text-lg hover:shadow-xl transform hover:scale-[1.02] transition-all flex items-center justify-center gap-3"
                                            >
                                                <FaShoppingCart size={20} />
                                                Add to Cart
                                            </button>

                                            <div className="grid grid-cols-2 gap-3">
                                                <button
                                                    onClick={() => toggleWishlist(quickViewProduct)}
                                                    className={`py-3 px-6 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${isWishlisted
                                                            ? 'bg-red-500 text-white hover:bg-red-600'
                                                            : 'border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-red-500 hover:text-red-500'
                                                        }`}
                                                >
                                                    <FaHeart size={16} />
                                                    {isWishlisted ? 'Wishlisted' : 'Wishlist'}
                                                </button>

                                                <Link
                                                    to={`/product/${quickViewProduct.id}`}
                                                    onClick={() => setQuickViewProduct(null)}
                                                    className="py-3 px-6 border-2 border-gray-200 dark:border-gray-700 rounded-xl font-bold text-gray-700 dark:text-gray-300 hover:border-gray-900 dark:hover:border-white transition-all text-center"
                                                >
                                                    Full Details
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    );
};

export default QuickViewModal;
