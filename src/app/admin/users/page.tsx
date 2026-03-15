"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search,
    Filter,
    MoreHorizontal,
    UserPlus,
    Shield,
    Ban,
    Edit3,
    Mail,
    ExternalLink,
    ChevronLeft,
    ChevronRight,
    TrendingUp,
    Wallet,
    Trash2,
    LogIn,
    X,
    User as UserIcon,
    CheckCircle,
    RotateCcw,
    Unlock,
    Smartphone
} from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/components/ToastProvider";

export default function UserManagement() {
    const { toast, confirm } = useToast();
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);

    // Modal State
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState<"create" | "edit">("create");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        id: "",
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        balance: 0
    });

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const data = await api.get(`/admin/users?search=${search}&page=${page}&limit=10`);
            if (Array.isArray(data)) {
                setUsers(data);
                setTotal(data.length);
            } else {
                setUsers(data.users || data.data || []);
                setTotal(data.total || 0);
            }
        } catch (e) {
            console.error("Failed to fetch users:", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [search, page]);

    const handleOpenCreate = () => {
        setModalMode("create");
        setFormData({ id: "", firstName: "", lastName: "", email: "", password: "", balance: 0 });
        setShowModal(true);
    };

    const handleOpenEdit = (user: any) => {
        setModalMode("edit");
        setFormData({
            id: user.id,
            firstName: user.firstName || "",
            lastName: user.lastName || "",
            email: user.email || "",
            password: "", // Handled as optional
            balance: user.balance || 0
        });
        setShowModal(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            // Destructure to remove id from body since it's already in the URL
            // Keep balance to ensure it's updated as requested
            const { id, ...dataToSubmit } = formData;

            // Ensure balance is a number
            if (dataToSubmit.balance !== undefined) {
                dataToSubmit.balance = Number(dataToSubmit.balance);
            }

            // Remove password if it is empty during edit
            if (modalMode === "edit" && !dataToSubmit.password) {
                delete (dataToSubmit as any).password;
            }

            if (modalMode === "create") {
                await api.post("/admin/users", dataToSubmit);
                toast("success", "Success", "User created successfully.");
            } else {
                await api.patch(`/admin/users/${id}`, dataToSubmit);
                toast("success", "Success", "User updated successfully.");
            }
            setShowModal(false);
            fetchUsers();
        } catch (err: any) {
            toast("error", "Error", err.message || "Failed to save user.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const toggleBlock = async (id: string, isBlocked: boolean) => {
        try {
            await api.patch(`/admin/users/${id}`, { isBlocked: !isBlocked });
            toast("success", "Success", `User ${!isBlocked ? 'blocked' : 'unblocked'}.`);
            fetchUsers();
        } catch (e: any) {
            toast("error", "Error", "Failed to update status.");
        }
    };

    const approveKyc = async (id: string) => {
        try {
            await api.patch(`/admin/users/${id}`, { kycStatus: 'VERIFIED' });
            toast("success", "KYC Approved", "User KYC has been manually approved.");
            fetchUsers();
        } catch (e: any) {
            toast("error", "Error", "Failed to approve KYC.");
        }
    };

    const resetKyc = async (id: string) => {
        const authorized = await confirm("Reset KYC", "Are you sure you want to clear this user's KYC records? They will need to re-verify.");
        if (!authorized) return;
        try {
            await api.delete(`/admin/users/${id}/kyc`);
            toast("success", "KYC Reset", "User KYC records cleared and status set to UNVERIFIED.");
            fetchUsers();
        } catch (e: any) {
            toast("error", "Error", "Failed to reset KYC.");
        }
    };

    const deleteUser = async (id: string) => {
        const authorized = await confirm("Delete User", "Are you sure you want to delete this user?");
        if (!authorized) return;
        try {
            await api.delete(`/admin/users/${id}`);
            toast("success", "Success", "User deleted successfully.");
            fetchUsers();
        } catch (e: any) {
            toast("error", "Error", "Failed to delete user.");
        }
    };

    const impersonate = async (id: string) => {
        try {
            const data = await api.post(`/admin/users/${id}/login`, {});
            localStorage.setItem("user_token", data.access_token);
            toast("success", "Success", "Logging in as user...");
            window.open("/dashboard", "_blank");
        } catch (e: any) {
            toast("error", "Error", "Failed to login as user.");
        }
    };

    const handleUnlock = async (id: string, email: string) => {
        const authorized = await confirm("Unlock User", `Are you sure you want to manually unlock ${email}? This will reset their failed login attempts.`);
        if (!authorized) return;

        try {
            await api.post(`/admin/users/${id}/unlock`, {});
            toast("success", "User Unlocked", `Successfully restored access for ${email}.`);
            fetchUsers();
        } catch (err: any) {
            toast("error", "Error", err.message || "Failed to unlock user.");
        }
    };

    const handleForgotPassword = async (email: string) => {
        const authorized = await confirm("Reset Password", `Send a password reset code to ${email}?`);
        if (!authorized) return;

        try {
            await api.post("/auth/forgot-password", { email });
            toast("success", "Reset Sent", `Password reset code has been dispatched to ${email}.`);
        } catch (err: any) {
            toast("error", "Error", err.message || "Failed to trigger reset.");
        }
    };

    return (
        <div className="space-y-8 font-sans">
            {/* Header */}
            <div className="flex items-center justify-between gap-6">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">
                        User Management
                    </h1>
                    <p className="text-slate-400 text-sm mt-1">Manage all users on the platform</p>
                </div>
                <button
                    onClick={handleOpenCreate}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#00FFA3] text-[#020617] font-bold text-sm transition-all hover:scale-105"
                >
                    <UserPlus className="w-4 h-4" />
                    Create User
                </button>
            </div>

            {/* Search */}
            <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                    type="text"
                    placeholder="Search users..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/5 rounded-xl pl-12 pr-6 py-3.5 outline-none focus:border-[#00FFA3]/30 text-white transition-all text-sm"
                />
            </div>

            {/* Table */}
            <div className="bg-white/[0.02] rounded-2xl border border-white/5 overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/5 bg-white/[0.01]">
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Name</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Trades</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Balance</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">KYC</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500 font-medium">Loading Users...</td>
                                </tr>
                            ) : users.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500 font-medium">No users found.</td>
                                </tr>
                            ) : users.map((user) => (
                                <tr key={user.id} className="hover:bg-white/[0.01] transition-colors">
                                    <td className="px-6 py-5">
                                        <div className="text-sm font-bold text-white">{user.firstName} {user.lastName}</div>
                                        <div className="text-xs text-slate-500">{user.email}</div>
                                    </td>
                                    <td className="px-6 py-5 text-center text-sm font-medium text-slate-300">
                                        {user._count?.trades || 0}
                                    </td>
                                    <td className="px-6 py-5 text-center text-sm font-bold text-[#00FFA3]">
                                        ${(user.balance || 0).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-5 text-center">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${!user.isBlocked ? 'bg-[#00FFA3]/10 text-[#00FFA3]' : 'bg-rose-500/10 text-rose-500'}`}>
                                            {user.isBlocked ? 'Blocked' : 'Active'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-center">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${user.kycStatus === 'VERIFIED' ? 'bg-[#00FFA3]/10 text-[#00FFA3]' : user.kycStatus === 'PENDING' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-slate-500/10 text-slate-400'}`}>
                                            {user.kycStatus || 'UNVERIFIED'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            {user.kycStatus !== 'VERIFIED' && (
                                                <button onClick={() => approveKyc(user.id)} title="Manually Approve KYC" className="p-2 rounded-lg bg-white/[0.03] text-[#00FFA3] hover:text-[#00FFA3]/80 transition-colors">
                                                    <CheckCircle className="w-4 h-4" />
                                                </button>
                                            )}
                                            {user.kycStatus !== 'UNVERIFIED' && (
                                                <button onClick={() => resetKyc(user.id)} title="Reset/Clear KYC" className="p-2 rounded-lg bg-white/[0.03] text-orange-500 hover:text-orange-400 transition-colors">
                                                    <RotateCcw className="w-4 h-4" />
                                                </button>
                                            )}
                                            {(user.failedLoginAttempts > 0 || user.lockoutUntil) && (
                                                <button onClick={() => handleUnlock(user.id, user.email)} title="Unlock Account (Brute Force Protection)" className="p-2 rounded-lg bg-white/[0.03] text-amber-400 hover:text-amber-300 transition-colors">
                                                    <Unlock className="w-4 h-4" />
                                                </button>
                                            )}
                                            <button onClick={() => handleForgotPassword(user.email)} title="Send Reset Password Code" className="p-2 rounded-lg bg-white/[0.03] text-indigo-400 hover:text-indigo-300 transition-colors">
                                                <Smartphone className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => impersonate(user.id)} title="Login as user" className="p-2 rounded-lg bg-white/[0.03] text-slate-400 hover:text-white transition-colors">
                                                <LogIn className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => handleOpenEdit(user)} title="Edit user" className="p-2 rounded-lg bg-white/[0.03] text-slate-400 hover:text-white transition-colors">
                                                <Edit3 className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => toggleBlock(user.id, user.isBlocked)} title={user.isBlocked ? "Unblock" : "Block"} className={`p-2 rounded-lg bg-white/[0.03] transition-colors ${user.isBlocked ? 'text-[#00FFA3]' : 'text-rose-500'}`}>
                                                <Ban className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => deleteUser(user.id)} title="Delete user" className="p-2 rounded-lg bg-white/[0.03] text-rose-500 transition-colors">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="px-6 py-4 bg-white/[0.01] flex items-center justify-between border-t border-white/5">
                    <div className="text-xs text-slate-500">
                        Page {page} • Total {users.length}
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="p-2 rounded-lg bg-white/[0.03] disabled:opacity-30">
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button onClick={() => setPage(p => p + 1)} disabled={users.length < 10} className="p-2 rounded-lg bg-white/[0.03] disabled:opacity-30">
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal */}
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
                                <h3 className="text-xl font-bold text-white uppercase tracking-tight">
                                    {modalMode === "create" ? "Create User" : "Edit User"}
                                </h3>
                                <button onClick={() => setShowModal(false)} className="text-slate-500 hover:text-white transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-400 uppercase">First Name</label>
                                        <input
                                            required
                                            value={formData.firstName}
                                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                            className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-[#00FFA3]/40"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-400 uppercase">Last Name</label>
                                        <input
                                            required
                                            value={formData.lastName}
                                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                            className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-[#00FFA3]/40"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase">Email</label>
                                    <input
                                        required
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-[#00FFA3]/40"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase">Password</label>
                                    <input
                                        required={modalMode === "create"}
                                        type="password"
                                        placeholder={modalMode === "edit" ? "Leave blank to keep current" : "Password"}
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-[#00FFA3]/40"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase">Balance ($)</label>
                                    <input
                                        required
                                        type="number"
                                        value={formData.balance}
                                        onChange={(e) => setFormData({ ...formData, balance: Number(e.target.value) })}
                                        className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-[#00FFA3]/40 transition-all font-sans"
                                    />
                                </div>

                                <div className="pt-4 flex gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="flex-1 py-3 rounded-xl bg-white/5 text-slate-400 text-sm font-bold hover:bg-white/10 transition-all font-sans"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="flex-1 py-3 rounded-xl bg-[#00FFA3] text-[#020617] text-sm font-bold shadow-lg shadow-[#00FFA3]/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 font-sans"
                                    >
                                        {isSubmitting ? "Saving..." : (modalMode === "create" ? "Create User" : "Save Changes")}
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
