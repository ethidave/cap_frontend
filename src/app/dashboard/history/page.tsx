"use client";

import { useState, useEffect } from "react";
import { History, Download, Filter, Search, ChevronDown, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { api } from "@/lib/api";

export default function HistoryPage() {
    const [transactions, setTransactions] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const profile = await api.get("/auth/profile/me");
                setUser(profile);
                const txHistory = await api.get("/transactions/history");
                setTransactions(txHistory);
            } catch (error) {
                console.error("Transaction fetch error:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    // Helper color
    const getStatusColor = (status: string) => {
        if (status === 'COMPLETED') return 'text-[#00FFA3]';
        if (status === 'PENDING') return 'text-yellow-400';
        if (status === 'FAILED') return 'text-[#f6465d]';
        return 'text-[#a9b0c0]';
    }

    return (
        <div className="flex-1 flex flex-col min-h-0">
            <header className="h-[60px] bg-[#111317] border-b border-[#1c1f26] flex items-center justify-between px-4 sm:px-6 shrink-0">
                <div className="flex items-center gap-2">
                    <History className="w-5 h-5 text-[#00FFA3]" />
                    <h1 className="text-white font-bold text-base sm:text-lg">History</h1>
                </div>
                <div className="flex items-center gap-3">
                    <div className="hidden sm:flex items-center gap-6 mr-4 text-right">
                        <div className="flex flex-col">
                            <span className="text-[10px] uppercase font-bold text-[#636c7a] tracking-wider">Balance</span>
                            <span className="text-white font-semibold text-sm">{user?.balance?.toLocaleString() || '0.00'} USD</span>
                        </div>
                    </div>
                </div>
            </header>

            <div className="p-6 overflow-y-auto custom-scrollbar flex-1 bg-[#0b0c0f]">
                <div className="max-w-6xl mx-auto space-y-6">
                    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-[#111317] p-4 rounded-xl border border-[#1c1f26]">
                        <div className="relative w-full sm:w-80">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#636c7a]" />
                            <input
                                type="text"
                                placeholder="Search history..."
                                className="w-full bg-[#0b0c0f] border border-[#252a33] rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:border-[#00FFA3] outline-none transition-colors"
                            />
                        </div>
                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <button className="flex items-center gap-2 px-3 py-2 bg-[#1c1f26] border border-[#252a33] rounded-lg text-xs font-semibold text-[#a9b0c0] hover:text-white transition-colors">
                                <Filter className="w-3 h-3" />
                                All Types
                                <ChevronDown className="w-3 h-3" />
                            </button>
                        </div>
                    </div>

                    <div className="bg-[#111317] rounded-xl border border-[#1c1f26] overflow-hidden shadow-2xl">
                        <table className="w-full text-left">
                            <thead className="bg-[#0b0c0f] text-[#636c7a] border-b border-[#1c1f26] text-[10px] sm:text-[11px] uppercase tracking-widest font-black">
                                <tr>
                                    <th className="px-4 sm:px-6 py-4">Type</th>
                                    <th className="px-4 sm:px-6 py-4">Amount</th>
                                    <th className="px-6 py-4 hidden md:table-cell">Method</th>
                                    <th className="px-4 sm:px-6 py-4 text-right">Status</th>
                                    <th className="px-4 sm:px-6 py-4 text-right hidden sm:table-cell">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#1c1f26]">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-[#636c7a]">Loading transaction history...</td>
                                    </tr>
                                ) : transactions.length > 0 ? transactions.map((tx: any) => (
                                    <tr key={tx.id} className="hover:bg-[#16191e] transition-colors h-16 group">
                                        <td className="px-4 sm:px-6">
                                            <div className="flex items-center gap-2 sm:gap-3">
                                                <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center bg-opacity-10 border shrink-0 ${tx.type === 'DEPOSIT' ? 'bg-[#00FFA3] text-[#00FFA3] border-[#00FFA3]/20' : 'bg-red-500 text-red-500 border-red-500/20'}`}>
                                                    {tx.type === 'DEPOSIT' ? <ArrowDownRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-white font-bold text-xs sm:text-sm">{tx.type}</span>
                                                    <span className="text-[9px] text-[#636c7a] font-mono hidden sm:block">{tx.id.split("-")[0]}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 sm:px-6 font-mono text-white text-xs sm:text-base font-bold">
                                            {tx.amount.toLocaleString()}
                                        </td>
                                        <td className="px-6 hidden md:table-cell">
                                            <span className="bg-[#1c1f26] text-[#a9b0c0] px-2 py-1 rounded text-[10px] font-semibold">{tx.method}</span>
                                        </td>
                                        <td className={`px-4 sm:px-6 text-right font-bold text-[10px] sm:text-xs tracking-wider ${getStatusColor(tx.status)}`}>
                                            {tx.status}
                                        </td>
                                        <td className="px-4 sm:px-6 text-right hidden sm:table-cell">
                                            <div className="flex flex-col text-[10px] sm:text-[11px]">
                                                <span className="text-[#a9b0c0]">{new Date(tx.createdAt).toLocaleDateString()}</span>
                                                <span className="text-[#636c7a] hidden md:block">{new Date(tx.createdAt).toLocaleTimeString()}</span>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-[#636c7a]">No transaction history found. Make a deposit or withdrawal.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
