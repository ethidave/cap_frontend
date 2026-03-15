"use client";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";

import { api } from "@/lib/api";
import { useToast } from "@/components/ToastProvider";

export default function OTPPage() {
    const { toast } = useToast();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const inputRefs = [
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null)
    ];

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

    const handleVerify = async () => {
        const fullOtp = otp.join("");
        if (fullOtp.length < 6) {
            toast("error", "Invalid Code", "Please enter the complete 6-digit code.");
            return;
        }

        const email = localStorage.getItem("pending_email");
        if (!email) {
            toast("error", "Session Expired", "No registration session found. Please sign up again.");
            router.push("/signup");
            return;
        }

        setIsLoading(true);
        try {
            await api.post("/auth/verify-otp", { email, otp: fullOtp });
            toast("success", "Email Verified", "Your account is now active. Please sign in.");
            localStorage.removeItem("pending_email");
            router.push("/signin");
        } catch (error: any) {
            toast("error", "Verification Failed", error.message || "Invalid or expired OTP.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#020617] flex relative">
            {/* Left panel remains same */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[#020617]">
                <Image
                    src="/auth_signup_premium_4k_1773419915836.png"
                    alt="OTP Verification"
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
                        <div className="mb-10 text-left">
                            <h1 className="text-4xl font-black text-white mb-3 tracking-tight">Verify Email</h1>
                            <p className="text-slate-400 font-medium leading-relaxed">
                                We've sent a 6-digit code to your email. Enter it below to confirm your identity.
                            </p>
                        </div>

                        <div className="flex justify-between gap-1.5 sm:gap-2 mb-10">
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    ref={inputRefs[index]}
                                    type="text"
                                    inputMode="numeric"
                                    value={digit}
                                    onChange={(e) => handleChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    className="w-full max-w-[48px] h-12 sm:h-14 md:h-16 text-center text-lg md:text-xl font-black text-white bg-white/[0.02] border border-white/10 rounded-xl focus:border-[#00FFA3] focus:bg-white/[0.04] outline-none transition-all"
                                    maxLength={1}
                                />
                            ))}
                        </div>

                        <button
                            disabled={isLoading}
                            onClick={handleVerify}
                            className="btn-primary w-full h-14 shadow-[0_0_20px_rgba(0,255,163,0.2)] mb-8 flex justify-center items-center gap-2"
                        >
                            {isLoading ? <div className="w-5 h-5 border-2 border-[#020617] border-t-transparent rounded-full animate-spin" /> : "Verify & Proceed"}
                            {!isLoading && <ArrowRight className="w-5 h-5" />}
                        </button>

                        <div className="text-center">
                            <p className="text-slate-400 font-medium">
                                Didn't receive the code?{" "}
                                <button className="text-[#00FFA3] hover:underline decoration-2 underline-offset-4 font-bold">Resend</button>
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </main>
    );
}
