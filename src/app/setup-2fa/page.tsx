"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Shield, ArrowRight, SkipForward } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { api } from "@/lib/api";
import { useToast } from "@/components/ToastProvider";

export default function Setup2FAPage() {
    const { toast } = useToast();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [qrCode, setQrCode] = useState("");
    const [secret, setSecret] = useState("");
    const [code, setCode] = useState("");
    const [isVerifying, setIsVerifying] = useState(false);
    const initialized = useRef(false);

    useEffect(() => {
        const init2FA = async () => {
            if (initialized.current) return;
            initialized.current = true;
            try {
                // Check if user already has 2FA enabled
                const profile = await api.get("/auth/profile/me");
                if (profile.isTwoFactorAuthenticationEnabled) {
                    router.replace("/dashboard");
                    return;
                }

                // If not enabled, generate the secret and QR
                const res = await api.post("/auth/2fa/generate", {});
                if (res.qrCode && res.secret) {
                    setQrCode(res.qrCode);
                    setSecret(res.secret);
                }
            } catch (error: any) {
                toast("error", "Error", error.message || "Failed to load 2FA setup");
            } finally {
                setIsLoading(false);
            }
        };

        if (localStorage.getItem("user_token")) {
            init2FA();
        } else {
            router.replace("/signin");
        }
    }, [router, toast]);

    const handleVerifyToken = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsVerifying(true);

        try {
            await api.post("/auth/2fa/turn-on", { token: code });
            toast("success", "Security Secured", "Two-Factor Authentication is now enabled on your account.");
            router.push("/dashboard");
        } catch (error: any) {
            toast("error", "Verification Failed", error.message || "Invalid 2FA code.");
        } finally {
            setIsVerifying(false);
        }
    };

    const handleSkip = () => {
        router.push("/dashboard");
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#020617] flex items-center justify-center">
                <div className="w-8 h-8 rounded-full border-2 border-t-[#00FFA3] border-[#1c1f26] animate-spin"></div>
            </div>
        );
    }

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
                    <button onClick={handleSkip} title="Skip for now" className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors flex items-center gap-1 text-[10px] uppercase font-bold tracking-widest">
                        Skip <SkipForward className="w-4 h-4" />
                    </button>

                    <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mb-6 border border-blue-500/20 shadow-[0_0_30px_rgba(59,130,246,0.1)]">
                        <Shield className="w-8 h-8 text-blue-500" />
                    </div>

                    <h1 className="text-2xl font-bold text-white mb-2">Secure Your Account</h1>
                    <p className="text-slate-400 text-sm leading-relaxed mb-6">
                        We highly recommend enabling Two-Factor Authentication using Google Authenticator or Authy to protect your funds.
                    </p>

                    {qrCode && (
                        <div className="bg-white p-2 rounded-xl border border-slate-700 shadow-2xl mb-4">
                            <img src={qrCode} alt="2FA QR Code" className="w-40 h-40 object-contain" />
                        </div>
                    )}

                    <div className="text-xs text-slate-500 mb-8 w-full">
                        <span className="block mb-1">Manual Entry Code:</span>
                        <code className="text-[#00FFA3] font-mono font-bold tracking-[0.2em] bg-[#020617] px-4 py-2 rounded-lg border border-white/5 block w-full truncate">
                            {secret}
                        </code>
                    </div>

                    <form onSubmit={handleVerifyToken} className="w-full space-y-4">
                        <div className="relative group">
                            <input
                                required
                                maxLength={6}
                                className="w-full text-center tracking-[0.6em] font-mono text-2xl h-16 bg-white/[0.02] border border-white/5 focus:border-[#00FFA3]/30 focus:bg-white/[0.05] rounded-2xl outline-none text-white transition-all shadow-inner placeholder:text-slate-700"
                                placeholder={"000000"}
                                value={code}
                                onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ''))}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isVerifying || code.length !== 6}
                            className="w-full h-16 bg-[#00FFA3] text-[#020617] font-black text-sm uppercase tracking-widest rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#00FFA3]/10 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
                        >
                            {isVerifying ? "Verifying..." : "Enable 2FA"}
                            {!isVerifying && <ArrowRight className="w-5 h-5" />}
                        </button>
                    </form>
                </div>
            </motion.div>
        </main>
    );
}
