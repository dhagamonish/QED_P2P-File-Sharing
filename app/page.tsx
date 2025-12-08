'use client';

import { useRouter } from 'next/navigation';
import { nanoid } from 'nanoid';
import { NeoButton } from '@/components/ui/NeoButton';
import { NeoCard } from '@/components/ui/NeoCard';
import { ArrowRight, Share2, Shield, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

import ParticlesBackground from "@/components/ui/ParticlesBackground";

export default function Home() {
  const router = useRouter();

  const startSharing = () => {
    const roomId = nanoid(10);
    router.push(`/room/${roomId}`);
  };

  return (
    <motion.main
      className="flex-1 w-full flex flex-col items-center justify-center p-4 md:p-6 bg-transparent text-neo-black relative overflow-y-auto md:overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <ParticlesBackground />
      <div className="z-10 w-full max-w-6xl flex flex-col items-center gap-3 md:gap-4 sm:gap-6 h-full justify-center">

        {/* LOGO */}
        <div className="absolute top-4 left-4 md:top-8 md:left-8 z-50">
          <div className="border-4 border-neo-black bg-neo-white px-1 py-1 shadow-neo-sm transform -rotate-2">
            <img src="/logo.png" alt="Q.E.D. Logo" className="w-12 h-12 md:w-16 md:h-16 object-contain" />
          </div>
        </div>

        {/* BIG HERO TITLE */}
        <motion.div
          className="text-center space-y-1"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100 }}
        >
          <div className="inline-block bg-neo-yellow border-2 border-neo-black px-2 py-0.5 mb-1 transform -rotate-2 shadow-neo-sm">
            <span className="font-black uppercase tracking-widest text-[10px] md:text-xs">No Servers. No Logs. Just Speed.</span>
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-[0.9] drop-shadow-white">
            SHARE <br className="md:hidden" />
            <span className="text-stroke-3 text-transparent bg-clip-text bg-gradient-to-br from-neo-black to-neo-black" style={{ WebkitTextStroke: '1.5px var(--neo-black)', color: 'transparent' }}>
              FILES
            </span>
            <br />
            <span className="relative inline-block mt-0.5 md:mt-1">
              <span className="relative z-10 text-neo-white" style={{ textShadow: '2px 2px 0 #000' }}>INSTANTLY</span>
              <span className="absolute inset-0 bg-neo-blue transform skew-x-12 scale-110 -z-0 border-2 border-neo-black shadow-neo" />
            </span>
          </h1>
        </motion.div>

        {/* CTA */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full flex justify-center py-2"
        >
          <NeoButton
            size="xl"
            onClick={startSharing}
            className="flex items-center gap-3 bg-neo-pink text-white border-4 border-neo-black shadow-neo-lg hover:bg-neo-yellow hover:text-neo-black text-lg px-6 py-3 md:text-xl md:px-10 md:py-4"
          >
            Start Sending <ArrowRight strokeWidth={3} className="w-5 h-5 md:w-7 md:h-7" />
          </NeoButton>
        </motion.div>

        {/* Features Grid - Compact */}
        <div className="w-full mt-2 md:mt-4 overflow-x-auto pb-4 md:pb-0 md:overflow-visible">
          <div className="flex md:grid md:grid-cols-3 gap-3 md:gap-5 px-1 md:px-0 w-max md:w-full snap-x snap-mandatory">
            {[
              {
                icon: Shield,
                title: "Private & Secure",
                desc: "End-to-end encrypted via WebRTC. We never see your files.",
                bg: "bg-neo-pink",
                delay: 0.1
              },
              {
                icon: Zap,
                title: "Blazing Fast",
                desc: "Direct P2P transfer. Speed limited only by your connection.",
                bg: "bg-neo-blue",
                delay: 0.2
              },
              {
                icon: Share2,
                title: "No Limits",
                desc: "Share files of any size. No arbitrary caps or bandwidth limits.",
                bg: "bg-neo-yellow",
                delay: 0.3
              }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 + item.delay }}
                className="w-[280px] md:w-auto snap-center shrink-0"
              >
                <NeoCard className={`h-full flex flex-col items-center text-center space-y-2 p-3 md:space-y-3 hover:-translate-y-2 transition-transform duration-300 ${item.bg}`}>
                  <div className="p-2 bg-white border-2 border-neo-black shadow-neo-sm rounded-none">
                    <item.icon className="w-5 h-5 md:w-6 md:h-6 text-neo-black" strokeWidth={2.5} />
                  </div>
                  <h3 className="text-base md:text-xl font-black uppercase tracking-tight">{item.title}</h3>
                  <p className="text-xs md:text-sm font-bold leading-tight">{item.desc}</p>
                </NeoCard>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.main>
  );
}
