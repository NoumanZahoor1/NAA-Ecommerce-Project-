import { useEffect, useRef, useState } from 'react';
import { useMotionValue, useTransform, animate } from 'framer-motion';

const AnimatedCounter = ({ value, duration = 2 }) => {
    const count = useMotionValue(0);
    const rounded = useTransform(count, (latest) => Math.round(latest));
    const [displayValue, setDisplayValue] = useState(0);
    const ref = useRef(null);

    useEffect(() => {
        const unsubscribe = rounded.on('change', (latest) => {
            setDisplayValue(latest);
        });

        return () => unsubscribe();
    }, [rounded]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    animate(count, value, { duration });
                }
            },
            { threshold: 0.5 }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, [count, value, duration]);

    return <span ref={ref} className="tabular-nums transition-all">{displayValue}</span>;
};

export default AnimatedCounter;
