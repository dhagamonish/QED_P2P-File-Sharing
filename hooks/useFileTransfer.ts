'use client';

import { useEffect, useRef, useState } from 'react';
import { useSignaling } from '@/lib/webrtc/SignalingContext';
import type { Instance as PeerInstance, SignalData } from 'simple-peer';

interface FileMeta {
    name: string;
    size: number;
    mimeType: string;
}

interface IncomingFile {
    meta: FileMeta;
    chunks: ArrayBuffer[];
    receivedSize: number;
}

export const useFileTransfer = (roomId: string) => {
    const { socket } = useSignaling();
    const [peer, setPeer] = useState<PeerInstance | null>(null);
    const [connectionState, setConnectionState] = useState<'disconnected' | 'connecting' | 'connected' | 'failed'>('disconnected');
    const [progress, setProgress] = useState(0);
    const [incomingFile, setIncomingFile] = useState<FileMeta | null>(null);

    const peerRef = useRef<PeerInstance | null>(null);
    const incomingFileRef = useRef<IncomingFile | null>(null);

    useEffect(() => {
        if (!socket || !roomId) return;

        const handleUserConnected = async (userId: string) => {
            console.log('User connected, initiating peer connection to:', userId);
            const SimplePeer = (await import('simple-peer')).default;

            const p = new SimplePeer({
                initiator: true,
                trickle: false,
            });

            setupPeerEvents(p, userId, true);
        };

        const handleOffer = async (payload: { sdp: SignalData, caller: string }) => {
            console.log('Received offer from:', payload.caller);
            const SimplePeer = (await import('simple-peer')).default;

            const p = new SimplePeer({
                initiator: false,
                trickle: false,
            });

            p.signal(payload.sdp);
            setupPeerEvents(p, payload.caller, false);
        };

        const setupPeerEvents = (p: PeerInstance, targetId: string, isInitiator: boolean) => {
            p.on('signal', (data) => {
                if (isInitiator) {
                    socket.emit('offer', { target: targetId, sdp: data });
                } else {
                    socket.emit('answer', { target: targetId, sdp: data });
                }
            });

            p.on('connect', () => {
                console.log('Peer connected!');
                setConnectionState('connected');
            });

            p.on('data', (data) => {
                handleData(data);
            });

            p.on('error', (err) => {
                console.error('Peer error:', err);
                setConnectionState('failed');
            });

            p.on('close', () => {
                setConnectionState('disconnected');
                setPeer(null);
            });

            peerRef.current = p;
            setPeer(p);
        };

        const handleAnswer = (payload: { sdp: SignalData }) => {
            console.log('Received answer');
            peerRef.current?.signal(payload.sdp);
        };

        const handleIceCandidate = (payload: { candidate: SignalData }) => {
            peerRef.current?.signal(payload.candidate);
        };

        socket.on('user-connected', handleUserConnected);
        socket.on('offer', handleOffer);
        socket.on('answer', handleAnswer);
        socket.on('ice-candidate', handleIceCandidate);

        return () => {
            socket.off('user-connected', handleUserConnected);
            socket.off('offer', handleOffer);
            socket.off('answer', handleAnswer);
            socket.off('ice-candidate', handleIceCandidate);
            peerRef.current?.destroy();
        };
    }, [socket, roomId]);

    const handleData = (data: any) => {
        if (data.toString().includes('{"type":"meta"')) {
            try {
                const payload = JSON.parse(data.toString());
                const meta = payload.meta;
                console.log('Receiving file:', meta);
                incomingFileRef.current = {
                    meta,
                    chunks: [],
                    receivedSize: 0
                };
                setIncomingFile(meta);
                setProgress(0);
            } catch (e) {
                console.error('Error parsing meta:', e);
            }
        } else if (incomingFileRef.current) {
            const chunk = data as ArrayBuffer;
            incomingFileRef.current.chunks.push(chunk);
            incomingFileRef.current.receivedSize += chunk.byteLength;

            const percent = (incomingFileRef.current.receivedSize / incomingFileRef.current.meta.size) * 100;
            setProgress(percent);

            if (incomingFileRef.current.receivedSize >= incomingFileRef.current.meta.size) {
                console.log('File received completely');
                saveFile(incomingFileRef.current);
                incomingFileRef.current = null;
                setIncomingFile(null);
                setProgress(0);
            }
        }
    };

    const saveFile = (fileData: IncomingFile) => {
        const blob = new Blob(fileData.chunks, { type: fileData.meta.mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileData.meta.name;
        a.click();
        URL.revokeObjectURL(url);
    };

    const sendFile = async (file: File) => {
        if (!peerRef.current || connectionState !== 'connected') return;

        const meta: FileMeta = {
            name: file.name,
            size: file.size,
            mimeType: file.type
        };
        peerRef.current.send(JSON.stringify({ type: 'meta', meta }));

        const chunkSize = 16 * 1024;
        let offset = 0;

        const readSlice = (o: number) => {
            const slice = file.slice(o, o + chunkSize);
            const reader = new FileReader();
            reader.onload = (e) => {
                if (e.target?.result && peerRef.current) {
                    peerRef.current.send(e.target.result as ArrayBuffer);
                    offset += chunkSize;

                    const percent = Math.min((offset / file.size) * 100, 100);
                    setProgress(percent);

                    if (offset < file.size) {
                        setTimeout(() => readSlice(offset), 0);
                    } else {
                        console.log('File sent');
                        setProgress(0);
                    }
                }
            };
            reader.readAsArrayBuffer(slice);
        };

        readSlice(0);
    };

    return { peer, connectionState, sendFile, progress, incomingFile };
};
