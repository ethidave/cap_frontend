"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    LayoutDashboard,
    Users,
    ArrowLeftRight,
    TrendingUp,
    Settings,
    LifeBuoy,
    LogOut,
    Menu,
    X,
    ChevronRight,
    ShieldCheck,
    Check,
    Globe,
    Smartphone
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useToast } from "@/components/ToastProvider";
import AdminBell from "@/components/AdminBell";

const sidebarLinks = [
    { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/users", label: "User Management", icon: Users },
    { href: "/admin/transactions", label: "Transactions", icon: ArrowLeftRight },
    { href: "/admin/trades", label: "Trade Control", icon: TrendingUp },
    { href: "/admin/support", label: "Support Desk", icon: LifeBuoy },
    { href: "/admin/seo", label: "SEO Master", icon: Globe },
    { href: "/admin/notifications", label: "Mobile Push", icon: Smartphone },
    { href: "/admin/settings", label: "Site Settings", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { toast } = useToast();
    const pathname = usePathname();
    const router = useRouter();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("admin_token");
        if (!token && pathname !== "/admin/login") {
            router.replace("/admin/login");
        } else {
            setLoading(false);
        }
    }, [pathname, router]);

    const handleLogout = () => {
        localStorage.removeItem("admin_token");
        document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax; Secure";
        toast("info", "Session Ended", "You have been signed out.");
        router.push("/admin/login");
    };

    useEffect(() => {
        setIsMobileOpen(false);
    }, [pathname]);

    if (loading && pathname !== "/admin/login") {
        return <div className="h-screen w-screen bg-[#020617] flex items-center justify-center font-sans font-bold text-[#00FFA3]">Loading...</div>;
    }

    if (pathname === "/admin/login") return <>{children}</>;

    return (
        <div className="flex h-screen bg-[#020617] text-slate-200 overflow-hidden font-sans">
            {/* Sidebar Component */}
            <AnimatePresence mode="wait">
                {isMobileOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsMobileOpen(false)}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
                    />
                )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
                {(isSidebarOpen || isMobileOpen) && (
                    <motion.aside
                        initial={isMobileOpen ? { x: -300 } : { width: 0, opacity: 0 }}
                        animate={isMobileOpen ? { x: 0 } : { width: 280, opacity: 1 }}
                        exit={isMobileOpen ? { x: -300 } : { width: 0, opacity: 0 }}
                        className={`fixed md:relative z-50 h-full bg-[#020617] border-r border-white/5 flex flex-col transition-all duration-300 ease-in-out`}
                    >
                        <div className="p-8 pb-4">
                            <div className="flex items-center gap-3 mb-10 relative h-10 w-full">
                                <Image
                                    src="/logo.png"
                                    alt="CapTrade Pro Logo"
                                    fill
                                    className="object-contain object-left scale-[1.1] origin-left"
                                    priority
                                />
                            </div>
                        </div>

                        <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto custom-scrollbar">
                            {sidebarLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`flex items-center gap-4 px-5 py-3.5 rounded-xl transition-all group ${pathname === link.href
                                        ? "bg-white/[0.05] text-[#00FFA3] border border-white/5"
                                        : "text-slate-400 hover:text-white hover:bg-white/[0.02]"
                                        }`}
                                >
                                    <link.icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${pathname === link.href ? "text-[#00FFA3]" : "text-slate-500"}`} />
                                    <span className="font-bold text-sm tracking-wide">{link.label}</span>
                                    {pathname === link.href && (
                                        <motion.div layoutId="active" className="ml-auto w-1.5 h-1.5 rounded-full bg-[#00FFA3] shadow-[0_0_8px_#00FFA3]" />
                                    )}
                                </Link>
                            ))}
                        </nav>

                        <div className="p-4 mt-auto">
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-4 px-5 py-4 rounded-xl text-slate-500 hover:text-rose-500 hover:bg-rose-500/5 transition-all group"
                            >
                                <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                                <span className="font-bold text-sm tracking-wide">Sign Out</span>
                            </button>
                        </div>
                    </motion.aside>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                <header className="h-20 border-b border-white/5 bg-[#020617] flex items-center justify-between px-6 md:px-10 z-10 transition-all">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setIsMobileOpen(true)} className="md:hidden p-2 text-slate-400"><Menu className="w-6 h-6" /></button>
                    </div>

                    <div className="flex items-center gap-4 md:gap-6">
                        <AdminBell />
                        <div className="w-px h-6 bg-white/10 hidden sm:block" />

                        <Link href="/admin/profile" className="flex items-center gap-3 group">
                            <div className="hidden md:block text-right">
                                <div className="text-sm font-bold text-white leading-none mb-1 font-sans">Super Admin</div>
                                <div className="text-[10px] font-bold text-[#00FFA3] uppercase tracking-widest font-sans">Online</div>
                            </div>
                            <div className="w-10 h-10 rounded-full border-2 border-white/10 p-0.5 group-hover:border-[#00FFA3]/50 transition-all">
                                <div className="w-full h-full rounded-full bg-white/[0.05] flex items-center justify-center text-xs font-bold text-white uppercase font-sans">AD</div>
                            </div>
                        </Link>
                    </div>
                </header>

                <section className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-10 font-sans">
                    <div className="max-w-7xl mx-auto h-full">
                        {children}
                    </div>
                </section>
            </main>
        </div>
    );
}
