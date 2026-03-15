"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Shield, ArrowRight, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { api } from "@/lib/api";
import { useToast } from "@/components/ToastProvider";

export default function Signin2FAPage() {
    const { toast } = useToast();
    const router = useRouter();
    const [code, setCode] = useState("");
    const [rememberDevice, setRememberDevice] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();

        const tempUserId = localStorage.getItem("temp_user_id");
        if (!tempUserId) {
            router.push('/signin');
            return;
        }

        setIsLoading(true);
        try {
            // Assuming your backend has an endpoint for 2fa login using temporary userId and code
            const deviceId = localStorage.getItem("device_id");
            const res = await api.post("/auth/login/2fa", { userId: tempUserId, token: code, deviceId, rememberDevice });

            if (res.access_token) {
                localStorage.setItem("user_token", res.access_token);
                localStorage.removeItem("temp_user_id");

                if (rememberDevice) {
                    localStorage.setItem("remember_device", "true"); // Custom flag for your needs
                }

                toast("success", "Verification complete", "Secure connection established.");
                router.push("/dashboard");
            }
        } catch (error: any) {
            toast("error", "Verification Failed", error.message || "Invalid 2FA code.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#020617] flex justify-center items-center py-12 px-6">
            <div className="absolute top-12 left-12 z-20 hidden md:block">
                <Link href="/">
                    <Image src="/logo.png" alt="Logo" width={180} height={50} className="h-10 w-auto object-contain transition-opacity hover:opacity-80" />
                </Link>
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md bg-[#0a0f1d] border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl relative"
            >
                <div className="flex flex-col items-center text-center">
                    <button onClick={() => router.push('/signin')} className="absolute top-6 left-6 text-slate-500 hover:text-white transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </button>

                    <div className="w-16 h-16 rounded-full bg-[#00FFA3]/10 flex items-center justify-center mb-6 border border-[#00FFA3]/20 shadow-[0_0_30px_rgba(0,255,163,0.1)]">
                        <Shield className="w-8 h-8 text-[#00FFA3]" />
                    </div>

                    <h1 className="text-2xl font-bold text-white mb-2">Two-Factor Auth</h1>
                    <p className="text-slate-400 text-sm leading-relaxed mb-8">
                        Enter the 6-digit code from your Authenticator app to safely proceed to your dashboard.
                    </p>

                    <form onSubmit={handleVerify} className="w-full space-y-6">
                        <div>
                            <input
                                required
                                maxLength={6}
                                className="w-full text-center tracking-[0.5em] font-mono text-2xl h-16 bg-white/[0.02] border-white/10 focus:border-[#00FFA3] focus:bg-white/[0.04] rounded-xl outline-none text-white transition-all shadow-inner"
                                placeholder={"000000"}
                                value={code}
                                onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ''))}
                            />
                        </div>

                        <div className="flex items-center gap-3 justify-center text-sm text-[#a9b0c0]">
                            <input
                                type="checkbox"
                                id="remember"
                                checked={rememberDevice}
                                onChange={(e) => setRememberDevice(e.target.checked)}
                                className="w-4 h-4 rounded border-white/10 text-[#00FFA3] focus:ring-[#00FFA3] focus:ring-opacity-50 transition-all bg-white/[0.05]"
                            />
                            <label htmlFor="remember" className="cursor-pointer select-none">Remember my device</label>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading || code.length !== 6}
                            className="btn-primary w-full h-14 shadow-[0_0_20px_rgba(0,255,163,0.2)] flex items-center justify-center gap-2 mt-4 text-sm font-bold uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? "Verifying..." : "Verify Identity"}
                            {!isLoading && <ArrowRight className="w-4 h-4" />}
                        </button>
                    </form>
                </div>
            </motion.div>
        </main>
    );
}
