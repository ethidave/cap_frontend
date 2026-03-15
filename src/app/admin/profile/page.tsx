"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    User,
    Mail,
    Lock,
    Save,
    ShieldCheck,
    Key,
    Smartphone,
    Activity,
    LogOut,
    Camera,
    RefreshCw,
    X,
    Check
} from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/components/ToastProvider";

export default function AdminProfile() {
    const { toast } = useToast();
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: ""
    });

    const fetchProfile = async () => {
        try {
            const data = await api.get("/admin/profile");
            setProfile(data);
            setFormData({
                firstName: data.firstName || "",
                lastName: data.lastName || "",
                email: data.email || "",
                password: ""
            });
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const updateData: any = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email
            };
            if (formData.password) updateData.password = formData.password;

            await api.patch("/admin/profile", updateData);
            toast("success", "Success", "Profile updated successfully.");
            fetchProfile();
        } catch (e: any) {
            toast("error", "Error", "Failed to update profile.");
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) return <div className="text-center py-20 text-slate-500 font-bold uppercase tracking-widest animate-pulse font-sans">Loading profile...</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-10 font-sans">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-white tracking-tight leading-tight">Admin Profile</h1>
                <p className="text-slate-400 text-sm mt-1">Manage your account information and password</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left: Info Card */}
                <div className="md:col-span-1 space-y-6">
                    <div className="bg-white/[0.02] rounded-2xl border border-white/5 p-8 flex flex-col items-center text-center shadow-xl">
                        <div className="w-24 h-24 rounded-full bg-white/[0.05] border-2 border-[#00FFA3]/30 flex items-center justify-center text-3xl font-bold text-white mb-4 font-sans">
                            {profile?.firstName?.charAt(0)}{profile?.lastName?.charAt(0)}
                        </div>
                        <h2 className="text-lg font-bold text-white font-sans">{profile?.firstName} {profile?.lastName}</h2>
                        <span className="text-[10px] font-bold text-[#00FFA3] uppercase tracking-widest mt-2 px-3 py-1 rounded-full bg-[#00FFA3]/10 border border-[#00FFA3]/20 font-sans">
                            Administrator
                        </span>

                        <div className="w-full h-px bg-white/5 my-6" />

                        <div className="space-y-3 w-full">
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-slate-500 font-bold uppercase tracking-widest font-sans">User ID</span>
                                <span className="text-slate-300 font-sans">#{profile?.id.slice(-6)}</span>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-slate-500 font-bold uppercase tracking-widest font-sans">Role</span>
                                <span className="text-[#00F0FF] font-bold font-sans">SUPERADMIN</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Settings Form */}
                <div className="md:col-span-2">
                    <form onSubmit={handleUpdate} className="bg-white/[0.02] rounded-2xl border border-white/5 p-8 shadow-xl space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1 font-sans">First Name</label>
                                <input
                                    type="text"
                                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-5 py-3 text-sm text-white outline-none focus:border-[#00FFA3]/30 transition-all font-sans"
                                    value={formData.firstName}
                                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1 font-sans">Last Name</label>
                                <input
                                    type="text"
                                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-5 py-3 text-sm text-white outline-none focus:border-[#00FFA3]/30 transition-all font-sans"
                                    value={formData.lastName}
                                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1 font-sans">Email Address</label>
                            <input
                                type="email"
                                className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-5 py-3 text-sm text-white outline-none focus:border-[#00FFA3]/30 transition-all font-sans"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1 font-sans">New Password</label>
                            <input
                                type="password"
                                className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-5 py-3 text-sm text-white outline-none focus:border-[#00FFA3]/30 transition-all font-sans placeholder:text-slate-700"
                                placeholder="Change only if needed"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isSaving}
                            className="w-full py-4 rounded-xl bg-[#00FFA3] text-[#020617] font-bold uppercase tracking-widest shadow-lg shadow-[#00FFA3]/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50 font-sans"
                        >
                            {isSaving ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                            {isSaving ? "Saving..." : "Save Profile"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
