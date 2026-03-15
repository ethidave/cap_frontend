"use client";
import React from "react";
import { motion } from "framer-motion";
import {
    Users,
    TrendingUp,
    Wallet,
    ArrowUpRight,
    ArrowDownRight,
    ArrowDownLeft,
    Activity,
    Clock,
    ShieldAlert,
    Zap,
    DollarSign,
    BarChart3,
    RefreshCw
} from "lucide-react";

import { api } from "@/lib/api";

const initialStats = [
    { label: "Total Users", value: "0", icon: Users, color: "#00FFA3", key: 'totalUsers' },
    { label: "Total Deposits", value: "$0", icon: Wallet, color: "#00FFA3", key: 'totalDeposit' },
    { label: "Total Withdrawals", value: "$0", icon: ArrowDownLeft, color: "#f6465d", key: 'totalWithdraw' },
    { label: "Total Trades", value: "0", icon: BarChart3, color: "#00F0FF", key: 'totalTrades' },
];

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
};

export default function AdminDashboard() {
    const [stats, setStats] = React.useState(initialStats);
    const [chartData, setChartData] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [chartMode, setChartMode] = React.useState<'DEPOSITS' | 'WITHDRAWALS' | 'USERS'>('DEPOSITS');

    React.useEffect(() => {
        async function fetchStats() {
            try {
                const data = await api.get("/admin/dashboard/stats");
                setStats(prev => prev.map(s => {
                    if (s.key === 'totalUsers') return { ...s, value: (data.totalUsers || 0).toLocaleString() };
                    if (s.key === 'totalDeposit') return { ...s, value: `$${(data.totalDeposit || 0).toLocaleString()}` };
                    if (s.key === 'totalWithdraw') return { ...s, value: `$${(data.totalWithdraw || 0).toLocaleString()}` };
                    if (s.key === 'totalTrades') return { ...s, value: (data.totalTrades || 0).toLocaleString() };
                    return s;
                }));
                if (data.chartData) setChartData(data.chartData);
            } catch (e) {
                console.error("Failed to fetch stats", e);
            } finally {
                setLoading(false);
            }
        }
        fetchStats();
    }, []);

    const width = 1000;
    const height = 300;
    const paddingX = 40;
    const paddingY = 60;

    // SVG Chart Helpers
    const getChartPoints = () => {
        if (!chartData || chartData.length === 0) return "";
        const max = Math.max(...chartData.map(d =>
            chartMode === 'DEPOSITS' ? (Number(d.deposits) || 0) :
                chartMode === 'WITHDRAWALS' ? (Number(d.withdrawals) || 0) : (Number(d.users) || 0)
        ), 10);

        const points = chartData.map((d, i) => {
            const val = chartMode === 'DEPOSITS' ? (Number(d.deposits) || 0) :
                chartMode === 'WITHDRAWALS' ? (Number(d.withdrawals) || 0) : (Number(d.users) || 0);

            const x = (i / (chartData.length - 1)) * (width - paddingX * 2) + paddingX;
            // Scale value to fit between paddingY and height-paddingY
            const innerHeight = height - paddingY * 2;
            const y = (height - paddingY) - ((val / max) * innerHeight);
            return `${x},${y}`;
        }).join(" ");

        return points;
    };

    const getAreaPath = () => {
        const points = getChartPoints();
        if (!points) return "";
        const pointArr = points.split(" ");
        const first = pointArr[0];
        const last = pointArr[pointArr.length - 1];
        const firstX = first.split(',')[0];
        const lastX = last.split(',')[0];
        return `M ${first} L ${points} L ${lastX},240 L ${firstX},240 Z`;
    };

    const activeColor = chartMode === 'WITHDRAWALS' ? '#f6465d' : (chartMode === 'USERS' ? '#00F0FF' : '#00FFA3');

    return (
        <div className="space-y-10 font-sans">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tight leading-tight">
                        Analytics Center
                    </h1>
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.25em] mt-1.5 flex items-center gap-2">
                        <Activity className="w-3 h-3 text-[#00FFA3]" /> Advanced Performance Monitoring
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="px-5 py-2.5 rounded-2xl bg-[#00FFA3]/5 border border-[#00FFA3]/10 flex items-center gap-3">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#00FFA3] animate-pulse shadow-[0_0_12px_#00FFA3]" />
                        <span className="text-[10px] font-black text-[#00FFA3] uppercase tracking-widest">System Synchronized</span>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
                {stats.map((s, i) => (
                    <motion.div
                        key={i}
                        variants={item}
                        onClick={() => {
                            if (s.key === 'totalDeposit') setChartMode('DEPOSITS');
                            else if (s.key === 'totalWithdraw') setChartMode('WITHDRAWALS');
                            else if (s.key === 'totalUsers') setChartMode('USERS');
                        }}
                        className={`bg-[#0a0f1d] border rounded-3xl p-8 relative overflow-hidden group transition-all duration-500 shadow-2xl cursor-pointer ${(s.key === 'totalDeposit' && chartMode === 'DEPOSITS') ||
                            (s.key === 'totalWithdraw' && chartMode === 'WITHDRAWALS') ||
                            (s.key === 'totalUsers' && chartMode === 'USERS')
                            ? 'border-[#00FFA3]/30 ring-1 ring-[#00FFA3]/20 shadow-[#00FFA3]/5' : 'border-white/5 hover:border-white/10'
                            }`}
                    >
                        <div className="flex items-center justify-between mb-8">
                            <div className="w-14 h-14 rounded-2xl bg-white/[0.02] flex items-center justify-center border border-white/5 group-hover:scale-110 transition-all duration-500">
                                <s.icon className="w-7 h-7" style={{ color: s.color }} />
                            </div>
                        </div>
                        <div className="text-3xl font-black text-white mb-2 font-sans tracking-tight">{s.value}</div>
                        <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.15em] font-sans">{s.label}</div>

                        {/* Selector indicator */}
                        {((s.key === 'totalDeposit' && chartMode === 'DEPOSITS') ||
                            (s.key === 'totalWithdraw' && chartMode === 'WITHDRAWALS') ||
                            (s.key === 'totalUsers' && chartMode === 'USERS')) && (
                                <motion.div layoutId="selector" className="absolute bottom-0 left-0 right-0 h-1 bg-[#00FFA3] shadow-[0_0_15px_#00FFA3]" />
                            )}
                    </motion.div>
                ))}
            </motion.div>

            {/* Chart Section */}
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="bg-[#0a0f1d] border border-white/5 rounded-[2.5rem] p-10 shadow-2xl overflow-hidden relative"
            >
                <div className="flex items-center justify-between mb-12">
                    <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-2xl bg-white/[0.03] flex items-center justify-center text-white border border-white/5 shadow-inner">
                            <Activity className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-white leading-tight tracking-tight uppercase">Monthly Growth Trend</h3>
                            <p className="text-[10px] font-black text-[#00FFA3]/60 uppercase tracking-[0.2em] mt-1">Platform Evolution • Lifetime data</p>
                        </div>
                    </div>
                </div>

                <div className="relative h-[340px] w-full px-2">
                    {loading ? (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <RefreshCw className="w-12 h-12 text-[#00FFA3]/20 animate-spin" />
                        </div>
                    ) : chartData.length === 0 ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-600">
                            <ShieldAlert className="w-12 h-12 mb-4 opacity-20" />
                            <p className="text-xs font-black uppercase tracking-widest">No matching data available</p>
                        </div>
                    ) : (
                        <>
                            <svg
                                viewBox="0 0 1000 300"
                                className="w-full h-full"
                                preserveAspectRatio="none"
                            >
                                <defs>
                                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor={activeColor} stopOpacity="0.4" />
                                        <stop offset="100%" stopColor={activeColor} stopOpacity="0" />
                                    </linearGradient>
                                </defs>

                                {/* Grid Lines */}
                                {[0, 1, 2, 3].map(i => (
                                    <line key={i} x1="0" y1={paddingY + i * (300 - paddingY * 2) / 3} x2="1000" y2={paddingY + i * (300 - paddingY * 2) / 3} stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="5,10" />
                                ))}

                                {/* Area Path */}
                                <motion.path
                                    key={`area-${chartMode}`}
                                    initial={{ d: getAreaPath(), opacity: 0 }}
                                    animate={{ d: getAreaPath(), opacity: 1 }}
                                    transition={{ duration: 0.8 }}
                                    fill="url(#chartGradient)"
                                />

                                {/* Main Stroke Line */}
                                <motion.polyline
                                    key={`line-${chartMode}`}
                                    initial={{ pathLength: 0, opacity: 0 }}
                                    animate={{ pathLength: 1, opacity: 1 }}
                                    transition={{ duration: 1.2, ease: "easeOut" }}
                                    points={getChartPoints()}
                                    fill="none"
                                    stroke={activeColor}
                                    strokeWidth="4"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />

                                {/* Individual Data Points */}
                                {chartData.map((d, i) => {
                                    const max = Math.max(...chartData.map(d =>
                                        chartMode === 'DEPOSITS' ? (Number(d.deposits) || 0) :
                                            chartMode === 'WITHDRAWALS' ? (Number(d.withdrawals) || 0) : (Number(d.users) || 0)
                                    ), 10);
                                    const val = chartMode === 'DEPOSITS' ? (Number(d.deposits) || 0) :
                                        chartMode === 'WITHDRAWALS' ? (Number(d.withdrawals) || 0) : (Number(d.users) || 0);

                                    const x = (i / (chartData.length - 1)) * (1000 - 80) + 40;
                                    const y = (300 - 60) - ((val / max) * (300 - 120));

                                    return (
                                        <motion.circle
                                            key={`${i}-${chartMode}`}
                                            initial={{ r: 0 }}
                                            animate={{ r: 5 }}
                                            cx={x}
                                            cy={y}
                                            fill="#020617"
                                            stroke={activeColor}
                                            strokeWidth="3"
                                            className="cursor-pointer"
                                        />
                                    );
                                })}
                            </svg>

                            {/* Improved Labels Area */}
                            <div className="absolute bottom-0 left-0 right-0 flex justify-between px-8 text-[10px] font-black text-slate-500 uppercase tracking-tighter pt-8">
                                {chartData.map((d, i) => (
                                    <span key={i} className="transform -rotate-45 md:rotate-0 origin-top-left md:origin-center">{d.date}</span>
                                ))}
                            </div>
                        </>
                    )}
                </div>


                <div className="mt-8 pt-6 border-t border-white/5 flex flex-wrap gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-[#00FFA3]" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Deposits</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-[#f6465d]" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Withdrawals</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-[#00F0FF]" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">User Signups</span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

