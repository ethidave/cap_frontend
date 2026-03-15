"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    MessageSquare,
    Search,
    Filter,
    User,
    Clock,
    CheckCircle2,
    AlertCircle,
    Mail,
    Send,
    MoreVertical,
    Paperclip,
    Image as ImageIcon,
    Smile,
    ChevronRight,
    X,
    Check,
    Trash2
} from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/components/ToastProvider";

import { useSocket } from "@/components/SocketProvider";

export default function SupportDesk() {
    const { socket } = useSocket();
    const { toast, confirm } = useToast();
    const [messages, setMessages] = useState<any[]>([]);
    const [selected, setSelected] = useState<any>(null);
    const [replyText, setReplyText] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isSending, setIsSending] = useState(false);

    const fetchMessages = async () => {
        try {
            const data = await api.get("/admin/support");
            const msgs = Array.isArray(data) ? data : (data.data || []);
            setMessages(msgs);
            // Don't auto-select if we already have one
            if (msgs.length > 0 && !selected) setSelected(msgs[0]);
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    // WebSocket Real-time Updates
    useEffect(() => {
        if (!socket) return;

        const handleUpdate = (updatedMsg: any) => {
            setMessages((prev: any[]) => {
                const index = prev.findIndex(m => m.id === updatedMsg.id);
                if (index !== -1) {
                    const newList = [...prev];
                    newList[index] = { ...newList[index], ...updatedMsg };
                    return newList;
                } else {
                    return [updatedMsg, ...prev];
                }
            });

            setSelected((prev: any) => {
                if (prev?.id === updatedMsg.id) {
                    return { ...prev, ...updatedMsg };
                }
                return prev;
            });

            // Optional: notify about new messages if not selected
            if (updatedMsg.status === 'OPEN') {
                toast("success", "New Message", `${updatedMsg.name} sent a new inquiry.`);
            }
        };

        socket.on('support_update', handleUpdate);
        return () => {
            socket.off('support_update', handleUpdate);
        };
    }, [socket, toast]);

    const handleReply = async () => {
        if (!selected || !replyText.trim()) return;
        setIsSending(true);
        try {
            await api.post(`/admin/support/${selected.id}/reply`, { reply: replyText });
            toast("success", "Success", "Reply sent and recorded.");
            setReplyText("");
            fetchMessages();
        } catch (e: any) {
            toast("error", "Error", "Failed to send the reply.");
        } finally {
            setIsSending(false);
        }
    };

    const handleCloseTicket = async (id: string) => {
        const authorized = await confirm("Close Ticket", "Mark this support inquiry as resolved?");
        if (!authorized) return;
        try {
            await api.patch(`/admin/support/${id}/status`, { status: "RESOLVED" });
            toast("success", "Success", "Ticket marked as resolved.");
            fetchMessages();
        } catch (e: any) {
            toast("error", "Error", "Failed to update ticket status.");
        }
    };

    const handleDeleteTicket = async (id: string) => {
        const authorized = await confirm("Delete Message", "Permanently delete this support inquiry from history?");
        if (!authorized) return;
        try {
            await api.delete(`/admin/support/${id}`);
            toast("success", "Success", "Message deleted.");
            if (selected?.id === id) setSelected(null);
            fetchMessages();
        } catch (e: any) {
            toast("error", "Error", "Failed to delete the message.");
        }
    };

    return (
        <div className="h-[calc(100vh-160px)] flex flex-col md:flex-row gap-8 font-sans">
            {/* Left Column: List */}
            <div className="w-full md:w-96 flex flex-col gap-6 h-full">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Support Desk</h1>
                    <p className="text-slate-400 text-sm mt-1">Manage user messages and inquiries</p>
                </div>

                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 font-sans" />
                    <input
                        className="w-full bg-white/[0.03] border border-white/5 rounded-xl pl-11 pr-4 py-3 text-sm text-white outline-none focus:border-[#00FFA3]/30 transition-all font-sans"
                        placeholder="Search messages..."
                    />
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-2">
                    {isLoading ? (
                        <div className="text-center py-10 text-slate-500 text-xs font-bold uppercase tracking-widest animate-pulse font-sans">Loading messages...</div>
                    ) : messages.length === 0 ? (
                        <div className="text-center py-10 text-slate-500 text-xs font-bold uppercase tracking-widest font-sans">No messages found.</div>
                    ) : messages.map((msg) => (
                        <button
                            key={msg.id}
                            onClick={() => setSelected(msg)}
                            className={`w-full text-left p-4 rounded-xl border transition-all relative ${selected?.id === msg.id
                                ? 'bg-white/[0.05] border-[#00FFA3]/30'
                                : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.04]'
                                }`}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-widest ${msg.status === 'PENDING' ? 'bg-orange-500/10 text-orange-500' :
                                    msg.status === 'REPLIED' ? 'bg-[#00FFA3]/10 text-[#00FFA3]' :
                                        'bg-slate-700/20 text-slate-400'
                                    }`}>
                                    {msg.status}
                                </span>
                                <span className="text-[10px] font-bold text-slate-600 uppercase font-sans">
                                    {new Date(msg.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                            <div className="text-sm font-bold text-white mb-1 truncate font-sans">
                                {msg.subject}
                            </div>
                            <div className="text-xs text-slate-500 line-clamp-1 font-sans">
                                {(() => {
                                    const parts = msg.message.split('|||CHAT_MSG_SEP|||');
                                    const lastMsg = parts[parts.length - 1];
                                    const content = lastMsg.includes('|||') ? lastMsg.split('|||')[1] : lastMsg;
                                    return content;
                                })()}
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Right Column: Content */}
            <div className="flex-1 bg-white/[0.02] rounded-2xl border border-white/5 flex flex-col overflow-hidden relative shadow-xl">
                {selected ? (
                    <>
                        {/* Header */}
                        <div className="p-6 border-b border-white/5 bg-white/[0.01] flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-white/[0.05] flex items-center justify-center text-white font-bold text-lg border border-white/5 font-sans">
                                    {selected.name?.charAt(0) || "U"}
                                </div>
                                <div>
                                    <h2 className="text-base font-bold text-white font-sans">{selected.name}</h2>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <Mail className="w-3.5 h-3.5 text-slate-500 font-sans" />
                                        <span className="text-xs text-slate-400 font-sans">{selected.email}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                {selected.status !== 'RESOLVED' && (
                                    <button
                                        onClick={() => handleCloseTicket(selected.id)}
                                        className="p-2 rounded-lg bg-white/[0.03] text-slate-400 hover:text-[#00FFA3] transition-all flex items-center gap-2 text-xs font-bold uppercase tracking-widest font-sans px-4"
                                    >
                                        <CheckCircle2 className="w-4 h-4" /> Resolve
                                    </button>
                                )}
                                <button
                                    onClick={() => handleDeleteTicket(selected.id)}
                                    className="p-2 rounded-lg bg-white/[0.03] text-slate-400 hover:text-rose-500 transition-all font-sans"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-8 custom-scrollbar font-sans bg-[#020617] relative">
                            {/* Background mesh/glow */}
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(0,255,163,0.03)_0%,transparent_50%)] pointer-events-none" />

                            <AnimatePresence mode="popLayout">
                                {selected.message.split('|||CHAT_MSG_SEP|||').map((rawPart: string, idx: number) => {
                                    const part = rawPart.trim();
                                    if (!part) return null;

                                    // Parse: DATE ||| CONTENT
                                    const [dateStr, ...contentParts] = part.split('|||');
                                    const content = contentParts.join('|||').trim() || dateStr.trim(); // Fallback if no delimiter found
                                    const date = dateStr.includes(':') ? new Date(dateStr) : new Date(selected.createdAt);

                                    return (
                                        <motion.div
                                            key={idx}
                                            initial={{ opacity: 0, y: 15 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.05, type: 'spring', damping: 20 }}
                                            className="flex flex-col gap-2 max-w-[85%] sm:max-w-[70%]"
                                        >
                                            <div className="flex items-center gap-2 mb-1">
                                                <div className="w-6 h-6 rounded-lg bg-white/[0.05] border border-white/5 flex items-center justify-center text-[10px] font-black text-slate-400">
                                                    {selected.name?.charAt(0)}
                                                </div>
                                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                                    {idx === 0 ? 'Original Request' : 'Follow-up'}
                                                </span>
                                                <span className="text-[9px] font-bold text-slate-700 ml-auto tabular-nums">
                                                    {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {date.toLocaleDateString()}
                                                </span>
                                            </div>
                                            <div className="p-4 rounded-2xl rounded-tl-none bg-white/[0.03] border border-white/10 text-slate-200 text-sm leading-relaxed whitespace-pre-wrap font-sans shadow-2xl backdrop-blur-sm">
                                                {content}
                                            </div>
                                        </motion.div>
                                    );
                                })}

                                {selected.reply && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="flex flex-col gap-2 max-w-[85%] sm:max-w-[70%] self-end items-end"
                                    >
                                        <div className="flex items-center gap-2 mb-1 pr-1">
                                            <span className="text-[9px] font-bold text-slate-600 tabular-nums">
                                                {new Date(selected.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                            <span className="text-[10px] font-black text-[#00FFA3] uppercase tracking-widest">
                                                Admin Official Reply
                                            </span>
                                            <div className="w-6 h-6 rounded-lg bg-[#00FFA3]/10 border border-[#00FFA3]/20 flex items-center justify-center text-[10px] font-black text-[#00FFA3]">
                                                A
                                            </div>
                                        </div>
                                        <div className="p-4 rounded-2xl rounded-tr-none bg-gradient-to-br from-[#00FFA3] to-[#00D187] text-[#020617] text-sm font-bold leading-relaxed shadow-xl shadow-[#00FFA3]/5 whitespace-pre-wrap font-sans transition-all hover:brightness-105">
                                            {selected.reply}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Input */}
                        <div className="p-6 bg-white/[0.01] border-t border-white/5 font-sans">
                            <div className="flex items-center gap-3 bg-white/[0.02] border border-white/10 rounded-xl p-1.5 focus-within:border-[#00FFA3]/40 transition-all">
                                <textarea
                                    className="flex-1 bg-transparent border-none outline-none py-2 px-3 text-sm text-white placeholder:text-slate-600 resize-none font-sans min-h-[44px]"
                                    placeholder="Type your official reply here..."
                                    value={replyText}
                                    rows={1}
                                    onChange={(e) => setReplyText(e.target.value)}
                                />
                                <button
                                    onClick={handleReply}
                                    disabled={isSending || !replyText.trim()}
                                    className="h-10 px-4 rounded-lg bg-[#00FFA3] flex items-center justify-center text-[#020617] font-bold text-sm shadow-lg shadow-[#00FFA3]/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 font-sans"
                                >
                                    {isSending ? "..." : "Send Reply"}
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-slate-600 text-xs font-bold uppercase tracking-widest font-sans">
                        Select a message to view details
                    </div>
                )}
            </div>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                  width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                  background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                  background: rgba(255, 255, 255, 0.05);
                  border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                  background: rgba(0, 255, 163, 0.2);
                }
            `}</style>
        </div>
    );
}
