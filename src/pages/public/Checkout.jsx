import { useState, useEffect } from 'react';
import { useShop } from '../../context/ShopContext';
import { Link, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

// Initialize Stripe outside of component to avoid recreating stripe object on every render
const stripePromise = loadStripe('pk_test_51SWN4x2MF48BNtSN2TsvyEVhcV3tJYqbWMix1kH9HGpN9wxnUk6P3eZ06Oosz26KEJGth6BZoSABWjBPSw56GeP800A28ShV14');

const CheckoutForm = ({ total, cart, shipping }) => {
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();
    const [message, setMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        email: '', firstName: '', lastName: '', address: '', city: '', zip: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setIsLoading(true);

        // Store order data in sessionStorage before payment
        const orderData = {
            orderItems: cart,
            shippingAddress: {
                address: formData.address,
                city: formData.city,
                postalCode: formData.zip,
                country: 'US',
            },
            paymentMethod: 'Stripe',
            shippingPrice: shipping,
            totalPrice: total,
            email: formData.email,
            customerName: `${formData.firstName} ${formData.lastName}`,
        };
        sessionStorage.setItem('pendingOrder', JSON.stringify(orderData));

        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                // Make sure to change this to your payment completion page
                return_url: `${window.location.origin}/order-success`,
                receipt_email: formData.email,
                shipping: {
                    name: `${formData.firstName} ${formData.lastName}`,
                    address: {
                        line1: formData.address,
                        city: formData.city,
                        postal_code: formData.zip,
                        country: 'US', // Defaulting to US for simplicity
                    },
                },
            },
        });

        // This point will only be reached if there is an immediate error when
        // confirming the payment. Otherwise, your customer will be redirected to
        // your `return_url`.
        if (error.type === "card_error" || error.type === "validation_error") {
            setMessage(error.message);
        } else {
            setMessage("An unexpected error occurred.");
        }

        setIsLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <h3 className="text-lg font-medium mb-4">Contact Information</h3>
                <input
                    type="email"
                    name="email"
                    placeholder="Email address"
                    required
                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black p-3 border"
                    onChange={handleChange}
                    value={formData.email}
                />
            </div>

            <div>
                <h3 className="text-lg font-medium mb-4 mt-8">Shipping Address</h3>
                <div className="grid grid-cols-2 gap-4">
                    <input type="text" name="firstName" placeholder="First name" required className="w-full border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black p-3 border" onChange={handleChange} value={formData.firstName} />
                    <input type="text" name="lastName" placeholder="Last name" required className="w-full border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black p-3 border" onChange={handleChange} value={formData.lastName} />
                </div>
                <input type="text" name="address" placeholder="Address" required className="w-full border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black p-3 border mt-4" onChange={handleChange} value={formData.address} />
                <div className="grid grid-cols-2 gap-4 mt-4">
                    <input type="text" name="city" placeholder="City" required className="w-full border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black p-3 border" onChange={handleChange} value={formData.city} />
                    <input type="text" name="zip" placeholder="ZIP Code" required className="w-full border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black p-3 border" onChange={handleChange} value={formData.zip} />
                </div>
            </div>

            <div>
                <h3 className="text-lg font-medium mb-4 mt-8">Payment</h3>
                <PaymentElement id="payment-element" />
            </div>

            {message && <div id="payment-message" className="text-red-500 mt-4">{message}</div>}

            <button
                disabled={isLoading || !stripe || !elements}
                id="submit"
                type="submit"
                className="w-full bg-black text-white py-4 rounded-md font-bold text-lg hover:bg-gray-800 transition-colors mt-8 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <span id="button-text">
                    {isLoading ? "Processing..." : `Pay $${total.toFixed(2)}`}
                </span>
            </button>
        </form>
    );
};

const Checkout = () => {
    const { cart } = useShop();
    const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const shipping = 10.00;
    const total = subtotal + shipping;

    const [clientSecret, setClientSecret] = useState("");

    useEffect(() => {
        // Create PaymentIntent as soon as the page loads
        if (total > 0) {
            fetch("/api/payment/create-payment-intent", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount: total }),
            })
                .then((res) => res.json())
                .then((data) => setClientSecret(data.clientSecret))
                .catch((err) => console.error("Error fetching payment intent:", err));
        }
    }, [total]);

    const appearance = {
        theme: 'stripe',
    };
    const options = {
        clientSecret,
        appearance,
    };

    if (cart.length === 0) {
        return (
            <div className="min-h-screen pt-24 pb-12 flex flex-col items-center justify-center">
                <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
                <Link to="/shop" className="text-indigo-600 hover:underline">Continue Shopping</Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-24 dark:bg-gray-900 dark:text-white min-h-screen">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Form */}
                <div>
                    <h2 className="text-2xl font-bold mb-8">Checkout</h2>
                    {clientSecret ? (
                        <Elements options={options} stripe={stripePromise}>
                            <CheckoutForm total={total} cart={cart} shipping={shipping} />
                        </Elements>
                    ) : (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
                        </div>
                    )}
                </div>

                {/* Order Summary */}
                <div className="bg-gray-50 p-8 rounded-lg h-fit dark:bg-gray-800">
                    <h3 className="text-lg font-medium mb-6">Order Summary</h3>
                    <div className="space-y-4 mb-6">
                        {cart.map(item => (
                            <div key={`${item.id}-${item.size}-${item.color}`} className="flex gap-4">
                                <div className="w-16 h-16 bg-white rounded-md overflow-hidden border border-gray-200 relative">
                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                    <span className="absolute -top-2 -right-2 bg-gray-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">{item.quantity}</span>
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-medium">{item.name}</h4>
                                    <p className="text-sm text-gray-500">{item.color} / {item.size}</p>
                                </div>
                                <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                            </div>
                        ))}
                    </div>
                    <div className="border-t border-gray-200 pt-4 space-y-2">
                        <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                            <span className="font-medium">${subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                            <span className="font-medium">${shipping.toFixed(2)}</span>
                        </div>
                    </div>
                    <div className="border-t border-gray-200 pt-4 mt-4 flex justify-between items-center">
                        <span className="text-lg font-bold">Total</span>
                        <span className="text-2xl font-bold">${total.toFixed(2)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
