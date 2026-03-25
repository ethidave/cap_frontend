"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const SocketContext = createContext<{ socket: Socket | null }>({ socket: null });

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        const isAdminPath = typeof window !== 'undefined' && window.location.pathname.startsWith('/admin');
        const tokenKey = isAdminPath ? "admin_token" : "user_token";

        const connectSocket = () => {
            const token = localStorage.getItem(tokenKey);
            if (!token) {
                console.warn('⚠️ No socket token found, skipping connection');
                return null;
            }

            const backendUrl = process.env.NEXT_PUBLIC_SOCKET_URL || "https://api.captradepro.com";
            const newSocket = io(`${backendUrl}/notifications`, {
                auth: { token },
                transports: ['polling', 'websocket'],
                reconnectionAttempts: 5,
                timeout: 10000,
            });

            newSocket.on('connect', () => {
                console.log('✅ Notification Socket Connected');
            });

            newSocket.on('connect_error', (err) => {
                console.error('❌ Socket connection error:', err.message);
            });

            setSocket(newSocket);
            return newSocket;
        };

        const activeSocket = connectSocket();

        return () => {
            if (activeSocket) activeSocket.close();
        };
    }, []); // Still [] but now has better logging and helper function

    return (
        <SocketContext.Provider value={{ socket }}>
            {children}
        </SocketContext.Provider>
    );
};
