'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface SignalingContextType {
    socket: Socket | null;
    isConnected: boolean;
    joinRoom: (roomId: string) => void;
}

const SignalingContext = createContext<SignalingContextType>({
    socket: null,
    isConnected: false,
    joinRoom: () => { },
});

export const useSignaling = () => useContext(SignalingContext);

export const SignalingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const socketInstance = io({
            path: '/socket.io', // Default path, but good to be explicit if we change it
        });

        socketInstance.on('connect', () => {
            console.log('Connected to signaling server:', socketInstance.id);
            setIsConnected(true);
        });

        socketInstance.on('disconnect', () => {
            console.log('Disconnected from signaling server');
            setIsConnected(false);
        });

        setSocket(socketInstance);

        return () => {
            socketInstance.disconnect();
        };
    }, []);

    const joinRoom = (roomId: string) => {
        if (socket) {
            socket.emit('join-room', roomId);
        }
    };

    return (
        <SignalingContext.Provider value={{ socket, isConnected, joinRoom }}>
            {children}
        </SignalingContext.Provider>
    );
};
