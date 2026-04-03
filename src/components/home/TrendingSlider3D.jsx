import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useShop } from "../../context/ShopContext";

/* ─── 3D POSITION MATH ─── */
const X_SPREAD = 320;
const Z_GAP = 350;
const SCALE_STEP = 0.15;
const OPACITY_STEP = 0.22;

function getPos(offset) {
    const abs = Math.abs(offset);
    return {
        x: offset * X_SPREAD,
        z: -abs * Z_GAP,
        scale: Math.max(0.38, 1 - abs * SCALE_STEP),
        opacity: Math.max(0.18, 1 - abs * OPACITY_STEP),
        zIndex: 100 - abs,
        rotateY: offset * 7,
    };
}

/* ─── CARD component ─── */
function Card({ product, offset, onClickCard, isCenter, onAddToCart }) {
    const p = getPos(offset);
    const tag = product.salePrice ? "Sale" : product.stock < 5 ? "Low Stock" : product.rating >= 4.5 ? "Trending" : "New";

    const tagColor =
        tag === "Sale"
            ? { bg: "rgba(220,38,38,0.85)", text: "#fff" }
            : tag === "Low Stock"
                ? { bg: "rgba(239,68,68,0.85)", text: "#fff" }
                : tag === "Trending"
                    ? { bg: "rgba(245,158,11,0.85)", text: "#000" }
                    : { bg: "rgba(255,255,255,0.12)", text: "#fff" };

    return (
        <motion.div
            animate={{ x: p.x, z: p.z, scale: p.scale, opacity: p.opacity, rotateY: p.rotateY }}
            transition={{ type: "spring", stiffness: 280, damping: 38, mass: 1.1 }}
            onClick={offset !== 0 ? onClickCard : undefined}
            style={{
                position: "absolute",
                width: 420,
                height: 600,
                zIndex: p.zIndex,
                transformStyle: "preserve-3d",
                cursor: offset !== 0 ? "pointer" : "default",
            }}
        >
            {/* Card body */}
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: 20,
                    overflow: "hidden",
                    background: "#0a0a0a",
                    border: isCenter ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(255,255,255,0.03)",
                    boxShadow: isCenter
                        ? "0 20px 60px rgba(0,0,0,0.8), 0 0 40px rgba(255,255,255,0.02)"
                        : "0 10px 30px rgba(0,0,0,0.5)",
                    transition: "border 0.5s, box-shadow 0.5s",
                }}
            >
                {/* Image */}
                <div style={{ position: "relative", width: "100%", height: "70%", overflow: "hidden" }}>
                    <Link to={`/product/${product.id}`} style={{ width: "100%", height: "100%", display: "block" }}>
                        <img
                            src={product.image}
                            alt={product.name}
                            draggable={false}
                            style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                filter: isCenter ? "brightness(1) saturate(1)" : "brightness(0.5) saturate(0.6)",
                                transition: "filter 0.6s ease",
                            }}
                        />
                    </Link>
                    {/* Bottom fade */}
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, #111 0%, transparent 45%)", pointerEvents: "none" }} />
                    {/* Tag */}
                    <div style={{ position: "absolute", top: 16, left: 16 }}>
                        <span
                            style={{
                                display: "inline-block",
                                padding: "6px 14px",
                                borderRadius: 20,
                                background: tagColor.bg,
                                color: tagColor.text,
                                fontSize: 11,
                                fontWeight: 900,
                                letterSpacing: "0.22em",
                                textTransform: "uppercase",
                                backdropFilter: "blur(6px)",
                            }}
                        >
                            {tag}
                        </span>
                    </div>
                </div>

                {/* Info */}
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "16px", height: "40%", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
                    <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 10, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: 4 }}>
                        {product.category}
                    </p>
                    <Link to={`/product/${product.id}`}>
                        <h3 style={{ color: "#fff", fontWeight: 900, fontSize: 20, lineHeight: 1.2, letterSpacing: "-0.02em", marginBottom: 8 }}>
                            {product.name}
                        </h3>
                    </Link>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div style={{ display: "flex", flexDirection: "column" }}>
                            {product.salePrice ? (
                                <>
                                    <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, textDecoration: "line-through", marginBottom: -4 }}>
                                        ${product.price}
                                    </span>
                                    <span style={{ color: "#ef4444", fontWeight: 900, fontSize: 26 }}>
                                        ${product.salePrice}
                                    </span>
                                </>
                            ) : (
                                <span style={{ color: "#fff", fontWeight: 900, fontSize: 24 }}>
                                    ${product.price}
                                </span>
                            )}
                        </div>
                        {isCenter && (
                            <motion.button
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.25, duration: 0.45 }}
                                onClick={(e) => {
                                    e.preventDefault();
                                    onAddToCart(product);
                                }}
                                style={{
                                    padding: "8px 20px",
                                    borderRadius: 30,
                                    background: "#fff",
                                    color: "#000",
                                    border: "none",
                                    fontSize: 11,
                                    fontWeight: 900,
                                    letterSpacing: "0.15em",
                                    textTransform: "uppercase",
                                    cursor: "pointer",
                                    transition: "background 0.3s, color 0.3s",
                                }}
                                onMouseEnter={(e) => { e.target.style.background = "#ef4444"; e.target.style.color = "#fff"; }}
                                onMouseLeave={(e) => { e.target.style.background = "#fff"; e.target.style.color = "#000"; }}
                            >
                                Add to Bag
                            </motion.button>
                        )}
                    </div>
                </div>
            </div>

            {/* Glow under center */}
            {isCenter && (
                <div style={{ position: "absolute", bottom: -30, left: "50%", transform: "translateX(-50%)", width: "70%", height: 50, borderRadius: "50%", background: "rgba(255,255,255,0.18)", filter: "blur(22px)", pointerEvents: "none" }} />
            )}
        </motion.div>
    );
}

const TrendingSlider3D = ({ products = [] }) => {
    const { addToCart } = useShop();
    // Prioritize products on sale, then take top 10
    const featuredProducts = [...products]
        .sort((a, b) => {
            if (a.salePrice && !b.salePrice) return -1;
            if (!a.salePrice && b.salePrice) return 1;
            return 0;
        })
        .slice(0, 10);
    const total = featuredProducts.length;
    const [center, setCenter] = useState(0);
    const dragStart = useRef(null);
    const THRESH = 55;

    // Auto-rotate
    const timerRef = useRef(null);
    const resetTimer = useCallback(() => {
        clearInterval(timerRef.current);
        if (total > 0) {
            timerRef.current = setInterval(() => setCenter((c) => (c + 1) % total), 4200);
        }
    }, [total]);

    useEffect(() => {
        resetTimer();
        return () => clearInterval(timerRef.current);
    }, [resetTimer]);

    if (total === 0) return null;

    const goTo = (i) => {
        setCenter(((i % total) + total) % total);
        resetTimer();
    };
    const prev = () => goTo(center - 1);
    const next = () => goTo(center + 1);

    // Drag
    const onStart = (e) => { dragStart.current = e.clientX ?? e.touches?.[0]?.clientX ?? 0; };
    const onEnd = (e) => {
        if (dragStart.current === null) return;
        const end = e.clientX ?? e.changedTouches?.[0]?.clientX ?? 0;
        const diff = end - dragStart.current;
        if (diff < -THRESH) next();
        else if (diff > THRESH) prev();
        dragStart.current = null;
    };

    const offsets = [-2, -1, 0, 1, 2];

    const handleAddToCart = (product) => {
        addToCart({
            ...product,
            size: product.sizes ? product.sizes[0] : 'M',
            color: product.colors ? product.colors[0] : 'default',
            quantity: 1
        });
    };

    return (
        <section className="relative min-h-[85vh] dark:bg-[#08080a] bg-stone-50 transition-colors duration-500 overflow-hidden py-24" style={{ fontFamily: "'Inter', sans-serif" }}>
            {/* Ambient Background */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <motion.div
                    animate={{ x: ["0%", "15%", "0%"], y: ["0%", "-10%", "0%"] }}
                    transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] dark:bg-white/5 bg-black/[0.02] blur-[140px] rounded-full"
                />
            </div>

            <div className="max-w-[1400px] mx-auto px-6 relative z-10">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
                    <div className="flex-1">
                        {/* Status Badge */}
                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center gap-3 px-5 py-2 rounded-full dark:bg-red-500/10 bg-red-500/5 border dark:border-red-500/20 border-red-500/10 mb-6"
                        >
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inset-0 rounded-full bg-red-500 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                            </span>
                            <span className="text-[9px] font-black tracking-[0.3em] uppercase text-red-500">Hot Collection</span>
                        </motion.div>

                        <h2 className="text-5xl md:text-7xl font-black dark:text-white text-gray-900 leading-[0.85] tracking-tighter mb-8 uppercase">
                            Trending<br />
                            <span className="relative inline-block">
                                Now<span className="text-red-500">.</span>
                                <motion.div
                                    initial={{ width: 0 }}
                                    whileInView={{ width: "100%" }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 1.5, delay: 0.5 }}
                                    className="absolute -bottom-1 left-0 h-1 bg-gradient-to-r from-red-600 to-transparent rounded-full"
                                />
                            </span>
                        </h2>

                        <Link to="/shop" className="group flex items-center gap-4 dark:text-white/40 text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px] hover:text-red-500 dark:hover:text-white transition-colors duration-500">
                            Explore Collection
                            <motion.svg
                                animate={{ x: [0, 5, 0] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </motion.svg>
                        </Link>
                    </div>

                    {/* Navigation */}
                    <div className="flex items-center gap-6">
                        <button
                            onClick={prev}
                            className="group relative w-14 h-14 rounded-full border dark:border-white/10 border-black/10 flex items-center justify-center transition-all duration-500 hover:border-red-500 overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-red-500 scale-0 group-hover:scale-100 transition-transform duration-500 rounded-full" />
                            <span className="relative z-10 text-xl dark:text-white text-gray-900 group-hover:text-white">←</span>
                        </button>

                        <div className="flex flex-col items-center">
                            <span className="dark:text-white text-gray-900 font-black text-xl tracking-tighter">
                                {String(center + 1).padStart(2, "0")}
                            </span>
                            <div className="h-px w-6 dark:bg-white/20 bg-black/10 my-1" />
                            <span className="dark:text-white/20 text-gray-400 font-bold text-xs uppercase">
                                {String(total).padStart(2, "0")}
                            </span>
                        </div>

                        <button
                            onClick={next}
                            className="group relative w-14 h-14 rounded-full border dark:border-white/10 border-black/10 flex items-center justify-center transition-all duration-500 hover:border-red-500 overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-red-500 scale-0 group-hover:scale-100 transition-transform duration-500 rounded-full" />
                            <span className="relative z-10 text-xl dark:text-white text-gray-900 group-hover:text-white">→</span>
                        </button>
                    </div>
                </div>

                {/* 3D Stage */}
                <div
                    className="relative w-full h-[750px] flex items-center justify-center"
                    style={{ perspective: "1200px", perspectiveOrigin: "50% 40%" }}
                    onMouseDown={onStart}
                    onMouseUp={onEnd}
                    onMouseLeave={onEnd}
                    onTouchStart={onStart}
                    onTouchEnd={onEnd}
                >
                    <div className="relative w-[420px] h-[600px]" style={{ transformStyle: "preserve-3d" }}>
                        {offsets.map((off) => {
                            const idx = ((center + off) % total + total) % total;
                            return (
                                <Card
                                    key={`${featuredProducts[idx].id}-${idx}`}
                                    product={featuredProducts[idx]}
                                    offset={off}
                                    isCenter={off === 0}
                                    onClickCard={() => goTo(center + off)}
                                    onAddToCart={handleAddToCart}
                                />
                            );
                        })}
                    </div>
                </div>

                {/* Progress Indicators */}
                <div className="flex justify-center items-center gap-4 mt-8">
                    {featuredProducts.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => goTo(i)}
                            className={`h-1 transition-all duration-700 rounded-full overflow-hidden relative ${i === center ? 'w-12 dark:bg-white bg-gray-900' : 'w-2 dark:bg-white/10 bg-black/10 hover:bg-black/20'
                                }`}
                        >
                            {i === center && (
                                <motion.div
                                    initial={{ x: "-100%" }}
                                    animate={{ x: "100%" }}
                                    transition={{ duration: 4.2, ease: "linear" }}
                                    className="absolute inset-0 bg-gradient-to-r from-red-500 via-pink-500 to-red-500"
                                />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Ping Animation Style */}
            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes ping {
                    0% { transform: scale(1); opacity: 0.7; }
                    100% { transform: scale(3); opacity: 0; }
                }
            ` }} />
        </section>
    );
};

export default TrendingSlider3D;
