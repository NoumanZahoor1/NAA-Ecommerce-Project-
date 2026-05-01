import { useShop } from '../../context/ShopContext';
import { Link } from 'react-router-dom';
import { FaHeart, FaTrash, FaShoppingCart } from 'react-icons/fa';

const Wishlist = () => {
    const { wishlist, toggleWishlist, addToCart } = useShop();

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-24 min-h-screen">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">My Wishlist</h1>

            {wishlist.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <FaHeart className="mx-auto text-4xl text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Your wishlist is empty</h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">Save items you love to your wishlist.</p>
                    <Link to="/shop" className="inline-block bg-black text-white px-6 py-3 rounded-md font-bold hover:bg-gray-800 transition-colors dark:bg-white dark:text-black dark:hover:bg-gray-200">
                        Start Shopping
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {wishlist.map(product => (
                        <div key={product.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden group">
                            <div className="relative aspect-w-1 aspect-h-1 h-64 overflow-hidden">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                                />
                                <button
                                    onClick={() => toggleWishlist(product)}
                                    className="absolute top-2 right-2 p-2 bg-white dark:bg-gray-800 rounded-full shadow-md text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                >
                                    <FaTrash size={16} />
                                </button>
                            </div>
                            <div className="p-4">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                                    <Link to={`/product/${product.id}`} className="hover:underline">
                                        {product.name}
                                    </Link>
                                </h3>
                                <p className="text-gray-500 dark:text-gray-400 mb-4">${product.price.toFixed(2)}</p>
                                <button
                                    onClick={() => addToCart(product, product.sizes[0], product.colors[0])}
                                    className="w-full flex items-center justify-center gap-2 bg-black text-white py-2 rounded-md hover:bg-gray-800 transition-colors dark:bg-white dark:text-black dark:hover:bg-gray-200"
                                >
                                    <FaShoppingCart size={16} /> Add to Cart
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Wishlist;
