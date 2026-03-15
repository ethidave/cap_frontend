"use client";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, QrCode, Smartphone, X, ArrowRight, Phone, Fingerprint } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "@/lib/api";

export default function KycPromptPage() {
    const router = useRouter();
    const [showQr, setShowQr] = useState(false);
    const [step, setStep] = useState(1); // 1: Info, 2: Details, 3: QR
    const [phoneNumber, setPhoneNumber] = useState("");
    const [documentNumber, setDocumentNumber] = useState("");
    const [documentType, setDocumentType] = useState<"ID_CARD" | "PASSPORT">("ID_CARD");
    const [qrUrl, setQrUrl] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleInitiate = async () => {
        if (!phoneNumber || !documentNumber) {
            setError("Please fill in all security details.");
            return;
        }
        setIsLoading(true);
        setError("");
        try {
            const data = await api.post("/kyc/initiate", {
                documentType,
                phoneNumber,
                documentNumber
            });
            setQrUrl(data.qrCodeUrl);
            setStep(3);
        } catch (err: any) {
            setError(err.message || "Failed to initiate KYC. Duplicate identification detected.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-6 relative overflow-hidden">
            <div className="absolute top-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#00FFA3] rounded-full mix-blend-screen filter blur-[150px] opacity-10" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600 rounded-full mix-blend-screen filter blur-[150px] opacity-10" />
            </div>

            <div className="absolute top-6 left-6 sm:top-8 sm:left-8 z-20">
                <Link href="/">
                    <Image
                        src="/logo.png"
                        alt="CapTrade Pro Logo"
                        width={180}
                        height={48}
                        className="h-8 sm:h-10 w-auto object-contain transition-opacity hover:opacity-80"
                    />
                </Link>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md relative z-10 px-0 sm:px-0"
            >
                <div className="bg-[#0a0f1d] border border-white/10 rounded-2xl sm:rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden backdrop-blur-xl">
                    <AnimatePresence mode="wait">
                        {step === 1 ? (
                            <motion.div
                                key="info"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="flex flex-col items-center text-center"
                            >
                                <div className="w-16 h-16 rounded-full bg-[#00FFA3]/10 flex items-center justify-center mb-6 border border-[#00FFA3]/20">
                                    <ShieldCheck className="w-8 h-8 text-[#00FFA3]" />
                                </div>
                                <h1 className="text-2xl font-bold text-white mb-3">Identity Verification</h1>
                                <p className="text-slate-400 text-sm leading-relaxed mb-8">
                                    To unlock withdrawals and live trading, we need to verify your account. One verification per person is strictly enforced.
                                </p>
                                <button
                                    onClick={() => setStep(2)}
                                    className="w-full py-4 bg-white text-[#020617] rounded-xl font-bold hover:bg-slate-100 transition-all flex items-center justify-center gap-2"
                                >
                                    Start Verification <ArrowRight className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => router.push('/dashboard')}
                                    className="mt-4 text-slate-500 text-sm hover:text-white transition-colors"
                                >
                                    I'll do it later
                                </button>
                            </motion.div>
                        ) : step === 2 ? (
                            <motion.div
                                key="details"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="flex flex-col items-start"
                            >
                                <h2 className="text-xl font-bold text-white mb-6">Security Details</h2>

                                {error && (
                                    <div className="w-full p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-xs rounded-lg mb-4">
                                        {error}
                                    </div>
                                )}

                                <div className="w-full space-y-4">
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Document Type</label>
                                        <select
                                            value={documentType}
                                            onChange={(e: any) => setDocumentType(e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#00FFA3] transition-all"
                                        >
                                            <option value="ID_CARD">National ID Card</option>
                                            <option value="PASSPORT">International Passport</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Phone Number</label>
                                        <div className="relative">
                                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                            <input
                                                type="text"
                                                placeholder="+1 234 567 890"
                                                value={phoneNumber}
                                                onChange={(e) => setPhoneNumber(e.target.value)}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white outline-none focus:border-[#00FFA3] transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Document ID Number</label>
                                        <div className="relative">
                                            <Fingerprint className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                            <input
                                                type="text"
                                                placeholder="A12345678"
                                                value={documentNumber}
                                                onChange={(e) => setDocumentNumber(e.target.value)}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white outline-none focus:border-[#00FFA3] transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={handleInitiate}
                                    disabled={isLoading}
                                    className="w-full mt-8 py-4 bg-[#00FFA3] text-[#020617] rounded-xl font-bold hover:bg-[#00e08f] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {isLoading ? "Checking Security..." : "Continue to Live Check"}
                                    {!isLoading && <ArrowRight className="w-4 h-4" />}
                                </button>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="qr"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex flex-col items-center text-center"
                            >
                                <h2 className="text-xl font-bold text-white mb-2 ml-4">Scan QR with Phone</h2>
                                <p className="text-xs text-slate-400 mb-8 max-w-[250px]">
                                    Open your phone's camera and scan the code to complete the live identity check.
                                </p>
                                <div className="p-3 bg-white rounded-2xl mb-8 shadow-xl">
                                    <img
                                        src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrUrl || "https://captrade.pro")}`}
                                        alt="KYC QR Code"
                                        className="w-[150px] h-[150px] sm:w-[180px] sm:h-[180px] rounded-lg"
                                    />
                                </div>
                                <button
                                    onClick={() => router.push('/dashboard')}
                                    className="text-sm font-semibold text-[#00FFA3] hover:underline"
                                >
                                    Finish later in Dashboard
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </main>
    );
}
