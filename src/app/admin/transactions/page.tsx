"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowDownLeft,
    ArrowUpRight,
    CheckCircle2,
    XCircle,
    Clock,
    Search,
    Download,
    MoreVertical,
    DollarSign,
    CreditCard,
    Languages,
    ArrowLeftRight,
    X,
    User,
    Calendar,
    FileText,
    Check,
    Mail,
    Trash2
} from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/components/ToastProvider";

export default function TransactionsManagement() {
    const { toast, confirm } = useToast();
    const [filter, setFilter] = useState("ALL");
    const [transactions, setTransactions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Modal State for detailed view/edit
    const [selectedTx, setSelectedTx] = useState<any>(null);
    const [showModal, setShowModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [adminNotes, setAdminNotes] = useState("");

    const fetchTransactions = async () => {
        setLoading(true);
        try {
            let url = "/admin/transactions";
            const params = new URLSearchParams();
            if (filter !== "ALL") {
                if (filter === "DEPOSITS") params.append("type", "DEPOSIT");
                if (filter === "WITHDRAWALS") params.append("type", "WITHDRAWAL");
                if (filter === "PENDING") params.append("status", "PENDING");
            }
            const queryString = params.toString();
            const data = await api.get(queryString ? `${url}?${queryString}` : url);
            setTransactions(Array.isArray(data) ? data : (data.data || []));
        } catch (e) {
            console.error(e);
            toast("error", "Fetch Failed", "Unable to load transactions.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, [filter]);

    const handleUpdateStatus = async (id: string, status: "COMPLETED" | "FAILED" | "PENDING") => {
        const action = status === "COMPLETED" ? "Approve" : status === "FAILED" ? "Reject" : "Reset";
        const authorized = await confirm(`${action} Transaction`, `Are you sure you want to ${action.toLowerCase()} this transaction?`);
        if (!authorized) return;

        setIsSubmitting(true);
        try {
            await api.patch(`/admin/transactions/${id}`, {
                status,
                adminNotes: adminNotes || `Processed as ${status}`
            });
            toast("success", "Success", `Transaction has been ${status.toLowerCase()}.`);
            setShowModal(false);
            fetchTransactions();
        } catch (e: any) {
            toast("error", "Update Failed", e.message || "Something went wrong.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteTransaction = async (id: string) => {
        const authorized = await confirm("Delete Transaction", "Are you sure you want to permanently delete this transaction record?");
        if (!authorized) return;

        try {
            await api.delete(`/admin/transactions/${id}`);
            toast("success", "Success", "Transaction record deleted.");
            if (selectedTx?.id === id) setShowModal(false);
            fetchTransactions();
        } catch (e: any) {
            toast("error", "Deletion Failed", "Unable to delete the record.");
        }
    };

    const openDetails = (tx: any) => {
        setSelectedTx(tx);
        setAdminNotes(tx.adminNotes || "");
        setShowModal(true);
    };

    const stats = {
        deposits: transactions.filter(t => t.type === 'DEPOSIT' && t.status === 'COMPLETED').reduce((acc, t) => acc + (t.amount || 0), 0),
        withdrawals: transactions.filter(t => t.type === 'WITHDRAWAL' && t.status === 'COMPLETED').reduce((acc, t) => acc + (t.amount || 0), 0),
        pending: transactions.filter(t => t.status === 'PENDING').length
    };

    return (
        <div className="space-y-8 font-sans text-sm md:text-base">
            {/* Header */}
            <div className="flex items-center justify-between gap-6">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">
                        Transactions
                    </h1>
                    <p className="text-slate-400 text-sm mt-1">Manage all deposits and withdrawals</p>
                </div>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/[0.02] rounded-2xl p-6 border border-white/5">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-[#00FFA3]/10 flex items-center justify-center text-[#00FFA3]">
                            <ArrowDownLeft className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-bold text-slate-400 uppercase">Total Deposits</span>
                    </div>
                    <div className="text-2xl font-bold text-white">${stats.deposits.toLocaleString()}</div>
                </div>
                <div className="bg-white/[0.02] rounded-2xl p-6 border border-white/5">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                            <ArrowUpRight className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-bold text-slate-400 uppercase">Total Withdrawals</span>
                    </div>
                    <div className="text-2xl font-bold text-white">${stats.withdrawals.toLocaleString()}</div>
                </div>
                <div className="bg-white/[0.02] rounded-2xl p-6 border border-white/5">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-[#00F0FF]/10 flex items-center justify-center text-[#00F0FF]">
                            <Clock className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-bold text-slate-400 uppercase">Pending Requests</span>
                    </div>
                    <div className="text-2xl font-bold text-white">{stats.pending}</div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex bg-white/[0.03] p-1 rounded-xl border border-white/5 w-fit overflow-x-auto max-w-full">
                {['ALL', 'DEPOSITS', 'WITHDRAWALS', 'PENDING'].map(t => (
                    <button
                        key={t}
                        onClick={() => setFilter(t)}
                        className={`px-5 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${filter === t ? 'bg-[#00FFA3] text-[#020617]' : 'text-slate-500 hover:text-white'}`}
                    >
                        {t}
                    </button>
                ))}
            </div>

            {/* List */}
            <div className="bg-white/[0.02] rounded-2xl border border-white/5 overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/5 bg-white/[0.01]">
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">User</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Type</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Amount</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-center whitespace-nowrap">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right whitespace-nowrap">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading ? (
                                <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-500 font-medium">Loading transactions...</td></tr>
                            ) : transactions.length === 0 ? (
                                <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-500 font-medium">No transactions found.</td></tr>
                            ) : transactions.map((tx) => (
                                <tr key={tx.id} className="hover:bg-white/[0.01] transition-colors group">
                                    <td className="px-6 py-5">
                                        <div className="text-sm font-bold text-white">{tx.user?.firstName} {tx.user?.lastName}</div>
                                        <div className="text-xs text-slate-500">{tx.user?.email}</div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className={`flex items-center gap-2 text-xs font-bold ${tx.type === 'DEPOSIT' ? 'text-[#00FFA3]' : 'text-orange-500'}`}>
                                            {tx.type === 'DEPOSIT' ? <ArrowDownLeft className="w-3.5 h-3.5" /> : <ArrowUpRight className="w-3.5 h-3.5" />}
                                            {tx.type}
                                        </div>
                                        <div className="text-[10px] text-slate-600 font-bold uppercase mt-0.5 whitespace-nowrap">{tx.method || 'Standard'}</div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="text-sm font-bold text-white">${(tx.amount || 0).toLocaleString()}</div>
                                        <div className="text-[10px] text-slate-600 font-bold uppercase mt-0.5 whitespace-nowrap">{new Date(tx.createdAt).toLocaleDateString()}</div>
                                    </td>
                                    <td className="px-6 py-5 text-center">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${tx.status === 'COMPLETED' ? 'bg-[#00FFA3]/10 text-[#00FFA3]' :
                                            tx.status === 'PENDING' ? 'bg-orange-500/10 text-orange-500' :
                                                'bg-rose-500/10 text-rose-500'
                                            }`}>
                                            {tx.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => openDetails(tx)}
                                                className="p-2 rounded-lg bg-white/[0.03] text-slate-400 hover:text-white transition-colors"
                                                title="View Details"
                                            >
                                                <Search className="w-4 h-4" />
                                            </button>
                                            {tx.status === 'PENDING' ? (
                                                <>
                                                    <button
                                                        onClick={() => handleUpdateStatus(tx.id, 'COMPLETED')}
                                                        className="p-2 rounded-lg bg-[#00FFA3]/10 text-[#00FFA3] hover:bg-[#00FFA3] hover:text-[#020617] transition-all"
                                                        title="Approve"
                                                    >
                                                        <Check className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleUpdateStatus(tx.id, 'FAILED')}
                                                        className="p-2 rounded-lg bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-all"
                                                        title="Reject"
                                                    >
                                                        <XCircle className="w-4 h-4" />
                                                    </button>
                                                </>
                                            ) : (
                                                <button
                                                    onClick={() => handleDeleteTransaction(tx.id)}
                                                    className="p-2 rounded-lg bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-all"
                                                    title="Delete Record"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal for details */}
            <AnimatePresence>
                {showModal && selectedTx && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#020617]/90 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-[#0f172a] w-full max-w-lg rounded-2xl border border-white/10 p-8 shadow-2xl overflow-hidden"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-xl font-bold text-white uppercase tracking-tight">
                                    Transaction Details
                                </h3>
                                <button onClick={() => setShowModal(false)} className="text-slate-500 hover:text-white">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                                        <div className="text-[10px] font-bold text-slate-500 uppercase mb-1">Transaction Type</div>
                                        <div className={`text-sm font-bold uppercase ${selectedTx.type === 'DEPOSIT' ? 'text-[#00FFA3]' : 'text-orange-500'}`}>
                                            {selectedTx.type}
                                        </div>
                                    </div>
                                    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                                        <div className="text-[10px] font-bold text-slate-500 uppercase mb-1">Current Status</div>
                                        <div className={`text-sm font-bold uppercase ${selectedTx.status === 'COMPLETED' ? 'text-[#00FFA3]' :
                                            selectedTx.status === 'PENDING' ? 'text-orange-500' :
                                                'text-rose-500'
                                            }`}>
                                            {selectedTx.status}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <User className="w-4 h-4 text-slate-500" />
                                        <div>
                                            <div className="text-[10px] font-bold text-slate-500 uppercase">User Name</div>
                                            <div className="text-sm font-bold text-white">{selectedTx.user?.firstName} {selectedTx.user?.lastName}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Mail className="w-4 h-4 text-slate-500" />
                                        <div>
                                            <div className="text-[10px] font-bold text-slate-500 uppercase">User Email</div>
                                            <div className="text-sm font-bold text-white">{selectedTx.user?.email}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Calendar className="w-4 h-4 text-slate-500" />
                                        <div>
                                            <div className="text-[10px] font-bold text-slate-500 uppercase">Transaction Date</div>
                                            <div className="text-sm font-bold text-white">{new Date(selectedTx.createdAt).toLocaleString()}</div>
                                        </div>
                                    </div>
                                    {selectedTx.withdrawalInfo && (
                                        <div className="flex items-start gap-3">
                                            <FileText className="w-4 h-4 text-slate-500 mt-1" />
                                            <div>
                                                <div className="text-[10px] font-bold text-slate-500 uppercase">Withdrawal Address/Info</div>
                                                <div className="text-xs font-medium text-white break-all bg-white/5 p-3 rounded-lg mt-2 font-mono">
                                                    {typeof selectedTx.withdrawalInfo === 'string'
                                                        ? selectedTx.withdrawalInfo
                                                        : JSON.stringify(selectedTx.withdrawalInfo, null, 2)}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase">Admin Notes</label>
                                    <textarea
                                        value={adminNotes}
                                        onChange={(e) => setAdminNotes(e.target.value)}
                                        placeholder="Add internal notes about this transaction..."
                                        className="w-full bg-white/[0.03] border border-white/10 rounded-xl p-4 text-white text-sm outline-none focus:border-[#00FFA3]/40 min-h-[100px] transition-all"
                                    />
                                </div>

                                <div className="pt-4 flex gap-4">
                                    {selectedTx.status === 'PENDING' ? (
                                        <>
                                            <button
                                                onClick={() => handleUpdateStatus(selectedTx.id, 'FAILED')}
                                                disabled={isSubmitting}
                                                className="flex-1 py-3 rounded-xl bg-rose-500/10 text-rose-500 text-sm font-bold hover:bg-rose-500 hover:text-white transition-all uppercase"
                                            >
                                                Reject Fund
                                            </button>
                                            <button
                                                onClick={() => handleUpdateStatus(selectedTx.id, 'COMPLETED')}
                                                disabled={isSubmitting}
                                                className="flex-1 py-3 rounded-xl bg-[#00FFA3] text-[#020617] text-sm font-bold hover:scale-[1.02] active:scale-95 transition-all uppercase shadow-lg shadow-[#00FFA3]/20"
                                            >
                                                Approve Fund
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button
                                                onClick={() => handleDeleteTransaction(selectedTx.id)}
                                                className="flex-1 py-3 rounded-xl bg-rose-500/10 text-rose-500 text-sm font-bold hover:bg-rose-500 hover:text-white transition-all uppercase"
                                            >
                                                Delete Record
                                            </button>
                                            <button
                                                onClick={() => setShowModal(false)}
                                                className="flex-1 py-3 rounded-xl bg-white/5 text-slate-400 text-sm font-bold hover:bg-white/10 transition-all uppercase"
                                            >
                                                Close
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
