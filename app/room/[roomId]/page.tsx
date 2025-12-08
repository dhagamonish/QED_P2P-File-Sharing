'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { QRCodeSVG } from 'qrcode.react';
import { Copy, Check, Smartphone, Monitor, Send, FileText, MessageSquare, Info, AlertTriangle, X, File, Shield } from 'lucide-react';
import { useSignaling } from '@/lib/webrtc/SignalingContext';
import { useFileTransfer } from '@/hooks/useFileTransfer';
import { FileDropzone } from '@/components/FileDropzone';
import { NeoCard } from '@/components/ui/NeoCard';
import { NeoButton } from '@/components/ui/NeoButton';
import { motion } from 'framer-motion';
import ParticlesBackground from "@/components/ui/ParticlesBackground";

export default function RoomPage() {
    const params = useParams();
    const roomId = params.roomId as string;
    const { joinRoom, isConnected: isSignalingConnected } = useSignaling();
    const { connectionState, sendFile, sendText, progress, incomingFile, incomingText } = useFileTransfer(roomId);
    const [copied, setCopied] = useState(false);
    const [files, setFiles] = useState<File[]>([]);
    const [sending, setSending] = useState(false);
    const [activeTab, setActiveTab] = useState<'files' | 'text'>('files');
    const [textMessage, setTextMessage] = useState('');
    const [receivedMessages, setReceivedMessages] = useState<string[]>([]);
    const [currentUrl, setCurrentUrl] = useState('');

    // Multi-file state
    const [transferQueue, setTransferQueue] = useState<{ file: File, status: 'pending' | 'sending' | 'completed' | 'error' }[]>([]);
    const [queueStatus, setQueueStatus] = useState<'idle' | 'sending' | 'completed'>('idle');

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setCurrentUrl(window.location.href);
        }
    }, []);

    useEffect(() => {
        if (isSignalingConnected && roomId) {
            joinRoom(roomId);
        }
    }, [isSignalingConnected, roomId, joinRoom]);

    useEffect(() => {
        if (incomingText) {
            setReceivedMessages(prev => [...prev, incomingText]);
        }
    }, [incomingText]);

    const copyLink = () => {
        if (currentUrl) {
            navigator.clipboard.writeText(currentUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleFilesSelected = (selectedFiles: File[]) => {
        // Just add to staging, don't send yet
        setFiles(prev => [...prev, ...selectedFiles]);
    };

    const handleStartTransfer = async () => {
        if (files.length === 0 || connectionState !== 'connected') return;

        setSending(true);
        setQueueStatus('sending');

        // Initialize queue
        const initialQueue = files.map(f => ({ file: f, status: 'pending' as const }));
        setTransferQueue(initialQueue);

        // Process queue sequentially
        for (let i = 0; i < files.length; i++) {
            const file = files[i];

            // Update status to sending
            setTransferQueue(prev => prev.map((item, idx) => idx === i ? { ...item, status: 'sending' } : item));

            try {
                await sendFile(file);
                // Update status to completed
                setTransferQueue(prev => prev.map((item, idx) => idx === i ? { ...item, status: 'completed' } : item));
            } catch (error) {
                console.error("Error sending file:", file.name, error);
                setTransferQueue(prev => prev.map((item, idx) => idx === i ? { ...item, status: 'error' } : item));
            }
        }

        setSending(false);
        setQueueStatus('completed');
    };

    const handleReset = () => {
        setFiles([]);
        setTransferQueue([]);
        setQueueStatus('idle');
    };

    const handleSendText = () => {
        if (textMessage.trim() && connectionState === 'connected') {
            sendText(textMessage);
            setReceivedMessages(prev => [...prev, `You: ${textMessage}`]);
            setTextMessage('');
        }
    };

    return (
        <motion.main
            className="flex-1 w-full flex flex-col items-center justify-start p-4 md:p-8 bg-transparent text-neo-black overflow-y-auto md:overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <ParticlesBackground />

            <header className="w-full max-w-5xl flex justify-between items-center mb-4 md:mb-8 shrink-0">
                <Link href="/" className="flex items-center gap-4 hover:opacity-80 transition-opacity">
                    <img src="/logo.png" alt="Q.E.D. Logo" className="w-10 h-10 md:w-12 md:h-12 object-contain border-2 border-neo-black bg-neo-white shadow-neo-sm rounded-none" />
                </Link>
                <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-full border-2 border-neo-black shadow-neo-sm">
                    <div className={`w-3 h-3 rounded-full ${isSignalingConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                    <span className="font-bold text-xs md:text-sm">{isSignalingConnected ? 'Connected' : 'Connecting...'}</span>
                </div>
            </header>

            <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-4 h-full md:h-auto items-stretch overflow-hidden">
                {/* Left Column: Connection Info */}
                <motion.div
                    className="flex flex-col gap-4 overflow-y-auto md:overflow-visible"
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <NeoCard className="space-y-4 p-4 flex-1 flex flex-col justify-center">
                        <div className="text-center space-y-1">
                            <h2 className="text-xl font-black">SCAN TO CONNECT</h2>
                            <p className="font-medium text-gray-600 text-sm">Open this on another device</p>
                        </div>

                        <div className="flex justify-center">
                            {currentUrl && <QRCodeSVG value={currentUrl} size={150} />}
                        </div>

                        <div className="flex items-center gap-2">
                            <div className="flex-1 h-10 bg-white border-2 border-neo-black flex items-center px-3 font-mono text-xs overflow-hidden whitespace-nowrap">
                                {currentUrl || 'Loading...'}
                            </div>
                            <NeoButton onClick={copyLink} size="sm" className="h-10 w-10 flex items-center justify-center px-0">
                                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            </NeoButton>
                        </div>
                    </NeoCard>

                    <NeoCard variant="flat" className="bg-neo-blue/20 border-neo-blue p-3 shrink-0">
                        <h3 className="font-black text-base mb-1 flex items-center gap-2">
                            <Monitor className="w-4 h-4" /> Status
                        </h3>
                        <div className="space-y-1">
                            <div className="flex justify-between items-center font-bold text-sm">
                                <span>P2P Connection:</span>
                                <div className={`flex items-center gap-2 px-2 py-0.5 rounded-full border-2 border-neo-black ${connectionState === 'connected' ? 'bg-green-100 text-green-700' :
                                    connectionState === 'failed' ? 'bg-red-100 text-red-700' :
                                        'bg-yellow-100 text-yellow-700'
                                    }`}>
                                    <div className={`w-1.5 h-1.5 rounded-full ${connectionState === 'connected' ? 'bg-green-600' :
                                        connectionState === 'failed' ? 'bg-red-600' :
                                            'bg-yellow-600'
                                        }`} />
                                    <span className="text-xs">
                                        {connectionState === 'connected' ? 'ONLINE' :
                                            connectionState === 'failed' ? 'OFFLINE' :
                                                connectionState.toUpperCase()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </NeoCard>
                </motion.div>

                {/* Right Column: Transfer Area */}
                <motion.div
                    className="space-y-6 h-full"
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                >
                    <NeoCard className="h-full md:min-h-[400px] flex flex-col relative overflow-hidden p-0">
                        {/* Tabs */}
                        <div className="flex border-b-2 border-neo-black">
                            <button
                                onClick={() => setActiveTab('files')}
                                className={`flex-1 p-4 font-black flex items-center justify-center gap-2 transition-all duration-200 ${activeTab === 'files'
                                    ? 'bg-neo-blue text-white'
                                    : 'bg-white hover:bg-yellow-100'
                                    }`}
                            >
                                <FileText className="w-5 h-5" /> FILES
                            </button>
                            <button
                                onClick={() => setActiveTab('text')}
                                className={`flex-1 p-4 font-black flex items-center justify-center gap-2 transition-all duration-200 border-l-2 border-neo-black ${activeTab === 'text'
                                    ? 'bg-neo-blue text-white'
                                    : 'bg-white hover:bg-yellow-100'
                                    }`}
                            >
                                <MessageSquare className="w-5 h-5" /> TEXT
                            </button>
                        </div>

                        <div className="p-6 flex-1 flex flex-col relative">
                            {connectionState === 'connected' ? (
                                <>
                                    {activeTab === 'files' ? (
                                        <div className="flex-1 flex flex-col h-full overflow-hidden">
                                            {/* 1. STAGING STATE: Files selected but not sending yet */}
                                            {files.length > 0 && !sending && queueStatus === 'idle' && (
                                                <div className="flex-1 flex flex-col gap-4 h-full">
                                                    <div className="flex-1 overflow-y-auto space-y-2 pr-2">
                                                        <div className="flex justify-between items-center mb-2">
                                                            <h3 className="font-bold text-lg">Selected Files ({files.length})</h3>
                                                            <NeoButton size="sm" onClick={() => setFiles([])} className="bg-red-100 text-red-600 border-red-600 h-8 px-2">Clear All</NeoButton>
                                                        </div>
                                                        {files.map((file, idx) => (
                                                            <div key={idx} className="flex justify-between items-center p-3 bg-white border-2 border-neo-black shadow-neo-sm">
                                                                <div className="flex items-center gap-3 overflow-hidden">
                                                                    <div className="bg-neo-yellow p-1.5 border-2 border-neo-black">
                                                                        <File className="w-5 h-5" />
                                                                    </div>
                                                                    <div className="flex flex-col truncate">
                                                                        <span className="font-bold truncate text-sm">{file.name}</span>
                                                                        <span className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                                                                    </div>
                                                                </div>
                                                                <button onClick={() => setFiles(prev => prev.filter((_, i) => i !== idx))} className="ml-2 hover:bg-red-100 p-1 rounded-full transition-colors">
                                                                    <X className="w-4 h-4 text-neo-black" />
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>

                                                    <div className="mt-auto border-t-2 border-neo-black pt-4">
                                                        <div className="flex gap-3">
                                                            <NeoButton onClick={() => setFiles([])} className="flex-1 bg-white hover:bg-gray-100">
                                                                Cancel
                                                            </NeoButton>
                                                            <NeoButton onClick={handleStartTransfer} className="flex-[2] bg-neo-green text-white hover:bg-green-600 flex items-center justify-center gap-2">
                                                                Send {files.length} Files <Send className="w-4 h-4" />
                                                            </NeoButton>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* 2. SENDING STATE: Batch transfer in progress */}
                                            {sending && (
                                                <div className="flex-1 flex flex-col gap-4 h-full">
                                                    <h3 className="font-bold text-lg mb-2">Sending Files...</h3>
                                                    <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                                                        {transferQueue.map((item, idx) => (
                                                            <div key={idx} className={`p-3 border-2 border-neo-black shadow-neo-sm transition-all ${item.status === 'completed' ? 'bg-green-50 opacity-80' :
                                                                item.status === 'sending' ? 'bg-white scale-[1.02]' :
                                                                    'bg-gray-50 opacity-60'
                                                                }`}>
                                                                <div className="flex justify-between items-center mb-2">
                                                                    <span className="font-bold text-sm truncate max-w-[70%]">{item.file.name}</span>
                                                                    <span className="text-xs font-mono font-bold">
                                                                        {item.status === 'completed' ? 'DONE' :
                                                                            item.status === 'sending' ? `${Math.round(progress)}%` :
                                                                                'WAITING'}
                                                                    </span>
                                                                </div>
                                                                <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden border border-neo-black">
                                                                    <div
                                                                        className={`h-full transition-all duration-200 ${item.status === 'completed' ? 'bg-neo-green' : 'bg-neo-yellow'}`}
                                                                        style={{
                                                                            width: item.status === 'completed' ? '100%' :
                                                                                item.status === 'sending' ? `${progress}%` : '0%'
                                                                        }}
                                                                    />
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div className="text-center font-bold text-sm animate-pulse mt-2">
                                                        Please keep this tab open!
                                                    </div>
                                                </div>
                                            )}

                                            {/* 3. COMPLETED STATE: All done */}
                                            {queueStatus === 'completed' && !sending && (
                                                <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6 animate-in zoom-in duration-300">
                                                    <div className="bg-neo-green p-4 rounded-full border-4 border-neo-black shadow-neo-lg mb-2">
                                                        <Check className="w-12 h-12 text-white" strokeWidth={4} />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <h2 className="text-3xl font-black uppercase">Start Playing!</h2>
                                                        <p className="font-bold text-gray-600">All {files.length} files sent successfully.</p>
                                                    </div>
                                                    <NeoButton onClick={handleReset} size="lg" className="bg-neo-blue text-white w-full max-w-[200px] shadow-neo-lg">
                                                        Send More
                                                    </NeoButton>
                                                </div>
                                            )}

                                            {/* 4. DEFAULT EMPTY STATE */}
                                            {files.length === 0 && !incomingFile && queueStatus === 'idle' && (
                                                <div className="flex-1 flex flex-col h-full">
                                                    <FileDropzone onFilesSelected={handleFilesSelected} />
                                                </div>
                                            )}

                                            {/* INCOMING FILE STATE (Receiver) */}
                                            {incomingFile && (
                                                <div className="flex-1 flex flex-col items-center justify-center space-y-6">
                                                    <div className="p-6 bg-white border-4 border-neo-black shadow-neo-lg text-center max-w-sm">
                                                        <div className="animate-spin-slow mb-4 inline-block">
                                                            <Smartphone className="w-12 h-12 text-neo-blue" />
                                                        </div>
                                                        <h3 className="text-xl font-black mb-1 break-all">{incomingFile.name}</h3>
                                                        <p className="text-sm font-bold text-gray-500 mb-4">
                                                            {(incomingFile.size / 1024 / 1024).toFixed(2)} MB
                                                        </p>
                                                        <div className="w-full bg-gray-200 h-6 rounded-full overflow-hidden border-2 border-neo-black relative">
                                                            <div className="h-full bg-neo-blue transition-all duration-100" style={{ width: `${progress}%` }} />
                                                            <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black tracking-widest text-white mix-blend-difference">
                                                                {Math.round(progress)}%
                                                            </span>
                                                        </div>
                                                        <p className="mt-2 text-xs font-bold animate-pulse">Downloading...</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="flex-1 flex flex-col h-full">
                                            {/* Chat UI remains the same */}
                                            <div className="flex-1 bg-gray-100 border-2 border-neo-black rounded-xl p-4 mb-4 overflow-y-auto max-h-[300px] space-y-2">
                                                {receivedMessages.length === 0 && (
                                                    <p className="text-gray-400 text-center mt-10">No messages yet</p>
                                                )}
                                                {receivedMessages.map((msg, idx) => (
                                                    <div key={idx} className={`p-3 rounded-lg max-w-[80%] ${msg.startsWith('You:') ? 'bg-neo-blue text-neo-black border-2 border-neo-black ml-auto' : 'bg-white border-2 border-neo-black'}`}>
                                                        {msg}
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    value={textMessage}
                                                    onChange={(e) => setTextMessage(e.target.value)}
                                                    onKeyDown={(e) => e.key === 'Enter' && handleSendText()}
                                                    placeholder="Type a message..."
                                                    className="flex-1 border-2 border-neo-black rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-neo-yellow"
                                                />
                                                <NeoButton onClick={handleSendText} size="sm">
                                                    <Send className="w-5 h-5" />
                                                </NeoButton>
                                            </div>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="flex-1 flex flex-col items-center justify-center text-center p-8 opacity-50">
                                    <Smartphone className="w-16 h-16 mb-4 animate-pulse" />
                                    <h3 className="text-xl font-bold">Waiting for peer...</h3>
                                    <p>Scan the QR code or share the link to start sharing.</p>
                                </div>
                            )}
                        </div>
                    </NeoCard>
                </motion.div>
            </div>
        </motion.main >
    );
}
