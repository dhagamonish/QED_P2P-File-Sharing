'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { QRCodeSVG } from 'qrcode.react';
import { Copy, Check, Smartphone, Monitor } from 'lucide-react';
import { useSignaling } from '@/lib/webrtc/SignalingContext';
import { useFileTransfer } from '@/hooks/useFileTransfer';
import { FileDropzone } from '@/components/FileDropzone';
import { NeoCard } from '@/components/ui/NeoCard';
import { NeoButton } from '@/components/ui/NeoButton';

export default function RoomPage() {
    const params = useParams();
    const roomId = params.roomId as string;
    const { joinRoom, isConnected: isSignalingConnected } = useSignaling();
    const { connectionState, sendFile, progress, incomingFile } = useFileTransfer(roomId);
    const [copied, setCopied] = useState(false);
    const [files, setFiles] = useState<File[]>([]);
    const [sending, setSending] = useState(false);

    useEffect(() => {
        if (isSignalingConnected && roomId) {
            joinRoom(roomId);
        }
    }, [isSignalingConnected, roomId, joinRoom]);

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

    return (
        <main className="min-h-screen p-4 bg-neo-bg text-neo-black flex flex-col items-center">
            <header className="w-full max-w-4xl flex justify-between items-center mb-8">
                <h1 className="text-2xl font-black">NOTESQR</h1>
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

                {/* Right Column: File Transfer */}
                <div className="space-y-6">
                    <NeoCard className="h-full min-h-[400px] flex flex-col relative overflow-hidden">
                        <h2 className="text-2xl font-black mb-6">SEND FILES</h2>

                        {connectionState === 'connected' ? (
                            <>
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
                            </>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 opacity-50">
                                <Smartphone className="w-16 h-16 mb-4 animate-pulse" />
                                <h3 className="text-xl font-bold">Waiting for peer...</h3>
                                <p>Scan the QR code or share the link to start sending files.</p>
                            </div>
                        )}
                    </NeoCard>
                </div>
            </div>
        </main>
    );
}
