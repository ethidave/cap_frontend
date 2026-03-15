"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Bell, X, MessageSquare, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSocket } from "./SocketProvider";
import { api } from "@/lib/api";

export default function AdminBell() {
    const { socket } = useSocket();
    const [notifications, setNotifications] = useState<any[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const reminderIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const ringCountRef = useRef(0);

    const NOTIFICATION_SOUND = "https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3";

    useEffect(() => {
        fetchNotifications();

        // Listen for real-time notifications
        if (socket) {
            socket.on('notification', (notif) => {
                setNotifications(prev => [notif, ...prev]);
                setUnreadCount(prev => prev + 1);
                handleNewNotification();
            });

            socket.on('support_update', (msg) => {
                // Support update broadcast might not be a formal "notification" object
                // but we want to alert the admin anyway
                handleNewNotification();
                fetchNotifications(); // Refresh list to see the new message notification if created
            });
        }

        return () => {
            if (socket) {
                socket.off('notification');
                socket.off('support_update');
            }
            if (reminderIntervalRef.current) clearInterval(reminderIntervalRef.current);
        };
    }, [socket]);

    const fetchNotifications = async () => {
        try {
            const data = await api.get("/admin/notifications/unread"); // I'll need to create this endpoint or use general /notifications
            setNotifications(data || []);
            setUnreadCount(data?.filter((n: any) => !n.isRead).length || 0);
        } catch (e) {
            // Fallback to general notifications if unread endpoint fails
            try {
                const all = await api.get("/notifications");
                setNotifications(all || []);
                setUnreadCount(all?.filter((n: any) => !n.isRead).length || 0);
            } catch (err) { }
        }
    };

    const playSound = () => {
        if (!audioRef.current) {
            audioRef.current = new Audio(NOTIFICATION_SOUND);
        }
        audioRef.current.play().catch(e => console.log("Audio play blocked by browser. Interaction required."));
    };

    const handleNewNotification = () => {
        playSound();
        ringCountRef.current = 0; // Reset reminder counter

        // Clear existing interval
        if (reminderIntervalRef.current) clearInterval(reminderIntervalRef.current);

        // Set up "Every 10 minutes" reminder (re-ring up to 4 times)
        reminderIntervalRef.current = setInterval(() => {
            if (ringCountRef.current < 4) {
                playSound();
                ringCountRef.current += 1;
            } else {
                if (reminderIntervalRef.current) clearInterval(reminderIntervalRef.current);
            }
        }, 10 * 60 * 1000); // 10 minutes
    };

    const markAllRead = async () => {
        try {
            await api.post("/notifications/mark-all-read", {});
            setUnreadCount(0);
            setNotifications(notifications.map(n => ({ ...n, isRead: true })));
            if (reminderIntervalRef.current) clearInterval(reminderIntervalRef.current);
        } catch (e) { }
    };

    return (
        <div className="relative">
            <button
                onClick={() => {
                    setIsOpen(!isOpen);
                    if (!isOpen) fetchNotifications();
                    // Stop ringing when they open the menu
                    if (reminderIntervalRef.current) clearInterval(reminderIntervalRef.current);
                }}
                className={`relative p-2.5 rounded-xl transition-all duration-300 ${unreadCount > 0 ? "bg-[#00FFA3]/10 text-[#00FFA3]" : "bg-white/5 text-slate-400 hover:text-white"}`}
            >
                <Bell className={`w-5 h-5 ${unreadCount > 0 ? "animate-bounce" : ""}`} />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#00FFA3] text-[#020617] text-[10px] font-black rounded-full flex items-center justify-center border-2 border-[#020617] shadow-[0_0_10px_#00FFA3]">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 z-[60]"
                        />
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute right-0 mt-4 w-96 bg-[#0a0f1d] border border-white/10 rounded-[2rem] shadow-2xl z-[70] overflow-hidden backdrop-blur-xl"
                        >
                            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                                <h4 className="text-white font-black text-sm uppercase tracking-widest flex items-center gap-2">
                                    <Bell className="w-4 h-4 text-[#00FFA3]" /> Notifications
                                </h4>
                                <button
                                    onClick={markAllRead}
                                    className="text-[10px] font-black text-[#00FFA3] uppercase hover:underline"
                                >
                                    Mark all read
                                </button>
                            </div>

                            <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                                {notifications.length === 0 ? (
                                    <div className="p-12 text-center flex flex-col items-center gap-4">
                                        <div className="w-16 h-16 rounded-full bg-white/[0.02] flex items-center justify-center text-slate-700">
                                            <Bell className="w-8 h-8" />
                                        </div>
                                        <p className="text-slate-500 font-bold text-xs uppercase tracking-widest leading-relaxed">System is quiet.<br />No new alerts.</p>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-white/5">
                                        {notifications.map((n) => (
                                            <div
                                                key={n.id}
                                                className={`p-5 hover:bg-white/[0.02] transition-colors group cursor-default ${!n.isRead ? "bg-[#00FFA3]/5" : ""}`}
                                            >
                                                <div className="flex gap-4">
                                                    <div className={`mt-1 h-2 w-2 rounded-full shrink-0 ${!n.isRead ? "bg-[#00FFA3]" : "bg-slate-700"}`} />
                                                    <div className="space-y-1">
                                                        <h5 className="text-white font-bold text-sm group-hover:text-[#00FFA3] transition-colors">{n.title}</h5>
                                                        <p className="text-slate-400 text-xs leading-relaxed">{n.message}</p>
                                                        <div className="flex items-center gap-2 pt-2">
                                                            <Clock className="w-3 h-3 text-slate-600" />
                                                            <span className="text-[10px] font-bold text-slate-600 uppercase">
                                                                {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <Link
                                href="/admin/support"
                                className="block p-5 bg-white/[0.02] border-t border-white/5 text-center text-xs font-black text-slate-400 uppercase tracking-widest hover:text-white hover:bg-white/[0.05] transition-all"
                                onClick={() => setIsOpen(false)}
                            >
                                View All Support Desk
                            </Link>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
