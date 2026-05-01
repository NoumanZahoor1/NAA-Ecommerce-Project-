import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { FaTimes } from 'react-icons/fa';
import { useShop } from '../../context/ShopContext';
import { Link } from 'react-router-dom';

const CartDrawer = () => {
    const { cart, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity } = useShop();

    const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

    return (
        <Transition.Root show={isCartOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={setIsCartOpen}>
                {/* BACKDROP - Added blur for premium feel */}
                <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-500"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-500"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-hidden">
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                            <Transition.Child
                                as={Fragment}
                                enter="transform transition ease-in-out duration-500 sm:duration-700"
                                enterFrom="translate-x-full"
                                enterTo="translate-x-0"
                                leave="transform transition ease-in-out duration-500 sm:duration-700"
                                leaveFrom="translate-x-0"
                                leaveTo="translate-x-full"
                            >
                                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                                    {/* DRAWER PANEL - Replaced bg-white with glass-drawer */}
                                    <div className="flex h-full flex-col overflow-y-scroll glass-drawer">
                                        <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                                            <div className="flex items-start justify-between">
                                                <Dialog.Title className="text-lg font-medium text-gray-900 dark:text-white">Shopping cart</Dialog.Title>
                                                <div className="ml-3 flex h-7 items-center">
                                                    <button
                                                        type="button"
                                                        className="relative -m-2 p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                                                        onClick={() => setIsCartOpen(false)}
                                                    >
                                                        <span className="absolute -inset-0.5" />
                                                        <span className="sr-only">Close panel</span>
                                                        <FaTimes className="h-6 w-6" aria-hidden="true" />
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="mt-8">
                                                <div className="flow-root">
                                                    <ul role="list" className="-my-6 divide-y divide-gray-200 dark:divide-gray-700">
                                                        {cart.length === 0 ? (
                                                            <p className="py-6 text-center text-gray-500 dark:text-gray-400">Your cart is empty.</p>
                                                        ) : (
                                                            cart.map((product) => (
                                                                <li key={`${product.id}-${product.size}-${product.color}`} className="flex py-6">
                                                                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 dark:border-gray-700">
                                                                        <img
                                                                            src={product.image}
                                                                            alt={product.name}
                                                                            className="h-full w-full object-cover object-center"
                                                                        />
                                                                    </div>

                                                                    <div className="ml-4 flex flex-1 flex-col">
                                                                        <div>
                                                                            <div className="flex justify-between text-base font-medium text-gray-900 dark:text-white">
                                                                                <h3>
                                                                                    <Link to={`/product/${product.id}`}>{product.name}</Link>
                                                                                </h3>
                                                                                <p className="ml-4">${product.price.toFixed(2)}</p>
                                                                            </div>
                                                                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{product.color} | {product.size}</p>
                                                                        </div>
                                                                        <div className="flex flex-1 items-end justify-between text-sm">
                                                                            <div className="flex items-center gap-2">
                                                                                <button onClick={() => updateQuantity(product.id, product.size, product.color, -1)} className="px-2 py-1 bg-gray-100 dark:bg-gray-800 dark:text-gray-200 rounded hover:bg-gray-200 dark:hover:bg-gray-700">-</button>
                                                                                <p className="text-gray-500 dark:text-gray-400">Qty {product.quantity}</p>
                                                                                <button onClick={() => updateQuantity(product.id, product.size, product.color, 1)} className="px-2 py-1 bg-gray-100 dark:bg-gray-800 dark:text-gray-200 rounded hover:bg-gray-200 dark:hover:bg-gray-700">+</button>
                                                                            </div>

                                                                            <div className="flex">
                                                                                <button
                                                                                    type="button"
                                                                                    onClick={() => removeFromCart(product.id, product.size, product.color)}
                                                                                    className="font-medium text-red-600 hover:text-red-500 dark:text-red-400 dark:hover:text-red-300"
                                                                                >
                                                                                    Remove
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </li>
                                                            ))
                                                        )}
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-6 sm:px-6">
                                            <div className="flex justify-between text-base font-medium text-gray-900 dark:text-white">
                                                <p>Subtotal</p>
                                                <p>${subtotal.toFixed(2)}</p>
                                            </div>
                                            <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">Shipping and taxes calculated at checkout.</p>
                                            <div className="mt-6">
                                                <Link
                                                    to="/checkout"
                                                    className="flex items-center justify-center rounded-md border border-transparent bg-black px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-gray-900 dark:bg-white dark:text-black dark:hover:bg-gray-100 transition-colors"
                                                    onClick={() => setIsCartOpen(false)}
                                                >
                                                    Checkout
                                                </Link>
                                            </div>
                                            <div className="mt-6 flex justify-center text-center text-sm text-gray-500 dark:text-gray-400">
                                                <p>
                                                    or{' '}
                                                    <button
                                                        type="button"
                                                        className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                                                        onClick={() => setIsCartOpen(false)}
                                                    >
                                                        Continue Shopping
                                                        <span aria-hidden="true"> &rarr;</span>
                                                    </button>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    );
};

export default CartDrawer;