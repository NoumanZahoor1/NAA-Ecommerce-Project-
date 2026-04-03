import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaArrowLeft } from 'react-icons/fa';

const slides = [
    {
        id: 1,
        image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1920&q=80',
        title: 'Winter Era',
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

const HeroSlider = () => {
    const [current, setCurrent] = useState(0);
    const [direction, setDirection] = useState(0);

    const nextSlide = useCallback(() => {
        setDirection(1);
        setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, []);

    const prevSlide = useCallback(() => {
        setDirection(-1);
        setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    }, []);

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

    // Staggered text animations
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
        <div className="relative h-screen w-full overflow-hidden bg-black">
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
                    <div className="absolute inset-0 bg-black/30 z-10" />
                    <motion.img
                        variants={kenBurnsVariants}
                        initial="initial"
                        animate="animate"
                        src={slides[current].image}
                        alt={slides[current].title}
                        className="w-full h-full object-cover origin-center"
                    />

                    <div className="absolute inset-0 flex items-center justify-center z-20">
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="text-center text-white px-4 max-w-5xl"
                        >
                            <motion.div variants={itemVariants} className="overflow-hidden mb-4">
                                <span className="text-lg md:text-xl font-medium tracking-[0.8em] uppercase text-white/80 block">
                                    {slides[current].subtitle}
                                </span>
                            </motion.div>

                            <motion.h1 variants={itemVariants} className="text-7xl md:text-[10rem] font-black mb-10 leading-[0.85] tracking-tighter uppercase">
                                {slides[current].title.split(' ').map((word, i) => (
                                    <span key={i} className="inline-block mr-4">{word}</span>
                                ))}
                            </motion.h1>

                            <motion.div variants={itemVariants} className="flex justify-center flex-wrap gap-6">
                                <Link
                                    to={slides[current].link}
                                    className="group relative px-12 py-5 bg-white text-black text-lg font-bold uppercase tracking-widest overflow-hidden transition-all duration-300 hover:text-white"
                                >
                                    <span className="relative z-10">{slides[current].cta}</span>
                                    <div className="absolute inset-0 bg-black translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                                </Link>
                                <Link
                                    to="/shop"
                                    className="group relative px-12 py-5 border-2 border-white text-white text-lg font-bold uppercase tracking-widest overflow-hidden transition-all duration-300"
                                >
                                    <span className="relative z-10">New Arrivals</span>
                                    <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                                    <span className="absolute inset-0 flex items-center justify-center text-black opacity-0 group-hover:opacity-100 transition-opacity duration-300">New Arrivals</span>
                                </Link>
                            </motion.div>
                        </motion.div>
                    </div>
                </motion.div>
            </AnimatePresence>



            {/* Navigation Controls */}
            <div className="absolute left-12 bottom-12 z-30">
                <button
                    onClick={prevSlide}
                    className="group w-16 h-16 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all duration-500"
                >
                    <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                </button>
            </div>
            <div className="absolute right-28 bottom-12 z-30">
                <button
                    onClick={nextSlide}
                    className="group w-16 h-16 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all duration-500"
                >
                    <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                </button>
            </div>

            {/* Floating Navigation Dots with Progress Circles */}
            <div className="absolute right-8 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-6">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => {
                            setDirection(index > current ? 1 : -1);
                            setCurrent(index);
                        }}
                        className="relative group p-2"
                    >
                        <div className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${index === current ? 'bg-white scale-150' : 'bg-white/30 scale-100 group-hover:bg-white/60'
                            }`} />
                        {index === current && (
                            <svg className="absolute top-0 left-0 w-full h-full -rotate-90">
                                <circle
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    fill="none"
                                    stroke="white"
                                    strokeWidth="1"
                                    strokeDasharray="63"
                                    strokeDashoffset="63"
                                    className="animate-progress-circle"
                                />
                            </svg>
                        )}
                    </button>
                ))}
            </div>

            <style>{`
                @keyframes progress-circle {
                    from { stroke-dashoffset: 63; }
                    to { stroke-dashoffset: 0; }
                }
                .animate-progress-circle {
                    animation: progress-circle 8s linear infinite;
                }
            `}</style>
        </div>
    );
};

export default HeroSlider;
