"use client";

import { useState, useEffect } from "react";
import { Grid, CreditCard, ArrowUpRight, ArrowDownRight, RefreshCw, Layers } from "lucide-react";
import { api } from "@/lib/api";

export default function AccountsPage() {
    const [user, setUser] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const profile = await api.get("/auth/profile/me");
                setUser(profile);
            } catch (error) {
                console.error("Accounts fetch error:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchUser();
    }, []);

    return (
        <div className="flex-1 flex flex-col min-h-0 bg-[#0b0c0f]">
            <header className="h-[60px] bg-[#111317] border-b border-[#1c1f26] flex items-center justify-between px-6 shrink-0">
                <div className="flex items-center gap-2">
                    <Grid className="w-5 h-5 text-[#00FFA3]" />
                    <h1 className="text-white font-bold text-lg">My Accounts</h1>
                </div>
            </header>

            <div className="p-8 overflow-y-auto custom-scrollbar flex-1">
                <div className="max-w-5xl mx-auto space-y-10">

                    {/* Main Balance Hero */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-[#111317] p-6 rounded-2xl border border-[#1c1f26] shadow-xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                <CreditCard className="w-20 h-20 text-white" />
                            </div>
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#636c7a] mb-2">Total Balance</h3>
                            <div className="text-3xl font-black text-white">$ {user?.balance?.toLocaleString() || '0.00'}</div>
                            <div className="flex items-center gap-1.5 mt-3 text-[#00FFA3] text-xs font-bold bg-[#00FFA3]/5 px-2 py-1 rounded-md w-fit">
                                <ArrowUpRight className="w-3 h-3" />
                                +2.4% (Life-time)
                            </div>
                        </div>

                        <div className="bg-[#111317] p-6 rounded-2xl border border-[#1c1f26] shadow-xl">
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#636c7a] mb-2">Free Margin</h3>
                            <div className="text-3xl font-black text-white">$ {user?.balance?.toLocaleString() || '0.00'}</div>
                            <div className="mt-3 text-[#a9b0c0] text-xs font-semibold">Available for trading</div>
                        </div>

                        <div className="bg-[#111317] p-6 rounded-2xl border border-[#1c1f26] shadow-xl">
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#636c7a] mb-2">Equity</h3>
                            <div className="text-3xl font-black text-white">$ {user?.balance?.toLocaleString() || '0.00'}</div>
                            <div className="mt-3 text-[#a9b0c0] text-xs font-semibold">Real-time valuation</div>
                        </div>
                    </div>

                    {/* MetaTrader Account Detail */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-sm font-black uppercase tracking-[0.3em] text-[#636c7a]">Live MT5 Accounts</h2>
                            <button className="text-[10px] font-black uppercase text-[#00FFA3] hover:underline flex items-center gap-1">
                                <RefreshCw className="w-3 h-3" /> Sync All
                            </button>
                        </div>

                        <div className="bg-[#111317] border border-[#1c1f26] rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 hover:border-[#00FFA3]/20 transition-all group">
                            <div className="flex items-center gap-5">
                                <div className="w-12 h-12 rounded-xl bg-[#00FFA3]/10 flex items-center justify-center border border-[#00FFA3]/20">
                                    <Layers className="w-6 h-6 text-[#00FFA3]" />
                                </div>
                                <div className="space-y-0.5">
                                    <h4 className="text-white font-bold text-base">MetaTrader 5 - Live</h4>
                                    <p className="text-[#636c7a] text-xs font-mono tracking-tighter">Acc: 1102934850 • Server: CapTrade-Live-01</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 items-center">
                                <div className="text-right">
                                    <div className="text-[10px] uppercase font-bold text-[#636c7a]">Leverage</div>
                                    <div className="text-white font-bold text-sm">1:500</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-[10px] uppercase font-bold text-[#636c7a]">Currency</div>
                                    <div className="text-white font-bold text-sm">USD</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-[10px] uppercase font-bold text-[#636c7a]">Floating P/L</div>
                                    <div className="text-[#0ecb81] font-bold text-sm">+$0.00</div>
                                </div>
                                <div className="px-4">
                                    <button className="w-full md:w-auto px-6 py-2 border border-[#252a33] text-white text-xs font-bold rounded-lg hover:bg-white hover:text-[#0b0c0f] transition-all">TERMINAL</button>
                                </div>
                            </div>
                        </div>

                        <div className="bg-[#111317]/40 border border-[#1c1f26] border-dashed rounded-2xl p-6 flex items-center justify-center hover:bg-[#111317] transition-all cursor-pointer group">
                            <div className="flex flex-col items-center gap-2">
                                <div className="w-10 h-10 rounded-full bg-[#1c1f26] flex items-center justify-center text-[#636c7a] group-hover:bg-[#00FFA3]/10 group-hover:text-[#00FFA3] transition-all">
                                    <RefreshCw className="w-5 h-5" />
                                </div>
                                <span className="text-[11px] font-black uppercase tracking-widest text-[#636c7a] group-hover:text-white transition-colors">Create New Trading Account</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
