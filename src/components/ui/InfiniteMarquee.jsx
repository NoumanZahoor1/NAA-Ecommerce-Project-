import { motion } from 'framer-motion';

const InfiniteMarquee = ({ text, speed = 20 }) => {
    return (
        <div className="relative flex overflow-hidden bg-black text-white dark:bg-white dark:text-black py-4 select-none z-10">
            <div className="absolute inset-0 bg-gradient-to-r from-black dark:from-white via-transparent to-black dark:to-white z-10 w-full pointer-events-none opacity-20" />

            <motion.div
                className="flex whitespace-nowrap"
                animate={{ x: [0, -1000] }}
                transition={{
                    repeat: Infinity,
                    duration: speed,
                    ease: "linear",
                }}
            >
                {[...Array(4)].map((_, i) => (
                    <span key={i} className="text-4xl font-black uppercase mx-8 tracking-tighter opacity-80">
                        {text} •
                    </span>
                ))}
            </motion.div>
        </div>
    );
};

export default InfiniteMarquee;
