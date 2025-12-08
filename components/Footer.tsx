'use client';

import { useState } from 'react';
import { HelpCircle } from 'lucide-react';
import { HowItWorksModal } from './HowItWorksModal';

export const Footer = () => {
    const [showHowItWorks, setShowHowItWorks] = useState(false);

    return (
        <>
            <footer className="w-full py-3 px-6 border-t-2 border-neo-black bg-neo-white flex flex-col md:flex-row justify-between items-center gap-2 text-sm font-black uppercase z-40 mt-auto">
                <div className="flex items-center gap-2 order-2 md:order-1">
                    <span>&copy; 2025</span>
                    <span className="hidden md:inline mx-2 text-gray-400">|</span>
                    <span className="text-sm font-bold tracking-widest text-gray-500">Created by MD</span>
                </div>

                <div className="flex flex-col items-center order-1 md:order-2">
                    <span className="bg-neo-yellow px-3 py-0.5 border-2 border-neo-black shadow-neo-sm transform -rotate-1 text-xs md:text-sm">Secure P2P Transfer</span>
                </div>

                <div className="flex gap-4 order-3 md:order-3">
                    <button
                        onClick={() => setShowHowItWorks(true)}
                        className="flex items-center gap-2 hover:text-neo-blue hover:underline decoration-4 underline-offset-4 transition-colors"
                    >
                        <HelpCircle className="w-6 h-6" />
                        How it works?
                    </button>
                </div>
            </footer>

            <HowItWorksModal isOpen={showHowItWorks} onClose={() => setShowHowItWorks(false)} />
        </>
    );
};
