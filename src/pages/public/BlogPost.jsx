import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';
import { FaCalendarAlt, FaUser, FaArrowLeft, FaShareAlt, FaBookmark, FaQuoteRight, FaChevronLeft, FaChevronRight, FaClock } from 'react-icons/fa';

const BlogPost = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
        window.scrollTo(0, 0);
    }, [id]);

    // Mock Database
    const posts = [
        {
            id: "1",
            title: "Winter Fashion Trends 2025",
            category: "Trends",
            readTime: "8 min read",
            author: {
                name: "Sarah Johnson",
                role: "Editorial Lead",
                avatar: "https://i.pravatar.cc/150?u=sarah"
            },
            date: "Nov 20, 2025",
            image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=80",
            content: `
                <p class="text-xl md:text-2xl leading-relaxed mb-12 font-medium italic text-gray-800 dark:text-gray-200 border-l-4 border-indigo-600 pl-8">
                    As the climate patterns shift, our approach to winter dressing transcends mere warmth. In 2025, we witness a convergence of extreme utility and avant-garde silhouettes.
                </p>
                
                <h2 class="text-3xl md:text-5xl font-black uppercase italic tracking-tighter mb-8 mt-16 dark:text-white leading-none">The Architectural Puffer</h2>
                <p class="mb-8 text-lg leading-relaxed text-gray-600 dark:text-gray-400">
                    The traditional puffer jacket has been reimagined as a structural masterpiece. Designers are moving away from the uniform 'michelin' look toward asymmetric quilting and exaggerated volume. It's no longer just about insulation; it's about defining the space around the wearer.
                </p>

                <div class="my-16 grid grid-cols-1 md:grid-cols-2 gap-8 font-black uppercase tracking-widest text-[10px]">
                    <div class="p-8 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
                        <span class="text-indigo-600 block mb-2">Trend 01</span>
                        <h4 class="text-xl italic mb-4">Structural Volume</h4>
                        <p class="text-gray-400 normal-case tracking-normal">Exaggerated collars and drop shoulders define the new silhouette.</p>
                    </div>
                    <div class="p-8 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
                        <span class="text-indigo-600 block mb-2">Trend 02</span>
                        <h4 class="text-xl italic mb-4">Tactile Fusion</h4>
                        <p class="text-gray-400 normal-case tracking-normal">Mixing technical nylons with hand-woven wool for a sensory experience.</p>
                    </div>
                </div>

                <blockquote class="my-16 relative py-12 px-12 lg:px-20 text-center">
                    <FaQuoteRight class="absolute top-0 left-1/2 -translate-x-1/2 text-indigo-600 opacity-20 text-6xl" />
                    <p class="text-2xl md:text-4xl font-black italic uppercase tracking-tighter dark:text-white leading-tight">
                        "The modern winter palette is no longer restricted to neutrals. We are seeing a surge in 'Liquid obsidian' textures."
                    </p>
                </blockquote>

                <h2 class="text-3xl md:text-5xl font-black uppercase italic tracking-tighter mb-8 mt-16 dark:text-white leading-none">The Rise of Bio-Knits</h2>
                <p class="mb-8 text-lg leading-relaxed text-gray-600 dark:text-gray-400">
                    Sustainability has moved from a buzzword to a fundamental design constraint. 2025's best-performing knits aren't just recycled; they're bio-engineered. Proteins and plant-based fibers are creating textures that are softer than cashmere yet more durable than synthetic blends.
                </p>
            `,
            nextId: "2",
            prevId: "9"
        },
        {
            id: "2",
            title: "Sustainable Fashion: A Guide",
            category: "Sustainable",
            readTime: "12 min read",
            author: {
                name: "Mike Chen",
                role: "Innovation Strategist",
                avatar: "https://i.pravatar.cc/150?u=mike"
            },
            date: "Nov 18, 2025",
            image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=1600&q=80",
            content: `<p class="text-xl leading-relaxed mb-8">Full guide to sustainable fashion coming soon...</p>`,
            nextId: "3",
            prevId: "1"
        },
        {
            id: "3",
            title: "How to Style Accessories",
            category: "Styling",
            readTime: "6 min read",
            author: {
                name: "Emma Davis",
                role: "Styling Director",
                avatar: "https://i.pravatar.cc/150?u=emma"
            },
            date: "Nov 15, 2025",
            image: "https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?auto=format&fit=crop&w=1600&q=80",
            content: `<p class="text-xl leading-relaxed mb-8">Styling tips coming soon...</p>`,
            nextId: "4",
            prevId: "2"
        },
        {
            id: "4",
            title: "The Rise of Techwear",
            category: "Techwear",
            readTime: "9 min read",
            author: {
                name: "Alex Rivera",
                role: "Urban Anthro",
                avatar: "https://i.pravatar.cc/150?u=alex"
            },
            date: "Nov 12, 2025",
            image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=1600&q=80",
            content: `<p class="text-xl leading-relaxed mb-8">Techwear exploration coming soon...</p>`,
            nextId: "5",
            prevId: "3"
        }
    ];

    const currentPost = posts.find(p => p.id === id) || posts[0];
    const nextPost = posts.find(p => p.id === currentPost.nextId);
    const prevPost = posts.find(p => p.id === currentPost.prevId);

    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 pt-24 pb-20 selection:bg-indigo-600 selection:text-white">
            {/* Reading Progress Bar */}
            <motion.div
                className="fixed top-24 left-0 right-0 h-1 bg-indigo-600 z-[60] origin-left"
                style={{ scaleX }}
            />

            <div className="max-w-5xl mx-auto px-6 lg:px-12">
                {/* Top Actions */}
                <div className="flex justify-between items-center py-10">
                    <Link to="/blog" className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] dark:text-white hover:text-indigo-600 transition-colors">
                        <FaArrowLeft size={10} className="group-hover:-translate-x-1 transition-transform" />
                        Archive-025
                    </Link>
                    <div className="flex gap-8">
                        <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black dark:hover:text-white transition-colors">
                            <FaBookmark size={12} /> Save
                        </button>
                        <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black dark:hover:text-white transition-colors">
                            <FaShareAlt size={12} /> Share
                        </button>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    >
                        {/* Header Section */}
                        <header className="mb-20">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="flex items-center gap-4 mb-8"
                            >
                                <span className="px-4 py-1.5 bg-black dark:bg-white text-white dark:text-black text-[9px] font-black uppercase tracking-[0.3em] rounded-full">
                                    Sector: {currentPost.category}
                                </span>
                                <span className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                    <FaClock size={10} className="text-indigo-600" /> {currentPost.readTime}
                                </span>
                            </motion.div>

                            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black uppercase italic tracking-tighter leading-[0.85] dark:text-white mb-12">
                                {currentPost.title}
                            </h1>

                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-10 py-10 border-y border-gray-100 dark:border-gray-900">
                                <div className="flex items-center gap-6">
                                    <div className="relative">
                                        <img src={currentPost.author.avatar} alt={currentPost.author.name} className="w-16 h-16 rounded-full grayscale border-2 border-white dark:border-gray-800" />
                                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-indigo-600 border-2 border-white dark:border-gray-950 rounded-full" />
                                    </div>
                                    <div>
                                        <div className="text-lg font-black dark:text-white uppercase italic tracking-tighter leading-none mb-1">{currentPost.author.name}</div>
                                        <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{currentPost.author.role}</div>
                                    </div>
                                </div>
                                <div className="flex gap-12 text-[10px] font-black uppercase tracking-[0.3em]">
                                    <div className="space-y-1">
                                        <div className="text-gray-400">Release Date</div>
                                        <div className="dark:text-white">{currentPost.date}</div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-gray-400">Status</div>
                                        <div className="text-indigo-600">Verified Article</div>
                                    </div>
                                </div>
                            </div>
                        </header>

                        {/* Immersive Hero Image */}
                        <div className="relative mb-24 group">
                            <div className="aspect-[16/9] lg:aspect-[21/9] overflow-hidden rounded-[4rem] shadow-2xl">
                                <motion.img
                                    initial={{ scale: 1.1 }}
                                    animate={{ scale: 1 }}
                                    transition={{ duration: 1.5 }}
                                    src={currentPost.image}
                                    alt={currentPost.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            {/* Organic Floating Elements */}
                            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-600/10 blur-[60px] rounded-full group-hover:bg-indigo-600/20 transition-all duration-1000" />
                        </div>

                        {/* Article Content */}
                        <div className="max-w-3xl mx-auto">
                            <article
                                className="blog-content prose prose-2xl dark:prose-invert max-w-none 
                                prose-headings:font-black prose-headings:uppercase prose-headings:italic prose-headings:tracking-tighter
                                prose-p:text-gray-600 dark:prose-p:text-gray-400 prose-p:leading-relaxed prose-p:mb-10
                                prose-strong:text-indigo-600 dark:prose-strong:text-indigo-400 font-medium"
                                dangerouslySetInnerHTML={{ __html: currentPost.content }}
                            />

                            {/* Tags Section */}
                            <div className="flex flex-wrap gap-3 mt-24 mb-32 border-t border-gray-100 dark:border-gray-900 pt-16">
                                {['#AESTHETIC', '#FUTURE', '#CRAFTSMANSHIP', '#NAA'].map(tag => (
                                    <span key={tag} className="px-5 py-2 border border-gray-100 dark:border-gray-800 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:border-indigo-600 hover:text-indigo-600 transition-all cursor-pointer">
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            {/* Article Navigation */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-gray-100 dark:bg-gray-900 border border-gray-100 dark:border-gray-900 rounded-[3rem] overflow-hidden mb-32 group">
                                {prevPost ? (
                                    <Link to={`/blog/${prevPost.id}`} className="bg-white dark:bg-gray-950 p-12 hover:bg-gray-50 dark:hover:bg-gray-900 transition-all flex flex-col justify-between group/prev">
                                        <div className="flex items-center gap-3 text-[9px] font-black text-gray-400 uppercase tracking-widest mb-10">
                                            <FaChevronLeft className="group-hover/prev:-translate-x-2 transition-transform" /> Previous Transmission
                                        </div>
                                        <div className="text-2xl font-black dark:text-white uppercase italic tracking-tighter leading-none line-clamp-2">
                                            {prevPost.title}
                                        </div>
                                    </Link>
                                ) : <div className="bg-white dark:bg-gray-950 p-12 opacity-20" />}

                                {nextPost ? (
                                    <Link to={`/blog/${nextPost.id}`} className="bg-white dark:bg-gray-950 p-12 hover:bg-gray-50 dark:hover:bg-gray-900 transition-all flex flex-col justify-between items-end text-right group/next border-l border-gray-100 dark:border-gray-900">
                                        <div className="flex items-center gap-3 text-[9px] font-black text-gray-400 uppercase tracking-widest mb-10">
                                            Next Transmission <FaChevronRight className="group-hover/next:translate-x-2 transition-transform" />
                                        </div>
                                        <div className="text-2xl font-black dark:text-white uppercase italic tracking-tighter leading-none line-clamp-2">
                                            {nextPost.title}
                                        </div>
                                    </Link>
                                ) : <div className="bg-white dark:bg-gray-950 p-12 opacity-20" />}
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Footer Newsletter - Minimalist Version */}
                <div className="bg-indigo-600 p-16 lg:p-24 rounded-[4rem] text-center text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-3xl rounded-full" />
                    <h3 className="text-4xl lg:text-6xl font-black uppercase italic tracking-tighter mb-8 leading-none">The Future <br /> Is Open-Source</h3>
                    <p className="text-white/70 text-sm font-bold uppercase tracking-[0.3em] mb-12 max-w-md mx-auto">Subscribe for early access to editorial drops and secret releases.</p>
                    <div className="flex flex-col sm:flex-row max-w-md mx-auto gap-4">
                        <input type="email" placeholder="ACCESS CODE (EMAIL)" className="flex-1 bg-white/10 border border-white/20 px-8 py-5 rounded-full text-xs font-black tracking-widest placeholder:text-white/40 focus:bg-white/20 outline-none transition-all" />
                        <button className="bg-white text-black px-10 py-5 rounded-full text-[10px] font-black uppercase tracking-[0.4em] hover:bg-black hover:text-white transition-all">Connect</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BlogPost;
