import { Link } from 'react-router-dom';
import { FaInstagram, FaTwitter, FaFacebookF, FaArrowRight, FaYoutube } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const footerLinks = {
        shop: [
            { name: 'New Arrivals', path: '/shop?category=new' },
            { name: 'Men', path: '/shop?category=Men' },
            { name: 'Women', path: '/shop?category=Women' },
            { name: 'Accessories', path: '/shop?category=Accessories' },
            { name: 'The Archive', path: '/shop?category=archive' },
        ],
        support: [
            { name: 'Contact Us', path: '/support/contact' },
            { name: 'Shipping & Returns', path: '/support/shipping' },
            { name: 'Size Guide', path: '/support/size-guide' },
            { name: 'FAQ', path: '/support/faqs' },
        ],
        company: [
            { name: 'About NAA', path: '/support/about' },
            { name: 'Sustainability', path: '/support/sustainability' },
            { name: 'Careers', path: '/support/careers' },
            { name: 'Press', path: '/support/press' },
        ]
    };

    return (
        <footer className="bg-white dark:bg-black text-black dark:text-white pt-24 pb-12 overflow-hidden relative transition-colors duration-500">
            {/* Background Texture */}
            <div className="absolute inset-0 opacity-[0.03] dark:opacity-10 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>

            <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
                {/* Top Section: Newsletter & Brand */}
                <div className="flex flex-col lg:flex-row justify-between items-start mb-24 gap-16 lg:gap-0">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="max-w-xl"
                    >
                        <h2 className="text-4xl lg:text-5xl font-black uppercase tracking-tighter mb-6 italic text-gray-900 dark:text-white">
                            Join the movement
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md font-bold leading-relaxed">
                            Sign up for exclusive access to new drops, archive sales, and community events.
                        </p>
                        <form className="flex w-full border-b-2 border-black dark:border-white/20 hover:border-black dark:hover:border-white transition-colors duration-500 pb-2">
                            <input
                                type="email"
                                placeholder="ENTER YOUR EMAIL"
                                className="w-full bg-transparent border-none focus:ring-0 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-600 text-sm font-black tracking-[0.2em] uppercase px-0 py-4"
                            />
                            <button type="button" className="text-black dark:text-white hover:opacity-70 transition-opacity">
                                <FaArrowRight size={20} />
                            </button>
                        </form>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1 }}
                        className="hidden lg:block"
                    >
                        <h1 className="text-[120px] leading-none font-black tracking-tighter text-gray-200 dark:text-white/10 select-none transition-colors duration-500">
                            NAA
                        </h1>
                    </motion.div>
                </div>

                {/* Divider */}
                <motion.div
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, ease: "circOut" }}
                    className="h-1 w-full bg-black dark:bg-white/10 mb-20 origin-left"
                />

                {/* Links Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-24">
                    {/* Columns */}
                    {Object.entries(footerLinks).map(([title, links], idx) => (
                        <motion.div
                            key={title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1, duration: 0.8 }}
                        >
                            <h3 className="text-xs font-black uppercase tracking-[0.4em] text-gray-900 dark:text-gray-500 mb-8">{title}</h3>
                            <ul className="space-y-4">
                                {links.map((link) => (
                                    <li key={link.name}>
                                        <Link
                                            to={link.path}
                                            className="text-base font-bold text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white hover:translate-x-2 transition-all duration-300 inline-block"
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}

                    {/* Social Column */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                    >
                        <h3 className="text-xs font-black uppercase tracking-[0.4em] text-gray-900 dark:text-gray-500 mb-8">Follow</h3>
                        <div className="flex flex-wrap gap-4">
                            {[FaInstagram, FaTwitter, FaFacebookF, FaYoutube].map((Icon, i) => (
                                <a
                                    key={i}
                                    href="#"
                                    className="w-12 h-12 rounded-full border-2 border-black/10 dark:border-white/10 flex items-center justify-center text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black hover:border-transparent transition-all duration-500 shadow-sm"
                                >
                                    <Icon size={18} />
                                </a>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Bottom Bar */}
                <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-black/5 dark:border-white/5 text-[11px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-600">
                    <p>© {currentYear} NAA Studios. All Rights Reserved.</p>
                    <div className="flex gap-8 mt-4 md:mt-0">
                        <Link to="/support/privacy" className="hover:text-black dark:hover:text-white transition-colors">Privacy Policy</Link>
                        <Link to="/support/terms" className="hover:text-black dark:hover:text-white transition-colors">Terms of Use</Link>
                        <span className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            Systems Normal
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
