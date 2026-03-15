"use client";

import { useState } from "react";
import { Wallet, Globe, Shield, ArrowUpRight, CheckCircle, ArrowRight } from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/components/ToastProvider";
import { useDashboard } from "@/contexts/DashboardContext";

const withdrawMethods = [
    { id: 'CRYPTO', name: 'Cryptocurrency', icon: <Wallet className="w-6 h-6" />, desc: 'Instant withdrawal to your wallet' },
    { id: 'PAYPAL', name: 'PayPal', icon: <Shield className="w-6 h-6" />, desc: 'Secure transfer to your PayPal email' },
    { id: 'BANK', name: 'Bank Transfer', icon: <Globe className="w-6 h-6" />, desc: 'Wire transfer to your bank account' }
];

export default function WithdrawPage() {
    const { user } = useDashboard();
    const { toast } = useToast();
    const [amount, setAmount] = useState("");
    const [method, setMethod] = useState<'CRYPTO' | 'PAYPAL' | 'BANK'>('CRYPTO');
    const [details, setDetails] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleWithdraw = async () => {
        const numAmount = parseFloat(amount);
        if (!numAmount || numAmount <= 0) {
            toast("error", "Invalid Amount", "Please enter a valid positive number.");
            return;
        }

        if (!details.trim()) {
            toast("error", "Details Required", "Please provide withdrawal details.");
            return;
        }

        setIsLoading(true);
        try {
            await api.post("/transactions/withdraw", {
                amount: numAmount,
                method,
                details: { info: details }
            });
            toast("success", "Withdrawal Requested", "Your request is pending administrative review.");
            setAmount("");
            setDetails("");
        } catch (error: any) {
            toast("error", "Withdrawal Failed", error.message || "An error occurred.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex-1 flex flex-col min-h-0 bg-[#0b0c0f]">
            <header className="h-[60px] bg-[#111317] border-b border-[#1c1f26] flex items-center justify-between px-4 sm:px-6 shrink-0">
                <div className="flex items-center gap-2">
                    <ArrowUpRight className="w-5 h-5 text-red-400" />
                    <h1 className="text-white font-bold text-base sm:text-lg">Withdraw Funds</h1>
                </div>
            </header>

            <div className="p-4 sm:p-8 overflow-y-auto custom-scrollbar flex-1">
                <div className="max-w-4xl mx-auto space-y-8 sm:space-y-12">

                    <div className="text-center space-y-3">
                        <h2 className="text-2xl sm:text-3xl font-black text-white">Withdraw Your Funds</h2>
                        <p className="text-slate-400 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">Select your preferred withdrawal method and fill in the details. Processing times vary by method.</p>
                    </div>

                    <div className="max-w-xl mx-auto space-y-8">
                        {/* Selector */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {withdrawMethods.map((m: any) => (
                                <button
                                    key={m.id}
                                    onClick={() => setMethod(m.id)}
                                    className={`p-4 rounded-2xl border transition-all flex sm:flex-col items-center justify-center sm:justify-center gap-3 sm:gap-2 ${method === m.id ? 'bg-[#1c1f26] border-[#00FFA3] text-white shadow-[0_0_15px_rgba(0,255,163,0.1)]' : 'bg-[#111317] border-[#1c1f26] text-[#636c7a] hover:border-[#636c7a]'}`}
                                >
                                    <div className={`${method === m.id ? 'text-[#00FFA3]' : 'text-slate-400'}`}>
                                        {m.icon}
                                    </div>
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-center">{m.name}</span>
                                </button>
                            ))}
                        </div>

                        <div className="bg-[#111317] border border-[#1c1f26] p-8 rounded-2xl shadow-2xl relative overflow-hidden group">
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

                                <div>
                                    <label className="block text-xs font-bold text-[#636c7a] uppercase tracking-widest mb-2">
                                        {method === 'CRYPTO' ? 'Wallet Address (USDT TRC20)' : method === 'PAYPAL' ? 'PayPal Email Address' : 'Bank Details (IBAN & SWIFT)'}
                                    </label>
                                    <input
                                        type="text"
                                        placeholder={method === 'CRYPTO' ? 'T...' : method === 'PAYPAL' ? 'name@example.com' : 'IBAN: ..., SWIFT: ...'}
                                        value={details}
                                        onChange={(e) => setDetails(e.target.value)}
                                        className="w-full bg-[#0b0c0f] border border-[#252a33] focus:border-[#00FFA3] rounded-xl px-4 py-4 text-white text-xs sm:text-sm outline-none transition-all"
                                    />
                                </div>

                                <button
                                    onClick={handleWithdraw}
                                    disabled={isLoading || !amount || parseFloat(amount) <= 0 || !details.trim() || user?.kycStatus !== 'VERIFIED'}
                                    className="w-full py-4 bg-white text-[#020617] font-bold text-sm uppercase tracking-widest rounded-xl hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex justify-center items-center gap-2"
                                >
                                    {isLoading ? "Processing..." : user?.kycStatus === 'VERIFIED' ? "Submit Withdrawal" : "Verification Required"}
                                    {!isLoading && <ArrowRight className="w-4 h-4" />}
                                </button>
                                {user?.kycStatus !== 'VERIFIED' && (
                                    <p className="text-[10px] text-red-400 font-bold uppercase text-center mt-2 px-4 leading-tight">
                                        {user?.kycStatus === 'BANNED' 
                                            ? "Account restricted due to maximum KYC attempts. Please contact support." 
                                            : "Verify your identity in Settings to unlock withdrawals."}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
