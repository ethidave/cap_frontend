"use client";

import { useState, useEffect } from "react";
import { Settings, User as UserIcon, Shield, Bell, Lock, MoreVertical, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useToast } from "@/components/ToastProvider";

export default function SettingsPage() {
    const { toast } = useToast();
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const profile = await api.get("/auth/profile/me");
                setUser(profile);
            } catch (error) {
                console.error("Settings fetch error:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchUser();
    }, []);

    const handleUpdatePassword = async () => {
        if (!oldPassword || !newPassword || !confirmPassword) {
            toast("error", "Input Error", "Please fill in all password fields.");
            return;
        }

        if (newPassword !== confirmPassword) {
            toast("error", "Mismatch", "New passwords do not match.");
            return;
        }

        setIsSaving(true);
        try {
            await api.patch("/auth/profile", { oldPassword, newPassword });
            toast("success", "Password Updated", "Your password has been changed successfully.");
            setOldPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (error: any) {
            toast("error", "Update Failed", error.message || "Failed to update password.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="flex-1 flex flex-col min-h-0">

            <div className="p-6 overflow-y-auto custom-scrollbar flex-1 bg-[#0b0c0f]">
                <div className="max-w-4xl mx-auto space-y-8">

                    {/* Profile Section */}
                    <div className="bg-[#111317] rounded-2xl border border-[#1c1f26] overflow-hidden">
                        <div className="p-6 border-b border-[#1c1f26] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-[#00FFA3]/20 to-[#00F0FF]/10 flex items-center justify-center border border-[#00FFA3]/20 shrink-0">
                                    <UserIcon className="w-7 h-7 sm:w-8 sm:h-8 text-[#00FFA3]" />
                                </div>
                                <div className="min-w-0">
                                    <h2 className="text-lg sm:text-xl font-bold text-white uppercase tracking-tight truncate">{user ? `${user.firstName} ${user.lastName}` : '---'}</h2>
                                    <div className="flex flex-wrap items-center gap-2 mt-1">
                                        <span className="text-[10px] font-semibold text-[#636c7a] px-2 py-0.5 bg-[#0b0c0f] rounded-full border border-[#1c1f26]">Standard Account</span>
                                        {user?.kycStatus === 'VERIFIED' && (
                                            <span className="flex items-center gap-1 text-[9px] sm:text-[10px] text-[#00FFA3] font-bold uppercase"><CheckCircle className="w-3 h-3" /> Verified</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-[#a9b0c0]">First Name</label>
                                <input
                                    type="text"
                                    value={user?.firstName || "---"}
                                    readOnly
                                    className="w-full bg-[#0b0c0f] border border-[#252a33] rounded-xl px-4 py-3 text-sm text-[#636c7a] outline-none cursor-not-allowed"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-[#a9b0c0]">Last Name</label>
                                <input
                                    type="text"
                                    value={user?.lastName || "---"}
                                    readOnly
                                    className="w-full bg-[#0b0c0f] border border-[#252a33] rounded-xl px-4 py-3 text-sm text-[#636c7a] outline-none cursor-not-allowed"
                                />
                            </div>
                            <div className="space-y-1.5 md:col-span-2">
                                <label className="text-sm font-semibold text-[#a9b0c0]">Email Address</label>
                                <input
                                    type="email"
                                    value={user?.email || "---"}
                                    readOnly
                                    className="w-full bg-[#0b0c0f] border border-[#252a33] rounded-xl px-4 py-3 text-sm text-[#636c7a] outline-none cursor-not-allowed"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Password Section */}
                    <div className="bg-[#111317] rounded-2xl border border-[#1c1f26] overflow-hidden">
                        <div className="px-6 py-4 border-b border-[#1c1f26]">
                            <h3 className="text-white font-bold flex items-center gap-2">
                                <Lock className="w-4 h-4 text-[#00FFA3]" /> Change Password
                            </h3>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-[#a9b0c0]">Old Password</label>
                                <input
                                    type="password"
                                    value={oldPassword}
                                    onChange={(e) => setOldPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-[#0b0c0f] border border-[#252a33] rounded-xl px-4 py-3 text-sm text-white focus:border-[#00FFA3] outline-none transition-all"
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-semibold text-[#a9b0c0]">New Password</label>
                                    <input
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full bg-[#0b0c0f] border border-[#252a33] rounded-xl px-4 py-3 text-sm text-white focus:border-[#00FFA3] outline-none transition-all"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-semibold text-[#a9b0c0]">Confirm New Password</label>
                                    <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full bg-[#0b0c0f] border border-[#252a33] rounded-xl px-4 py-3 text-sm text-white focus:border-[#00FFA3] outline-none transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="px-6 py-4 bg-[#16191e]/50 border-t border-[#1c1f26] flex justify-end">
                            <button
                                onClick={handleUpdatePassword}
                                disabled={isSaving || !oldPassword || !newPassword}
                                className="w-full sm:w-auto px-6 py-2.5 bg-[#00FFA3] text-[#020617] font-bold rounded-lg hover:shadow-[0_0_20px_rgba(0,255,163,0.3)] transition-all text-sm disabled:opacity-50"
                            >
                                {isSaving ? "Updating..." : "Update Password"}
                            </button>
                        </div>
                    </div>

                    {/* Verification Section */}
                    <div className="bg-[#111317] p-6 rounded-2xl border border-[#1c1f26] space-y-4 max-w-2xl mx-auto">
                        <div className="flex items-center gap-3 mb-2">
                            <Lock className="w-5 h-5 text-[#00FFA3]" />
                            <h3 className="font-bold text-white">Verification</h3>
                        </div>
                        <p className="text-xs text-[#a9b0c0] leading-relaxed">Proof of identity and address are required for larger withdrawals and higher limits.</p>
                        <div className="flex items-center justify-between text-[11px] font-bold py-2 px-3 bg-[#0b0c0f] rounded-lg border border-[#1c1f26]">
                            <span className="text-[#636c7a]">KYC Status</span>
                            <span className={user?.kycStatus === 'VERIFIED' ? 'text-[#00FFA3]' : user?.kycStatus === 'BANNED' ? 'text-red-500' : 'text-yellow-500'}>
                                {user?.kycStatus === 'BANNED' ? 'MAX ATTEMPTS REACHED' : user?.kycStatus || 'NOT STARTED'}
                            </span>
                        </div>
                        {user?.kycStatus !== 'VERIFIED' && user?.kycStatus !== 'BANNED' ? (
                            <button
                                onClick={() => router.push('/kyc-prompt')}
                                className="w-full py-2.5 bg-[#00FFA3]/10 text-[#00FFA3] text-sm font-semibold rounded-xl hover:bg-[#00FFA3]/20 transition-colors"
                            >
                                Update KYC
                            </button>
                        ) : user?.kycStatus === 'BANNED' ? (
                            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                                <p className="text-[10px] text-red-500 font-bold uppercase text-center leading-tight">
                                    Maximum KYC attempts (3/3) reached. Withdrawal disabled. Please contact support.
                                </p>
                            </div>
                        ) : (
                            <div className="p-3 bg-[#00FFA3]/10 border border-[#00FFA3]/20 rounded-xl flex items-center justify-center gap-2">
                                <CheckCircle className="w-4 h-4 text-[#00FFA3]" />
                                <span className="text-xs font-bold text-[#00FFA3] uppercase tracking-widest">Verified Account</span>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}
