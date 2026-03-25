"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Settings,
    Shield,
    Globe,
    Bell,
    Mail,
    Save,
    RefreshCw,
    Server,
    Database,
    Lock,
    Zap,
    Power,
    Volume2,
    Trash2,
    Send,
    MessageSquare,
    CreditCard,
    Key,
    ShieldCheck as ShieldIcon
} from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/components/ToastProvider";

export default function AdminSettings() {
    const { toast, confirm } = useToast();
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("general");

    // Form States
    const [settings, setSettings] = useState<Record<string, string>>({});
    const [broadcastMessage, setBroadcastMessage] = useState("");
    const [isBroadcasting, setIsBroadcasting] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        setIsLoading(true);
        try {
            const data = await api.get("/admin/settings");
            const mapped: Record<string, string> = {};
            data.forEach((s: any) => mapped[s.key] = s.value);
            setSettings(mapped);
        } catch (e) {
            console.error(e);
            toast("error", "Error", "Failed to load platform settings.");
        } finally {
            setIsLoading(false);
        }
    };

    const updateSetting = async (key: string, value: string) => {
        try {
            await api.patch(`/admin/settings/${key}`, { value });
            setSettings(prev => ({ ...prev, [key]: value }));
            return true;
        } catch (e) {
            toast("error", "Failed to update", `Could not save ${key}`);
            return false;
        }
    };

    const handleSaveSection = async (keys: string[]) => {
        setIsSaving(true);
        let success = true;
        for (const key of keys) {
            const ok = await updateSetting(key, settings[key] || "");
            if (!ok) success = false;
        }
        if (success) {
            toast("success", "Settings Saved", "Configuration updated successfully.");
        }
        setIsSaving(false);
    };

    const handleBroadcast = async () => {
        if (!broadcastMessage) return;
        setIsBroadcasting(true);
        try {
            await api.post("/admin/notifications/bulk", {
                title: "Platform Announcement",
                message: broadcastMessage
            });
            toast("success", "Broadcast Success", "Announcement has been sent to all users.");
            setBroadcastMessage("");
        } catch (e: any) {
            toast("error", "Error", "Failed to send the broadcast.");
        } finally {
            setIsBroadcasting(false);
        }
    };

    const toggleMaintenance = async () => {
        const isCurrentlyOn = settings["MAINTENANCE_MODE"] === "true";
        const newValue = !isCurrentlyOn;
        const ok = await updateSetting("MAINTENANCE_MODE", String(newValue));
        if (ok) {
            toast("warning", "Maintenance Mode", `System is now ${newValue ? 'OFFLINE' : 'ONLINE'}.`);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <RefreshCw className="w-8 h-8 text-[#00FFA3] animate-spin" />
            </div>
        );
    }

    const tabs = [
        { id: "general", label: "General", icon: Globe },
        { id: "email", label: "Email / SMTP", icon: Mail },
        { id: "payments", label: "Payments", icon: CreditCard },
        { id: "google", label: "Google Auth", icon: Key },
        { id: "support", label: "Support Widget", icon: MessageSquare },
        { id: "broadcast", label: "Broadcast", icon: Volume2 },
        { id: "kyc", label: "KYC Settings", icon: Shield },
    ];

    return (
        <div className="space-y-10 max-w-5xl font-sans">
            <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">Platform Configuration</h1>
                <p className="text-slate-400 text-sm mt-1">Institutional-grade control center for site parameters</p>
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide border-b border-white/5">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-6 py-3 rounded-t-xl transition-all text-sm font-bold uppercase tracking-widest border-x border-t ${activeTab === tab.id
                                ? 'bg-[#00FFA3]/5 border-white/10 text-[#00FFA3]'
                                : 'text-slate-500 border-transparent hover:text-slate-300'
                            }`}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                    </button>
                ))}
            </div>

            <AnimatePresence mode="wait">
                {activeTab === "general" && (
                    <motion.div
                        key="general"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-8"
                    >
                        {/* Maintenance Section */}
                        <div className="bg-white/[0.02] rounded-2xl border border-white/5 p-8 flex flex-col justify-between shadow-xl">
                            <div className="flex items-start justify-between mb-6">
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500 border border-orange-500/20">
                                        <Power className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-white font-bold text-lg leading-tight">Maintenance Mode</h3>
                                        <p className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-widest font-sans">Public Access Control</p>
                                    </div>
                                </div>
                                <div
                                    onClick={toggleMaintenance}
                                    className={`w-14 h-7 rounded-full p-1 cursor-pointer transition-all duration-300 border border-white/5 ${settings["MAINTENANCE_MODE"] === "true" ? 'bg-orange-500' : 'bg-white/[0.05]'}`}
                                >
                                    <div className={`w-5 h-5 rounded-full bg-white shadow-lg transition-all duration-300 transform ${settings["MAINTENANCE_MODE"] === "true" ? 'translate-x-7' : 'translate-x-0'}`} />
                                </div>
                            </div>
                            <div>
                                <div className={`text-xs font-bold mb-2 tracking-widest ${settings["MAINTENANCE_MODE"] === "true" ? 'text-orange-500' : 'text-slate-500'}`}>
                                    {settings["MAINTENANCE_MODE"] === "true" ? 'STATUS: OFFLINE' : 'STATUS: ONLINE'}
                                </div>
                                <p className="text-xs text-slate-500 leading-relaxed font-sans">
                                    When active, regular users cannot access the site. Only administrators can bypass.
                                </p>
                            </div>
                        </div>

                        {/* Site Info */}
                        <div className="bg-white/[0.02] rounded-2xl border border-white/5 p-8 shadow-xl">
                            <div className="flex gap-4 mb-6">
                                <div className="w-12 h-12 rounded-xl bg-[#00F0FF]/10 flex items-center justify-center text-[#00F0FF] border border-[#00F0FF]/20">
                                    <Globe className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-white font-bold text-lg leading-tight">Site Branding</h3>
                                    <p className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-widest">General Identity</p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <InputGroup
                                    label="Site Name"
                                    placeholder="CapTrade Pro"
                                    value={settings["SITE_NAME"] || ""}
                                    onChange={(v) => setSettings(p => ({ ...p, SITE_NAME: v }))}
                                />
                                <button
                                    onClick={() => handleSaveSection(["SITE_NAME"])}
                                    disabled={isSaving}
                                    className="w-full py-3 rounded-xl bg-white/[0.05] border border-white/5 text-white font-bold uppercase tracking-widest text-[10px] hover:bg-white/[0.08] transition-all flex items-center justify-center gap-2"
                                >
                                    {isSaving ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                                    Update Site Info
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}

                {activeTab === "email" && (
                    <motion.div
                        key="email"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-8"
                    >
                        <div className="bg-white/[0.02] rounded-2xl border border-white/5 p-10 shadow-2xl">
                            <div className="flex items-center gap-5 mb-10 pb-6 border-b border-white/5">
                                <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 border border-blue-500/20">
                                    <Mail className="w-7 h-7" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white">SMTP Configuration</h3>
                                    <p className="text-sm text-slate-500">Email delivery engine settings (Nodemailer)</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
                                <InputGroup
                                    label="SMTP Host"
                                    placeholder="smtp.gmail.com"
                                    value={settings["MAIL_HOST"] || ""}
                                    onChange={(v) => setSettings(p => ({ ...p, MAIL_HOST: v }))}
                                />
                                <InputGroup
                                    label="SMTP Port"
                                    placeholder="465"
                                    value={settings["MAIL_PORT"] || ""}
                                    onChange={(v) => setSettings(p => ({ ...p, MAIL_PORT: v }))}
                                />
                                <InputGroup
                                    label="SMTP User / Email"
                                    placeholder="admin@yourdomain.com"
                                    value={settings["MAIL_USER"] || ""}
                                    onChange={(v) => setSettings(p => ({ ...p, MAIL_USER: v }))}
                                />
                                <InputGroup
                                    label="SMTP Password"
                                    type="password"
                                    placeholder="••••••••••••"
                                    value={settings["MAIL_PASSWORD"] || ""}
                                    onChange={(v) => setSettings(p => ({ ...p, MAIL_PASSWORD: v }))}
                                />
                                <InputGroup
                                    label="Customer Support Email"
                                    placeholder="support@yourdomain.com"
                                    value={settings["SUPPORT_EMAIL"] || ""}
                                    onChange={(v) => setSettings(p => ({ ...p, SUPPORT_EMAIL: v }))}
                                />
                                <InputGroup
                                    label="Admin Alert Email"
                                    placeholder="payouts@yourdomain.com"
                                    value={settings["ADMIN_EMAIL"] || ""}
                                    onChange={(v) => setSettings(p => ({ ...p, ADMIN_EMAIL: v }))}
                                />
                                 <InputGroup
                                    label="From Name / Email"
                                    placeholder="CapTrade Pro <no-reply@domain.com>"
                                    value={settings["MAIL_FROM"] || ""}
                                    onChange={(v) => setSettings(p => ({ ...p, MAIL_FROM: v }))}
                                />
                                <div className="flex flex-col justify-end pb-1">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3 ml-1">Secure Connection (SSL/TLS)</label>
                                    <button
                                        onClick={() => setSettings(p => ({ ...p, MAIL_SECURE: settings.MAIL_SECURE === 'true' ? 'false' : 'true' }))}
                                        className={`px-6 py-2.5 rounded-xl border transition-all text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 ${settings.MAIL_SECURE === 'true' ? 'bg-[#00FFA3]/10 border-[#00FFA3]/20 text-[#00FFA3]' : 'bg-white/5 border-white/10 text-slate-500'}`}
                                    >
                                        <Lock className="w-3.5 h-3.5" />
                                        {settings.MAIL_SECURE === 'true' ? 'Enabled' : 'Disabled'}
                                    </button>
                                </div>
                            </div>

                            <div className="mt-12 flex items-center justify-between gap-6">
                                <p className="text-xs text-slate-500 max-w-sm">SMTP parameters are applied in real-time. Changes will affect verification emails and kyc notifications immediately.</p>
                                <button
                                    onClick={() => handleSaveSection(["MAIL_HOST", "MAIL_PORT", "MAIL_USER", "MAIL_PASSWORD", "MAIL_SECURE", "SUPPORT_EMAIL", "ADMIN_EMAIL", "MAIL_FROM"])}
                                    disabled={isSaving}
                                    className="px-10 py-4 rounded-xl bg-blue-500 text-white font-bold uppercase tracking-widest text-xs shadow-lg shadow-blue-500/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-3 disabled:opacity-50"
                                >
                                    {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                    Save Server Config
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}

                {activeTab === "payments" && (
                    <motion.div
                        key="payments"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="max-w-2xl"
                    >
                        <div className="bg-white/[0.02] rounded-2xl border border-white/5 p-10 shadow-2xl">
                            <div className="flex items-center gap-5 mb-8 pb-6 border-b border-white/5">
                                <div className="w-14 h-14 rounded-2xl bg-[#00FFA3]/10 flex items-center justify-center text-[#00FFA3] border border-[#00FFA3]/20">
                                    <CreditCard className="w-7 h-7" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white">Deposit Gateway</h3>
                                    <p className="text-sm text-slate-500">OxaPay Integration (Crypto Deposits)</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <InputGroup
                                    label="Merchant Key"
                                    placeholder="Enter your OxaPay API Key"
                                    value={settings["OXAPAY_MERCHANT_KEY"] || ""}
                                    onChange={(v) => setSettings(p => ({ ...p, OXAPAY_MERCHANT_KEY: v }))}
                                />
                                <div className="p-4 bg-orange-500/5 rounded-xl border border-orange-500/10">
                                    <p className="text-[10px] text-orange-500/60 font-bold uppercase tracking-widest mb-1">Notice</p>
                                    <p className="text-xs text-slate-400">Merchant key is used to generate deposit addresses. Leaving this blank or setting it to \"sandbox\" will enable simulation mode.</p>
                                </div>
                                <button
                                    onClick={() => handleSaveSection(["OXAPAY_MERCHANT_KEY"])}
                                    disabled={isSaving}
                                    className="w-full py-4 rounded-xl bg-[#00FFA3] text-[#020617] font-bold uppercase tracking-widest text-xs shadow-lg shadow-[#00FFA3]/20 hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                                >
                                    {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                    Update Payment Key
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}

                {activeTab === "google" && (
                    <motion.div
                        key="google"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="max-w-3xl"
                    >
                         <div className="bg-white/[0.02] rounded-2xl border border-white/5 p-10 shadow-2xl">
                            <div className="flex items-center gap-5 mb-8 pb-6 border-b border-white/5">
                                <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500 border border-red-500/20">
                                    <Key className="w-7 h-7" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white">Google OAuth 2.0</h3>
                                    <p className="text-sm text-slate-500">Enable "Sign in with Google" functionality</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <InputGroup
                                    label="Google Client ID"
                                    placeholder="your-app-id.apps.googleusercontent.com"
                                    value={settings["GOOGLE_CLIENT_ID"] || ""}
                                    onChange={(v) => setSettings(p => ({ ...p, GOOGLE_CLIENT_ID: v }))}
                                />
                                <InputGroup
                                    label="Google Client Secret"
                                    type="password"
                                    placeholder="••••••••••••••••••••••••"
                                    value={settings["GOOGLE_CLIENT_SECRET"] || ""}
                                    onChange={(v) => setSettings(p => ({ ...p, GOOGLE_CLIENT_SECRET: v }))}
                                />
                                <InputGroup
                                    label="Authorized Redirect URI"
                                    placeholder="http://your-domain.com/auth/google/callback"
                                    value={settings["GOOGLE_CALLBACK_URL"] || ""}
                                    onChange={(v) => setSettings(p => ({ ...p, GOOGLE_CALLBACK_URL: v }))}
                                />
                                <InputGroup
                                    label="Frontend Redirect Base URL"
                                    placeholder="http://your-domain.com"
                                    value={settings["FRONTEND_URL"] || ""}
                                    onChange={(v) => setSettings(p => ({ ...p, FRONTEND_URL: v }))}
                                />
                                
                                <div className="p-4 bg-red-500/5 rounded-xl border border-red-500/10">
                                    <p className="text-[10px] text-red-500/60 font-bold uppercase tracking-widest mb-1">Configuration Tip</p>
                                    <p className="text-xs text-slate-400">Ensure the Redirect URI matches exactly what you configured in the <a href="https://console.cloud.google.com/" target="_blank" className="text-red-400 hover:underline">Google Cloud Console</a>. The Frontend URL determines where users land after login (e.g. /signin?token=...).</p>
                                </div>

                                <button
                                    onClick={() => handleSaveSection(["GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET", "GOOGLE_CALLBACK_URL", "FRONTEND_URL"])}
                                    disabled={isSaving}
                                    className="w-full py-4 rounded-xl bg-red-600 text-white font-bold uppercase tracking-widest text-xs shadow-lg shadow-red-900/40 hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                                >
                                    {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                    Apply Google Config
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}

                {activeTab === "support" && (
                    <motion.div
                        key="support"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="max-w-3xl"
                    >
                         <div className="bg-white/[0.02] rounded-2xl border border-white/5 p-10 shadow-2xl">
                            <div className="flex items-center gap-5 mb-8 pb-6 border-b border-white/5">
                                <div className="w-14 h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-500 border border-purple-500/20">
                                    <MessageSquare className="w-7 h-7" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white">Live Chat Widget</h3>
                                    <p className="text-sm text-slate-500">Inject 3rd-party chat script (TinyChat AI, Tawk.to, etc.)</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Widget Script / URL</label>
                                    <textarea
                                        rows={4}
                                        className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-5 py-3.5 text-sm text-white outline-none focus:border-purple-500/40 transition-all font-mono placeholder:text-slate-800"
                                        placeholder="<script src='https://tinychat.ai/...'></script>"
                                        value={settings["TINYCHAT_WIDGET"] || ""}
                                        onChange={(e) => setSettings(p => ({ ...p, TINYCHAT_WIDGET: e.target.value }))}
                                    />
                                    <p className="text-[10px] text-slate-600 font-medium ml-1">Paste the full embed script or unique ID provided by your chat provider.</p>
                                </div>

                                <button
                                    onClick={() => handleSaveSection(["TINYCHAT_WIDGET"])}
                                    disabled={isSaving}
                                    className="w-full py-4 rounded-xl bg-purple-600 text-white font-bold uppercase tracking-widest text-xs shadow-lg shadow-purple-900/40 hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                                >
                                    {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                    Deploy Widget
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}

                {activeTab === "broadcast" && (
                    <motion.div
                        key="broadcast"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="max-w-2xl"
                    >
                        {/* Bulk Communication */}
                        <div className="bg-white/[0.02] rounded-2xl border border-white/5 p-8 shadow-xl font-sans">
                            <div className="flex gap-4 mb-8">
                                <div className="w-12 h-12 rounded-xl bg-[#00F0FF]/10 flex items-center justify-center text-[#00F0FF] border border-[#00F0FF]/20">
                                    <Volume2 className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-white font-bold text-lg leading-tight">Mass Broadcast</h3>
                                    <p className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-widest font-sans">Global Announcement</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1 font-sans">Message Body</label>
                                    <textarea
                                        rows={4}
                                        className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-5 py-3.5 text-sm text-white outline-none focus:border-[#00F0FF]/40 transition-all font-sans placeholder:text-slate-700 resize-none"
                                        placeholder="Write your message here..."
                                        value={broadcastMessage}
                                        onChange={(e) => setBroadcastMessage(e.target.value)}
                                    />
                                </div>
                                <button
                                    onClick={handleBroadcast}
                                    disabled={isBroadcasting || !broadcastMessage}
                                    className="w-full py-4 rounded-xl bg-[#00F0FF] text-[#020617] font-bold uppercase tracking-widest shadow-lg shadow-[#00F0FF]/20 hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50 font-sans"
                                >
                                    {isBroadcasting ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Send className="w-4 h-4" />}
                                    {isBroadcasting ? 'Sending...' : 'Send Broadcast'}
                                </button>
                                <p className="text-[10px] text-center text-slate-600 font-bold uppercase tracking-tight font-sans">
                                    Notice: This will send a notification and email to all registered users.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}

                {activeTab === "kyc" && (
                    <motion.div
                        key="kyc"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="max-w-2xl"
                    >
                        <div className="bg-white/[0.02] rounded-2xl border border-white/5 p-10 shadow-2xl">
                            <div className="flex items-center gap-5 mb-8 pb-6 border-b border-white/5">
                                <div className="w-14 h-14 rounded-2xl bg-[#00FFA3]/10 flex items-center justify-center text-[#00FFA3] border border-[#00FFA3]/20">
                                    <Shield className="w-7 h-7" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white">KYC Configuration</h3>
                                    <p className="text-sm text-slate-500">Mobile Handoff & Security Parameters</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <InputGroup
                                    label="Mobile KYC Base URL"
                                    placeholder="https://captradepro.com"
                                    value={settings["KYC_MOBILE_URL_ROOT"] || ""}
                                    onChange={(v) => setSettings(p => ({ ...p, KYC_MOBILE_URL_ROOT: v }))}
                                />
                                <div className="p-4 bg-[#00FFA3]/5 rounded-xl border border-[#00FFA3]/10">
                                    <p className="text-[10px] text-[#00FFA3]/60 font-bold uppercase tracking-widest mb-1">Configuration Tip</p>
                                    <p className="text-xs text-slate-400">
                                        This URL is used to generate the QR code. Point it to your frontend domain (e.g. https://captradepro.com).
                                        Ensure the mobile app or web view can reach this address.
                                    </p>
                                </div>
                                <button
                                    onClick={() => handleSaveSection(["KYC_MOBILE_URL_ROOT"])}
                                    disabled={isSaving}
                                    className="w-full py-4 rounded-xl bg-[#00FFA3] text-[#020617] font-bold uppercase tracking-widest text-xs shadow-lg shadow-[#00FFA3]/20 hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                                >
                                    {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                    Update KYC Config
                                </button>
                            </div>

                            <div className="mt-10 pt-10 border-t border-white/5 space-y-6">
                                <div>
                                    <h3 className="text-white font-bold text-lg leading-tight">Storage & Privacy</h3>
                                    <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest">Manual Data Purge</p>
                                </div>
                                <p className="text-xs text-slate-400 leading-relaxed">
                                    While the system automatically deletes images after processing, orphaned files may occasionally remain. Use this to permanently delete all files in the KYC uploads directory.
                                </p>
                                <button
                                    onClick={async () => {
                                        const confirmed = await confirm(
                                            "Confirm Purge", 
                                            "Are you sure you want to permanently delete ALL uploaded KYC images? This operation cannot be undone and will immediately reclaim server storage."
                                        );
                                        
                                        if (confirmed) {
                                            try {
                                                const res = await api.delete("/admin/kyc/cleanup");
                                                toast("success", "Cleanup Complete", `Successfully deleted ${res.deletedCount || 0} orphaned files.`);
                                            } catch (e) {
                                                toast("error", "Cleanup Failed", "Could not purge the uploads directory.");
                                            }
                                        }
                                    }}
                                    className="w-full py-4 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-500 font-bold uppercase tracking-widest text-xs hover:bg-orange-500/20 transition-all flex items-center justify-center gap-3"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Purge KYC Uploads Directory
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function InputGroup({ label, placeholder, value, onChange, type = "text" }: { label: string, placeholder: string, value: string, onChange: (v: string) => void, type?: string }) {
    return (
        <div className="space-y-2.5">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">{label}</label>
            <input
                type={type}
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-white/20 transition-all font-medium placeholder:text-slate-800"
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
}
