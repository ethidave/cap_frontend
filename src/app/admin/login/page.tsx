"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
    Lock,
    Mail,
    ArrowRight,
    Eye,
    EyeOff,
    ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ToastProvider";
import { api } from "@/lib/api";
import Image from "next/image";

export default function AdminLoginPage() {
    const { toast } = useToast();
    const [showPw, setShowPw] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const data = await api.post("/auth/admin/login", { email, password });

            if (!data.access_token) {
                toast("error", "Login Failed", "No access token received.");
                setIsLoading(false);
                return;
            }

            localStorage.setItem("admin_token", data.access_token);
            document.cookie = `token=${data.access_token}; path=/; max-age=604800; SameSite=Lax`;

            toast("success", "Login Successful", "Welcome back.");
            router.push("/admin/dashboard");
        } catch (error: any) {
            toast("error", "Login Failed", error.message || "Invalid email or password.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#020617] flex flex-col lg:flex-row overflow-hidden">
            {/* --- LEFT PANEL --- */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[#03081c]">
                <Image
                    src="/admin-login-bg.png"
                    alt="CapTrade Pro"
                    fill
                    className="object-cover opacity-30"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-br from-[#020617] via-transparent to-transparent" />

                <div className="relative z-10 w-full p-16 flex flex-col justify-between">
                    <div>
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="mb-12"
                        >
                            <Image
                                src="/logo.png"
                                alt="CapTrade Pro Logo"
                                width={240}
                                height={80}
                                className="h-16 w-auto object-contain"
                            />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="space-y-4"
                        >
                            <h1 className="text-6xl font-black text-white leading-tight tracking-tight">
                                WELCOME TO <br />
                                <span className="text-[#00FFA3]">ADMIN PANEL</span>
                            </h1>
                            <p className="max-w-md text-slate-400 font-medium text-lg leading-relaxed pt-6">
                                Manage your platform settings, users, and transactions from one place.
                            </p>
                        </motion.div>
                    </div>
                </div>

                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
            </div>

            {/* --- RIGHT PANEL --- */}
            <div className="flex-1 flex items-center justify-center p-8 bg-[#020617] relative">
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="w-full max-w-sm space-y-10"
                >
                    <div className="text-center lg:text-left">
                        <div className="lg:hidden flex justify-center mb-10">
                            <Image
                                src="/logo.png"
                                alt="CapTrade Pro Logo"
                                width={180}
                                height={60}
                                className="h-12 w-auto object-contain"
                            />
                        </div>
                        <h2 className="text-3xl font-black text-white tracking-tight mb-2">
                            Login
                        </h2>
                        <p className="text-slate-400 font-medium text-sm">Please login to your account</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2 group">
                            <label className="text-xs font-bold text-slate-500 ml-1">
                                Email
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-[#00FFA3] transition-colors" />
                                <input
                                    type="email"
                                    required
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full h-14 bg-white/[0.03] border border-white/5 rounded-2xl pl-12 pr-6 text-sm font-medium text-white placeholder:text-slate-600 outline-none focus:border-[#00FFA3]/30 focus:bg-white/[0.06] transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-2 group">
                            <label className="text-xs font-bold text-slate-500 ml-1">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-[#00FFA3] transition-colors" />
                                <input
                                    type={showPw ? "text" : "password"}
                                    required
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full h-14 bg-white/[0.03] border border-white/5 rounded-2xl pl-12 pr-12 text-sm font-medium text-white placeholder:text-slate-600 outline-none focus:border-[#00FFA3]/30 focus:bg-white/[0.06] transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPw(!showPw)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white transition-colors"
                                >
                                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between px-1">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 rounded-md border-white/10 bg-white/[0.03] text-[#00FFA3] focus:ring-[#00FFA3]/20 transition-all"
                                    checked={rememberMe}
                                    onChange={() => setRememberMe(!rememberMe)}
                                />
                                <span className="text-xs font-bold text-slate-500">Remember Me</span>
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-16 rounded-2xl bg-[#00FFA3] text-[#020617] font-black text-sm uppercase tracking-widest shadow-lg shadow-[#00FFA3]/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {isLoading ? "Logging in..." : "Login"}
                            {!isLoading && <ChevronRight className="w-5 h-5" />}
                        </button>
                    </form>
                </motion.div>
            </div>
        </main>
    );
}
