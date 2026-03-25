"use client";
import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    TrendingUp,
    TrendingDown,
    Search,
    Filter,
    MoreHorizontal,
    XCircle,
    Edit3,
    Activity,
    Clock,
    Zap,
    ShieldAlert,
    BarChart3,
    RefreshCw,
    Trash2,
    ChevronLeft,
    ChevronRight,
    X,
    User,
    ArrowUpRight,
    ArrowDownLeft,
    Check
} from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/components/ToastProvider";

function TradeControlContent() {
    const { toast, confirm } = useToast();
    const router = useRouter();
    const searchParams = useSearchParams();
    const userId = searchParams.get("userId");

    const [trades, setTrades] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [stats, setStats] = useState({ active: 0, totalPnl: 0 });

    // Modal State
    const [showModal, setShowModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        id: "",
        symbol: "",
        type: "BUY",
        quantity: 0,
        leverage: 1,
        openPrice: 0,
        pnl: 0,
        status: "OPEN"
    });

    const fetchTrades = async () => {
        setLoading(true);
        try {
            let data;
            if (userId) {
                data = await api.get(`/admin/users/${userId}/trades`);
            } else {
                data = await api.get(`/admin/trades?search=${search}`);
            }
            const tradesArray = Array.isArray(data) ? data : (data.data || []);
            setTrades(tradesArray);

            const active = tradesArray.filter((t: any) => t.status === 'OPEN').length;
            const totalPnl = tradesArray.reduce((acc: number, t: any) => acc + (t.pnl || 0), 0);
            setStats({ active, totalPnl });
        } catch (e) {
            console.error(e);
            toast("error", "Error", "Failed to load trade data.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTrades();
    }, [userId, search]);

    const handleOpenEdit = (trade: any) => {
        setFormData({
            id: trade.id,
            symbol: trade.symbol || "",
            type: trade.type || "BUY",
            quantity: trade.quantity || 0,
            leverage: trade.leverage || 1,
            openPrice: trade.openPrice || 0,
            pnl: trade.pnl || 0,
            status: trade.status || "OPEN"
        });
        setShowModal(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const { id, ...dataToSubmit } = formData;
            await api.patch(`/admin/trades/${id}`, dataToSubmit);
            toast("success", "Success", "Trade updated successfully.");
            setShowModal(false);
            fetchTrades();
        } catch (err: any) {
            toast("error", "Error", err.message || "Failed to update trade.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const deleteTrade = async (id: string) => {
        const authorized = await confirm("Delete Trade Record", "Are you sure you want to permanently delete this trade record?");
        if (!authorized) return;
        try {
            await api.delete(`/admin/trades/${id}`);
            toast("success", "Success", "Trade record has been deleted.");
            fetchTrades();
        } catch (e: any) {
            toast("error", "Error", "Failed to delete the trade record.");
        }
    };

    return (
        <div className="space-y-8 font-sans">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">
                        {userId ? `User #${userId.slice(-6)}: Trades` : 'Trade Hub'}
                    </h1>
                    <p className="text-slate-400 text-sm mt-1">
                        {userId ? `Viewing all LIVE positions for this specific user` : 'Monitor and manage all LIVE user positions'}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    {userId && (
                        <button
                            onClick={() => router.push('/admin/trades')}
                            className="bg-white/5 border border-white/10 hover:bg-white/10 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all uppercase"
                        >
                            View All Trades
                        </button>
                    )}
                    {!userId && (
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                            <input
                                placeholder="Search email..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white outline-none focus:border-[#00FFA3]/30 min-w-[200px]"
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/[0.02] rounded-2xl p-6 border border-white/5">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-[#00F0FF]/10 flex items-center justify-center text-[#00F0FF]">
                            <Activity className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-bold text-slate-400 uppercase">Active Positions</span>
                    </div>
                    <div className="text-2xl font-bold text-white">{stats.active} <span className="text-xs text-slate-500 font-medium">Running Trades</span></div>
                </div>
                <div className="bg-white/[0.02] rounded-2xl p-6 border border-white/5">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-[#00FFA3]/10 flex items-center justify-center text-[#00FFA3]">
                            <BarChart3 className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-bold text-slate-400 uppercase">Global Performance</span>
                    </div>
                    <div className={`text-2xl font-bold ${stats.totalPnl >= 0 ? 'text-[#00FFA3]' : 'text-rose-500'}`}>
                        {stats.totalPnl >= 0 ? '+' : ''}${stats.totalPnl.toLocaleString()} <span className="text-xs opacity-50 font-medium whitespace-nowrap">Net ROI</span>
                    </div>
                </div>
            </div>

            {/* List */}
            <div className="bg-white/[0.02] rounded-2xl border border-white/5 overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/5 bg-white/[0.01]">
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Symbol / User</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-center whitespace-nowrap">Open Price</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-center whitespace-nowrap">Volume</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-center whitespace-nowrap">Current P/L</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right whitespace-nowrap">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading ? (
                                <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-500 font-medium">Loading trades...</td></tr>
                            ) : trades.length === 0 ? (
                                <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-500 font-medium">No records found.</td></tr>
                            ) : trades.map((trade) => (
                                <tr key={trade.id} className="hover:bg-white/[0.01] transition-colors group">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs border ${trade.type === 'BUY' ? 'bg-[#00FFA3]/10 border-[#00FFA3]/20 text-[#00FFA3]' : 'bg-rose-500/10 border-rose-500/20 text-rose-500'
                                                }`}>
                                                {trade.type}
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-white uppercase">{trade.symbol} <span className="text-[10px] text-slate-500 font-black ml-1">#{trade.id.slice(-4)}</span></div>
                                                <div className="text-[10px] text-slate-500 font-bold uppercase mt-0.5">{trade.user?.firstName} {trade.user?.lastName}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-center">
                                        <div className="text-sm font-bold text-white">${(trade.openPrice || 0).toLocaleString()}</div>
                                        <div className="text-[10px] text-slate-600 font-bold uppercase mt-0.5">Entry Price</div>
                                    </td>
                                    <td className="px-6 py-5 text-center">
                                        <div className="text-sm font-bold text-white">${(trade.quantity || 0).toLocaleString()}</div>
                                        <div className="text-[10px] text-[#00F0FF] font-bold uppercase mt-0.5">{trade.leverage}x Leverage</div>
                                    </td>
                                    <td className="px-6 py-5 text-center">
                                        <div className={`text-sm font-bold ${(trade.pnl || 0) >= 0 ? 'text-[#00FFA3]' : 'text-rose-500'}`}>
                                            {(trade.pnl || 0) >= 0 ? '+' : ''}${(trade.pnl || 0).toLocaleString()}
                                        </div>
                                        <div className={`text-[10px] font-bold uppercase mt-0.5 ${trade.status === 'OPEN' ? 'text-orange-500' : 'text-slate-500'}`}>
                                            {trade.status}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => handleOpenEdit(trade)}
                                                className="p-2 rounded-lg bg-white/[0.03] text-slate-400 hover:text-white transition-colors"
                                                title="Full Edit"
                                            >
                                                <Edit3 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => deleteTrade(trade.id)}
                                                className="p-2 rounded-lg bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                                                title="Delete Trade"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Edit Modal */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#020617]/90 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-[#0f172a] w-full max-w-md rounded-2xl border border-white/10 p-8 shadow-2xl"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-xl font-bold text-white uppercase tracking-tight">Edit Trade Detail</h3>
                                <button onClick={() => setShowModal(false)} className="text-slate-500 hover:text-white transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-400 uppercase">Symbol</label>
                                        <input
                                            value={formData.symbol}
                                            onChange={(e) => setFormData({ ...formData, symbol: e.target.value.toUpperCase() })}
                                            className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-[#00FFA3]/40"
                                            placeholder="e.g. BTC/USD"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-400 uppercase">Side</label>
                                        <select
                                            value={formData.type}
                                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                            className="w-full bg-[#0f172a] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-[#00FFA3]/40"
                                        >
                                            <option value="BUY">BUY</option>
                                            <option value="SELL">SELL</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-400 uppercase">Volume ($)</label>
                                        <input
                                            type="number"
                                            value={formData.quantity}
                                            onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                                            className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-[#00FFA3]/40"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-400 uppercase">Leverage</label>
                                        <input
                                            type="number"
                                            value={formData.leverage}
                                            onChange={(e) => setFormData({ ...formData, leverage: Number(e.target.value) })}
                                            className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-[#00FFA3]/40"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-400 uppercase">Open Price ($)</label>
                                        <input
                                            type="number"
                                            step="0.000001"
                                            value={formData.openPrice}
                                            onChange={(e) => setFormData({ ...formData, openPrice: Number(e.target.value) })}
                                            className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-[#00FFA3]/40"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-400 uppercase">Profit/Loss ($)</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={formData.pnl}
                                            onChange={(e) => setFormData({ ...formData, pnl: Number(e.target.value) })}
                                            className={`w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#00FFA3]/40 ${formData.pnl >= 0 ? 'text-[#00FFA3]' : 'text-rose-500'}`}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase">Trade Status</label>
                                    <select
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                        className="w-full bg-[#0f172a] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-[#00FFA3]/40"
                                    >
                                        <option value="OPEN">OPEN (Running)</option>
                                        <option value="CLOSED">CLOSED (Finished)</option>
                                    </select>
                                </div>

                                <div className="pt-4 flex gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="flex-1 py-3 rounded-xl bg-white/5 text-slate-400 text-sm font-bold hover:bg-white/10 transition-all uppercase"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="flex-1 py-3 rounded-xl bg-[#00FFA3] text-[#020617] text-sm font-bold shadow-lg shadow-[#00FFA3]/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 uppercase"
                                    >
                                        {isSubmitting ? "Saving..." : "Save Details"}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default function TradeControl() {
    return (
        <Suspense fallback={<div className="p-10 text-center text-slate-500 font-bold uppercase tracking-widest">Loading Trading Hub...</div>}>
            <TradeControlContent />
        </Suspense>
    );
}
