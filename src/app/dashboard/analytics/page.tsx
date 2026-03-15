"use client";

import { PieChart, TrendingUp, TrendingDown, Target, Zap, Clock, Calendar } from "lucide-react";
import { DashboardHeader } from "@/components/DashboardHeader";

export default function AnalyticsPage() {
    return (
        <div className="flex-1 flex flex-col min-h-0 bg-[#0b0c0f]">
            <header className="h-[60px] bg-[#111317] border-b border-[#1c1f26] flex items-center justify-between px-6 shrink-0">
                <div className="flex items-center gap-2">
                    <PieChart className="w-5 h-5 text-[#00FFA3]" />
                    <h1 className="text-white font-bold text-lg">Trading Analytics</h1>
                </div>
            </header>

            <div className="p-8 overflow-y-auto custom-scrollbar flex-1">
                <div className="max-w-6xl mx-auto space-y-10">

                    {/* Performance Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <PerformanceCard icon={<TrendingUp className="text-[#0ecb81]" />} label="Total Profit" value="+$4,290.00" subValue="+12.5%" isProfit />
                        <PerformanceCard icon={<TrendingDown className="text-[#f6465d]" />} label="Total Loss" value="-$1,020.00" subValue="-2.4%" isProfit={false} />
                        <PerformanceCard icon={<Target className="text-blue-400" />} label="Win Rate" value="68.4%" subValue="42/60 Trades" />
                        <PerformanceCard icon={<Zap className="text-yellow-400" />} label="Profit Factor" value="4.20" subValue="Excellent" />
                    </div>

                    {/* Chart & Summary Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* Performance Graph Mockup */}
                        <div className="lg:col-span-2 bg-[#111317] p-8 rounded-2xl border border-[#1c1f26] shadow-xl space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="font-bold text-white text-lg flex items-center gap-2">
                                    Equity Curve
                                    <span className="text-[10px] font-bold text-[#636c7a] px-2 py-0.5 bg-[#0b0c0f] rounded uppercase tracking-wider">Historical</span>
                                </h3>
                                <div className="flex bg-[#0b0c0f] p-1 rounded-lg border border-[#1c1f26]">
                                    {['7D', '30D', '90D', 'All'].map(t => (
                                        <button key={t} className={`px-4 py-1.5 text-xs font-bold rounded-md transition-colors ${t === '30D' ? 'bg-[#1c1f26] text-[#00FFA3]' : 'text-[#636c7a] hover:text-white'}`}>{t}</button>
                                    ))}
                                </div>
                            </div>

                            <div className="h-[300px] w-full bg-[radial-gradient(circle_at_center,rgba(0,183,163,0.05)_0%,transparent_100%)] flex flex-col items-center justify-center border-t border-b border-white/[0.02] border-dashed">
                                {/* Simple Mock Curve Drawing */}
                                <div className="w-full h-full relative p-4 flex items-end gap-2 overflow-hidden">
                                    <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_95%,rgba(255,255,255,0.02)_95.2%)] bg-[size:40px_100%]" />
                                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_4%,transparent_4.2%)] bg-[size:100%_40px]" />

                                    <div className="flex-1 bg-gradient-to-t from-[#00FFA3]/20 to-[#00FFA3]/60 rounded-t-lg h-[40%] animate-pulse" />
                                    <div className="flex-1 bg-gradient-to-t from-[#00FFA3]/20 to-[#00FFA3]/60 rounded-t-lg h-[55%] delay-75 animate-pulse" />
                                    <div className="flex-1 bg-gradient-to-t from-[#00FFA3]/20 to-[#00FFA3]/60 rounded-t-lg h-[45%] delay-150 animate-pulse" />
                                    <div className="flex-1 bg-gradient-to-t from-[#00FFA3]/20 to-[#00FFA3]/60 rounded-t-lg h-[75%] delay-200 animate-pulse" />
                                    <div className="flex-1 bg-gradient-to-t from-[#00FFA3]/20 to-[#00FFA3]/60 rounded-t-lg h-[90%] delay-300 animate-pulse" />
                                    <div className="flex-1 bg-gradient-to-t from-[#00FFA3]/20 to-[#00FFA3]/60 rounded-t-lg h-[80%] delay-500 animate-pulse" />
                                </div>
                                <span className="text-[10px] text-[#636c7a] font-bold uppercase tracking-widest absolute">Account Performance Data Visualizing...</span>
                            </div>
                        </div>

                        {/* Distribution & Stats */}
                        <div className="bg-[#111317] border border-[#1c1f26] rounded-2xl flex flex-col shadow-xl">
                            <div className="p-6 border-b border-[#1c1f26]">
                                <h3 className="font-bold text-white text-base">Trade Distribution</h3>
                            </div>
                            <div className="p-6 space-y-6 flex-1">
                                <DistRow label="XAUUSD" percentage={45} color="bg-[#00FFA3]" />
                                <DistRow label="BTCUSD" percentage={30} color="bg-blue-400" />
                                <DistRow label="EURUSD" percentage={15} color="bg-[#00F0FF]" />
                                <DistRow label="GBPUSD" percentage={10} color="bg-purple-400" />

                                <div className="pt-6 border-t border-[#1c1f26] space-y-4">
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-[#636c7a] flex items-center gap-1.5 font-bold uppercase tracking-wider"><Clock className="w-3.5 h-3.5" /> Avg. Holding Time</span>
                                        <span className="text-white font-mono">2.4 Hours</span>
                                    </div>
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-[#636c7a] flex items-center gap-1.5 font-bold uppercase tracking-wider"><Calendar className="w-3.5 h-3.5" /> Best Day</span>
                                        <span className="text-[#0ecb81] font-mono">Tuesday</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </div>
    );
}

function PerformanceCard({ icon, label, value, subValue, isProfit }: any) {
    return (
        <div className="bg-[#111317] p-6 rounded-2xl border border-[#1c1f26] shadow-xl h-fit">
            <div className="w-9 h-9 rounded-lg bg-[#0b0c0f] border border-[#1c1f26] flex items-center justify-center mb-4">
                {icon}
            </div>
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#636c7a] mb-1">{label}</h3>
            <div className="text-2xl font-black text-white">{value}</div>
            <div className={`text-[10px] font-bold mt-1.5 uppercase ${isProfit === undefined ? 'text-white' : isProfit ? 'text-[#0ecb81]' : 'text-[#f6465d]'}`}>
                {subValue}
            </div>
        </div>
    );
}

function DistRow({ label, percentage, color }: any) {
    return (
        <div className="space-y-1.5">
            <div className="flex justify-between text-[11px] font-bold text-[#a9b0c0] uppercase tracking-wider">
                <span>{label}</span>
                <span>{percentage}%</span>
            </div>
            <div className="h-1.5 w-full bg-[#0b0c0f] rounded-full overflow-hidden border border-[#252a33]">
                <div className={`h-full ${color} rounded-full`} style={{ width: `${percentage}%` }}></div>
            </div>
        </div>
    );
}
