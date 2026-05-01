import { useParams, Link } from 'react-router-dom';
import { useState, useEffect, useMemo } from 'react';
import { useShop } from '../../context/ShopContext';
import { FaHeart, FaChevronRight, FaShippingFast, FaShieldAlt, FaUndo } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import SizeLab from '../../components/shop/SizeLab';
import Reviews from '../../components/shop/Reviews';
import ProductCard from '../../components/shop/ProductCard';
import ModelViewer from '../../components/shop/ModelViewer';
import { FaCube, FaCamera } from 'react-icons/fa';

const ProductDetail = () => {
    const { id: routeId } = useParams();
    const { products, addToCart, toggleWishlist, wishlist } = useShop();

    const product = useMemo(() => {
        return products.find(p => p.id === routeId || p._id === routeId);
    }, [products, routeId]);

    const [selectedSize, setSelectedSize] = useState(null);
    const [selectedColor, setSelectedColor] = useState(null);
    const [activeImage, setActiveImage] = useState(null);
    const [viewMode, setViewMode] = useState('photo'); // 'photo' | '3d'
    const [isSizeLabOpen, setIsSizeLabOpen] = useState(false);

    useEffect(() => {
        if (product) {
            setSelectedSize(product.sizes[0]);
            setSelectedColor(product.colors[0]);
            setActiveImage(product.image);
            window.scrollTo({ top: 0, behavior: 'auto' });
        }
    }, [product]);

    const allImages = useMemo(() => {
        if (!product) return [];
        return [product.image, ...(product.images || [])];
    }, [product]);

    if (!product) {
        return (
            <div className="pt-32 pb-64 text-center dark:bg-black dark:text-white">
                <h2 className="text-2xl font-light opacity-50 uppercase tracking-[0.3em]">Object not found</h2>
                <Link to="/shop" className="mt-8 inline-block text-gray-900 dark:text-white font-bold border-b-2 border-black dark:border-white uppercase text-xs tracking-widest pb-1">Return to Gallery</Link>
            </div>
        );
    }

    const relatedProducts = products
        .filter(p => p.category === product.category && p.id !== product.id)
        .slice(0, 4);

    return (
        <div className="bg-white dark:bg-black min-h-screen pt-24 transition-colors duration-500">
            {/* Breadcrumbs */}
            <div className="max-w-7xl mx-auto px-6 py-6 lg:py-8 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">
                <Link to="/" className="hover:text-black dark:hover:text-white">Home</Link>
                <FaChevronRight size={6} className="opacity-50" />
                <Link to="/shop" className="hover:text-black dark:hover:text-white">{product.category}</Link>
                <FaChevronRight size={6} className="opacity-50" />
                <span className="text-gray-900 dark:text-white truncate max-w-[150px]">{product.name}</span>
            </div>

            <main className="max-w-7xl mx-auto px-6 pb-24">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-20">

                    {/* Left Column: Image Center */}
                    <div className="lg:col-span-7 flex flex-col gap-6">
                        {/* Main Image Display */}
                        <div className="aspect-[4/5] bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 overflow-hidden relative group">
                            <AnimatePresence mode="wait">
                                {viewMode === '3d' && product.model ? (
                                    <motion.div
                                        key="3d-model"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="w-full h-full"
                                    >
                                        <ModelViewer modelUrl={product.model} poster={product.image} />
                                    </motion.div>
                                ) : (
                                    <motion.img
                                        key={activeImage}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.5 }}
                                        src={activeImage}
                                        alt={product.name}
                                        className="w-full h-full object-cover"
                                    />
                                )}
                            </AnimatePresence>

                            {/* 3D Toggle Control */}
                            {product.model && (
                                <div className="absolute bottom-6 left-6 flex gap-2 z-20">
                                    <button
                                        onClick={() => setViewMode('photo')}
                                        className={`p-3 rounded-xl backdrop-blur-md border transition-all ${viewMode === 'photo'
                                            ? 'bg-white/90 text-black border-white shadow-lg'
                                            : 'bg-black/50 text-white border-transparent hover:bg-black/70'}`}
                                    >
                                        <FaCamera size={16} />
                                    </button>
                                    <button
                                        onClick={() => setViewMode('3d')}
                                        className={`p-3 rounded-xl backdrop-blur-md border transition-all ${viewMode === '3d'
                                            ? 'bg-white/90 text-black border-white shadow-lg'
                                            : 'bg-black/50 text-white border-transparent hover:bg-black/70'}`}
                                    >
                                        <FaCube size={16} />
                                    </button>
                                </div>
                            )}

                            {product.salePrice && (
                                <div className="absolute top-6 left-6 bg-red-600 text-white text-[9px] font-black uppercase tracking-widest px-4 py-2 rounded-sm italic">
                                    Special Offer
                                </div>
                            )}
                        </div>

                    </div>

                    {/* Right Column: Narrative & Action */}
                    <div className="lg:col-span-5 space-y-10 lg:pt-4">
                        <motion.section
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-6"
                        >
                            <div className="space-y-2">
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-600">NAA / Studio</span>
                                <h1 className="text-3xl lg:text-5xl font-black text-gray-900 dark:text-white tracking-tight uppercase leading-tight italic">
                                    {product.name}
                                </h1>
                            </div>

                            <div className="flex items-baseline gap-4">
                                {product.salePrice ? (
                                    <>
                                        <span className="text-3xl font-black text-red-600 italic">${product.salePrice}</span>
                                        <span className="text-lg text-gray-400 dark:text-zinc-700 line-through font-bold">${product.price}</span>
                                    </>
                                ) : (
                                    <span className="text-3xl font-black text-gray-900 dark:text-white italic">${product.price}</span>
                                )}
                            </div>

                            <p className="text-sm text-gray-600 dark:text-zinc-400 leading-relaxed max-w-md font-medium">
                                {product.description || "Experimental technical piece designed for modern urban environments. Focuses on silhouette, materiality, and functional intent."}
                            </p>
                        </motion.section>

                        <div className="h-px bg-gray-100 dark:bg-zinc-900" />

                        {/* Options */}
                        <div className="space-y-10">
                            {/* Color */}
                            <div className="space-y-4">
                                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-500">
                                    <span>Colorway</span>
                                    <span className="text-gray-900 dark:text-white uppercase italic">{selectedColor}</span>
                                </div>
                                <div className="flex flex-wrap gap-4">
                                    {product.colors.map(color => (
                                        <button
                                            key={color}
                                            onClick={() => setSelectedColor(color)}
                                            className={`w-8 h-8 rounded-full border-4 border-white dark:border-black ring-1 transition-all
                                                ${selectedColor === color ? 'ring-black dark:ring-white scale-110 shadow-lg' : 'ring-gray-200 dark:ring-transparent opacity-60 hover:opacity-100'}`}
                                            style={{ backgroundColor: color }}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Size */}
                            <div className="space-y-4">
                                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-500">
                                    <span>Dimension</span>
                                    <button
                                        onClick={() => setIsSizeLabOpen(true)}
                                        className="text-indigo-600 hover:tracking-[0.2em] transition-all font-bold"
                                    >
                                        Size Lab
                                    </button>
                                </div>
                                <div className="grid grid-cols-4 gap-2">
                                    {product.sizes.map(size => (
                                        <button
                                            key={size}
                                            onClick={() => setSelectedSize(size)}
                                            className={`py-3 text-[10px] font-black transition-all border
                                                ${selectedSize === size
                                                    ? 'bg-black text-white border-black dark:bg-white dark:text-black dark:border-white shadow-xl'
                                                    : 'bg-transparent text-gray-500 border-gray-200 dark:border-zinc-900 hover:border-gray-400 dark:hover:border-zinc-700'}`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-4 pt-4">
                                <button
                                    onClick={() => addToCart(product, selectedSize, selectedColor)}
                                    className="flex-1 bg-black text-white dark:bg-white dark:text-black py-5 px-8 font-black text-[11px] uppercase tracking-[0.4em] hover:bg-gray-900 dark:hover:bg-gray-100 transition-all shadow-xl"
                                >
                                    Acquire Now
                                </button>
                                <button
                                    onClick={() => toggleWishlist(product)}
                                    className={`w-16 flex items-center justify-center border-2 transition-all duration-500
                                        ${wishlist.find(i => i.id === product.id)
                                            ? 'bg-red-500 border-red-500 text-white'
                                            : 'bg-transparent border-gray-100 dark:border-zinc-900 text-gray-400 hover:text-black dark:hover:text-white hover:border-black dark:hover:border-white'}`}
                                >
                                    <FaHeart size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Meta */}
                        <div className="pt-10 grid grid-cols-3 gap-4 border-t border-gray-100 dark:border-zinc-900">
                            {[
                                { icon: FaShippingFast, label: 'Express' },
                                { icon: FaShieldAlt, label: 'Secure' },
                                { icon: FaUndo, label: 'Concierge' }
                            ].map((item, idx) => (
                                <div key={idx} className="flex flex-col items-center gap-2 group">
                                    <item.icon className="text-gray-400 dark:text-zinc-800 group-hover:text-indigo-600 transition-colors" size={20} />
                                    <span className="text-[8px] font-black uppercase tracking-widest text-gray-500">{item.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>

            {/* Recommendations Section */}
            <section className="bg-gray-50 dark:bg-black py-24 border-t border-gray-100 dark:border-zinc-900">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex items-end justify-between mb-16">
                        <div>
                            <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.5em] mb-4 block">Archive</span>
                            <h2 className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white uppercase italic tracking-tighter">You May Also Like</h2>
                        </div>
                        <Link to="/shop" className="text-[10px] font-black uppercase tracking-widest border-b-2 border-black dark:border-white pb-1">Shop All</Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {relatedProducts.map((rel) => (
                            <ProductCard key={rel.id} product={rel} />
                        ))}
                    </div>
                </div>
            </section>

            <div className="border-t border-gray-100 dark:border-zinc-900">
                <Reviews productId={product.id} />
            </div>

            <SizeLab
                isOpen={isSizeLabOpen}
                onClose={() => setIsSizeLabOpen(false)}
                productFit={product.fit}
                availableSizes={product.sizes}
                onSelectSize={(size) => setSelectedSize(size)}
                product={product}
            />
        </div>
    );
};


export default ProductDetail;
