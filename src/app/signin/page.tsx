"use client";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, TrendingUp, ArrowRight, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { api } from "@/lib/api";
import { useToast } from "@/components/ToastProvider";

export default function SignInPage() {
    const { toast } = useToast();
    const [showPw, setShowPw] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({ email: "", password: "" });
    const router = useRouter();

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        if (token) {
            localStorage.setItem("user_token", token);
            toast("success", "Welcome", "Successfully signed in via Google.");
            // Wait a moment for the toast to be seen before redirecting
            setTimeout(() => {
                router.push("/dashboard");
            }, 1000);
        }
    }, [router, toast]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            let deviceId = localStorage.getItem("device_id");
            if (!deviceId) {
                deviceId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
                localStorage.setItem("device_id", deviceId);
            }

            const res = await api.post("/auth/login", { ...formData, deviceId });
            if (res.access_token) {
                localStorage.setItem("user_token", res.access_token);
                toast("success", "Welcome", "Successfully signed in. Checking security status...");
                // Force a check on setup-2fa before bringing them to dashboard, as requested
                router.push("/setup-2fa");
            } else if (res.requires2FA) {
                localStorage.setItem("temp_user_id", res.userId);
                router.push("/signin/2fa");
            }
        } catch (error: any) {
            toast("error", "Sign In Failed", error.message || "Invalid credentials.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#020617] flex relative">
            {/* Sidebar remains same */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[#020617]">
                <Image
                    src="/auth_signin_premium_4k_1773419820693.png"
                    alt="Futuristic Trading Dashboard"
                    fill
                    className="object-cover opacity-100 scale-100"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-[#020617] via-transparent to-transparent z-10" />

                <div className="absolute top-12 left-12 z-20">
                    <Link href="/">
                        <Image
                            src="/logo.png"
                            alt="CapTrade Pro Logo"
                            width={220}
                            height={60}
                            className="h-14 w-auto object-contain transition-opacity hover:opacity-80"
                        />
                    </Link>
                </div>
            </div>

            <div className="w-full lg:w-1/2 flex flex-col relative min-h-screen overflow-y-auto">
                <div className="absolute top-8 left-8 md:left-12 z-30">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group"
                    >
                        <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:border-[#00FFA3]/40 transition-all">
                            <ArrowLeft className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-semibold">Back</span>
                    </button>
                </div>

                <div className="flex-1 flex items-center justify-center px-6 py-24 md:px-12 text-left">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="w-full max-w-sm"
                    >
                        <div className="mb-8 md:mb-10 text-left">
                            <h1 className="text-3xl md:text-4xl font-black text-white mb-3 tracking-tight">Welcome back</h1>
                            <p className="text-slate-400 font-medium text-sm md:text-base">
                                Don't have an account?{" "}
                                <Link href="/signup" className="text-[#00FFA3] hover:underline decoration-2 underline-offset-4">Create account</Link>
                            </p>
                        </div>

                        <form onSubmit={handleLogin} className="space-y-6 mb-10">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 px-1">Email Address</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-[#00FFA3] transition-colors z-10" />
                                    <input
                                        required
                                        className="input-field with-icon-left h-14 bg-white/[0.02] border-white/5 focus:bg-white/[0.04] relative z-0"
                                        placeholder="trader@example.com"
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center px-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Password</label>
                                    <Link href="/forgot-password" className="text-xs font-bold text-[#00FFA3] hover:underline decoration-2 underline-offset-4">Forgot password?</Link>
                                </div>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-[#00FFA3] transition-colors z-10" />
                                    <input
                                        required
                                        className="input-field with-icon-left with-icon-right h-14 bg-white/[0.02] border-white/5 focus:bg-white/[0.04] relative z-0"
                                        placeholder="••••••••"
                                        type={showPw ? "text" : "password"}
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    />
                                    <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-[#00FFA3] transition-colors z-10">
                                        {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            <button
                                disabled={isLoading}
                                className="btn-primary w-full h-14 shadow-[0_0_20px_rgba(0,255,163,0.2)] flex items-center justify-center gap-2"
                            >
                                {isLoading ? <div className="w-5 h-5 border-2 border-[#020617] border-t-transparent rounded-full animate-spin" /> : "Sign In"}
                                {!isLoading && <ArrowRight className="w-5 h-5" />}
                            </button>
                        </form>

                        <div className="relative mb-10">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-white/5"></div>
                            </div>
                            <div className="relative flex justify-center text-[10px] uppercase font-black tracking-widest">
                                <span className="bg-[#020617] px-4 text-slate-500">Or continue with</span>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => window.location.href = "http://localhost:3001/api/auth/google"}
                            className="w-full h-14 bg-white/[0.03] border border-white/10 hover:bg-white/[0.05] hover:border-white/20 rounded-xl flex items-center justify-center gap-3 transition-all text-white font-bold group"
                        >
                            <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 6.13l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            Google
                        </button>
                    </motion.div>
                </div>
            </div>
        </main>
    );
}
