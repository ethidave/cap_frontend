"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Smartphone,
    Send,
    Trash2,
    Settings,
    History,
    Bell,
    ShieldCheck,
    RefreshCw,
    Activity,
    AlertCircle
} from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/components/ToastProvider";

export default function OneSignalAdmin() {
    const { toast } = useToast();
    const [view, setView] = useState<'SEND' | 'HISTORY' | 'SETTINGS'>('SEND');
    const [isLoading, setIsLoading] = useState(false);

    // Settings
    const [appId, setAppId] = useState("");
    const [apiKey, setApiKey] = useState("");

    // Send form
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");
    const [imageUrl, setImageUrl] = useState("");

    // History
    const [broadcasts, setBroadcasts] = useState<any[]>([]);
    const [isFetchingHistory, setIsFetchingHistory] = useState(false);

    useEffect(() => {
        fetchSettings();
        fetchHistory();
    }, []);

    const fetchSettings = async () => {
        try {
            const resId = await api.get("/admin/settings/ONESIGNAL_APP_ID");
            const resKey = await api.get("/admin/settings/ONESIGNAL_REST_API_KEY");
            if (resId) setAppId(resId.value);
            if (resKey) setApiKey(resKey.value);
        } catch (e) { }
    };

    const fetchHistory = async () => {
        setIsFetchingHistory(true);
        try {
            const data = await api.get("/admin/onesignal/broadcasts");
            setBroadcasts(data || []);
        } catch (e) { }
        setIsFetchingHistory(false);
    };

    const saveSettings = async () => {
        setIsLoading(true);
        try {
            await api.patch("/admin/settings/ONESIGNAL_APP_ID", { value: appId });
            await api.patch("/admin/settings/ONESIGNAL_REST_API_KEY", { value: apiKey });
            toast("success", "Settings Saved", "OneSignal configuration updated successfully.");
        } catch (e) {
            toast("error", "Error", "Failed to save settings.");
        }
        setIsLoading(false);
    };

    const sendPush = async () => {
        if (!title || !message) {
            toast("error", "Error", "Please fill in all fields.");
            return;
        }
        setIsLoading(true);
        try {
            await api.post("/admin/onesignal/broadcasts", { title, message, imageUrl });
            toast("success", "Push Sent", "Notification broadcasted via OneSignal.");
            setTitle("");
            setMessage("");
            setImageUrl("");
            fetchHistory();
            setView('HISTORY');
        } catch (e: any) {
            toast("error", "Error", e.message || "Failed to send notification. Check configuration.");
        }
        setIsLoading(false);
    };

    const deleteBroadcast = async (id: string) => {
        try {
            await api.delete(`/admin/onesignal/broadcasts/${id}`);
            setBroadcasts(broadcasts.filter(b => b.id !== id));
            toast("success", "Deleted", "Broadcast record removed from database.");
        } catch (e) {
            toast("error", "Error", "Failed to delete record.");
        }
    };

    return (
        <div className="space-y-8 max-w-6xl font-sans">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
                        <Smartphone className="w-8 h-8 text-[#00FFA3]" /> Mobile Push Center
                    </h1>
                    <p className="text-slate-400 text-sm mt-2 font-medium uppercase tracking-widest">Powered by OneSignal</p>
                </div>
            </div>

            {/* Quick Stats & Tabs */}
            <div className="flex flex-wrap items-center gap-3 border-b border-white/5 pb-6">
                <button
                    onClick={() => setView('SEND')}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all ${view === 'SEND' ? 'bg-[#00FFA3] text-[#020617] shadow-lg shadow-[#00FFA3]/20' : 'bg-white/[0.03] text-slate-400 hover:text-white'}`}
                >
                    <Send className="w-4 h-4" /> Send Notifications
                </button>
                <button
                    onClick={() => setView('HISTORY')}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all ${view === 'HISTORY' ? 'bg-[#00FFA3] text-[#020617] shadow-lg shadow-[#00FFA3]/20' : 'bg-white/[0.03] text-slate-400 hover:text-white'}`}
                >
                    <History className="w-4 h-4" /> Broadcast History
                </button>
                <button
                    onClick={() => setView('SETTINGS')}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all ${view === 'SETTINGS' ? 'bg-[#00FFA3] text-[#020617] shadow-lg shadow-[#00FFA3]/20' : 'bg-white/[0.03] text-slate-400 hover:text-white'}`}
                >
                    <Settings className="w-4 h-4" /> Configuration
                </button>
            </div>

            <div className="min-h-[400px]">
                <AnimatePresence mode="wait">
                    {view === 'SEND' && (
                        <motion.div
                            key="send"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
                        >
                            <div className="lg:col-span-2 bg-[#0a0f1d] border border-white/5 rounded-3xl p-8 shadow-2xl">
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Notification Title</label>
                                        <input
                                            type="text"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            placeholder="e.g. Market Alert"
                                            className="w-full bg-[#020617] border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-[#00FFA3]/50 transition-all font-bold placeholder:text-slate-800"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Message Content</label>
                                        <textarea
                                            rows={6}
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            placeholder="Write your push notification message here..."
                                            className="w-full bg-[#020617] border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-[#00FFA3]/50 transition-all leading-relaxed placeholder:text-slate-800 resize-none"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Image URL (Optional)</label>
                                        <input
                                            type="text"
                                            value={imageUrl}
                                            onChange={(e) => setImageUrl(e.target.value)}
                                            placeholder="https://example.com/image.jpg"
                                            className="w-full bg-[#020617] border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-[#00FFA3]/50 transition-all font-bold placeholder:text-slate-800"
                                        />
                                    </div>
                                    <button
                                        onClick={sendPush}
                                        disabled={isLoading || !title || !message}
                                        className="w-full py-5 bg-[#00FFA3] text-[#020617] rounded-2xl font-black text-base uppercase tracking-widest hover:scale-[1.01] active:scale-[0.98] transition-all shadow-xl shadow-[#00FFA3]/20 flex items-center justify-center gap-3 disabled:opacity-50"
                                    >
                                        {isLoading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                                        {isLoading ? "Broadcasting..." : "Dispatch Notification"}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="bg-[#00FFA3]/5 border border-[#00FFA3]/10 rounded-3xl p-6">
                                    <div className="flex items-center gap-3 text-[#00FFA3] mb-4">
                                        <Activity className="w-5 h-5" />
                                        <h4 className="font-bold uppercase tracking-widest text-xs">Live System</h4>
                                    </div>
                                    <p className="text-slate-400 text-sm leading-relaxed text-left">
                                        This will send a Push Notification to all users who have the Android app installed and registered.
                                    </p>
                                </div>
                                <div className="bg-blue-500/5 border border-blue-500/10 rounded-3xl p-6">
                                    <div className="flex items-center gap-3 text-blue-400 mb-4">
                                        <ShieldCheck className="w-5 h-5" />
                                        <h4 className="font-bold uppercase tracking-widest text-xs">Security Check</h4>
                                    </div>
                                    <p className="text-slate-400 text-sm leading-relaxed text-left">
                                        Messages are stored in the database for auditing and compliance. Avoid sending sensitive credentials via push.
                                    </p>
                                </div>
                                {imageUrl && (
                                    <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-4 overflow-hidden shadow-xl">
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 ml-1 text-left">Image Preview</p>
                                        <img src={imageUrl} alt="Preview" className="w-full h-auto rounded-2xl border border-white/10" />
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {view === 'HISTORY' && (
                        <motion.div
                            key="history"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                        >
                            <div className="bg-[#0a0f1d] border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
                                <div className="p-6 bg-white/[0.02] border-b border-white/5 flex items-center justify-between">
                                    <h3 className="text-white font-bold flex items-center gap-2">
                                        <History className="w-4 h-4 text-slate-500" /> Broadcast Logs
                                    </h3>
                                    <button onClick={fetchHistory} className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                                        <RefreshCw className={`w-4 h-4 text-slate-500 ${isFetchingHistory ? 'animate-spin' : ''}`} />
                                    </button>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] border-b border-white/5">
                                                <th className="px-8 py-4">Image</th>
                                                <th className="px-8 py-4">Title</th>
                                                <th className="px-8 py-4">Message</th>
                                                <th className="px-8 py-4 text-center">Date</th>
                                                <th className="px-8 py-4 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {broadcasts.length === 0 ? (
                                                <tr>
                                                    <td colSpan={5} className="px-8 py-20 text-center">
                                                        <div className="flex flex-col items-center gap-3">
                                                            <Bell className="w-10 h-10 text-slate-800" />
                                                            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">No notifications sent yet</p>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ) : (
                                                broadcasts.map((b) => (
                                                    <tr key={b.id} className="hover:bg-white/[0.01] transition-colors group">
                                                        <td className="px-8 py-5">
                                                            {b.imageUrl ? (
                                                                <img src={b.imageUrl} alt="" className="w-12 h-12 rounded-lg object-cover border border-white/10" />
                                                            ) : (
                                                                <div className="w-12 h-12 rounded-lg bg-white/[0.02] border border-dashed border-white/10 flex items-center justify-center text-slate-600">
                                                                    <Smartphone className="w-4 h-4" />
                                                                </div>
                                                            )}
                                                        </td>
                                                        <td className="px-8 py-5">
                                                            <span className="text-white font-bold">{b.title}</span>
                                                        </td>
                                                        <td className="px-8 py-5">
                                                            <p className="text-slate-400 text-sm max-w-md line-clamp-1">{b.message}</p>
                                                        </td>
                                                        <td className="px-8 py-5 text-center">
                                                            <span className="text-slate-500 text-xs font-mono">{new Date(b.createdAt).toLocaleString()}</span>
                                                        </td>
                                                        <td className="px-8 py-5 text-right">
                                                            <button
                                                                onClick={() => deleteBroadcast(b.id)}
                                                                className="p-3 text-slate-600 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {view === 'SETTINGS' && (
                        <motion.div
                            key="settings"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            className="max-w-2xl bg-[#0a0f1d] border border-white/5 rounded-3xl p-10 shadow-2xl"
                        >
                            <div className="flex items-center gap-4 mb-10">
                                <div className="w-14 h-14 rounded-2xl bg-[#00FFA3]/10 flex items-center justify-center text-[#00FFA3] border border-[#00FFA3]/20">
                                    <Settings className="w-7 h-7" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-white leading-tight">OneSignal Configuration</h3>
                                    <p className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-widest">Connect your mobile push provider</p>
                                </div>
                            </div>

                            <div className="space-y-8">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] ml-1">App ID</label>
                                    <input
                                        type="text"
                                        value={appId}
                                        onChange={(e) => setAppId(e.target.value)}
                                        placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                                        className="w-full bg-[#020617] border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-[#00FFA3]/30 transition-all font-mono text-sm"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Rest API Key</label>
                                    <input
                                        type="password"
                                        value={apiKey}
                                        onChange={(e) => setApiKey(e.target.value)}
                                        placeholder="OneSignal REST API Key"
                                        className="w-full bg-[#020617] border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-[#00FFA3]/30 transition-all font-mono text-sm"
                                    />
                                </div>

                                <div className="pt-4">
                                    <button
                                        onClick={saveSettings}
                                        disabled={isLoading}
                                        className="w-full py-5 bg-white text-[#020617] rounded-2xl font-black text-base uppercase tracking-widest hover:bg-slate-100 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                                    >
                                        <ShieldCheck className="w-5 h-5" />
                                        Save Credentials
                                    </button>
                                </div>

                                <div className="bg-red-500/5 border border-red-500/10 rounded-2xl p-4 flex items-start gap-4 mt-6">
                                    <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                                    <p className="text-[11px] text-slate-500 leading-relaxed font-bold uppercase tracking-tight">
                                        Warning: Incorrect keys will cause notification dispatch failures. Ensure you copy the "REST API Key" and not the "User Auth Key".
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
