'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { QRCodeSVG } from 'qrcode.react';
import { Copy, Check, Smartphone, Monitor, Home, Send, FileText, MessageSquare } from 'lucide-react';
import { useSignaling } from '@/lib/webrtc/SignalingContext';
import { useFileTransfer } from '@/hooks/useFileTransfer';
import { FileDropzone } from '@/components/FileDropzone';
import { NeoCard } from '@/components/ui/NeoCard';
import { NeoButton } from '@/components/ui/NeoButton';

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
        const url = window.location.href;
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleFilesSelected = async (selectedFiles: File[]) => {
        setFiles(selectedFiles);
        if (connectionState === 'connected') {
            setSending(true);
            for (const file of selectedFiles) {
                await sendFile(file);
            }
            setSending(false);
            setFiles([]);
        }
    };

    const handleSendText = () => {
        if (textMessage.trim() && connectionState === 'connected') {
            sendText(textMessage);
            setReceivedMessages(prev => [...prev, `You: ${textMessage}`]);
            setTextMessage('');
        }
    };

    return (
        <main className="min-h-screen p-4 bg-neo-bg text-neo-black flex flex-col items-center">
            <header className="w-full max-w-4xl flex justify-between items-center mb-8">
                <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                    <div className="bg-neo-black text-white p-2 rounded-lg">
                        <Home className="w-6 h-6" />
                    </div>
                    <h1 className="text-2xl font-black">NOTESQR</h1>
                </Link>
                <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${isSignalingConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                    <span className="font-bold text-sm">{isSignalingConnected ? 'Server Connected' : 'Connecting...'}</span>
                </div>
            </header>

            <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column: Connection Info */}
                <div className="space-y-6">
                    <NeoCard className="space-y-6">
                        <div className="text-center space-y-2">
                            <h2 className="text-2xl font-black">SCAN TO CONNECT</h2>
                            <p className="font-medium text-gray-600">Open this on another device</p>
                        </div>

                        <div className="flex justify-center p-4 bg-white border-2 border-neo-black rounded-xl">
                            <QRCodeSVG value={typeof window !== 'undefined' ? window.location.href : ''} size={200} />
                        </div>

                        <div className="flex items-center gap-2">
                            <div className="flex-1 h-12 bg-white border-2 border-neo-black flex items-center px-3 font-mono text-sm overflow-hidden whitespace-nowrap">
                                {typeof window !== 'undefined' ? window.location.href : 'Loading...'}
                            </div>
                            <NeoButton onClick={copyLink} size="sm" className="h-12 w-12 flex items-center justify-center px-0">
                                {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                            </NeoButton>
                        </div>
                    </NeoCard>

                    <NeoCard variant="flat" className="bg-neo-blue/20 border-neo-blue">
                        <h3 className="font-black text-lg mb-2 flex items-center gap-2">
                            <Monitor className="w-5 h-5" /> Status
                        </h3>
                        <div className="space-y-2">
                            <div className="flex justify-between font-bold">
                                <span>P2P Connection:</span>
                                <span className={`
                  ${connectionState === 'connected' ? 'text-green-600' :
                                        connectionState === 'connecting' ? 'text-yellow-600' :
                                            connectionState === 'failed' ? 'text-red-600' : 'text-gray-600'}
                `}>
                                    {connectionState.toUpperCase()}
                                </span>
                            </div>
                        </div>
                    </NeoCard>
                </div>

                {/* Right Column: Transfer Area */}
                <div className="space-y-6">
                    <NeoCard className="h-full min-h-[500px] flex flex-col relative overflow-hidden p-0">
                        {/* Tabs */}
                        <div className="flex border-b-2 border-neo-black">
                            <button
                                onClick={() => setActiveTab('files')}
                                className={`flex-1 p-4 font-black flex items-center justify-center gap-2 transition-colors ${activeTab === 'files' ? 'bg-neo-yellow' : 'bg-white hover:bg-gray-50'
                                    }`}
                            >
                                <FileText className="w-5 h-5" /> FILES
                            </button>
                            <button
                                onClick={() => setActiveTab('text')}
                                className={`flex-1 p-4 font-black flex items-center justify-center gap-2 transition-colors border-l-2 border-neo-black ${activeTab === 'text' ? 'bg-neo-yellow' : 'bg-white hover:bg-gray-50'
                                    }`}
                            >
                                <MessageSquare className="w-5 h-5" /> TEXT
                            </button>
                        </div>

                        <div className="p-6 flex-1 flex flex-col">
                            {connectionState === 'connected' ? (
                                <>
                                    {activeTab === 'files' ? (
                                        <div className="flex-1 flex flex-col">
                                            {!sending && !incomingFile && <FileDropzone onFilesSelected={handleFilesSelected} />}

                                            {sending && (
                                                <div className="flex-1 flex flex-col items-center justify-center space-y-4">
                                                    <div className="w-full bg-gray-200 h-4 rounded-full overflow-hidden border-2 border-neo-black">
                                                        <div className="h-full bg-neo-main transition-all duration-100" style={{ width: `${progress}%` }} />
                                                    </div>
                                                    <p className="font-bold">Sending... {Math.round(progress)}%</p>
                                                </div>
                                            )}

                                            {incomingFile && (
                                                <div className="flex-1 flex flex-col items-center justify-center space-y-4 animate-pulse">
                                                    <div className="w-full bg-gray-200 h-4 rounded-full overflow-hidden border-2 border-neo-black">
                                                        <div className="h-full bg-neo-blue transition-all duration-100" style={{ width: `${progress}%` }} />
                                                    </div>
                                                    <p className="font-bold">Receiving {incomingFile.name}... {Math.round(progress)}%</p>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="flex-1 flex flex-col h-full">
                                            <div className="flex-1 bg-gray-100 border-2 border-neo-black rounded-xl p-4 mb-4 overflow-y-auto max-h-[300px] space-y-2">
                                                {receivedMessages.length === 0 && (
                                                    <p className="text-gray-400 text-center mt-10">No messages yet</p>
                                                )}
                                                {receivedMessages.map((msg, idx) => (
                                                    <div key={idx} className={`p-3 rounded-lg max-w-[80%] ${msg.startsWith('You:') ? 'bg-neo-blue text-white ml-auto' : 'bg-white border-2 border-neo-black'}`}>
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
                                                    className="flex-1 border-2 border-neo-black rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-neo-main"
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
                </div>
            </div>
        </main>
    );
}
