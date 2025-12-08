'use client';

import { useRouter } from 'next/navigation';
import { nanoid } from 'nanoid';
import { NeoButton } from '@/components/ui/NeoButton';
import { NeoCard } from '@/components/ui/NeoCard';
import { ArrowRight, Share2, Shield, Zap } from 'lucide-react';

import { motion } from 'framer-motion';

export default function Home() {
  const router = useRouter();

  const startSharing = () => {
    const roomId = nanoid(10);
    router.push(`/room/${roomId}`);
  };

  return (
    <motion.main
      className="min-h-screen flex flex-col items-center justify-center p-4 bg-transparent text-neo-black relative overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Decorative Background Elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-neo-main rounded-full blur-3xl opacity-50 pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-48 h-48 bg-neo-blue rounded-full blur-3xl opacity-50 pointer-events-none" />

      <div className="z-10 max-w-4xl w-full text-center space-y-12">

        {/* Hero Section */}
        <motion.div
          className="space-y-6 flex flex-col items-center"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
        >
          <div className="w-48 h-48 relative mb-4">
            <img src="/logo.png" alt="Q.E.D. Logo" className="w-full h-full object-contain drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]" />
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">
            SEND <span className="text-neo-main">FILES</span>
            <br />
            <span className="text-neo-blue">INSTANTLY</span>
          </h1>
          <p className="text-xl md:text-2xl font-bold max-w-2xl mx-auto">
            Peer-to-peer file sharing. No limits. No logs. No servers.
            <br />
            Just you and the receiver.
          </p>
        </motion.div>

        {/* CTA */}
        <motion.div
          className="flex justify-center"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <NeoButton
            size="lg"
            onClick={startSharing}
            className="text-2xl px-12 py-6 flex items-center gap-4 bg-neo-main hover:bg-yellow-400"
          >
            Start Sharing <ArrowRight className="w-8 h-8" />
          </NeoButton>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          {[
            { icon: Shield, title: "Private & Secure", desc: "End-to-end encrypted via WebRTC. We never see your files.", color: "bg-neo-accent" },
            { icon: Zap, title: "Blazing Fast", desc: "Direct P2P transfer. Speed limited only by your connection.", color: "bg-neo-blue" },
            { icon: Share2, title: "No Limits", desc: "Share files of any size. No arbitrary caps or bandwidth limits.", color: "bg-neo-main" }
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + (idx * 0.1) }}
            >
              <NeoCard className="flex flex-col items-center text-center space-y-4 hover:-translate-y-2 transition-transform h-full">
                <div className={`p-4 ${feature.color} rounded-full border-2 border-neo-black shadow-neo-sm`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-black">{feature.title}</h3>
                <p className="font-medium">{feature.desc}</p>
              </NeoCard>
            </motion.div>
          ))}
        </div>
      </div>

      <footer className="absolute bottom-4 text-sm font-bold opacity-50">
        Built with Next.js & WebRTC
      </footer>
    </motion.main>
  );
}
