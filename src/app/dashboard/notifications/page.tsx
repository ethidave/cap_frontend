"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, CheckCircle2, AlertTriangle, Info, AlertOctagon, RefreshCw, Check } from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/components/ToastProvider";

export default function NotificationsPage() {
    const { toast } = useToast();
    const [notifications, setNotifications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'ALL' | 'UNREAD' | 'TRADES' | 'TRANSFERS'>('ALL');

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const data = await api.get('/notifications');
            setNotifications(data || []);
        } catch (err: any) {
            toast("error", "Error", err.message || "Failed to fetch notifications.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const markAsRead = async (id: string) => {
        try {
            await api.patch(`/notifications/${id}/read`, {});
            setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
        } catch (e: any) {
            toast("error", "Error", "Failed to mark as read.");
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'SUCCESS': return <CheckCircle2 className="w-5 h-5 text-[#00FFA3]" />;
            case 'WARNING': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
            case 'CRITICAL': return <AlertOctagon className="w-5 h-5 text-[#f6465d]" />;
            default: return <Info className="w-5 h-5 text-blue-500" />;
        }
    };

    const getBgColor = (type: string, isRead: boolean) => {
        if (isRead) return "bg-white/[0.01]";
        switch (type) {
            case 'SUCCESS': return "bg-[#00FFA3]/5 border-[#00FFA3]/20";
            case 'WARNING': return "bg-yellow-500/5 border-yellow-500/20";
            case 'CRITICAL': return "bg-[#f6465d]/5 border-[#f6465d]/20";
            default: return "bg-blue-500/5 border-blue-500/20";
        }
    };

    const filteredNotifications = notifications.filter(n => {
        const title = n.title.toLowerCase();
        return title.includes('trade') || title.includes('deposit') || title.includes('withdraw');
    });

    const displayNotifications = filteredNotifications.filter(n => {
        if (filter === 'ALL') return true;
        if (filter === 'UNREAD') return !n.isRead;
        const title = n.title.toLowerCase();
        if (filter === 'TRADES') return title.includes('trade');
        if (filter === 'TRANSFERS') return title.includes('deposit') || title.includes('withdraw');
        return true;
    });

    return (
        <div className="space-y-8 w-full max-w-7xl mx-auto pt-6 px-2">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-4 md:px-0">
                <div className="space-y-1">
                    <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
                        <Bell className="w-6 h-6 sm:w-8 sm:h-8 text-[#00FFA3]" /> Notifications
                    </h1>
                    <p className="text-slate-400 text-[13px] sm:text-sm leading-relaxed">Monitor your real-time trade executions and wallet transfers.</p>
                </div>
                <button
                    onClick={fetchNotifications}
                    className="flex items-center gap-2 px-5 py-2.5 bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 rounded-xl transition-all text-slate-300 font-bold text-sm tracking-widest uppercase hover:text-white"
                >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    Refresh Feed
                </button>
            </div>

            {/* Premium Filtering Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
                {['ALL', 'UNREAD', 'TRADES', 'TRANSFERS'].map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f as any)}
                        className={`px-5 py-2 rounded-xl text-xs font-bold tracking-widest uppercase whitespace-nowrap transition-all ${filter === f ? 'bg-[#00FFA3] text-[#020617] shadow-[0_0_20px_rgba(0,255,163,0.3)]' : 'bg-[#1c1f26] text-slate-400 hover:text-white border border-white/5 hover:border-white/20'}`}
                    >
                        {f}
                    </button>
                ))}
            </div>

            <div className="space-y-3">
                {loading ? (
                    <div className="py-24 flex flex-col items-center justify-center text-slate-500">
                        <RefreshCw className="w-10 h-10 animate-spin mb-4 text-[#00FFA3]" />
                        <p className="text-sm font-semibold tracking-wide uppercase">Syncing server...</p>
                    </div>
                ) : displayNotifications.length === 0 ? (
                    <div className="py-24 flex flex-col items-center justify-center text-slate-500 bg-[#0a0f1d] rounded-3xl border border-white/5 shadow-2xl">
                        <Bell className="w-16 h-16 mb-4 opacity-10" />
                        <p className="font-medium text-slate-400 flex items-center gap-2">No alerts found for this filter. <CheckCircle2 className="w-4 h-4 text-[#00FFA3]/50" /></p>
                    </div>
                ) : (
                    <AnimatePresence>
                        {displayNotifications.map((n) => (
                            <motion.div
                                key={n.id}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className={`flex items-start gap-5 p-6 rounded-2xl border transition-all duration-300 relative overflow-hidden group ${getBgColor(n.type, n.isRead)} ${n.isRead ? 'border-transparent opacity-60 hover:opacity-100 hover:bg-[#111317]' : 'shadow-lg'}`}
                            >
                                {!n.isRead && (
                                    <div className="absolute top-0 right-0 w-32 h-32 pointer-events-none">
                                        <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-[#00FFA3]/10 to-transparent blur-2xl" />
                                    </div>
                                )}
                                <div className={`p-4 rounded-2xl bg-white/[0.02] border border-white/5 shrink-0 transition-colors shadow-inner ${!n.isRead ? 'bg-[#00FFA3]/5 border-[#00FFA3]/20 shadow-[0_0_15px_rgba(0,255,163,0.1)]' : ''}`}>
                                    {getIcon(n.type)}
                                </div>
                                <div className="flex-1 min-w-0 pr-12 pt-1">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-2">
                                        <h3 className={`text-base font-bold truncate ${n.isRead ? 'text-slate-400' : 'text-white tracking-wide'}`}>
                                            {n.title}
                                        </h3>
                                        <span className="text-[10px] font-mono font-medium text-slate-500 shrink-0 bg-[#020617] px-2 py-1 rounded-md border border-white/5 w-fit">
                                            {new Date(n.createdAt).toLocaleDateString()} &middot; {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                    <p className={`text-sm break-words leading-relaxed ${n.isRead ? 'text-slate-500' : 'text-slate-300'}`}>
                                        {n.message}
                                    </p>
                                </div>

                                {!n.isRead && (
                                    <button
                                        onClick={() => markAsRead(n.id)}
                                        title="Acknowledge Alert"
                                        className="p-2 sm:p-3 absolute top-6 right-6 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 bg-[#00FFA3]/20 text-[#00FFA3] rounded-xl transition-all duration-300 hover:bg-[#00FFA3] hover:text-[#020617] scale-90 hover:scale-100 shadow-[0_0_20px_rgba(0,255,163,0.2)]"
                                    >
                                        <Check className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                                    </button>
                                )}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                )}
            </div>
        </div>
    );
}
