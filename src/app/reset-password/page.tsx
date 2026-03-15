"use client";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft, Lock } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useToast } from "@/components/ToastProvider";

export default function ResetPasswordPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const [email, setEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const inputRefs = [
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null)
    ];

    useEffect(() => {
        const resetEmail = localStorage.getItem("reset_email");
        if (resetEmail) setEmail(resetEmail);
    }, []);

    const handleChange = (index: number, value: string) => {
        if (value.length > 1) {
            value = value.slice(-1);
        }

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value !== "" && index < 5) {
            inputRefs[index + 1].current?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && otp[index] === "" && index > 0) {
            inputRefs[index - 1].current?.focus();
        }
    };

    const handleReset = async () => {
        const fullOtp = otp.join("");
        if (fullOtp.length < 6) {
            toast("error", "Invalid Code", "Please enter the complete 6-digit code.");
            return;
        }
        if (newPassword.length < 8) {
            toast("error", "Invalid Password", "Password must be at least 8 characters.");
            return;
        }
        if (newPassword !== confirmPassword) {
            toast("error", "Mismatch", "Passwords do not match.");
            return;
        }

        setIsLoading(true);
        try {
            await api.post("/auth/reset-password", {
                email,
                otp: fullOtp,
                newPassword,
                confirmPassword
            });
            toast("success", "Password Reset", "Your password has been changed successfully. Please sign in.");
            localStorage.removeItem("reset_email");
            router.push("/signin");
        } catch (error: any) {
            toast("error", "Reset Failed", error.message || "Invalid OTP or request.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#020617] flex relative">
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[#020617]">
                <Image
                    src="/auth_signin_premium_4k_1773419820693.png"
                    alt="Reset Password Background"
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
                            <h1 className="text-3xl md:text-4xl font-black text-white mb-3 tracking-tight">Set New Password</h1>
                            <p className="text-slate-400 font-medium text-sm md:text-base leading-relaxed">
                                Enter the 6-digit code sent to your email and choose a new password.
                            </p>
                        </div>

                        <div className="space-y-6 mb-10">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 px-1">Reset Code from Email</label>
                                <div className="flex justify-between gap-1 sm:gap-1.5 overflow-x-hidden p-1">
                                    {otp.map((digit, index) => (
                                        <input
                                            key={index}
                                            ref={inputRefs[index]}
                                            type="text"
                                            inputMode="numeric"
                                            value={digit}
                                            onChange={(e) => handleChange(index, e.target.value)}
                                            onKeyDown={(e) => handleKeyDown(index, e)}
                                            className="w-full max-w-[48px] h-12 md:h-14 text-center text-lg md:text-xl font-black text-white bg-white/[0.02] border border-white/10 rounded-xl focus:border-[#00FFA3] focus:bg-white/[0.04] outline-none transition-all"
                                            maxLength={1}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 px-1">New Password</label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-[#00FFA3] transition-colors z-10" />
                                    <input
                                        className="input-field with-icon-left h-14 bg-white/[0.02] border-white/5 focus:bg-white/[0.04] w-full relative z-0"
                                        placeholder="Min 8 characters"
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 px-1">Confirm New Password</label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-[#00FFA3] transition-colors z-10" />
                                    <input
                                        className="input-field with-icon-left h-14 bg-white/[0.02] border-white/5 focus:bg-white/[0.04] w-full relative z-0"
                                        placeholder="Min 8 characters"
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleReset}
                            disabled={isLoading || !email}
                            className="btn-primary w-full h-14 shadow-[0_0_20px_rgba(0,255,163,0.2)] mb-8 flex justify-center items-center disabled:opacity-50"
                        >
                            {isLoading ? "Resetting..." : "Confirm Password Change"} <ArrowRight className="ml-2 w-5 h-5" />
                        </button>
                    </motion.div>
                </div>
            </div>
        </main>
    );
}
