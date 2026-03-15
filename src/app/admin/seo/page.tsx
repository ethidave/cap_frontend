"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Save,
    Globe,
    Search,
    Share2,
    Twitter,
    Info,
    Plus,
    Trash2,
    ChevronRight,
    ExternalLink,
    AlertCircle,
    CheckCircle2,
    Settings
} from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/components/ToastProvider";

interface SeoSetting {
    id: string;
    page: string;
    title: string;
    description: string;
    keywords: string;
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
    twitterCard?: string;
    twitterTitle?: string;
    twitterDescription?: string;
    twitterImage?: string;
    canonicalUrl?: string;
    author?: string;
    robots?: string;
    googleSiteVerification?: string;
    updatedAt: string;
}

const DEFAULT_PAGES = ["home", "about", "contact", "login", "register", "trading", "dashboard", "kyc", "profile"];

export default function SeoMaster() {
    const { toast } = useToast();
    const [settings, setSettings] = useState<SeoSetting[]>([]);
    const [selectedPage, setSelectedPage] = useState<string>("home");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [newPagedMode, setNewPageMode] = useState(false);
    const [customPageName, setCustomPageName] = useState("");

    const [formData, setFormData] = useState<Partial<SeoSetting>>({
        page: "home",
        title: "",
        description: "",
        keywords: "",
        ogTitle: "",
        ogDescription: "",
        ogImage: "",
        twitterCard: "summary_large_image",
        twitterTitle: "",
        twitterDescription: "",
        twitterImage: "",
        canonicalUrl: "",
        author: "CapTrade Pro Team",
        robots: "index, follow",
        googleSiteVerification: ""
    });

    useEffect(() => {
        fetchSettings();
    }, []);

    useEffect(() => {
        const found = (settings || []).find(s => s.page === selectedPage);
        if (found) {
            setFormData({
                ...found,
                ogTitle: found.ogTitle || "",
                ogDescription: found.ogDescription || "",
                ogImage: found.ogImage || "",
                twitterCard: found.twitterCard || "summary_large_image",
                twitterTitle: found.twitterTitle || "",
                twitterDescription: found.twitterDescription || "",
                twitterImage: found.twitterImage || "",
                canonicalUrl: found.canonicalUrl || "",
                author: found.author || "CapTrade Pro Team",
                robots: found.robots || "index, follow",
                googleSiteVerification: found.googleSiteVerification || ""
            });
        } else {
            setFormData({
                page: selectedPage,
                title: "",
                description: "",
                keywords: "",
                ogTitle: "",
                ogDescription: "",
                ogImage: "",
                twitterCard: "summary_large_image",
                twitterTitle: "",
                twitterDescription: "",
                twitterImage: "",
                canonicalUrl: "",
                author: "CapTrade Pro Team",
                robots: "index, follow",
                googleSiteVerification: ""
            });
        }
    }, [selectedPage, settings]);

    const fetchSettings = async () => {
        try {
            setLoading(true);
            const response = await api.get("/seo/all");
            setSettings(Array.isArray(response) ? response : []);
        } catch (error) {
            toast("error", "Error", "Failed to load SEO settings.");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setSaving(true);
            await api.post("/seo/upsert", formData);
            toast("success", "SEO Master", `Settings for ${selectedPage} updated successfully!`);
            fetchSettings();
            setNewPageMode(false);
            setCustomPageName("");
        } catch (error) {
            toast("error", "Save Failed", "Could not update SEO settings.");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this page's SEO settings?")) return;
        try {
            await api.delete(`/seo/${id}`);
            toast("info", "Deleted", "SEO settings removed.");
            fetchSettings();
            setSelectedPage("home");
        } catch (error) {
            toast("error", "Error", "Failed to delete.");
        }
    };

    const currentSetting = (settings || []).find(s => s.page === selectedPage);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                    className="w-12 h-12 border-4 border-[#00FFA3]/20 border-t-[#00FFA3] rounded-full"
                />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/[0.02] border border-white/5 p-8 rounded-3xl backdrop-blur-md">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-[#00FFA3]/10 border border-[#00FFA3]/20 flex items-center justify-center text-[#00FFA3]">
                        <Globe className="w-7 h-7" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-white tracking-tight">SEO Master Control</h1>
                        <p className="text-slate-500 font-bold text-sm uppercase tracking-widest mt-1">Global Metadata Orchestration</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => {
                            setNewPageMode(true);
                            setSelectedPage("");
                        }}
                        className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white/[0.05] border border-white/10 text-white font-bold text-sm hover:bg-white/[0.1] transition-all"
                    >
                        <Plus className="w-4 h-4" />
                        Add Custom Page
                    </button>
                    <button
                        form="seo-form"
                        type="submit"
                        disabled={saving}
                        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#00FFA3] text-[#020617] font-black text-sm hover:scale-105 transition-all shadow-lg shadow-[#00FFA3]/20 disabled:opacity-50"
                    >
                        <Save className="w-4 h-4" />
                        {saving ? "Deploying..." : "Update Master"}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left: Page Selector */}
                <div className="lg:col-span-3 space-y-4">
                    <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 h-fit backdrop-blur-md">
                        <div className="flex items-center gap-2 mb-6 px-2">
                            <Search className="w-4 h-4 text-slate-500" />
                            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Target Pages</span>
                        </div>
                        <div className="space-y-2">
                            {/* Merge default pages with existing db settings */}
                            {Array.from(new Set([...DEFAULT_PAGES, ...(settings || []).map(s => s.page)])).sort().map(page => (
                                <button
                                    key={page}
                                    onClick={() => {
                                        setSelectedPage(page);
                                        setNewPageMode(false);
                                    }}
                                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all group ${selectedPage === page
                                        ? "bg-[#00FFA3]/10 text-[#00FFA3] border border-[#00FFA3]/20"
                                        : "text-slate-400 hover:text-white hover:bg-white/[0.03]"
                                        }`}
                                >
                                    <span className="font-bold text-sm capitalize">{page}</span>
                                    {selectedPage === page && (
                                        <ChevronRight className="w-4 h-4 animate-in slide-in-from-left-2 duration-300" />
                                    )}
                                    {(settings || []).some(s => s.page === page) && selectedPage !== page && (
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#00FFA3]/30" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right: Management Form */}
                <div className="lg:col-span-9 space-y-8">
                    <form id="seo-form" onSubmit={handleSave} className="space-y-8">
                        {/* Section: Core Meta */}
                        <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 backdrop-blur-md relative overflow-hidden">
                            <div className="flex items-center gap-3 mb-8">
                                <Info className="w-5 h-5 text-[#00FFA3]" />
                                <h2 className="text-xl font-black text-white uppercase tracking-tight">Core Tags: <span className="text-[#00FFA3] lowercase">{selectedPage || customPageName || "new-page"}</span></h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                                {newPagedMode && (
                                    <div className="md:col-span-2 space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Internal Page Route / Slug</label>
                                        <input
                                            required
                                            type="text"
                                            value={formData.page || ""}
                                            onChange={(e) => setFormData({ ...formData, page: e.target.value })}
                                            placeholder="e.g. promotional-landing"
                                            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-white font-bold text-sm outline-none focus:border-[#00FFA3]/50 focus:bg-white/[0.05] transition-all"
                                        />
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Meta Title</label>
                                    <input
                                        required
                                        type="text"
                                        value={formData.title || ""}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        placeholder="Enter search-optimized title"
                                        className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-white font-bold text-sm outline-none focus:border-[#00FFA3]/50 focus:bg-white/[0.05] transition-all"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Keywords (Comma Separated)</label>
                                    <input
                                        required
                                        type="text"
                                        value={formData.keywords || ""}
                                        onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                                        placeholder="trading, crypto, investment..."
                                        className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-white font-bold text-sm outline-none focus:border-[#00FFA3]/50 focus:bg-white/[0.05] transition-all"
                                    />
                                </div>

                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Meta Description</label>
                                    <textarea
                                        required
                                        rows={3}
                                        value={formData.description || ""}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        placeholder="Craft a compelling description for search results"
                                        className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-white font-bold text-sm outline-none focus:border-[#00FFA3]/50 focus:bg-white/[0.05] transition-all resize-none"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Section: Social Graph */}
                        <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 backdrop-blur-md">
                            <div className="flex items-center gap-3 mb-8">
                                <Share2 className="w-5 h-5 text-indigo-400" />
                                <h2 className="text-xl font-black text-white uppercase tracking-tight">Social Graph (OpenGraph)</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">OG Title (FB/WhatsApp)</label>
                                    <input
                                        type="text"
                                        value={formData.ogTitle || ""}
                                        onChange={(e) => setFormData({ ...formData, ogTitle: e.target.value })}
                                        placeholder="Custom title for social sharing"
                                        className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-white font-bold text-sm outline-none focus:border-[#00FFA3]/50 focus:bg-white/[0.05] transition-all"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">OG Image URL</label>
                                    <input
                                        type="text"
                                        value={formData.ogImage || ""}
                                        onChange={(e) => setFormData({ ...formData, ogImage: e.target.value })}
                                        placeholder="https://example.com/social-cover.jpg"
                                        className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-white font-bold text-sm outline-none focus:border-[#00FFA3]/50 focus:bg-white/[0.05] transition-all"
                                    />
                                </div>

                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">OG Description</label>
                                    <textarea
                                        rows={2}
                                        value={formData.ogDescription || ""}
                                        onChange={(e) => setFormData({ ...formData, ogDescription: e.target.value })}
                                        placeholder="Social media preview description"
                                        className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-white font-bold text-sm outline-none focus:border-[#00FFA3]/50 focus:bg-white/[0.05] transition-all resize-none"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Section: Twitter / X */}
                        <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 backdrop-blur-md">
                            <div className="flex items-center gap-3 mb-8">
                                <Twitter className="w-5 h-5 text-sky-400" />
                                <h2 className="text-xl font-black text-white uppercase tracking-tight">Twitter / X Configuration</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Twitter Card Type</label>
                                    <select
                                        value={formData.twitterCard || "summary_large_image"}
                                        onChange={(e) => setFormData({ ...formData, twitterCard: e.target.value })}
                                        className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-white font-bold text-sm outline-none focus:border-[#00FFA3]/50 focus:bg-white/[0.05] transition-all appearance-none"
                                    >
                                        <option value="summary">Summary</option>
                                        <option value="summary_large_image">Summary Large Image</option>
                                        <option value="app">App</option>
                                        <option value="player">Player</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Twitter Image URL</label>
                                    <input
                                        type="text"
                                        value={formData.twitterImage || ""}
                                        onChange={(e) => setFormData({ ...formData, twitterImage: e.target.value })}
                                        placeholder="URL for Twitter-specific image"
                                        className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-white font-bold text-sm outline-none focus:border-[#00FFA3]/50 focus:bg-white/[0.05] transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Section: Technical SEO */}
                        <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 backdrop-blur-md">
                            <div className="flex items-center gap-3 mb-8">
                                <Settings className="w-5 h-5 text-slate-400" />
                                <h2 className="text-xl font-black text-white uppercase tracking-tight">Technical Directives</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Canonical URL</label>
                                    <input
                                        type="text"
                                        value={formData.canonicalUrl || ""}
                                        onChange={(e) => setFormData({ ...formData, canonicalUrl: e.target.value })}
                                        placeholder="https://captrade.pro/trading"
                                        className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-white font-bold text-sm outline-none focus:border-[#00FFA3]/50 focus:bg-white/[0.05] transition-all"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Robots Directive</label>
                                    <input
                                        type="text"
                                        value={formData.robots || ""}
                                        onChange={(e) => setFormData({ ...formData, robots: e.target.value })}
                                        placeholder="index, follow"
                                        className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-white font-bold text-sm outline-none focus:border-[#00FFA3]/50 focus:bg-white/[0.05] transition-all"
                                    />
                                </div>

                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Google Site Verification ID</label>
                                    <input
                                        type="text"
                                        value={formData.googleSiteVerification || ""}
                                        onChange={(e) => setFormData({ ...formData, googleSiteVerification: e.target.value })}
                                        placeholder="Unique ID from Google Search Console"
                                        className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-white font-bold text-sm outline-none focus:border-[#00FFA3]/50 focus:bg-white/[0.05] transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Danger Zone */}
                        {currentSetting && (
                            <div className="p-8 border-2 border-rose-500/10 rounded-3xl bg-rose-500/[0.02]">
                                <div className="flex items-center justify-between gap-4">
                                    <div>
                                        <h4 className="text-white font-black text-sm uppercase tracking-tight">Purge Metadata</h4>
                                        <p className="text-slate-500 text-[11px] font-bold mt-1 uppercase tracking-widest">This will remove all SEO configurations for this page</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleDelete(currentSetting.id)}
                                        className="px-6 py-3 rounded-xl bg-rose-500/10 text-rose-500 font-black text-xs hover:bg-rose-500 hover:text-white transition-all border border-rose-500/20"
                                    >
                                        Delete Forever
                                    </button>
                                </div>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
}
