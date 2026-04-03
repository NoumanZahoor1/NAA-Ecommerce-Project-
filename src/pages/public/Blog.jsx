import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaCalendarAlt, FaSearch, FaBolt, FaFilter } from 'react-icons/fa';

const Blog = () => {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const categories = ['All', 'Editorial', 'Sustainable', 'Styling', 'Trends', 'Techwear', 'Minimalism'];

    const posts = [
        {
            id: 1,
            title: "Winter Fashion Trends 2025",
            category: "Trends",
            excerpt: "Discover the hottest winter fashion trends that will keep you stylish and warm this season, from oversized puffer coats to technical knitwear.",
            image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80",
            date: "Nov 20, 2025",
            author: "Sarah Johnson",
            featured: true,
            trending: true
        },
        {
            id: 2,
            title: "Sustainable Fashion: A Guide",
            category: "Sustainable",
            excerpt: "Learn how to build a sustainable wardrobe without compromising on style. We explore mushroom leather and recycled textiles.",
            image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=800&q=80",
            date: "Nov 18, 2025",
            author: "Mike Chen"
        },
        {
            id: 3,
            title: "How to Style Accessories",
            category: "Styling",
            excerpt: "Master the art of accessorizing with our expert tips and tricks to elevate any outfit from basic to editorial.",
            image: "https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?auto=format&fit=crop&w=800&q=80",
            date: "Nov 15, 2025",
            author: "Emma Davis"
        },
        {
            id: 4,
            title: "The Rise of Techwear",
            category: "Techwear",
            excerpt: "Exploring the intersection of high-performance utility and urban aesthetics in the modern metropolis.",
            image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80",
            date: "Nov 12, 2025",
            author: "Alex Rivera",
            trending: true
        },
        {
            id: 5,
            title: "Artisanal Denim Craft",
            category: "Editorial",
            excerpt: "A deep dive into the world of Japanese selvedge denim and the artisans keeping traditional weaving alive.",
            image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80",
            date: "Nov 10, 2025",
            author: "Yuki Tanaka"
        },
        {
            id: 6,
            title: "Minimalism in 2025",
            category: "Minimalism",
            excerpt: "Why the 'Quiet Luxury' movement is evolving into something more structural and expressive this year.",
            image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=800&q=80",
            date: "Nov 08, 2025",
            author: "James Wilson"
        },
        {
            id: 7,
            title: "Futurist Footwear Design",
            category: "Techwear",
            excerpt: "3D printed midsoles and bio-based materials: the future of what we wear on our feet.",
            image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80",
            date: "Nov 05, 2025",
            author: "Sia Varma"
        },
        {
            id: 8,
            title: "The Color of the Year",
            category: "Trends",
            excerpt: "How 'Liquid Obsidian' is taking over the runways from Paris to Tokyo.",
            image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80",
            date: "Nov 02, 2025",
            author: "Marcus Aurelius"
        },
        {
            id: 9,
            title: "Sustainable Dyeing Methods",
            category: "Sustainable",
            excerpt: "How bacteria and algae are being used to create vibrant, eco-friendly pigments for haute couture.",
            image: "https://images.unsplash.com/photo-1591085686350-798c0f9faa7f?auto=format&fit=crop&w=800&q=80",
            date: "Oct 30, 2025",
            author: "Dr. Elena Rossi"
        }
    ];

    const filteredPosts = selectedCategory === 'All'
        ? posts
        : posts.filter(post => post.category === selectedCategory);

    const featuredPost = posts.find(p => p.featured);

    return (
        <div ref={containerRef} className="min-h-screen bg-white dark:bg-gray-950 pt-32 pb-20 selection:bg-indigo-600 selection:text-white">
            <div className="max-w-7xl mx-auto px-6 lg:px-12">

                {/* Dynamic Header Section */}
                <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-20 gap-10">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <span className="w-12 h-[1px] bg-indigo-600" />
                            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-indigo-600">Established 2025</span>
                        </div>
                        <h1 className="text-7xl md:text-9xl font-black uppercase italic tracking-tighter leading-none dark:text-white">
                            NAA <br />
                            <span className="relative inline-block mt-2">
                                <span className="text-transparent stroke-text pr-4 opacity-20 dark:opacity-10">JOURNAL</span>
                                <motion.span
                                    initial={{ width: 0 }}
                                    whileInView={{ width: '100%' }}
                                    transition={{ duration: 1, ease: "circOut" }}
                                    className="absolute left-0 bottom-4 h-2 bg-indigo-600/30 -z-10"
                                />
                            </span>
                        </h1>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="max-w-md lg:text-right"
                    >
                        <p className="text-gray-400 text-sm font-bold leading-relaxed uppercase tracking-wider mb-6">
                            A curated repository of aesthetic evolution, technical breakthroughs, and the slow-fashion movement.
                        </p>
                        <div className="flex lg:justify-end gap-10">
                            <div>
                                <div className="text-2xl font-black dark:text-white italic">09</div>
                                <div className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Articles</div>
                            </div>
                            <div>
                                <div className="text-2xl font-black dark:text-white italic">04</div>
                                <div className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Sectors</div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Categories & Search - Floating Bar Design */}
                <div className="sticky top-24 z-40 mb-20">
                    <div className="bg-white/80 dark:bg-gray-950/80 backdrop-blur-2xl px-6 py-4 rounded-3xl lg:rounded-full border border-gray-100 dark:border-gray-900 shadow-sm flex flex-col md:flex-row gap-6 justify-between items-center transition-all">
                        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar w-full md:w-auto">
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`whitespace-nowrap px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${selectedCategory === cat
                                        ? 'bg-black text-white dark:bg-white dark:text-black shadow-lg shadow-indigo-500/10'
                                        : 'text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-900'
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                        <div className="relative w-full md:w-72">
                            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={10} />
                            <input
                                type="text"
                                placeholder="SEARCH ARCHIVES..."
                                className="w-full bg-gray-50/50 dark:bg-gray-900/50 border border-transparent rounded-full pl-10 pr-6 py-2.5 text-[9px] font-black tracking-[0.2em] outline-none focus:border-indigo-600/30 transition-all dark:text-white placeholder:text-gray-500 uppercase"
                            />
                        </div>
                    </div>
                </div>

                {/* Featured Post - Cinematic Hero */}
                {selectedCategory === 'All' && featuredPost && (
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="mb-32 relative group"
                    >
                        <Link to={`/blog/${featuredPost.id}`} className="block relative h-[70vh] min-h-[500px] overflow-hidden rounded-[3rem] lg:rounded-[4rem] bg-gray-900">
                            <motion.img
                                src={featuredPost.image}
                                alt={featuredPost.title}
                                className="w-full h-full object-cover opacity-70 transition-all duration-[3000ms] group-hover:scale-110 group-hover:rotate-1"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/20 to-transparent" />

                            <div className="absolute top-10 right-10 flex gap-4">
                                <span className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-[9px] font-black text-white uppercase tracking-widest border border-white/10">
                                    Editorial Pick
                                </span>
                            </div>

                            <div className="absolute bottom-0 left-0 p-10 lg:p-20 w-full">
                                <div className="max-w-4xl space-y-8">
                                    <div className="flex items-center gap-4 text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em]">
                                        <span>{featuredPost.date}</span>
                                        <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse" />
                                        <span>{featuredPost.author}</span>
                                    </div>
                                    <h2 className="text-5xl lg:text-8xl font-black text-white uppercase italic tracking-tighter leading-[0.85] group-hover:translate-x-4 transition-transform duration-700">
                                        {featuredPost.title}
                                    </h2>
                                    <p className="text-white/60 text-lg lg:text-xl font-medium max-w-2xl leading-relaxed">
                                        {featuredPost.excerpt}
                                    </p>
                                    <div className="pt-6">
                                        <div className="inline-flex items-center gap-6 px-10 py-5 bg-white text-black rounded-full text-[11px] font-black uppercase tracking-[0.3em] hover:bg-indigo-600 hover:text-white transition-all cursor-pointer group/btn">
                                            Read Full Article
                                            <FaArrowRight className="group-hover/btn:translate-x-2 transition-transform" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                )}

                {/* Grid Header */}
                <div className="flex items-center gap-6 mb-16">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.8em] text-gray-400">Latest Briefings</h3>
                    <div className="flex-1 h-[1px] bg-gray-100 dark:bg-gray-900" />
                    <FaFilter className="text-gray-300" size={12} />
                </div>

                {/* Posts Grid - Asymmetric Rhythm */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-24 gap-x-12 lg:gap-x-20">
                    <AnimatePresence mode="popLayout">
                        {filteredPosts.filter(p => selectedCategory !== 'All' || !p.featured).map((post, index) => (
                            <motion.article
                                layout
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.6, delay: (index % 3) * 0.1 }}
                                key={post.id}
                                className="group flex flex-col h-full"
                            >
                                <Link to={`/blog/${post.id}`} className="block flex-1">
                                    <div className="relative aspect-[3/4] overflow-hidden rounded-[2.5rem] bg-gray-100 dark:bg-gray-900 mb-10 shadow-sm group-hover:shadow-2xl group-hover:shadow-indigo-500/5 transition-all duration-700">
                                        <img
                                            src={post.image}
                                            alt={post.title}
                                            className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110 grayscale group-hover:grayscale-0"
                                        />

                                        {/* Overlay Indicators */}
                                        <div className="absolute top-6 left-6 flex flex-col gap-2">
                                            <span className="px-3 py-1 bg-white/95 dark:bg-black/95 backdrop-blur-md text-black dark:text-white text-[9px] font-black uppercase tracking-widest border border-gray-100 dark:border-gray-800">
                                                {post.category}
                                            </span>
                                            {post.trending && (
                                                <span className="flex items-center gap-1.5 px-3 py-1 bg-indigo-600 text-white text-[9px] font-black uppercase tracking-widest shadow-lg shadow-indigo-600/20">
                                                    <FaBolt size={8} className="animate-pulse" /> Trending
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-6 flex flex-col h-full">
                                        <div className="flex items-center gap-4 text-[9px] font-black text-gray-400 uppercase tracking-[0.3em]">
                                            <span>{post.date}</span>
                                            <span className="w-1 h-1 bg-indigo-600/30 rounded-full" />
                                            <span>{post.author}</span>
                                        </div>

                                        <h3 className="text-3xl lg:text-4xl font-black dark:text-white uppercase italic tracking-tighter leading-[0.9] group-hover:text-indigo-600 transition-colors">
                                            {post.title}
                                        </h3>

                                        <p className="text-gray-500 dark:text-gray-400 text-sm font-medium leading-relaxed line-clamp-3">
                                            {post.excerpt}
                                        </p>

                                        <div className="mt-auto pt-6 flex items-center justify-between border-t border-gray-50 dark:border-gray-900 group-hover:border-indigo-600/20 transition-colors">
                                            <span className="text-[10px] font-black uppercase tracking-[0.4em] dark:text-white group-hover:translate-x-2 transition-transform">
                                                Discover
                                            </span>
                                            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-50 dark:bg-gray-900 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                                <FaArrowRight size={10} />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.article>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Newsletter Section - High Impact */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    className="mt-40 bg-gray-950 dark:bg-white rounded-[3rem] lg:rounded-[5rem] p-12 lg:p-24 overflow-hidden relative"
                >
                    {/* Abstract background elements */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/20 blur-[100px] rounded-full" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-400/10 blur-[80px] rounded-full" />

                    <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-16">
                        <div className="max-w-2xl text-center lg:text-left">
                            <h2 className="text-5xl lg:text-7xl font-black text-white dark:text-black uppercase italic tracking-tighter leading-none mb-8">
                                Stay Inside <br />
                                <span className="opacity-30">The Void</span>
                            </h2>
                            <p className="text-gray-400 dark:text-gray-500 text-lg font-medium leading-relaxed uppercase tracking-wider mb-0">
                                Join 50,000+ fashion futurists receiving our weekly briefings on artisanal craftsmanship and technical aesthetics.
                            </p>
                        </div>

                        <div className="w-full max-w-md">
                            <div className="flex flex-col gap-4">
                                <input
                                    type="email"
                                    placeholder="Enter your transmission address"
                                    className="w-full bg-white/5 dark:bg-black/5 border border-white/10 dark:border-black/10 px-8 py-6 rounded-full text-white dark:text-black text-xs font-black uppercase tracking-[0.2em] focus:ring-2 focus:ring-indigo-600 outline-none transition-all"
                                />
                                <button className="w-full bg-white dark:bg-black text-black dark:text-white px-8 py-6 rounded-full text-[11px] font-black uppercase tracking-[0.5em] hover:bg-indigo-600 hover:text-white transition-all shadow-xl shadow-white/5">
                                    Initiate Connection
                                </button>
                            </div>
                            <p className="mt-6 text-[9px] text-gray-500 text-center uppercase tracking-widest">
                                By subscribing you agree to our Terms of Discovery
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Pagination Style Footer */}
            <div className="mt-20 flex justify-center items-center gap-10 opacity-30 group">
                <span className="text-[10px] font-black uppercase tracking-widest dark:text-white">Start</span>
                <div className="w-32 h-[1px] bg-gray-200 dark:bg-gray-800 relative overflow-hidden">
                    <motion.div
                        style={{ x: '-100%' }}
                        animate={{ x: '100%' }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 bg-indigo-600"
                    />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest dark:text-white">End of Feed</span>
            </div>
        </div>
    );
};

export default Blog;
