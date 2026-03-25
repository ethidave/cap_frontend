"use client";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, QrCode, Smartphone, X, ArrowRight, Phone, Fingerprint, RefreshCw } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "@/lib/api";

export default function KycPromptPage() {
    const router = useRouter();
    const [step, setStep] = useState(1); // 1: Info, 2: Details, 3: QR
    const [phoneNumber, setPhoneNumber] = useState("");
    const [documentType, setDocumentType] = useState<"ID_CARD" | "PASSPORT" | "DRIVER_LICENSE">("ID_CARD");
    const [qrUrl, setQrUrl] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleInitiate = async () => {
        if (!phoneNumber) {
            setError("Please fill in your security details.");
            return;
        }
        setIsLoading(true);
        setError("");
        try {
            const data = await api.post("/kyc/initiate", {
                documentType,
                phoneNumber
            });
            
            // On Desktop, always show QR. On mobile, we can still redirect if we want,
            // but for now let's always show the QR/Success screen and the link.
            setQrUrl(data.qrCodeUrl);
            setStep(3);
        } catch (err: any) {
            setError(err.message || "Failed to initiate KYC. Duplicate identification detected.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
            {/* Background elements */}
            <div className="absolute top-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#00FFA3] rounded-full mix-blend-screen filter blur-[150px] opacity-10" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600 rounded-full mix-blend-screen filter blur-[150px] opacity-10" />
            </div>

            <div className="absolute top-6 left-6 sm:top-8 sm:left-8 z-20">
                <Link href="/">
                    <Image
                        src="/logo.png"
                        alt="Logo"
                        width={180}
                        height={48}
                        className="h-8 sm:h-10 w-auto object-contain transition-opacity hover:opacity-80"
                    />
                </Link>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-lg bg-[#0a0f1d]/60 backdrop-blur-3xl border border-white/5 rounded-[40px] p-8 sm:p-12 relative z-10 shadow-2xl"
            >
                <div className="w-full relative min-h-[420px]">
                    <AnimatePresence mode="wait">
                        {step === 1 ? (
                            <motion.div
                                key="step-1"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="flex flex-col items-center text-center"
                            >
                                <div className="w-20 h-20 bg-[#00FFA3]/10 rounded-3xl flex items-center justify-center mb-8 border border-[#00FFA3]/20 shadow-lg shadow-[#00FFA3]/10">
                                    <ShieldCheck className="w-10 h-10 text-[#00FFA3]" />
                                </div>
                                <h1 className="text-3xl font-bold text-white mb-4">Identity Verification</h1>
                                <p className="text-slate-400 text-sm leading-relaxed mb-10 max-w-sm">
                                    Complete our institution-grade identity verification to unlock premium features and ensure account security.
                                </p>
                                <button
                                    onClick={() => setStep(2)}
                                    className="w-full py-4.5 bg-white text-[#020617] rounded-2xl font-extrabold hover:bg-slate-100 transition-all flex items-center justify-center gap-2 shadow-xl"
                                >
                                    Start Secure Check <ArrowRight className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => router.push('/dashboard')}
                                    className="mt-6 text-slate-500 text-sm font-medium hover:text-white transition-colors"
                                >
                                    I'll complete this later
                                </button>
                            </motion.div>
                        ) : step === 2 ? (
                            <motion.div
                                key="step-2"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="flex flex-col items-start"
                            >
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="w-10 h-10 rounded-xl bg-[#00FFA3]/10 flex items-center justify-center border border-[#00FFA3]/20">
                                        <Fingerprint className="w-5 h-5 text-[#00FFA3]" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-white">Security Details</h2>
                                </div>

                                {error && (
                                    <div className="w-full p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-semibold rounded-xl mb-6 flex items-center gap-3">
                                        <X className="w-4 h-4" />
                                        {error}
                                    </div>
                                )}

                                <div className="w-full space-y-5">
                                    <div className="group">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1 block">Document Selection</label>
                                        <div className="relative">
                                            <select
                                                value={documentType}
                                                onChange={(e: any) => setDocumentType(e.target.value)}
                                                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:border-[#00FFA3] transition-all appearance-none cursor-pointer"
                                            >
                                                <option value="ID_CARD" className="bg-[#0a0f1d] text-white">National ID Card</option>
                                                <option value="DRIVER_LICENSE" className="bg-[#0a0f1d] text-white">Driver's License</option>
                                                <option value="PASSPORT" className="bg-[#0a0f1d] text-white">International Passport</option>
                                            </select>
                                            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="group">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1 block">Phone Number</label>
                                        <div className="relative">
                                            <Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-[#00FFA3] transition-colors" />
                                            <input
                                                type="text"
                                                placeholder="+1 234 567 890"
                                                value={phoneNumber}
                                                onChange={(e) => setPhoneNumber(e.target.value)}
                                                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl pl-12 pr-5 py-4 text-white outline-none focus:border-[#00FFA3] transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={handleInitiate}
                                    disabled={isLoading}
                                    className="w-full mt-10 py-4.5 bg-[#00FFA3] text-[#020617] rounded-2xl font-extrabold hover:bg-[#00e08f] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50 shadow-lg shadow-[#00FFA3]/20"
                                >
                                    {isLoading ? (
                                        <>
                                            <RefreshCw className="w-5 h-5 animate-spin" />
                                            Initializing...
                                        </>
                                    ) : (
                                        <>
                                            Request QR Access <ArrowRight className="w-5 h-5" />
                                        </>
                                    )}
                                </button>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="step-3"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex flex-col items-center text-center"
                            >
                                <div className="w-16 h-16 rounded-2xl bg-white/[0.03] flex items-center justify-center mb-6 border border-white/5">
                                    <QrCode className="w-8 h-8 text-[#00FFA3]" />
                                </div>
                                <h2 className="text-2xl font-bold text-white mb-2 ml-4">Scan with Mobile</h2>
                                <p className="text-sm text-slate-400 mb-10 max-w-xs leading-relaxed">
                                    Position your phone camera over the code to begin your secure identity check.
                                </p>
                                
                                <div className="p-4 bg-white rounded-[32px] mb-10 shadow-2xl relative group">
                                    <div className="absolute inset-[-4px] bg-[#00FFA3]/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <img
                                        src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(qrUrl || "https://captrade.pro")}`}
                                        alt="KYC QR"
                                        className="w-[200px] h-[200px] sm:w-[220px] sm:h-[220px] rounded-2xl relative z-10"
                                    />
                                </div>
                                
                                <div className="flex flex-col gap-4 w-full">
                                    <div className="flex items-center gap-3 px-6 py-4 bg-white/5 rounded-2xl border border-white/5">
                                        <Smartphone className="w-5 h-5 text-slate-400" />
                                        <p className="text-xs text-slate-400 text-left">Your session will remain active for 30 minutes on your mobile device.</p>
                                    </div>
                                     <button
                                        onClick={() => window.location.href = qrUrl}
                                        className="text-sm font-bold text-[#00FFA3] hover:underline transition-all mt-2"
                                    >
                                        I can't scan, continue on this device
                                    </button>
                                    <button
                                        onClick={() => router.push('/dashboard')}
                                        className="text-xs font-medium text-slate-600 hover:text-slate-400 mt-2"
                                    >
                                        I'll finish this later
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </main>
    );
}
