'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { config } from '@/config/api';

const SOCKET_URL = config.SOCKET_URL;

interface SocketContextType {
    socket: Socket | null;
    connected: boolean;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export function SocketProvider({ children }: { children: React.ReactNode }) {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        const connectSocket = () => {
            const userStr = localStorage.getItem('user');
            if (userStr) {
                const user = JSON.parse(userStr);
                const newSocket = io(SOCKET_URL, {
                    path: '/socket.io',
                    transports: ['websocket'],
                    query: { userId: user.id }
                });

                newSocket.on('connect', () => {
                    console.log('[SOCKET] Conectado com ID:', newSocket.id);
                    setConnected(true);
                    newSocket.emit('join_personal_room', { userId: user.id });
                });

                newSocket.on('disconnect', () => {
                    console.log('[SOCKET] Desconectado');
                    setConnected(false);
                });

                setSocket(newSocket);

                return newSocket;
            }
            return null;
        };

        let currentSocket = connectSocket();

        const handleStorageChange = () => {
            if (currentSocket) currentSocket.disconnect();
            currentSocket = connectSocket();
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            if (currentSocket) currentSocket.disconnect();
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    return (
        <SocketContext.Provider value={{ socket, connected }}>
            {children}
        </SocketContext.Provider>
    );
}

export function useSocket() {
    const context = useContext(SocketContext);
    if (context === undefined) {
        throw new Error('useSocket must be used within a SocketProvider');
    }
    return context;
}
