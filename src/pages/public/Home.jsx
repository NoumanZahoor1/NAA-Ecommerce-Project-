import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useShop } from '../../context/ShopContext';
import { useState, useEffect, useRef } from 'react';
import { FaStar, FaShippingFast, FaUndo, FaLock, FaQuoteLeft, FaUsers, FaGlobe, FaBoxOpen, FaHeadset } from 'react-icons/fa';
import InfiniteMarquee from '../../components/ui/InfiniteMarquee';
import MagneticButton from '../../components/ui/MagneticButton';
import ProductCard from '../../components/common/ProductCard';
import HeroSlider from '../../components/public/HeroSlider';
import AnimatedCounter from '../../components/ui/AnimatedCounter';
import TrendingSlider3D from '../../components/home/TrendingSlider3D';
import ShopTheLook from '../../components/home/ShopTheLook';

const Home = () => {
    const { products } = useShop();
    const [currentSlide, setCurrentSlide] = useState(0);

    // Parallax Scroll Effect
    const { scrollY } = useScroll();
    const opacity = useTransform(scrollY, [0, 300], [1, 0]);

    const featuredProducts = products.slice(0, 8);

    const testimonials = [
        { name: 'Sarah Johnson', text: 'Amazing quality and fast shipping! Will definitely order again.', rating: 5 },
        { name: 'Mike Chen', text: 'Best online shopping experience. Love the products!', rating: 5 },
        { name: 'Emma Davis', text: 'Stylish, comfortable, and affordable. What more could you want?', rating: 5 },
    ];

    const collections = [
        { title: 'Men', subtitle: 'Modern Streetwear', image: 'https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=800&q=80', link: '/shop?category=Men', count: '01' },
        { title: 'Women', subtitle: 'Timeless Elegance', image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80', link: '/shop?category=Women', count: '02' },
        { title: 'Accessories', subtitle: 'Essential Accents', image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=800&q=80', link: '/shop?category=Accessories', count: '03' },
    ];



    // Testimonial carousel
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % testimonials.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [testimonials.length]);



    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-gray-900 dark:text-white transition-colors duration-300 overflow-x-hidden"
        >
            {/* Hero Slider */}
            <HeroSlider />

            <InfiniteMarquee text="NEW COLLECTION • FREE SHIPPING • LIMITED EDITION • PREMIUM QUALITY" />

            {/* Stats Section - Upgraded */}
            <section className="py-32 bg-white dark:bg-black relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-800 to-transparent" />
                <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16">
                    {[
                        { number: 10, suffix: 'K+', label: 'Happy Customers', icon: <FaUsers className="text-gray-400" /> },
                        { number: 500, suffix: '+', label: 'Premium Products', icon: <FaBoxOpen className="text-gray-400" /> },
                        { number: 50, suffix: '+', label: 'Global Brands', icon: <FaGlobe className="text-gray-400" /> },
                        { number: 24, suffix: '/7', label: 'Support', icon: <FaHeadset className="text-gray-400" /> }
                    ].map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1, duration: 0.8 }}
                            viewport={{ once: true }}
                            className="group flex flex-col items-center text-center"
                        >
                            <div className="mb-6 p-4 rounded-2xl bg-gray-50 dark:bg-gray-900 group-hover:scale-110 group-hover:-translate-y-2 transition-all duration-500">
                                {stat.icon}
                            </div>
                            <div className="text-5xl md:text-7xl font-black mb-2 tracking-tighter dark:text-white">
                                <AnimatedCounter value={stat.number} />{stat.suffix}
                            </div>
                            <div className="text-gray-500 dark:text-gray-400 font-bold tracking-widest text-xs uppercase">{stat.label}</div>
                        </motion.div>
                    ))}
                </div>
                <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-800 to-transparent" />
            </section>

            {/* Trending Now - Luxury 3D Experience */}
            <TrendingSlider3D products={products} />

            {/* Featured Collections Grid - Magazine Style */}
            <section className="py-32 bg-white dark:bg-black border-b border-gray-100 dark:border-gray-900">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-start mb-24 gap-8">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="max-w-xl"
                        >
                            <span className="text-red-600 font-black tracking-[0.3em] uppercase mb-4 block">Curated Styles</span>
                            <h2 className="text-6xl md:text-8xl font-black uppercase leading-[0.9] tracking-tighter dark:text-white">
                                The <br />Categories<span className="text-gray-300 dark:text-gray-800">.</span>
                            </h2>
                        </motion.div>
                        <motion.p
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="text-gray-500 dark:text-gray-400 text-xl font-medium max-w-sm md:mt-auto"
                        >
                            Explore our meticulously crafted collections designed for the contemporary lifestyle.
                        </motion.p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
                        {collections.map((collection, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.2 }}
                                viewport={{ once: true }}
                                className={`group relative h-[700px] overflow-hidden rounded-3xl ${index === 1 ? 'md:mt-24' : ''} ${index === 2 ? 'md:-mt-12' : ''}`}
                            >
                                <Link to={collection.link} className="block w-full h-full">
                                    <div className="absolute top-8 left-8 z-20 overflow-hidden">
                                        <motion.span className="text-white/30 text-8xl font-black leading-none block -translate-y-full group-hover:translate-y-0 transition-transform duration-700">
                                            {collection.count}
                                        </motion.span>
                                    </div>
                                    <img
                                        src={collection.image}
                                        alt={collection.title}
                                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

                                    <div className="absolute bottom-0 left-0 w-full p-10 z-20">
                                        <div className="overflow-hidden mb-2">
                                            <span className="text-red-500 font-bold uppercase tracking-widest text-sm block translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                                                {collection.subtitle}
                                            </span>
                                        </div>
                                        <h3 className="text-5xl font-black text-white uppercase tracking-tighter mb-6 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                                            {collection.title}
                                        </h3>
                                        <div className="flex items-center gap-4 text-white opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100 translate-y-4 group-hover:translate-y-0">
                                            <span className="w-12 h-[1px] bg-white" />
                                            <span className="font-black uppercase tracking-widest text-sm">Shop Now</span>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Interactive Shop The Look */}
            <ShopTheLook />

            {/* Our Story - Parallax Text */}
            <section className="py-32 bg-white dark:bg-black text-black dark:text-white transition-colors duration-300">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl md:text-6xl font-bold mb-8 leading-tight">
                            "WE DESIGN FOR THE <span className="text-gray-400 dark:text-gray-500 italic">BOLD</span>, THE <span className="text-gray-400 dark:text-gray-500 italic">CREATIVE</span>, AND THE <span className="text-gray-400 dark:text-gray-500 italic">FREE</span>."
                        </h2>
                        <p className="text-xl text-gray-600 dark:text-gray-400 mb-12">
                            NAA was founded with a simple mission: to provide premium quality clothing that doesn't compromise on style or sustainability. Every piece is carefully crafted to ensure you look and feel your best.
                        </p>
                        <Link to="/support/about">
                            <MagneticButton>
                                <span className="inline-block border-2 border-black dark:border-white/30 px-10 py-4 text-lg hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all rounded-full font-bold">
                                    Read Our Story
                                </span>
                            </MagneticButton>
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Features */}
            <section className="py-20 px-4 bg-gray-50 dark:bg-black">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
                    {[
                        { icon: <FaShippingFast size={40} />, title: 'Free Shipping', desc: 'On orders over $100' },
                        { icon: <FaUndo size={40} />, title: 'Easy Returns', desc: '30-day return policy' },
                        { icon: <FaLock size={40} />, title: 'Secure Payment', desc: '100% secure transactions' },
                        { icon: <FaStar size={40} />, title: 'Premium Quality', desc: 'Guaranteed satisfaction' }
                    ].map((feature, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            viewport={{ once: true }}
                            className="text-center p-8 bg-white dark:bg-neutral-900 rounded-xl shadow-lg border border-transparent dark:border-neutral-800"
                        >
                            <div className="text-black dark:text-white mb-4 flex justify-center">{feature.icon}</div>
                            <h3 className="text-xl font-bold mb-2 dark:text-white">{feature.title}</h3>
                            <p className="text-gray-600 dark:text-gray-400">{feature.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Testimonials - Kinetic Typography Style */}
            <section className="py-32 bg-gray-50 dark:bg-black overflow-hidden transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 relative">
                    <div className="absolute top-0 left-10 text-[12rem] font-black text-black/5 dark:text-white/5 pointer-events-none select-none leading-none">
                        REVIEWS
                    </div>

                    <div className="relative z-10 flex flex-col items-center justify-center min-h-[400px]">
                        <motion.div
                            key={currentSlide}
                            initial={{ opacity: 0, y: 50, filter: 'blur(10px)' }}
                            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                            exit={{ opacity: 0, y: -50, filter: 'blur(10px)' }}
                            transition={{ duration: 0.8, ease: "circOut" }}
                            className="text-center max-w-4xl"
                        >
                            <div className="flex justify-center gap-2 mb-8">
                                {[...Array(testimonials[currentSlide].rating)].map((_, j) => (
                                    <motion.div
                                        key={j}
                                        initial={{ opacity: 0, scale: 0 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: j * 0.1 }}
                                    >
                                        <FaStar className="text-2xl text-black dark:text-white" />
                                    </motion.div>
                                ))}
                            </div>

                            <h3 className="text-4xl md:text-6xl font-black uppercase tracking-tight leading-tight mb-8 text-black dark:text-white">
                                "{testimonials[currentSlide].text}"
                            </h3>

                            <div className="flex items-center justify-center gap-4">
                                <div className="h-px w-12 bg-black dark:bg-white" />
                                <p className="font-bold uppercase tracking-[0.3em] text-sm text-black dark:text-white">
                                    {testimonials[currentSlide].name}
                                </p>
                                <div className="h-px w-12 bg-black dark:bg-white" />
                            </div>
                        </motion.div>

                        {/* Pagination Dots */}
                        <div className="flex gap-4 mt-16">
                            {testimonials.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentSlide(idx)}
                                    className={`h-1 transition-all duration-500 rounded-full ${idx === currentSlide ? 'w-16 bg-black dark:bg-white' : 'w-4 bg-gray-300 dark:bg-gray-800 hover:bg-gray-400'}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Newsletter - Minimalist Premium */}
            <section className="py-32 bg-white dark:bg-black transition-colors duration-300 border-t border-gray-100 dark:border-gray-900">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-16 md:gap-8">
                        <div className="flex-1 text-center md:text-left">
                            <h2 className="text-7xl md:text-8xl font-black uppercase tracking-tighter mb-4 text-black dark:text-white leading-[0.8]">
                                Stay<br />Ahead
                            </h2>
                            <p className="text-gray-500 dark:text-gray-400 font-medium text-lg max-w-md mt-6">
                                Join the inner circle. Receive early access to drops, exclusive archives, and private events.
                            </p>
                        </div>

                        <div className="flex-1 w-full max-w-xl">
                            <form className="relative group">
                                <div className="absolute -inset-1 bg-gradient-to-r from-red-500 via-purple-500 to-pink-500 rounded-2xl opacity-20 group-hover:opacity-40 blur transition duration-500" />
                                <div className="relative flex items-center bg-gray-50 dark:bg-black rounded-xl border border-gray-200 dark:border-gray-800 p-2 transform transition-transform duration-300 group-hover:scale-[1.01]">
                                    <input
                                        type="email"
                                        placeholder="ENTER YOUR EMAIL ADDRESS"
                                        className="flex-1 bg-transparent border-none text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-600 px-6 py-4 font-bold uppercase tracking-wider focus:ring-0 text-sm"
                                    />
                                    <button className="bg-black dark:bg-white text-white dark:text-black px-8 py-4 rounded-lg font-black uppercase tracking-wider text-xs hover:opacity-80 transition-opacity">
                                        Join
                                    </button>
                                </div>
                            </form>
                            <p className="mt-4 text-xs text-gray-400 text-center md:text-right uppercase tracking-widest">
                                By joining you agree to our Terms & Privacy Policy
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </motion.div>
    );
};

export default Home;
