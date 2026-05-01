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

/* ── Reviews section extracted so hooks work correctly ── */
const ReviewsSection = ({ currentSlide, setCurrentSlide, testimonials }) => {
    const reviewRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: reviewRef, offset: ['start end', 'end start'] });
    const watermarkX = useTransform(scrollYProgress, [0, 1], ['-8%', '8%']);

    return (
        <section ref={reviewRef} className="relative py-32 bg-white dark:bg-black overflow-hidden transition-colors duration-500">
            {/* Top edge */}
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-black/10 dark:via-white/10 to-transparent" />

            {/* Parallax REVIEWS watermark */}
            <motion.div
                style={{ x: watermarkX }}
                className="absolute top-1/2 -translate-y-1/2 whitespace-nowrap pointer-events-none select-none leading-none z-0"
            >
                <span className="text-[13rem] font-black text-black/[0.08] dark:text-white/[0.04] tracking-tighter">
                    REVIEWS REVIEWS REVIEWS
                </span>
            </motion.div>

            <div className="max-w-7xl mx-auto px-4 relative z-10">
                <div className="relative z-10 flex flex-col items-center justify-center min-h-[400px]">
                    <motion.div
                        key={currentSlide}
                        initial={{ opacity: 0, y: 50, filter: 'blur(10px)' }}
                        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, y: -50, filter: 'blur(10px)' }}
                        transition={{ duration: 0.8, ease: 'circOut' }}
                        className="text-center max-w-4xl"
                    >
                        {/* Gold stars */}
                        <div className="flex justify-center gap-3 mb-8">
                            {[...Array(testimonials[currentSlide].rating)].map((_, j) => (
                                <motion.div
                                    key={j}
                                    initial={{ opacity: 0, scale: 0, rotate: -30 }}
                                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                    transition={{ delay: j * 0.08, type: 'spring', stiffness: 400, damping: 15 }}
                                >
                                    <FaStar className="text-2xl" style={{ color: '#F5C842' }} />
                                </motion.div>
                            ))}
                        </div>

                        <h3 className="text-3xl md:text-6xl font-black uppercase tracking-tight leading-tight mb-8 text-black dark:text-white">
                            "{testimonials[currentSlide].text}"
                        </h3>

                        <div className="flex items-center justify-center gap-6">
                            <motion.img 
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5 }}
                                src={testimonials[currentSlide].avatar} 
                                className="w-14 h-14 rounded-full object-cover border border-black/10 dark:border-white/10"
                                alt={testimonials[currentSlide].name}
                            />
                            <div className="text-left">
                                <p className="font-bold uppercase tracking-[0.3em] text-xs text-black dark:text-white">
                                    {testimonials[currentSlide].name}
                                </p>
                                <p className="text-[10px] uppercase tracking-widest text-black/40 dark:text-white/40 mt-1">Verified Client</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Pagination Dots */}
                    <div className="flex gap-4 mt-16">
                        {testimonials.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentSlide(idx)}
                                className={`h-1 transition-all duration-500 rounded-full ${idx === currentSlide
                                        ? 'w-16 bg-black dark:bg-white'
                                        : 'w-4 bg-black/15 dark:bg-white/15 hover:bg-black/30 dark:hover:bg-white/30'
                                    }`}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom edge */}
            <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-black/10 dark:via-white/10 to-transparent" />
        </section>
    );
};

const Home = () => {
    const { products } = useShop();
    const [currentSlide, setCurrentSlide] = useState(0);

    // Parallax Scroll Effect
    const { scrollY } = useScroll();
    const opacity = useTransform(scrollY, [0, 300], [1, 0]);

    const featuredProducts = products.slice(0, 8);

    const testimonials = [
        { name: 'Sarah Johnson', text: 'Amazing quality and fast shipping! Will definitely order again.', rating: 5, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80' },
        { name: 'Mike Chen', text: 'Best online shopping experience. Love the products!', rating: 5, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80' },
        { name: 'Emma Davis', text: 'Stylish, comfortable, and affordable. What more could you want?', rating: 5, avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80' },
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
            <section className="py-32 bg-[#FAF9F6] dark:bg-black border-y border-gray-100 dark:border-gray-900 transition-colors duration-500">
                <div className="max-w-7xl mx-auto px-4">
                    {/* Editorial Header */}
                    <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-12">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1 }}
                            className="flex-1"
                        >
                            <span className="text-red-600 font-black tracking-[0.4em] uppercase text-xs mb-6 block">Curated Styles</span>
                            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
                                <h2 className="text-4xl sm:text-5xl md:text-8xl font-black uppercase leading-none tracking-tighter dark:text-white">
                                    The
                                </h2>
                                <div className="hidden md:block h-[2px] flex-1 bg-black/10 dark:bg-white/10 mt-4" />
                                <h2 className="text-4xl sm:text-5xl md:text-8xl font-black uppercase leading-none tracking-tighter dark:text-white">
                                    Categories<span className="text-red-500">.</span>
                                </h2>
                            </div>
                        </motion.div>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            className="text-gray-500 dark:text-gray-400 text-lg font-medium max-w-sm"
                        >
                            Explore our meticulously crafted collections designed for the contemporary lifestyle and creative expression.
                        </motion.p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-10">
                        {collections.map((collection, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 60 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.2, duration: 0.8, ease: "easeOut" }}
                                viewport={{ once: true, margin: "-50px" }}
                                className={`group relative h-[450px] md:h-[750px] overflow-hidden rounded-[8px] border border-black/5 dark:border-white/5 ${index === 1 ? 'md:mt-24' : ''} ${index === 2 ? 'md:-mt-12' : ''}`}
                            >
                                <Link to={collection.link} className="block w-full h-full">
                                    {/* Persistent subtle counter */}
                                    <div className="absolute top-8 left-8 z-20 overflow-hidden">
                                        <motion.span className="text-white text-8xl font-black leading-none block opacity-10 group-hover:opacity-30 group-hover:scale-110 transition-all duration-700 origin-top-left">
                                            {collection.count}
                                        </motion.span>
                                    </div>

                                    <img
                                        src={collection.image}
                                        alt={collection.title}
                                        className="w-full h-full object-cover grayscale md:grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110"
                                    />

                                    {/* Gradients */}
                                    <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />
                                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-700" />

                                    <div className="absolute bottom-0 left-0 w-full p-12 z-20">
                                        <div className="overflow-hidden mb-3">
                                            <span className="text-red-500 font-black uppercase tracking-widest text-[10px] block translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                                                {collection.subtitle}
                                            </span>
                                        </div>
                                        <h3 className="text-5xl font-black text-white uppercase tracking-tighter mb-8 translate-y-2 group-hover:translate-y-0 transition-all duration-500">
                                            {collection.title}
                                        </h3>

                                        {/* Red Underline Sweep Interaction */}
                                        <div className="relative inline-flex flex-col">
                                            <span className="font-black uppercase tracking-[0.2em] text-xs text-white pb-2">
                                                Shop Now
                                            </span>
                                            <div className="h-[2px] w-full bg-white/20 overflow-hidden">
                                                <motion.div
                                                    className="h-full bg-red-600"
                                                    initial={{ x: "-100%" }}
                                                    whileHover={{ x: "0%" }}
                                                    transition={{ duration: 0.4 }}
                                                />
                                            </div>
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

            {/* Our Story - Editorial Serif Style */}
            <section className="relative py-32 bg-white dark:bg-black text-black dark:text-white transition-colors duration-500 overflow-hidden">
                {/* Decorative Background Quote Marks */}
                <div className="absolute top-10 left-10 text-[20rem] font-serif text-black/[0.03] dark:text-white/[0.03] pointer-events-none select-none leading-none">
                    &ldquo;
                </div>
                <div className="absolute bottom-10 right-10 text-[20rem] font-serif text-black/[0.03] dark:text-white/[0.03] pointer-events-none select-none leading-none">
                    &rdquo;
                </div>

                <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl md:text-6xl mb-10 leading-tight font-serif italic font-medium">
                            &ldquo;We design for the <span className="text-gray-400 dark:text-gray-500 font-normal">bold</span>, the <span className="text-gray-400 dark:text-gray-500 font-normal">creative</span>, and the <span className="text-gray-400 dark:text-gray-500 font-normal">free</span>.&rdquo;
                        </h2>
                        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-14 font-medium leading-relaxed max-w-2xl mx-auto">
                            NAA was founded with a simple mission: to provide premium quality clothing that doesn't compromise on style or sustainability. Every piece is carefully crafted to ensure you look and feel your best.
                        </p>
                        <Link to="/support/about">
                            <MagneticButton>
                                <motion.span
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="inline-flex items-center justify-center px-12 py-5 bg-black dark:bg-white text-white dark:text-black text-sm uppercase tracking-[0.3em] font-black transition-all duration-300 hover:shadow-[0_20px_50px_rgba(0,0,0,0.2)] dark:hover:shadow-[0_20px_50px_rgba(255,255,255,0.1)] rounded-none"
                                >
                                    Read Our Story
                                </motion.span>
                            </MagneticButton>
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Features - Theme Aware Premium Section */}
            <section className="relative py-32 px-4 bg-white dark:bg-black overflow-hidden transition-colors duration-500">
                {/* Subtle Grid / Noise Pattern */}
                <div className="absolute inset-0 opacity-[0.05] dark:opacity-[0.08]"
                    style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)', backgroundSize: '80px 80px' }} />
                
                {/* Decorative Spotlights */}
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-red-600/5 dark:bg-red-600/10 blur-[120px] rounded-full pointer-events-none" />
                <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-blue-600/5 dark:bg-blue-600/5 blur-[100px] rounded-full pointer-events-none" />

                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="text-center mb-24">
                        <motion.span 
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            className="text-[10px] font-black tracking-[0.8em] uppercase text-black/40 dark:text-white/40 block mb-4"
                        >
                            The NAA Promise
                        </motion.span>
                        <h2 className="text-4xl md:text-5xl font-black text-black dark:text-white uppercase tracking-tighter">
                            Designed for the <span className="text-red-600">Modern</span> Era
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-px bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5">
                        {[
                            { icon: <FaShippingFast size={28} />, title: 'Free Shipping', desc: 'On orders over $100', accent: '#ef4444' },
                            { icon: <FaUndo size={28} />, title: 'Easy Returns', desc: '30-day return policy', accent: '#f59e0b' },
                            { icon: <FaLock size={28} />, title: 'Secure Payment', desc: '100% secure transactions', accent: '#3b82f6' },
                            { icon: <FaStar size={28} />, title: 'Premium Quality', desc: 'Guaranteed satisfaction', accent: '#10b981' }
                        ].map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1, duration: 0.8 }}
                                viewport={{ once: true }}
                                whileHover={{ y: -8 }}
                                className="group relative text-center p-8 md:p-14 bg-white dark:bg-black flex flex-col items-center gap-6 cursor-default transition-all duration-500 hover:bg-black/[0.01] dark:hover:bg-white/[0.02]"
                            >
                                {/* Neon Icon Glow */}
                                <div
                                    className="w-20 h-20 rounded-full flex items-center justify-center transition-all duration-700 group-hover:scale-110 relative"
                                    style={{ 
                                        backgroundColor: `${feature.accent}12`, 
                                        boxShadow: `inset 0 0 20px ${feature.accent}10, 0 0 0 1px ${feature.accent}30` 
                                    }}
                                >
                                    <span className="relative z-10 transition-colors duration-500" style={{ color: feature.accent }}>{feature.icon}</span>
                                    {/* Hover Glow Bloom */}
                                    <div className="absolute inset-0 rounded-full blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-700" style={{ backgroundColor: feature.accent }} />
                                </div>

                                <div className="space-y-2">
                                    <h3 className="text-sm font-black text-black dark:text-white uppercase tracking-[0.2em] transition-colors duration-500 group-hover:text-red-500">{feature.title}</h3>
                                    <p className="text-black/40 dark:text-white/40 text-xs font-medium tracking-wide">{feature.desc}</p>
                                </div>

                                {/* High-Speed Reveal Line */}
                                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-black/5 dark:bg-white/5 overflow-hidden">
                                    <motion.div 
                                        className="h-full"
                                        initial={{ width: "0%", left: "50%" }}
                                        whileHover={{ width: "100%", left: "0%" }}
                                        transition={{ duration: 0.4, ease: "circOut" }}
                                        style={{ backgroundColor: feature.accent }}
                                    />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials - Dark with Parallax Watermark */}
            <ReviewsSection
                currentSlide={currentSlide}
                setCurrentSlide={setCurrentSlide}
                testimonials={testimonials}
            />

            {/* Newsletter - Minimalist Underline Style */}
            <section className="py-24 bg-white dark:bg-black transition-colors duration-500 overflow-hidden border-t border-black/5 dark:border-white/5">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-12 md:gap-24">
                        <div className="flex-1">
                            <motion.span 
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                className="text-[10px] font-black tracking-[0.6em] uppercase text-red-600 block mb-6"
                            >
                                The Inner Circle
                            </motion.span>
                            <h2 className="text-4xl md:text-8xl font-black uppercase tracking-tighter text-black dark:text-white leading-[0.8]">
                                Stay<br />Ahead<span className="text-red-600">.</span>
                            </h2>
                        </div>

                        {/* Structural Separator */}
                        <div className="hidden md:block w-px h-40 bg-black/10 dark:bg-white/10" />

                        <div className="flex-1 w-full max-w-2xl">
                            <p className="text-gray-500 dark:text-gray-400 font-medium text-lg mb-12 max-w-md">
                                Join the inner circle. Receive early access to drops, exclusive archives, and private events.
                            </p>
                            
                            <form className="relative">
                                <div className="flex flex-col md:flex-row items-end gap-8">
                                    <div className="flex-1 w-full relative">
                                        <input
                                            type="email"
                                            placeholder="Your Email Address"
                                            className="w-full bg-transparent border-b-2 border-black/10 dark:border-white/10 py-4 text-xl outline-none focus:border-red-600 transition-colors duration-500 text-black dark:text-white placeholder:text-black/20 dark:placeholder:text-white/20 uppercase tracking-widest font-black text-sm"
                                        />
                                        <motion.div 
                                            className="absolute bottom-0 left-0 h-[2px] bg-red-600"
                                            initial={{ width: 0 }}
                                            whileFocus={{ width: "100%" }}
                                        />
                                    </div>
                                    
                                    <button className="group relative px-12 py-4 bg-black dark:bg-white text-white dark:text-black font-black uppercase tracking-widest text-xs overflow-hidden transition-all duration-300">
                                        <span className="relative z-10">Join Now</span>
                                        {/* Shimmer Sweep Animation */}
                                        <motion.div 
                                            animate={{ x: ["-100%", "200%"] }}
                                            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
                                        />
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
