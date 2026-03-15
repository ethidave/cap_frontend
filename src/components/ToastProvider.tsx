"use client";
import React, { createContext, useContext, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    CheckCircle2,
    AlertCircle,
    XCircle,
    Info,
    X,
    ShieldCheck,
    AlertTriangle,
    Grid
} from "lucide-react";

type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
    id: string;
    type: ToastType;
    title: string;
    message: string;
}

interface ToastContextType {
    toast: (type: ToastType, title: string, message: string) => void;
    confirm: (title: string, message: string) => Promise<boolean>;
    prompt: (title: string, message: string, defaultValue?: string) => Promise<string | null>;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);
    const [confirmDialog, setConfirmDialog] = useState<{
        show: boolean;
        title: string;
        message: string;
        resolve?: (value: boolean) => void;
    }>({ show: false, title: "", message: "" });

    const [promptDialog, setPromptDialog] = useState<{
        show: boolean;
        title: string;
        message: string;
        defaultValue: string;
        resolve?: (value: string | null) => void;
    }>({ show: false, title: "", message: "", defaultValue: "" });

    const [promptValue, setPromptValue] = useState("");

    const toast = useCallback((type: ToastType, title: string, message: string) => {
        const id = Math.random().toString(36).substring(2, 9);
        setToasts((prev) => [...prev, { id, type, title, message }]);
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 5000);
    }, []);

    const confirm = useCallback((title: string, message: string) => {
        return new Promise<boolean>((resolve) => {
            setConfirmDialog({ show: true, title, message, resolve });
        });
    }, []);

    const prompt = useCallback((title: string, message: string, defaultValue: string = "") => {
        setPromptValue(defaultValue);
        return new Promise<string | null>((resolve) => {
            setPromptDialog({ show: true, title, message, defaultValue, resolve });
        });
    }, []);

    const removeToast = (id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    return (
        <ToastContext.Provider value={{ toast, confirm, prompt }}>
            {children}

            {/* Toast Container */}
            <div className="fixed inset-0 z-[9999] pointer-events-none flex flex-col items-center justify-center p-6">
                <AnimatePresence>
                    {toasts.map((t) => (
                        <motion.div
                            key={t.id}
                            initial={{ opacity: 0, scale: 0.8, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
                            className="w-full max-w-[360px] bg-[#0f172a] rounded-[2rem] p-10 shadow-2xl flex flex-col items-center text-center pointer-events-auto mb-4 last:mb-0 border border-white/5 font-sans"
                        >
                            <div className="relative mb-8">
                                <div className="w-20 h-20 bg-white/[0.03] rounded-3xl border border-white/10 flex items-center justify-center shadow-inner relative">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg border-4 border-[#0f172a] transform scale-110 ${t.type === 'success' ? 'bg-[#00FFA3]' :
                                        t.type === 'error' ? 'bg-[#f6465d]' :
                                            t.type === 'warning' ? 'bg-[#f0b90b]' :
                                                'bg-[#3b82f6]'
                                        }`}>
                                        {t.type === 'success' && <CheckCircle2 className="w-6 h-6 text-[#020617]" />}
                                        {t.type === 'error' && <XCircle className="w-6 h-6 text-white" />}
                                        {t.type === 'warning' && <AlertTriangle className="w-6 h-6 text-white" />}
                                        {t.type === 'info' && <Info className="w-6 h-6 text-white" />}
                                    </div>
                                </div>
                            </div>

                            <h4 className="text-white font-bold text-xl tracking-tight mb-2 font-sans">
                                {t.title}
                            </h4>
                            <p className="text-slate-400 text-sm leading-relaxed mb-8 max-w-[280px] font-sans">
                                {t.message}
                            </p>

                            <button
                                onClick={() => removeToast(t.id)}
                                className={`w-full py-3.5 rounded-xl flex items-center justify-center gap-2 font-bold text-xs uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-lg font-sans ${t.type === 'success' ? 'bg-[#00FFA3] text-[#020617] shadow-[#00FFA3]/20' :
                                    t.type === 'error' ? 'bg-[#f6465d] text-white shadow-[#f6465d]/20' :
                                        'bg-white text-[#020617] shadow-white/10'
                                    }`}
                            >
                                Dismiss
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Confirm Dialog */}
            <AnimatePresence>
                {confirmDialog.show && (
                    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-6 bg-[#020617]/95 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-[#0f172a] max-w-sm w-full rounded-[2.5rem] border border-white/10 p-10 relative z-10 shadow-2xl font-sans"
                        >
                            <div className="flex flex-col items-center text-center">
                                <div className="w-20 h-20 rounded-3xl bg-[#00FFA3]/10 border border-[#00FFA3]/20 flex items-center justify-center mb-8">
                                    <ShieldCheck className="w-10 h-10 text-[#00FFA3]" />
                                </div>
                                <h3 className="text-xl font-bold text-white tracking-tight mb-3 font-sans">{confirmDialog.title}</h3>
                                <p className="text-slate-400 text-sm leading-relaxed mb-10 font-sans">{confirmDialog.message}</p>

                                <div className="flex gap-4 w-full">
                                    <button
                                        onClick={() => {
                                            confirmDialog.resolve?.(false);
                                            setConfirmDialog({ ...confirmDialog, show: false });
                                        }}
                                        className="flex-1 h-14 rounded-2xl bg-white/[0.03] border border-white/5 text-slate-400 font-bold uppercase text-[10px] tracking-widest hover:bg-white/5 transition-all font-sans"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => {
                                            confirmDialog.resolve?.(true);
                                            setConfirmDialog({ ...confirmDialog, show: false });
                                        }}
                                        className="flex-1 h-14 rounded-2xl bg-[#00FFA3] text-[#020617] font-bold uppercase text-[10px] tracking-widest shadow-lg shadow-[#00FFA3]/20 hover:scale-105 transition-all font-sans"
                                    >
                                        Confirm
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Prompt Dialog */}
            <AnimatePresence>
                {promptDialog.show && (
                    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-6 bg-[#020617]/95 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-[#0f172a] max-w-sm w-full rounded-[2.5rem] border border-white/10 p-10 relative z-10 shadow-2xl font-sans"
                        >
                            <div className="flex flex-col items-center">
                                <div className="w-16 h-16 rounded-2xl bg-[#3b82f6]/10 border border-[#3b82f6]/20 flex items-center justify-center mb-6">
                                    <Info className="w-8 h-8 text-[#3b82f6]" />
                                </div>
                                <h3 className="text-lg font-bold text-white tracking-tight mb-2 font-sans">{promptDialog.title}</h3>
                                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-6 font-sans">{promptDialog.message}</p>

                                <input
                                    type="text"
                                    autoFocus
                                    value={promptValue}
                                    onChange={(e) => setPromptValue(e.target.value)}
                                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-5 py-3 text-white text-sm font-bold outline-none focus:border-[#3b82f6]/40 mb-8 transition-all font-sans"
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                            promptDialog.resolve?.(promptValue);
                                            setPromptDialog({ ...promptDialog, show: false });
                                        }
                                    }}
                                />

                                <div className="flex gap-4 w-full">
                                    <button
                                        onClick={() => {
                                            promptDialog.resolve?.(null);
                                            setPromptDialog({ ...promptDialog, show: false });
                                        }}
                                        className="flex-1 h-14 rounded-2xl bg-white/[0.03] border border-white/5 text-slate-400 font-bold uppercase text-[10px] tracking-widest hover:bg-white/5 transition-all font-sans"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => {
                                            promptDialog.resolve?.(promptValue);
                                            setPromptDialog({ ...promptDialog, show: false });
                                        }}
                                        className="flex-1 h-14 rounded-2xl bg-[#3b82f6] text-white font-bold uppercase text-[10px] tracking-widest shadow-lg shadow-[#3b82f6]/20 hover:scale-105 transition-all font-sans"
                                    >
                                        Update
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) throw new Error("useToast must be used within ToastProvider");
    return context;
}
