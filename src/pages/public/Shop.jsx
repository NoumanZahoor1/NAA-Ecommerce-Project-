import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useShop } from '../../context/ShopContext';
import FilterSidebar from '../../components/shop/FilterSidebar';
import ProductCard from '../../components/shop/ProductCard';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaFilter, FaTimes } from 'react-icons/fa';


const Shop = () => {
    const { products, addToCart } = useShop();
    const [searchParams] = useSearchParams();
    const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
    const [filters, setFilters] = useState({
        category: searchParams.get('category') ? [searchParams.get('category')] : [],
        size: [],
        color: searchParams.get('colors') ? searchParams.get('colors').split(',') : [],
        maxPrice: searchParams.get('maxPrice') ? parseInt(searchParams.get('maxPrice')) : 1000,
        minPrice: searchParams.get('minPrice') ? parseInt(searchParams.get('minPrice')) : null
    });
    const [quickViewProduct, setQuickViewProduct] = useState(null);

    // Update filters when URL params change
    useEffect(() => {
        const category = searchParams.get('category');
        const colors = searchParams.get('colors');

        const maxPrice = searchParams.get('maxPrice');
        const minPrice = searchParams.get('minPrice');

        setFilters(prev => ({
            ...prev,
            category: category ? [category] : prev.category,
            colors: colors ? colors.split(',') : prev.colors,
            maxPrice: maxPrice ? parseInt(maxPrice) : prev.maxPrice,
            minPrice: minPrice ? parseInt(minPrice) : prev.minPrice
        }));
    }, [searchParams]);

    const filteredProducts = products.filter(product => {
        const productPrice = product.salePrice || product.price;

        // If "Sale" category is selected, show only products with salePrice
        if (filters.category.includes('Sale')) {
            if (!product.salePrice) return false;

            // If other categories are ALSO selected, the product must match at least one of them
            const otherCategories = filters.category.filter(c => c !== 'Sale');
            if (otherCategories.length > 0) {
                const matchesOther = otherCategories.some(c =>
                    (c === 'new' && product.category === 'new') ||
                    (c === 'archive' && product.category === 'archive') ||
                    (!['new', 'archive'].includes(c) && product.category === c)
                );
                if (!matchesOther) return false;
            }
        } else {
            // For other categories (when Sale is NOT selected), filter normally
            if (filters.category.length > 0 && !filters.category.some(c =>
                (c === 'new' && product.category === 'new') ||
                (c === 'archive' && product.category === 'archive') ||
                (!['new', 'archive'].includes(c) && product.category === c)
            )) {
                return false;
            }
        }

        if (filters.size.length > 0 && !product.sizes.some(s => filters.size.includes(s))) return false;
        if (filters.color.length > 0 && !product.colors.some(c => filters.color.includes(c))) return false;

        // Use effective price for price range filtering
        if (productPrice > filters.maxPrice) return false;
        if (filters.minPrice && productPrice < filters.minPrice) return false;

        return true;
    });

    const activeCategory = filters.category.length > 0 ? filters.category[0] : 'All Products';

    // Dynamic Header Info
    const getHeaderInfo = () => {
        if (filters.category.includes('Sale')) return { title: 'Sale', desc: 'Limited time offers on premium items.' };
        if (filters.category.includes('new')) return { title: 'New Arrivals', desc: 'The latest drops and freshest fits.' };
        if (filters.category.includes('archive')) return { title: 'The Archive', desc: 'Rare and vintage pieces.' };
        if (filters.category.includes('Men')) return { title: 'Men\'s Collection', desc: 'Essentials for the modern man.' };
        if (filters.category.includes('Women')) return { title: 'Women\'s Collection', desc: 'Elevated staples and statement pieces.' };
        if (filters.category.includes('Accessories')) return { title: 'Accessories', desc: 'The finishing touches.' };
        return { title: 'Shop All', desc: 'Explore our complete collection.' };
    };

    const header = getHeaderInfo();

    return (
        <div className="min-h-screen bg-white dark:bg-black transition-colors duration-300">
            {/* Mobile Filter Dialog */}
            <Transition.Root show={isMobileFiltersOpen} as={Fragment}>
                <Dialog as="div" className="relative z-40 lg:hidden" onClose={setIsMobileFiltersOpen}>
                    <Transition.Child
                        as={Fragment}
                        enter="transition-opacity ease-linear duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="transition-opacity ease-linear duration-300"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-25" />
                    </Transition.Child>

                    <div className="fixed inset-0 z-40 flex">
                        <Transition.Child
                            as={Fragment}
                            enter="transition ease-in-out duration-300 transform"
                            enterFrom="-translate-x-full"
                            enterTo="translate-x-0"
                            leave="transition ease-in-out duration-300 transform"
                            leaveFrom="translate-x-0"
                            leaveTo="-translate-x-full"
                        >
                            <Dialog.Panel className="relative flex w-full max-w-xs flex-col overflow-y-auto bg-white dark:bg-gray-900 pb-12 shadow-xl">
                                <div className="flex px-4 pb-2 pt-5">
                                    <button
                                        type="button"
                                        className="-m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400"
                                        onClick={() => setIsMobileFiltersOpen(false)}
                                    >
                                        <span className="sr-only">Close menu</span>
                                        <FaTimes className="h-6 w-6" aria-hidden="true" />
                                    </button>
                                </div>
                                <div className="px-4 py-6">
                                    <FilterSidebar filters={filters} setFilters={setFilters} />
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition.Root>

            <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex items-baseline justify-between border-b border-gray-200 dark:border-gray-800 pb-10 pt-24">
                    <div>
                        <motion.h1
                            key={header.title}
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-4xl font-black tracking-tight text-gray-900 dark:text-white sm:text-6xl uppercase"
                        >
                            {header.title}
                        </motion.h1>
                        <motion.p
                            key={header.desc}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className="mt-4 text-base text-gray-500 dark:text-gray-400"
                        >
                            {header.desc}
                        </motion.p>
                    </div>

                    <div className="flex items-center">
                        <button
                            type="button"
                            className="-m-2 ml-4 p-2 text-gray-400 hover:text-gray-500 sm:ml-6 lg:hidden"
                            onClick={() => setIsMobileFiltersOpen(true)}
                        >
                            <span className="sr-only">Filters</span>
                            <FaFilter className="h-5 w-5" aria-hidden="true" />
                        </button>
                    </div>
                </div>

                <section aria-labelledby="products-heading" className="pb-24 pt-6">
                    <h2 id="products-heading" className="sr-only">Products</h2>

                    <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
                        {/* Filters (Desktop) */}
                        <div className="hidden lg:block">
                            <FilterSidebar filters={filters} setFilters={setFilters} />
                        </div>

                        {/* Product Grid */}
                        <div className="lg:col-span-3">
                            {filteredProducts.length > 0 ? (
                                <motion.div
                                    layout
                                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10"
                                >
                                    <AnimatePresence>
                                        {filteredProducts.map((product) => (
                                            <ProductCard
                                                key={product.id}
                                                product={product}
                                                onQuickView={setQuickViewProduct}
                                            />
                                        ))}
                                    </AnimatePresence>
                                </motion.div>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex flex-col items-center justify-center py-20 text-center"
                                >
                                    <div className="text-6xl mb-4">🔍</div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No products found</h3>
                                    <p className="text-gray-500 dark:text-gray-400 mb-6">Try adjusting your filters to find what you're looking for.</p>
                                    <button
                                        onClick={() => setFilters({ category: [], size: [], color: [], maxPrice: 1000 })}
                                        className="text-sm font-bold underline hover:no-underline dark:text-white"
                                    >
                                        Clear all filters
                                    </button>
                                </motion.div>
                            )}
                        </div>
                    </div>
                </section>
            </main>

            {/* Quick View Modal */}
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
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                    </Transition.Child>

                    <div className="fixed inset-0 z-10 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                enterTo="opacity-100 translate-y-0 sm:scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            >
                                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-900 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl">
                                    {quickViewProduct && (
                                        <div className="grid grid-cols-1 md:grid-cols-2">
                                            <div className="aspect-[3/4] relative bg-gray-100">
                                                <img src={quickViewProduct.image} alt={quickViewProduct.name} className="absolute inset-0 h-full w-full object-cover" />
                                            </div>
                                            <div className="p-8 flex flex-col justify-center">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div>
                                                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white uppercase tracking-wide">{quickViewProduct.name}</h2>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400">{quickViewProduct.category}</p>
                                                    </div>
                                                    <button onClick={() => setQuickViewProduct(null)} className="text-gray-400 hover:text-gray-500">
                                                        <span className="sr-only">Close</span>
                                                        <FaTimes size={24} />
                                                    </button>
                                                </div>

                                                <div className="mb-6">
                                                    {quickViewProduct.salePrice ? (
                                                        <div className="flex items-center gap-3">
                                                            <p className="text-2xl font-bold text-red-600">${quickViewProduct.salePrice}</p>
                                                            <p className="text-lg text-gray-400 line-through">${quickViewProduct.price}</p>
                                                        </div>
                                                    ) : (
                                                        <p className="text-2xl font-medium text-gray-900 dark:text-white">${quickViewProduct.price}</p>
                                                    )}
                                                </div>

                                                <p className="text-gray-500 dark:text-gray-300 mb-8 leading-relaxed">
                                                    {quickViewProduct.description || "Lorem ipsum dolor sit amet."}
                                                </p>

                                                <button
                                                    onClick={() => {
                                                        addToCart(quickViewProduct, quickViewProduct.sizes[0], quickViewProduct.colors[0]);
                                                        setQuickViewProduct(null);
                                                    }}
                                                    className="w-full bg-black dark:bg-white dark:text-black text-white py-4 px-8 rounded-none font-bold uppercase tracking-widest hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
                                                >
                                                    Add to Cart
                                                </button>
                                                <Link
                                                    to={`/product/${quickViewProduct.id}`}
                                                    className="mt-4 block text-center text-sm text-gray-500 hover:text-black dark:hover:text-white underline"
                                                >
                                                    View Full Details
                                                </Link>
                                            </div>
                                        </div>
                                    )}
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition.Root>
        </div>
    );
};

export default Shop;
