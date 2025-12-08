'use client';

import { motion } from 'framer-motion';

export const AnimatedBackground = () => {
    return (
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
            {/* Grid Pattern */}
            <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: `linear-gradient(#1a1a1a 1px, transparent 1px), linear-gradient(90deg, #1a1a1a 1px, transparent 1px)`,
                    backgroundSize: '40px 40px',
                }}
            />

            {/* Floating Shapes */}
            <motion.div
                className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-neo-main rounded-full blur-[100px] opacity-20"
                animate={{
                    x: [0, 100, 0],
                    y: [0, 50, 0],
                    scale: [1, 1.1, 1],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear"
                }}
            />

            <motion.div
                className="absolute bottom-[-10%] right-[-10%] w-[35vw] h-[35vw] bg-neo-blue rounded-full blur-[100px] opacity-20"
                animate={{
                    x: [0, -100, 0],
                    y: [0, -50, 0],
                    scale: [1, 1.2, 1],
                }}
                transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: "linear"
                }}
            />

            <motion.div
                className="absolute top-[40%] left-[40%] w-[20vw] h-[20vw] bg-neo-accent rounded-full blur-[80px] opacity-10"
                animate={{
                    x: [0, 50, -50, 0],
                    y: [0, -50, 50, 0],
                }}
                transition={{
                    duration: 30,
                    repeat: Infinity,
                    ease: "linear"
                }}
            />
        </div>
    );
};
