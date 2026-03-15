"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, RefreshCcw, CheckCircle2, AlertCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function MaintenancePage() {
    const [remainingMins, setRemainingMins] = useState<number | null>(null);
    const [isRetrying, setIsRetrying] = useState(false);
    const [retryStatus, setRetryStatus] = useState<'idle' | 'success' | 'fail'>('idle');

    useEffect(() => {
        const checkStatus = async () => {
            try {
                const res = await fetch("http://localhost:3001/maintenance-status");
                const data = await res.json();

                if (data.estimatedEnd) {
                    const end = new Date(data.estimatedEnd);
                    const diff = end.getTime() - Date.now();
                    if (diff > 0) {
                        setRemainingMins(Math.ceil(diff / 60000));
                    } else {
                        setRemainingMins(null);
                    }
                }

                const isAdmin = localStorage.getItem("admin_token");

                if (!data.maintenance || isAdmin) {
                    window.location.href = isAdmin ? "/admin/dashboard" : "/";
                }
            } catch (e) { }
        };
        checkStatus();
        const interval = setInterval(checkStatus, 5000); // Check every 5s
        return () => clearInterval(interval);
    }, []);

    const handleRetry = async () => {
        setIsRetrying(true);
        setRetryStatus('idle');

        try {
            const res = await fetch("http://localhost:3001/maintenance-status");
            const data = await res.json();

            if (!data.maintenance) {
                setRetryStatus('success');
                setTimeout(() => {
                    window.location.href = "/dashboard";
                }, 1000);
            } else {
                setRetryStatus('fail');
                // Refresh remaining mins if available
                if (data.estimatedEnd) {
                    const end = new Date(data.estimatedEnd);
                    const diff = end.getTime() - Date.now();
                    setRemainingMins(diff > 0 ? Math.ceil(diff / 60000) : null);
                }
            }
        } catch (error) {
            setRetryStatus('fail');
        } finally {
            setIsRetrying(false);
            setTimeout(() => setRetryStatus('idle'), 3000);
        }
    };

    return (
        <main className="min-h-screen bg-[#020617] flex items-center justify-center p-6 relative overflow-hidden font-sans">
            {/* Background elements for depth */}
            <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-[#00FFA3]/5 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-[#00F0FF]/5 blur-[120px] pointer-events-none" />

            <div className="w-full max-w-lg z-10 flex flex-col items-center text-center">
                {/* Logo */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-12"
                >
                    <Image src="/logo.png" alt="CapTrade Pro" width={180} height={40} className="h-10 w-auto object-contain brightness-110" />
                </motion.div>

                {/* Main Visual */}
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="relative w-full aspect-[4/3] max-h-[320px] mb-10 rounded-[2rem] overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] border border-white/5 bg-[#0b0e1a]"
                >
                    <Image
                        src="/maintenance.png"
                        alt="Server Maintenance"
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#020617]/40 to-transparent pointer-events-none" />
                </motion.div>

                {/* Typography */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="space-y-4"
                >
                    <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
                        Under Maintenance
                    </h1>
                    <p className="text-slate-400 text-base md:text-lg max-w-sm mx-auto font-medium leading-relaxed">
                        The platform is currently under maintenance for system upgrades. We'll be back online {remainingMins ? <span>in about <span className="text-[#00FFA3] font-bold">{remainingMins} minutes</span></span> : "shortly"}.
                    </p>
                </motion.div>

                {/* Action Row */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="mt-12 flex flex-col items-center gap-6"
                >
                    <button
                        onClick={handleRetry}
                        disabled={isRetrying}
                        className={`group relative flex items-center gap-3 px-8 py-3 rounded-full font-bold text-sm transition-all duration-300 ${retryStatus === 'success'
                            ? 'bg-[#00FFA3] text-[#020617]'
                            : retryStatus === 'fail'
                                ? 'bg-red-500 text-white'
                                : 'bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-[#00FFA3]/50'
                            }`}
                    >
                        <AnimatePresence mode="wait">
                            {isRetrying ? (
                                <motion.div
                                    key="loading"
                                    initial={{ opacity: 0, rotate: 0 }}
                                    animate={{ opacity: 1, rotate: 360 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                >
                                    <RefreshCcw className="w-4 h-4" />
                                </motion.div>
                            ) : retryStatus === 'success' ? (
                                <motion.div key="success" initial={{ scale: 0 }} animate={{ scale: 1 }}>
                                    <CheckCircle2 className="w-4 h-4" />
                                </motion.div>
                            ) : retryStatus === 'fail' ? (
                                <motion.div key="fail" initial={{ scale: 0 }} animate={{ scale: 1 }}>
                                    <AlertCircle className="w-4 h-4" />
                                </motion.div>
                            ) : (
                                <RefreshCcw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                            )}
                        </AnimatePresence>

                        <span>
                            {isRetrying ? "Checking System..." :
                                retryStatus === 'success' ? "Online! Redirecting..." :
                                    retryStatus === 'fail' ? "Still in Maintenance" : "Retry Connection"}
                        </span>
                    </button>

                    <Link href="/admin/login" className="flex items-center gap-2 text-slate-500 hover:text-[#00FFA3] transition-all text-[10px] font-black uppercase tracking-widest group">
                        Administrative Access <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </motion.div>

                {/* Bottom Status */}
                <div className="mt-12 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#00FFA3] animate-pulse" />
                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">
                        System Status: Secure Upgrade
                    </span>
                </div>
            </div>
        </main>
    );
}
