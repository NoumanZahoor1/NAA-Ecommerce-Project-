import { useState, useRef, useEffect, useCallback } from 'react';
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  useMotionTemplate,
} from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaPlus, FaArrowRight } from 'react-icons/fa';
import { useShop } from '../../context/ShopContext';
import { useTheme } from '../../context/ThemeContext';

/* ══════════════════════════════════════════════════════
   HOOK — Text Scramble (rAF-based)
══════════════════════════════════════════════════════ */
function useTextScramble(text, active) {
  const [output, setOutput] = useState(text);
  useEffect(() => {
    if (!active) { setOutput(text); return; }
    const POOL = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ#@!%&*01234';
    let frame = 0;
    let rafId;
    const MAX = text.length * 2.4;
    const tick = () => {
      setOutput(
        text.split('').map((ch, i) => {
          if (ch === ' ') return ' ';
          if (i < frame / 2.4) return ch;
          return POOL[Math.floor(Math.random() * POOL.length)];
        }).join('')
      );
      frame++;
      if (frame < MAX) rafId = requestAnimationFrame(tick);
      else setOutput(text);
    };
    const t = setTimeout(() => { rafId = requestAnimationFrame(tick); }, 300);
    return () => { clearTimeout(t); cancelAnimationFrame(rafId); };
  }, [active, text]);
  return output;
}

/* ══════════════════════════════════════════════════════
   SUB-COMPONENT — Price Counter
══════════════════════════════════════════════════════ */
const PriceCounter = ({ price, accent }) => {
  const [display, setDisplay] = useState('0.00');
  useEffect(() => {
    const end = parseFloat(price);
    const t0 = performance.now();
    const dur = 820;
    let rafId;
    const tick = (now) => {
      const p = Math.min((now - t0) / dur, 1);
      setDisplay((end * (1 - Math.pow(1 - p, 4))).toFixed(2));
      if (p < 1) rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [price]);
  return (
    <span className="font-black text-[15px] tabular-nums" style={{ color: accent, fontFamily: "'DM Sans', sans-serif" }}>
      ${display}
    </span>
  );
};

/* ══════════════════════════════════════════════════════
   CONSTANTS
══════════════════════════════════════════════════════ */
const GRADES = {
  Accessories: 'sepia(0.38) saturate(1.65) hue-rotate(-15deg) brightness(0.97)',
  Outerwear: 'saturate(0.72) brightness(0.89) sepia(0.14)',
  Tops: 'saturate(1.12) hue-rotate(7deg) brightness(1.05)',
  Bottoms: 'sepia(0.22) saturate(1.42) hue-rotate(-22deg) brightness(0.91)',
};

/* ══════════════════════════════════════════════════════
   MAIN — ShopTheLook
══════════════════════════════════════════════════════ */
const ShopTheLook = () => {
  const { products } = useShop();
  const { darkMode } = useTheme();

  const [activeItem, setActiveItem] = useState(null);
  const [inView, setInView] = useState(false);
  const [isTouch, setIsTouch] = useState(false);
  const [isHoveringVision, setIsHoveringVision] = useState(false);

  const sectionRef = useRef(null);
  const imgWrapRef = useRef(null);
  const leaveTimer = useRef(null);

  /* ── Detection — Device Capability ── */
  useEffect(() => {
    const checkTouch = () => setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0);
    checkTouch();
    window.addEventListener('resize', checkTouch);
    return () => window.removeEventListener('resize', checkTouch);
  }, []);

  /* ── Stable hotspot enter/leave handlers ── */
  const handleHotspotEnter = useCallback((id) => {
    clearTimeout(leaveTimer.current);
    setActiveItem(id);
  }, []);

  const handleHotspotLeave = useCallback(() => {
    leaveTimer.current = setTimeout(() => setActiveItem(null), 250);
  }, []);

  const cancelLeave = useCallback(() => {
    clearTimeout(leaveTimer.current);
  }, []);

  /* ── Raw motion values ── */
  const curX = useMotionValue(-9999);
  const curY = useMotionValue(-9999);
  const rawSpotX = useMotionValue(50);
  const rawSpotY = useMotionValue(50);

  /* ── Springs ── */
  const smoothCX = useSpring(curX, { stiffness: 600, damping: 40, mass: 0.3 });
  const smoothCY = useSpring(curY, { stiffness: 600, damping: 40, mass: 0.3 });
  const spotX = useSpring(rawSpotX, { stiffness: 60, damping: 20, mass: 0.6 });
  const spotY = useSpring(rawSpotY, { stiffness: 60, damping: 20, mass: 0.6 });

  /* ── Reactive spotlight string ── */
  const spotlightBg = useMotionTemplate`radial-gradient(circle 260px at ${spotX}% ${spotY}%, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.03) 45%, transparent 70%)`;

  /* ── Scroll parallax ── */
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const frameScale = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [0.86, 1, 1, 0.86]);
  const sectionAlpha = useTransform(scrollYProgress, [0, 0.12, 0.88, 1], [0, 1, 1, 0]);
  const headY = useTransform(scrollYProgress, [0, 1], [70, -70]);
  const statsY = useTransform(scrollYProgress, [0, 1], [30, -30]);

  /* ── IntersectionObserver ── */
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  /* ── Product data ── */
  const findId = (kw) => products.find((p) => p.name.toLowerCase().includes(kw))?.id || '';

  const lookItems = [
    {
      id: findId('classic sunglasses') || '5f4d1e2b4f1d4b0017a1a033',
      num: '01',
      sid: '01',
      title: 'Classic Sunglasses',
      price: '45.99',
      category: 'Accessories',
      image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=400&q=80',
      pos: { top: '15%', left: '32%' },
      accent: '#D4A843',
    },
    {
      id: findId('casual blazer') || '5f4d1e2b4f1d4b0017a1a007',
      num: '02',
      sid: '02',
      title: 'Casual Blazer',
      price: '89.99',
      category: 'Outerwear',
      image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=400&q=80',
      pos: { top: '35%', left: '78%' },
      accent: '#A07B6A',
    },
    {
      id: findId('oxford shirt') || '5f4d1e2b4f1d4b0017a1a018',
      num: '03',
      sid: '03',
      title: 'Oxford Shirt',
      price: '49.99',
      category: 'Tops',
      image: 'https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?auto=format&fit=crop&w=400&q=80',
      pos: { top: '55%', left: '46%' },
      accent: '#5B8AC5',
    },
    {
      id: findId('premium watch') || '5f4d1e2b4f1d4b0017a1a035',
      num: '04',
      sid: '04',
      title: 'Premium Watch',
      price: '125.00',
      category: 'Accessories',
      image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=400&q=80',
      pos: { top: '75%', left: '18%' },
      accent: '#C8B08A',
    },
    {
      id: findId('chino pants') || '5f4d1e2b4f1d4b0017a1a009',
      num: '05',
      sid: '05',
      title: 'Chino Pants',
      price: '49.99',
      category: 'Bottoms',
      image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=400&q=80',
      pos: { top: '88%', left: '65%' },
      accent: '#8C7660',
    },
  ];

  const activeData = lookItems.find((i) => i.sid === activeItem);
  const imgFilter = activeData ? (GRADES[activeData.category] ?? 'none') : 'none';

  /* ── Stable particles ── */
  const particles = useRef(
    Array.from({ length: 12 }, (_, i) => ({
      delay: i * 0.9,
      x: 5 + (i * 8.7) % 90,
      size: 1.5 + (i * 1.5) % 4,
      duration: 12 + (i * 1.4) % 8,
    }))
  ).current;

  /* ── Mouse tracking ── */
  const onMouseMove = useCallback((e) => {
    if (isTouch) return;
    curX.set(e.clientX);
    curY.set(e.clientY);
    if (imgWrapRef.current) {
      const ir = imgWrapRef.current.getBoundingClientRect();
      rawSpotX.set(((e.clientX - ir.left) / ir.width) * 100);
      rawSpotY.set(((e.clientY - ir.top) / ir.height) * 100);
    }
  }, [curX, curY, rawSpotX, rawSpotY, isTouch]);

  const onMouseLeave = useCallback(() => {
    curX.set(-9999); curY.set(-9999);
    rawSpotX.set(50); rawSpotY.set(50);
    setActiveItem(null);
    setIsHoveringVision(false);
  }, [curX, curY, rawSpotX, rawSpotY]);

  /* ── Scrambled headline ── */
  const sc1 = useTextScramble('SHOP', inView);
  const sc2 = useTextScramble('THE LOOK', inView);

  /* ═══════════════════════════════════════════
     RENDER
  ═══════════════════════════════════════════ */
  return (
    <section
      ref={sectionRef}
      className={`relative min-h-screen py-8 flex flex-col justify-center transition-colors duration-700 overflow-hidden select-none ${darkMode ? 'bg-[#050505]' : 'bg-white'}`}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      {/* Global CSS keyframes — smooth animations */}
      <style>{`
        @keyframes stl-float {
          0%        { transform: translateY(0);      opacity: 0; }
          10%       { opacity: 0.4; }
          90%       { opacity: 0.4; }
          100%      { transform: translateY(-720px); opacity: 0; }
        }
        @keyframes stl-bob {
          0%, 100% { transform: translateY(0px); }
          50%      { transform: translateY(-12px); }
        }
        @keyframes stl-halo {
          0%, 100% { transform: scale(1);    opacity: 0.2; }
          50%      { transform: scale(1.7);  opacity: 0.55; }
        }
        @keyframes stl-ring1 {
          0%        { transform: scale(1);   opacity: 0.4; }
          100%      { transform: scale(2.6); opacity: 0;   }
        }
        @keyframes stl-ring2 {
          0%        { transform: scale(1);   opacity: 0.25; }
          100%      { transform: scale(3.2); opacity: 0;    }
        }
        @keyframes stl-shimmer {
          0% { transform: translateX(-100%) skewX(-15deg); }
          100% { transform: translateX(200%) skewX(-15deg); }
        }
      `}</style>

      {/* SVG Grain — Texture */}
      <svg className="absolute w-0 h-0" aria-hidden="true">
        <defs>
          <filter id="stl-grain-hq">
            <feTurbulence type="fractalNoise" baseFrequency="0.68" numOctaves="3" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
            <feComponentTransfer><feFuncA type="linear" slope="0.04" /></feComponentTransfer>
            <feBlend in="SourceGraphic" mode="overlay" />
          </filter>
        </defs>
      </svg>
      <div className="absolute inset-0 z-50 pointer-events-none opacity-[0.8]" style={{ filter: 'url(#stl-grain-hq)' }} />

      {/* Overlay: Vignette + Scanlines */}
      <div className={`absolute inset-0 z-[6] pointer-events-none ${darkMode ? 'bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.5)_100%)]' : 'bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.05)_100%)]'}`} />
      <div
        className={`absolute inset-0 z-[6] pointer-events-none ${darkMode ? 'opacity-[0.015]' : 'opacity-[0.04]'}`}
        style={{ backgroundImage: `repeating-linear-gradient(0deg,transparent,transparent 2px,${darkMode ? 'rgba(255,255,255,1)' : 'rgba(0,0,0,1)'} 2px,${darkMode ? 'rgba(255,255,255,1)' : 'rgba(0,0,0,1)'} 3px)` }}
      />

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-[5]">
        {particles.map((p, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white/10 shadow-[0_0_8px_rgba(255,255,255,0.2)]"
            style={{
              width: p.size, height: p.size, left: `${p.x}%`, bottom: -40,
              animation: `stl-float ${p.duration}s ${p.delay}s linear infinite`,
            }}
          />
        ))}
      </div>

      {/* ── Custom cursor (hidden on touch or when not over vision) ── */}
      <AnimatePresence>
        {!isTouch && isHoveringVision && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="fixed z-[999] pointer-events-none"
            style={{ x: smoothCX, y: smoothCY, translateX: '-50%', translateY: '-50%', willChange: 'transform', left: 0, top: 0 }}
          >
            <motion.div
              animate={
                activeItem
                  ? { width: 84, height: 84, borderColor: activeData?.accent ?? (darkMode ? '#fff' : '#000'), borderWidth: 2, backgroundColor: darkMode ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)' }
                  : { width: 28, height: 28, borderColor: darkMode ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)', borderWidth: 1.5, backgroundColor: 'transparent' }
              }
              transition={{ type: 'spring', stiffness: 350, damping: 28 }}
              className={`rounded-full border flex items-center justify-center backdrop-blur-[2px] transition-colors duration-500`}
            >
              <AnimatePresence mode="wait">
                {activeItem ? (
                  <motion.span key="v" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
                    className={`text-[7px] font-black tracking-[0.3em] uppercase ${darkMode ? 'text-white' : 'text-black'}`} style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    VIEW
                  </motion.span>
                ) : (
                  <motion.div key="d" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className={`w-1.5 h-1.5 rounded-full ${darkMode ? 'bg-white' : 'bg-black'}`} />
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main content ── */}
      <motion.div style={{ opacity: sectionAlpha }} className="w-full max-w-[62vw] mx-auto px-4 md:px-8 relative z-20">

        {/* SIDEBARS — Editorial labels */}
        <div className="hidden xl:block absolute left-0 top-1/2 -rotate-90 origin-center -translate-y-1/2 pointer-events-none h-0 whitespace-nowrap">
          <span className={`text-[7px] font-black tracking-[0.7em] uppercase transition-colors duration-500 ${darkMode ? 'text-white/10' : 'text-black/15'}`}>SS '25 / INTERACTIVE LOOKBOOK / VOL.04 COL.A</span>
        </div>
        <div className="hidden xl:block absolute right-0 top-1/2 rotate-90 origin-center -translate-y-1/2 pointer-events-none h-0 whitespace-nowrap">
          <span className={`text-[7px] font-black tracking-[0.7em] uppercase transition-colors duration-500 ${darkMode ? 'text-white/10' : 'text-black/15'}`}>NAA STUDIO / PREMIUM ETHEREAL COLLECTION</span>
        </div>

        {/* HEADER SECTION */}
        <motion.header style={{ y: headY }} className="text-center mb-12 relative z-10">
          <motion.div initial={{ width: 0, opacity: 0 }} animate={inView ? { width: 120, opacity: 1 } : {}}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="h-[1.5px] bg-red-600 mx-auto mb-10" />



          <div className="overflow-hidden leading-[1] mb-2">
            <motion.div initial={{ y: '100%' }} animate={inView ? { y: '0%' } : {}} transition={{ delay: 0.45, duration: 1, ease: 'easeOut' }}
              className={`font-black uppercase tracking-tighter transition-colors duration-500 ${darkMode ? 'text-white' : 'text-black'}`}
              style={{ fontSize: 'clamp(2.5rem, 9vw, 6.5rem)', fontFamily: "'Bebas Neue', sans-serif" }}>
              {sc1}
            </motion.div>
          </div>
          <div className="overflow-hidden leading-[1]">
            <motion.div initial={{ y: '100%' }} animate={inView ? { y: '0%' } : {}} transition={{ delay: 0.6, duration: 1, ease: 'easeOut' }}
              className="font-black uppercase tracking-tighter transition-colors duration-500"
              style={{ fontSize: 'clamp(2.5rem, 9vw, 6.5rem)', fontFamily: "'Bebas Neue', sans-serif", color: 'transparent', WebkitTextStroke: darkMode ? '1px rgba(255,255,255,0.2)' : '1px rgba(0,0,0,0.15)' }}>
              {sc2}
            </motion.div>
          </div>
        </motion.header>

        {/* ── VISION CONTAINER ── */}
        <div 
          onMouseEnter={() => setIsHoveringVision(true)}
          onMouseLeave={() => setIsHoveringVision(false)}
          className={`relative w-full max-w-none mx-auto h-[50vh] md:h-[65vh] ${!isTouch && isHoveringVision ? 'cursor-none' : ''}`}
        >

          {/* PARALLAX VISUAL + INTERACTION PLANE */}
          <motion.div style={{ scale: frameScale }} className="absolute inset-0">

            {/* FRAME LAYER (IMAGE) */}
            <div
              ref={imgWrapRef}
              className={`absolute inset-0 rounded-[40px] md:rounded-[60px] overflow-hidden pointer-events-none transition-all duration-700 shadow-[0_80px_180px_rgba(0,0,0,0.92)] border ${darkMode ? 'border-white/5' : 'border-black/5'}`}
            >
              <div className="absolute w-[112%] h-[112%] -top-[6%] -left-[6%] transition-[filter] duration-[1000ms] ease-out" style={{ filter: imgFilter }}>
                <img
                  src="https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1288&auto=format&fit=crop"
                  alt="Shop The Look"
                  className="w-full h-full object-cover object-center scale-[1.02]"
                />
              </div>
              <motion.div className="absolute inset-0" style={{ background: spotlightBg, mixBlendMode: 'plus-lighter', opacity: 0.6 }} />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/20 opacity-30" />

              {/* Internal Metadata */}
              <div className="absolute bottom-12 right-12 text-right opacity-30">
                <p className={`text-[9px] font-black tracking-widest uppercase mb-1 transition-colors duration-500 ${darkMode ? 'text-white' : 'text-black'}`}>Vol. 04 / SS '25</p>
                <div className="flex justify-end gap-1">
                  {[...Array(5)].map((_, i) => <div key={i} className={`w-1 h-1 rounded-full transition-colors duration-500 ${i < 3 ? (darkMode ? 'bg-white' : 'bg-black') : (darkMode ? 'bg-white/20' : 'bg-black/20')}`} />)}
                </div>
              </div>
            </div>

            {/* INTERACTION LAYER */}
            <div className="absolute inset-0 z-10">
              {lookItems.map((item, index) => {
                const isRight = parseFloat(item.pos.left) > 50;
                const active = activeItem === item.sid;

                return (
                  <div
                    key={item.sid}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center p-10 ${!isTouch ? 'cursor-none' : 'cursor-pointer'}`}
                    style={{ top: item.pos.top, left: item.pos.left, zIndex: active ? 50 : 20 }}
                    onPointerEnter={() => handleHotspotEnter(item.sid)}
                    onPointerLeave={handleHotspotLeave}
                    onClick={() => setActiveItem(active ? null : item.sid)}
                    aria-label={`View ${item.title}`}
                  >
                    {/* Animated Hotspot Pin */}
                    <div className="relative w-16 h-16 pointer-events-none" style={{ animation: `stl-bob ${4 + index * 0.3}s ${index * 0.8}s ease-in-out infinite` }}>

                      {/* Halo Backglow */}
                      <div className="absolute inset-[-25px] rounded-full" style={{ background: `radial-gradient(circle, ${item.accent}30 0%, transparent 75%)`, animation: `stl-halo 3s ${index * 0.5}s ease-in-out infinite` }} />

                      {/* The Button */}
                      <motion.div
                        className="w-16 h-16 rounded-full border-2 flex items-center justify-center backdrop-blur-md relative z-10"
                        animate={active ? {
                          scale: 1.25,
                          backgroundColor: item.accent,
                          borderColor: item.accent,
                          boxShadow: `0 0 45px ${item.accent}80, 0 15px 40px rgba(0,0,0,0.6)`
                        } : {
                          scale: 1,
                          backgroundColor: 'rgba(255,255,255,0.12)',
                          borderColor: 'rgba(255,255,255,0.3)',
                          boxShadow: '0 8px 32px rgba(0,0,0,0.4)'
                        }}
                        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                      >
                        <FaPlus size={11} className={`transition-all duration-500 ${active ? 'rotate-45 text-black' : 'text-white'}`} />
                        <div className="absolute inset-0 rounded-full border border-white/20" style={{ animation: `stl-ring1 2.5s ${index * 0.4}s infinite ease-out` }} />
                        <div className="absolute inset-0 rounded-full border border-white/10" style={{ animation: `stl-ring2 4s ${index * 0.4}s 0.8s infinite ease-out` }} />
                      </motion.div>

                      {/* Index Badge */}
                      <div className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-black text-black z-20 shadow-xl" style={{ backgroundColor: item.accent }}>
                        {item.num}
                      </div>
                    </div>

                    {/* PRODUCT TOOLTIP */}
                    <AnimatePresence>
                      {active && (
                        <motion.div
                          initial={{ opacity: 0, y: 15, scale: 0.94 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.96 }}
                          className={`absolute ${isRight ? 'right-24' : 'left-24'} top-0 w-72 origin-top`}
                          style={{ zIndex: 100 }}
                        >
                          {/* Premium Ambient Backglow */}
                          <div className="absolute inset-[-40px] opacity-25 blur-3xl pointer-events-none rounded-full" style={{ background: item.accent }} />

                          <div className={`relative rounded-[20px] overflow-hidden backdrop-blur-3xl transition-colors duration-500 border ${darkMode ? 'bg-black/80 border-white/10 shadow-2xl' : 'bg-white/95 border-black/10 shadow-xl'}`}>
                            {/* Color Accent Bar */}
                            <div className="h-[3px]" style={{ backgroundColor: item.accent }} />

                            <Link
                              to={`/product/${item.id}`}
                              className={`block p-4 group/card relative ${!isTouch ? 'cursor-none' : ''}`}
                              onPointerEnter={cancelLeave}
                              onPointerLeave={handleHotspotLeave}
                            >
                              <div className="flex gap-4 items-center">
                                <div className="w-[84px] h-[105px] rounded-xl overflow-hidden bg-neutral-900 flex-shrink-0 relative">
                                  <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-110" />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                                </div>
                                <div className="flex-1 py-1 flex flex-col justify-between h-[105px]">
                                  <div>
                                    <span className="text-[8px] font-black tracking-widest text-white/40 uppercase block mb-1">{item.category}</span>
                                    <h4 className="text-[15px] font-black text-white leading-tight mb-2 tracking-tight">{item.title}</h4>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <PriceCounter price={item.price} accent={item.accent} />
                                    <motion.div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ backgroundColor: item.accent }} whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}>
                                      <FaArrowRight size={10} className="text-black" />
                                    </motion.div>
                                  </div>
                                </div>
                              </div>
                              {/* Shimmer Effect */}
                              <div className="absolute inset-0 pointer-events-none opacity-0 group-hover/card:opacity-100 transition-opacity duration-700" style={{ background: `linear-gradient(90deg, transparent, ${item.accent}08, transparent)`, animation: 'stl-shimmer 2s infinite linear' }} />
                            </Link>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* ── FOOTER INTERFACE ── */}
        <motion.div
          style={{ y: statsY }}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 1.2, duration: 0.8 }}
          className={`flex flex-wrap gap-y-6 items-center justify-between mt-10 pt-6 border-t transition-colors duration-500 ${darkMode ? 'border-white/5' : 'border-black/5'}`}
        >
          <div className="flex items-center gap-4">
          </div>

          <div className="flex items-center gap-2">
            {lookItems.map((item, i) => (
              <motion.button
                key={item.sid}
                onClick={() => setActiveItem(activeItem === item.sid ? null : item.sid)}
                className={`w-10 h-10 rounded-full text-[10px] font-black transition-all duration-300 border ${activeItem === item.sid ? 'text-black border-transparent' : (darkMode ? 'text-white/30 border-white/10 hover:border-white/30' : 'text-black/40 border-black/10 hover:border-black/30')} ${!isTouch ? 'cursor-none' : ''}`}
                style={{ backgroundColor: activeItem === item.sid ? item.accent : 'transparent' }}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.9 }}
                aria-label={`Show ${item.title}`}
              >
                {item.num}
              </motion.button>
            ))}
          </div>

          <div className="flex items-center gap-3">
          </div>
        </motion.div>

      </motion.div>
    </section>
  );
};

export default ShopTheLook;
