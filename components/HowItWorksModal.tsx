"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, QrCode, Send, Download } from "lucide-react";
import { NeoButton } from "./ui/NeoButton";
import { NeoCard } from "./ui/NeoCard";

interface HowItWorksModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const steps = [
    {
        title: "1. START SHARING",
        desc: "Click 'Start Sending' to create a secure, private room. No logins required.",
        icon: Send,
        color: "bg-neo-yellow",
    },
    {
        title: "2. CONNECT PEER",
        desc: "Share the link or let your friend scan the QR code to join the room.",
        icon: QrCode,
        color: "bg-neo-blue",
    },
    {
        title: "3. INSTANT TRANSFER",
        desc: "Drag & Drop files. They transfer directly between devices. No servers.",
        icon: Download,
        color: "bg-neo-pink",
    },
];

export const HowItWorksModal = ({ isOpen, onClose }: HowItWorksModalProps) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    if (!mounted) return null;

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-neo-black/50 backdrop-blur-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                >
                    <motion.div
                        className="w-full max-w-4xl max-h-[90vh] overflow-y-auto"
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 20 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <NeoCard className="relative flex flex-col gap-8 bg-white shadow-neo-lg pt-12">
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 p-2 hover:bg-neo-yellow border-2 border-transparent hover:border-neo-black transition-all rounded-full"
                            >
                                <X className="w-8 h-8 text-neo-black" />
                            </button>

                            <div className="text-center space-y-2">
                                <h2 className="text-4xl md:text-6xl font-black uppercase drop-shadow-neo">
                                    How It Works
                                </h2>
                                <p className="text-xl font-bold text-gray-600">
                                    Simple. Fast. Direct.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {steps.map((step, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.1 + 0.2 }}
                                        className="flex flex-col items-center text-center space-y-4"
                                    >
                                        <div
                                            className={`w-24 h-24 ${step.color} border-4 border-neo-black shadow-neo flex items-center justify-center rounded-full`}
                                        >
                                            <step.icon className="w-10 h-10 text-neo-black" />
                                        </div>
                                        <h3 className="text-xl font-black bg-neo-black text-white px-2 py-1 transform -rotate-2">
                                            {step.title}
                                        </h3>
                                        <p className="font-bold text-sm md:text-base leading-tight px-4">
                                            {step.desc}
                                        </p>
                                    </motion.div>
                                ))}
                            </div>

                            <div className="text-center pt-4 border-t-2 border-neo-black">
                                <NeoButton onClick={onClose} size="lg" className="w-full md:w-auto">
                                    Got it, let's go!
                                </NeoButton>
                            </div>
                        </NeoCard>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>,
        document.body
    );
};
