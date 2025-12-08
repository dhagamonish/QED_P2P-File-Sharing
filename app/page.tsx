'use client';

import { useRouter } from 'next/navigation';
import { nanoid } from 'nanoid';
import { NeoButton } from '@/components/ui/NeoButton';
import { NeoCard } from '@/components/ui/NeoCard';
import { ArrowRight, Share2, Shield, Zap } from 'lucide-react';

export default function Home() {
  const router = useRouter();

  const startSharing = () => {
    const roomId = nanoid(10);
    router.push(`/room/${roomId}`);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-neo-bg text-neo-black relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-neo-main rounded-full blur-3xl opacity-50 pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-48 h-48 bg-neo-blue rounded-full blur-3xl opacity-50 pointer-events-none" />

      <div className="z-10 max-w-4xl w-full text-center space-y-12">

        {/* Hero Section */}
        <div className="space-y-6 flex flex-col items-center">
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
        </div>

        {/* CTA */}
        <div className="flex justify-center">
          <NeoButton
            size="lg"
            onClick={startSharing}
            className="text-2xl px-12 py-6 flex items-center gap-4 bg-neo-main hover:bg-yellow-400"
          >
            Start Sharing <ArrowRight className="w-8 h-8" />
          </NeoButton>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          <NeoCard className="flex flex-col items-center text-center space-y-4 hover:-translate-y-2 transition-transform">
            <div className="p-4 bg-neo-accent rounded-full border-2 border-neo-black shadow-neo-sm">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-black">Private & Secure</h3>
            <p className="font-medium">End-to-end encrypted via WebRTC. We never see your files.</p>
          </NeoCard>

          <NeoCard className="flex flex-col items-center text-center space-y-4 hover:-translate-y-2 transition-transform">
            <div className="p-4 bg-neo-blue rounded-full border-2 border-neo-black shadow-neo-sm">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-black">Blazing Fast</h3>
            <p className="font-medium">Direct P2P transfer. Speed limited only by your connection.</p>
          </NeoCard>

          <NeoCard className="flex flex-col items-center text-center space-y-4 hover:-translate-y-2 transition-transform">
            <div className="p-4 bg-neo-main rounded-full border-2 border-neo-black shadow-neo-sm">
              <Share2 className="w-8 h-8 text-black" />
            </div>
            <h3 className="text-xl font-black">No Limits</h3>
            <p className="font-medium">Share files of any size. No arbitrary caps or bandwidth limits.</p>
          </NeoCard>
        </div>
      </div>

      <footer className="absolute bottom-4 text-sm font-bold opacity-50">
        Built with Next.js & WebRTC
      </footer>
    </main>
  );
}
