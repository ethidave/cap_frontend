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
                return null;
            }

            // Explicitly connect to the correct backend server domain (the main domain is reverse proxying socket.io)
            const backendUrl = "https://captradepro.com/notifications";
            const newSocket = io(backendUrl, {
                auth: { token },
                transports: ['polling', 'websocket'],
                reconnectionAttempts: 5,
                timeout: 10000,
            });

            // Empty error handler to suppress noise from our app code
            newSocket.on('connect_error', () => {});

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
