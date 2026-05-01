import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaArrowLeft } from 'react-icons/fa';

const slides = [
    {
        id: 1,
        image: '/three.png',
        title: 'NAA Era',
        subtitle: 'The New Standard in Luxury',
        cta: 'Shop Collection',
        link: '/shop'
    },
    {
        id: 2,
        image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1920&q=80',
        title: 'Modern Classic',
        subtitle: 'Timeless Pieces for Every Occasion',
        cta: 'Explore Men',
        link: '/shop?category=Men'
    },
    {
        id: 3,
        image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1920&q=80',
        title: 'Pure Elegance',
        subtitle: 'Redefining Feminine Silhouette',
        cta: 'Explore Women',
        link: '/shop?category=Women'
    }
];

// Typewriter hook
const useTypewriter = (text, speed = 80) => {
    const [displayed, setDisplayed] = useState('');
    const [done, setDone] = useState(false);
    const indexRef = useRef(0);

    useEffect(() => {
        setDisplayed('');
        setDone(false);
        indexRef.current = 0;
        const interval = setInterval(() => {
            if (indexRef.current < text.length) {
                setDisplayed(text.slice(0, indexRef.current + 1));
                indexRef.current += 1;
            } else {
                setDone(true);
                clearInterval(interval);
            }
        }, speed);
        return () => clearInterval(interval);
    }, [text, speed]);

    return { displayed, done };
};

// TypewriterTitle component
const TypewriterTitle = ({ title }) => {
    const { displayed, done } = useTypewriter(title, 120);
    return (
        <h1 className="text-4xl sm:text-6xl md:text-[8.5rem] font-black mb-10 leading-[0.9] tracking-tighter uppercase drop-shadow-2xl">
            {displayed}
            <span className={`typewriter-cursor${done ? ' done' : ''}`}
                style={{ height: '0.8em', width: '0.06em', display: 'inline-block' }} />
        </h1>
    );
};

const HeroSlider = () => {
    const [current, setCurrent] = useState(0);
    const [direction, setDirection] = useState(0);

    // Mouse Parallax Values
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
    const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

    const nextSlide = useCallback(() => {
        setDirection(1);
        setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, []);

    const prevSlide = useCallback(() => {
        setDirection(-1);
        setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    }, []);

    const handleMouseMove = (e) => {
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;
        const x = (clientX - innerWidth / 2) / 40; // max shift 25px
        const y = (clientY - innerHeight / 2) / 40;
        mouseX.set(x);
        mouseY.set(y);
    };

    useEffect(() => {
        const timer = setInterval(() => {
            nextSlide();
        }, 8000);
        return () => clearInterval(timer);
    }, [nextSlide]);

    const slideVariants = {
        enter: (direction) => ({
            x: direction > 0 ? '100%' : '-100%',
            opacity: 0,
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1,
            transition: {
                x: { type: "spring", stiffness: 100, damping: 20 },
                opacity: { duration: 0.8 }
            }
        },
        exit: (direction) => ({
            zIndex: 0,
            x: direction < 0 ? '100%' : '-100%',
            opacity: 0,
            transition: {
                x: { type: "spring", stiffness: 100, damping: 20 },
                opacity: { duration: 0.8 }
            }
        })
    };

    const kenBurnsVariants = {
        initial: { scale: 1 },
        animate: {
            scale: 1.15,
            transition: { duration: 8, ease: "linear" }
        }
    };

    const containerVariants = {
        visible: {
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.5
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
        }
    };

    return (
        <div onMouseMove={handleMouseMove} className="relative h-screen w-full overflow-hidden bg-black">
            <AnimatePresence initial={false} custom={direction}>
                <motion.div
                    key={current}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="absolute inset-0"
                >
                    {/* Darker Overlay for better readability */}
                    <div className="absolute inset-0 bg-black/45 z-10" />

                    {/* Parallax Image Container */}
                    <motion.div
                        style={{ x: springX, y: springY }}
                        className="absolute -inset-10"
                    >
                        <motion.img
                            variants={kenBurnsVariants}
                            initial="initial"
                            animate="animate"
                            src={slides[current].image}
                            onLoad={() => console.log('Image Loaded:', slides[current].image)}
                            onError={() => console.error('Image Failed to Load:', slides[current].image)}
                            alt={slides[current].title}
                            className="w-full h-full object-cover origin-center"
                        />
                    </motion.div>

                    <div className="absolute inset-0 flex items-center justify-center z-20">
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="text-center text-white px-4 max-w-5xl"
                        >
                            <motion.div variants={itemVariants} className="overflow-hidden mb-6">
                                <span className="text-xl md:text-2xl font-medium tracking-[0.6em] uppercase text-white/95 block drop-shadow-xl">
                                    {slides[current].subtitle}
                                </span>
                            </motion.div>

                            <TypewriterTitle key={current} title={slides[current].title} />

                            <motion.div variants={itemVariants} className="flex justify-center flex-wrap gap-8 pt-4">
                                {/* Premium Liquid Fill Button */}
                                <Link
                                    to={slides[current].link}
                                    className="group relative px-10 md:px-16 py-4 md:py-6 bg-white text-black text-[10px] md:text-sm font-black uppercase tracking-[0.2em] overflow-hidden transition-all duration-500 hover:scale-105 active:scale-95"
                                >
                                    <span className="relative z-10 transition-colors duration-500 group-hover:text-white">
                                        {slides[current].cta}
                                    </span>
                                    <div className="absolute inset-x-0 bottom-0 top-0 bg-black -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-[0.16,1,0.3,1]" />
                                </Link>

                                <Link
                                    to="/shop"
                                    className="group relative px-10 md:px-16 py-4 md:py-6 border border-white/30 text-white text-[10px] md:text-sm font-black uppercase tracking-[0.2em] overflow-hidden transition-all duration-500 hover:scale-105 active:scale-95"
                                >
                                    <span className="relative z-10 transition-colors duration-500 group-hover:text-black">
                                        New Arrivals
                                    </span>
                                    <div className="absolute inset-x-0 bottom-0 top-0 bg-white translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-[0.16,1,0.3,1]" />
                                </Link>
                            </motion.div>
                        </motion.div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Navigation Controls */}
            <div className="absolute left-6 md:left-12 bottom-8 md:bottom-12 z-30">
                <button
                    onClick={prevSlide}
                    className="group w-12 md:w-14 h-12 md:h-14 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all duration-500"
                >
                    <FaArrowLeft className="text-xs md:text-sm group-hover:-translate-x-1 transition-transform" />
                </button>
            </div>
            <div className="absolute right-20 md:right-28 bottom-8 md:bottom-12 z-30">
                <button
                    onClick={nextSlide}
                    className="group w-12 md:w-14 h-12 md:h-14 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all duration-500"
                >
                    <FaArrowRight className="text-xs md:text-sm group-hover:translate-x-1 transition-transform" />
                </button>
            </div>

            {/* Right-Rails Progress */}
            <div className="absolute right-8 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-8">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => {
                            setDirection(index > current ? 1 : -1);
                            setCurrent(index);
                        }}
                        className="relative group p-2 flex items-center justify-center"
                    >
                        <div className={`w-[2px] h-12 transition-all duration-500 ${index === current ? 'bg-red-600 h-20' : 'bg-white/20 hover:bg-white/40'}`} />
                        {index === current && (
                            <motion.div
                                layoutId="hero-nav"
                                className="absolute inset-0 border border-white/10 rounded-none pointer-events-none"
                            />
                        )}
                    </button>
                ))}
            </div>

            <style>{`
                @keyframes blink {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0; }
                }
                .typewriter-cursor {
                    display: inline-block;
                    width: 0.05em;
                    background: white;
                    margin-left: 0.05em;
                    animation: blink 0.75s step-end infinite;
                    vertical-align: middle;
                }
                .typewriter-cursor.done {
                    animation: none;
                    opacity: 0;
                }
            `}</style>
        </div>
    );
};

export default HeroSlider;

