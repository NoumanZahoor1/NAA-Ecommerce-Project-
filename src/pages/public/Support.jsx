import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Support = () => {
    const location = useLocation();
    const type = location.pathname.split('/').pop();

    const content = {
        'contact': {
            title: 'Contact Us',
            body: (
                <div className="space-y-8">
                    <p className="text-xl font-medium leading-relaxed">We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="p-8 bg-black/5 dark:bg-white/5 rounded-2xl border border-black/5 dark:border-white/5">
                            <p className="text-sm font-black uppercase tracking-widest text-black/40 dark:text-white/40 mb-2">Email</p>
                            <p className="text-xl font-bold">nomijatoi456@gmail.com</p>
                        </div>
                        <div className="p-8 bg-black/5 dark:bg-white/5 rounded-2xl border border-black/5 dark:border-white/5">
                            <p className="text-sm font-black uppercase tracking-widest text-black/40 dark:text-white/40 mb-2">Phone</p>
                            <p className="text-xl font-bold">+92 3177543733</p>
                        </div>
                        <div className="p-8 bg-black/5 dark:bg-white/5 rounded-2xl border border-black/5 dark:border-white/5 md:col-span-2">
                            <p className="text-sm font-black uppercase tracking-widest text-black/40 dark:text-white/40 mb-2">Office</p>
                            <p className="text-xl font-bold">Sahiwal, Pakistan</p>
                        </div>
                    </div>
                </div>
            )
        },
        'faqs': {
            title: 'FAQs',
            body: (
                <div className="space-y-6">
                    {[
                        { q: 'What is your return policy?', a: 'We accept returns within 30 days of purchase.' },
                        { q: 'Do you ship internationally?', a: 'Yes, we ship to over 50 countries worldwide.' },
                        { q: 'How do I track my order?', a: 'You will receive a tracking link via email once your order ships.' }
                    ].map((item, i) => (
                        <div key={i} className="group border-b border-black/10 dark:border-white/10 pb-6 transition-all duration-300">
                            <h3 className="font-black uppercase tracking-tight text-xl mb-3 group-hover:text-black/60 dark:group-hover:text-white/60 transition-colors">{item.q}</h3>
                            <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed font-medium">{item.a}</p>
                        </div>
                    ))}
                </div>
            )
        },
        'shipping': {
            title: 'Shipping & Returns',
            body: (
                <div className="space-y-12">
                    <div className="space-y-4">
                        <h3 className="text-2xl font-black uppercase tracking-tighter italic font-serif">Shipping</h3>
                        <p className="text-lg leading-relaxed text-gray-600 dark:text-gray-400 font-medium">Standard shipping takes 3-5 business days. Express shipping takes 1-2 business days. All orders are tracked and insured.</p>
                    </div>
                    <div className="space-y-4 pt-8 border-t border-black/10 dark:border-white/10">
                        <h3 className="text-2xl font-black uppercase tracking-tighter italic font-serif">Returns</h3>
                        <p className="text-lg leading-relaxed text-gray-600 dark:text-gray-400 font-medium">Items must be unworn and in original packaging with tags. Return shipping is free for orders over $100. We offer full refunds within 30 days.</p>
                    </div>
                </div>
            )
        },
        'privacy': {
            title: 'Privacy Policy',
            body: <p className="text-xl leading-relaxed font-medium">Your privacy is fundamental to our relationship. We enforce strict data protection protocols and do not sell your personal information to third parties.</p>
        },
        'terms': {
            title: 'Terms of Service',
            body: <p className="text-xl leading-relaxed font-medium">By accessing the NAA studio website, you agree to follow our standards of usage and conduct as outlined in our legal framework.</p>
        },
        'size-guide': {
            title: 'Size Guide',
            body: (
                <div className="space-y-8">
                    <p className="text-xl font-medium">Our sizing is true to size, designed for a modern tailored fit.</p>
                    <div className="overflow-hidden rounded-2xl border border-black/10 dark:border-white/10">
                        <table className="min-w-full text-sm">
                            <thead className="bg-black/5 dark:bg-white/5">
                                <tr className="border-b border-black/10 dark:border-white/10">
                                    <th className="py-4 px-6 text-left font-black uppercase tracking-widest text-xs">Size</th>
                                    <th className="py-4 px-6 text-left font-black uppercase tracking-widest text-xs">Chest</th>
                                    <th className="py-4 px-6 text-left font-black uppercase tracking-widest text-xs">Length</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[
                                    { s: 'S', c: '20"', l: '27"' },
                                    { s: 'M', c: '22"', l: '28"' },
                                    { s: 'L', c: '24"', l: '29"' },
                                    { s: 'XL', c: '26"', l: '30"' }
                                ].map((row, i) => (
                                    <tr key={i} className="border-b border-black/5 dark:border-white/5 last:border-0 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors">
                                        <td className="py-4 px-6 font-bold">{row.s}</td>
                                        <td className="py-4 px-6 text-gray-600 dark:text-gray-400">{row.c}</td>
                                        <td className="py-4 px-6 text-gray-600 dark:text-gray-400">{row.l}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )
        },
        'about': {
            title: 'About NAA',
            body: (
                <div className="space-y-12">
                    <p className="text-3xl md:text-5xl font-serif italic text-black dark:text-white leading-tight font-medium">
                        "NAA is a design studio focused on the intersection of modern utility and timeless aesthetics."
                    </p>
                    <div className="space-y-6 pt-12 border-t border-black/10 dark:border-white/10">
                        <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
                            Founded in 2024, we strive to create garments that serve as the uniform for the contemporary creative class.
                        </p>
                        <p className="text-lg text-gray-500 dark:text-gray-500 leading-relaxed font-medium">
                            Our philosophy is rooted in minimalism and functionality. Every collection is an exploration of form, material, and the way clothing interacts with the human experience.
                        </p>
                    </div>
                </div>
            )
        },
        'sustainability': {
            title: 'Sustainability',
            body: (
                <div className="space-y-6">
                    <p className="text-2xl font-serif italic leading-relaxed">We are committed to the future.</p>
                    <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
                        Our materials are exclusively sourced from sustainable mills in Japan and Italy, focusing on organic fibers and recycled high-performance textiles.
                    </p>
                </div>
            )
        }
    };

    const pageData = content[type] || content['contact'];

    return (
        <div className="relative min-h-screen bg-white dark:bg-black text-black dark:text-white transition-colors duration-500 overflow-hidden">
            {/* Large Background Watermark */}
            <div className="fixed inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] dark:opacity-[0.02] z-0">
                <span className="text-[30vw] font-black uppercase tracking-tighter leading-none select-none">
                    NAA
                </span>
            </div>

            <main className="relative z-10 max-w-4xl mx-auto px-6 py-32 md:py-48">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={type}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <header className="mb-20">
                            <motion.div
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: 1 }}
                                transition={{ duration: 1, delay: 0.2 }}
                                className="h-px bg-black dark:bg-white mb-8 origin-left opacity-20"
                            />
                            <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-none">
                                {pageData.title}
                            </h1>
                        </header>

                        <div className="prose dark:prose-invert max-w-none">
                            {pageData.body}
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Bottom Navigation */}
                <footer className="mt-40 pt-12 border-t border-black/10 dark:border-white/10">
                    <div className="flex flex-wrap gap-8">
                        {['about', 'contact', 'shipping', 'faqs'].map((link) => (
                            <Link 
                                key={link} 
                                to={`/support/${link}`}
                                className={`text-sm uppercase font-black tracking-widest transition-all duration-300 hover:text-black dark:hover:text-white ${type === link ? 'text-black dark:text-white' : 'text-gray-400'}`}
                            >
                                {link}
                            </Link>
                        ))}
                    </div>
                </footer>
            </main>
        </div>
    );
};

export default Support;

