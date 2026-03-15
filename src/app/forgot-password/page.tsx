"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, ArrowRight, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useToast } from "@/components/ToastProvider";

export default function ForgotPasswordPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSendCode = async () => {
        if (!email) return;
        setIsLoading(true);
        try {
            await api.post("/auth/forgot-password", { email });
            toast("success", "Code Sent", "Check your email for the reset code.");
            localStorage.setItem("reset_email", email);
            router.push("/reset-password");
        } catch (error: any) {
            toast("error", "Error", error.message || "Failed to send reset code.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#020617] flex relative">
            {/* Left panel – Hero image */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[#020617]">
                <Image
                    src="/auth_signin_premium_4k_1773419820693.png"
                    alt="Forgot Password Background"
                    fill
                    className="object-cover opacity-100 scale-100"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-[#020617] via-transparent to-transparent z-10" />

                {/* Real Logo in hero section */}
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

            {/* Right panel – Form */}
            <div className="w-full lg:w-1/2 flex flex-col relative min-h-screen overflow-y-auto">
                {/* Back Button */}
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
                            <h1 className="text-3xl md:text-4xl font-black text-white mb-3 tracking-tight">Forgot Password</h1>
                            <p className="text-slate-400 font-medium text-sm md:text-base leading-relaxed">
                                Enter the email address associated with your account and we'll send you a code to reset your password.
                            </p>
                        </div>

                        <div className="space-y-6 mb-10">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 px-1">Email Address</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-[#00FFA3] transition-colors z-10" />
                                    <input
                                        className="input-field with-icon-left h-14 bg-white/[0.02] border-white/5 focus:bg-white/[0.04] w-full relative z-0"
                                        placeholder="trader@example.com"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleSendCode}
                            disabled={isLoading || !email}
                            className="btn-primary w-full h-14 shadow-[0_0_20px_rgba(0,255,163,0.2)] mb-8 flex justify-center items-center disabled:opacity-50"
                        >
                            {isLoading ? "Sending..." : "Send Reset Code"} <ArrowRight className="ml-2 w-5 h-5" />
                        </button>

                        <div className="text-center">
                            <p className="text-slate-400 font-medium">
                                Remember your password?{" "}
                                <Link href="/signin" className="text-[#00FFA3] hover:underline decoration-2 underline-offset-4">Sign in</Link>
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </main>
    );
}
