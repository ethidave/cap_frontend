"use client";

import { useState } from "react";
import { Wallet, Plus, Zap, CheckCircle, Globe, Shield, ArrowRight } from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/components/ToastProvider";

export default function DepositPage() {
    const { toast } = useToast();
    const [amount, setAmount] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleDeposit = async () => {
        const numAmount = parseFloat(amount);
        if (!numAmount || numAmount <= 0) {
            toast("error", "Invalid Amount", "Please enter a valid positive number.");
            return;
        }

        setIsLoading(true);
        try {
            const res = await api.post("/transactions/deposit", { amount: numAmount });
            if (res.payUrl) {
                // Redirect user to OxaPay payment gateway
                window.location.href = res.payUrl;
            } else {
                toast("error", "Deposit Failed", "Failed to get the payment URL from the server.");
            }
        } catch (error: any) {
            toast("error", "Deposit Failed", error.message || "An error occurred.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex-1 flex flex-col min-h-0 bg-[#0b0c0f]">
            <header className="h-[60px] bg-[#111317] border-b border-[#1c1f26] flex items-center justify-between px-4 sm:px-6 shrink-0">
                <div className="flex items-center gap-2">
                    <Plus className="w-5 h-5 text-[#00FFA3]" />
                    <h1 className="text-white font-bold text-base sm:text-lg">Deposit Funds</h1>
                </div>
            </header>

            <div className="p-4 sm:p-8 overflow-y-auto custom-scrollbar flex-1">
                <div className="max-w-4xl mx-auto space-y-8 sm:space-y-12">

                    {/* Header Intro */}
                    <div className="text-center space-y-3">
                        <h2 className="text-2xl sm:text-3xl font-black text-white">Deposit via Crypto</h2>
                        <p className="text-slate-400 text-xs sm:text-sm max-w-sm mx-auto leading-relaxed">Deposit using our secure cryptocurrency gateway for instant and zero-fee funding.</p>
                    </div>

                    {/* Deposit Form */}
                    <div className="max-w-xl mx-auto bg-[#111317] border border-[#1c1f26] hover:border-[#00FFA3]/40 p-6 sm:p-8 rounded-2xl transition-all shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
                            <Wallet className="w-24 h-24 text-[#00FFA3]" />
                        </div>

                        <div className="mb-8">
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center border bg-[#00FFA3]/10 text-[#00FFA3] border-[#00FFA3]/20 mb-4">
                                <Wallet className="w-6 h-6" />
                            </div>
                            <h3 className="font-bold text-xl text-white">Cryptocurrency Payment</h3>
                            <p className="text-[#636c7a] text-sm mt-1">BTC, ETH, USDT, LTC, TRX, ETC, and more supported</p>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-xs font-bold text-[#636c7a] uppercase tracking-widest mb-2">Amount (USD)</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white font-bold">$</span>
                                    <input
                                        type="number"
                                        min="1"
                                        placeholder="0.00"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        className="w-full bg-[#0b0c0f] border border-[#252a33] focus:border-[#00FFA3] rounded-xl pl-8 pr-4 py-4 text-white font-black text-lg outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <button
                                onClick={handleDeposit}
                                disabled={isLoading || !amount || parseFloat(amount) <= 0}
                                className="w-full py-4 bg-[#00FFA3] text-[#020617] font-bold text-sm uppercase tracking-widest rounded-xl hover:shadow-[0_0_20px_rgba(0,255,163,0.3)] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex justify-center items-center gap-2"
                            >
                                {isLoading ? "Processing..." : "Proceed to Payment"}
                                {!isLoading && <ArrowRight className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    {/* Info Section */}
                    <div className="bg-[#111317] rounded-2xl border border-[#1c1f26] p-6 sm:p-8 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-[-10%] right-[-10%] w-[30%] h-[100%] bg-blue-500/5 mix-blend-screen filter blur-[100px] pointer-events-none" />
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-center">
                            <div className="flex items-center gap-4 group">
                                <div className="p-3 bg-white/[0.03] rounded-full border border-white/5 text-[#00FFA3] group-hover:bg-[#00FFA3]/10 transition-colors">
                                    <CheckCircle className="w-6 h-6" />
                                </div>
                                <div className="space-y-0.5">
                                    <h4 className="text-white font-bold text-sm">Instant Credit</h4>
                                    <p className="text-[#636c7a] text-[10px] sm:text-xs">Funds added automatically</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 group">
                                <div className="p-3 bg-white/[0.03] rounded-full border border-white/5 text-blue-400 group-hover:bg-blue-400/10 transition-colors">
                                    <Globe className="w-6 h-6" />
                                </div>
                                <div className="space-y-0.5">
                                    <h4 className="text-white font-bold text-sm">Multiple Assets</h4>
                                    <p className="text-[#636c7a] text-[10px] sm:text-xs">USDT, BTC, ETH, and more</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 group">
                                <div className="p-3 bg-white/[0.03] rounded-full border border-white/5 text-purple-400 group-hover:bg-purple-400/10 transition-colors">
                                    <Shield className="w-6 h-6" />
                                </div>
                                <div className="space-y-0.5">
                                    <h4 className="text-white font-bold text-sm">Secure Network</h4>
                                    <p className="text-[#636c7a] text-[10px] sm:text-xs">End-to-end encrypted transactions</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
