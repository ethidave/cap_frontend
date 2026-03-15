"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { TrendingUp, ArrowRight, Menu, X } from "lucide-react";
import { useState } from "react";

const links = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/how-it-works", label: "How It Works" },
    { href: "/contact", label: "Contact" },
];

export function Navigation() {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);

    return (
        <motion.nav
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 md:px-12 bg-[#020617] border-b border-white/[0.05]"
        >
            {/* Logo */}
            <Link href="/" className="flex items-center transition-opacity hover:opacity-80">
                <Image
                    src="/logo.png"
                    alt="CapTrade Pro Logo"
                    width={220}
                    height={60}
                    className="h-14 w-auto object-contain"
                    priority
                />
            </Link>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center gap-1 bg-white/[0.03] border border-white/[0.05] rounded-full px-1.5 py-1">
                {links.map((l) => (
                    <Link key={l.href} href={l.href}
                        className={`relative px-5 py-2 text-sm font-medium rounded-full transition-colors ${pathname === l.href ? "text-white bg-white/[0.07]" : "text-slate-400 hover:text-white hover:bg-white/[0.05]"}`}
                    >
                        {l.label}
                    </Link>
                ))}
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-5">
                <Link href="/signin" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                    Sign In
                </Link>
                <Link href="/signup"
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold text-[#020617] bg-gradient-to-r from-[#00FFA3] to-[#00F0FF] hover:shadow-[0_0_20px_rgba(0,255,163,0.45)] transition-shadow"
                >
                    Get Started <ArrowRight className="w-4 h-4" />
                </Link>
            </div>

            {/* Mobile toggle */}
            <button className="md:hidden text-slate-300" onClick={() => setOpen(!open)} aria-label="Toggle menu">
                {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Mobile Menu Overlay */}
            <motion.div
                initial={false}
                animate={open ? "open" : "closed"}
                variants={{
                    open: { opacity: 1, x: 0, pointerEvents: "auto" },
                    closed: { opacity: 0, x: "100%", pointerEvents: "none" }
                }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="fixed inset-0 z-[60] bg-[#020617]/95 backdrop-blur-xl flex flex-col justify-center items-center gap-8 md:hidden"
            >
                <button
                    onClick={() => setOpen(false)}
                    className="absolute top-6 right-6 p-2 rounded-full bg-white/5 border border-white/10 text-white"
                >
                    <X className="w-6 h-6" />
                </button>

                <div className="flex flex-col items-center gap-6">
                    {links.map((l, i) => (
                        <motion.div
                            key={l.href}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: open ? 1 : 0, y: open ? 0 : 10 }}
                            transition={{ delay: i * 0.05 + 0.1 }}
                        >
                            <Link
                                href={l.href}
                                onClick={() => setOpen(false)}
                                className={`text-2xl font-black uppercase tracking-tighter transition-all ${pathname === l.href ? "text-[#00FFA3]" : "text-white/60 hover:text-white"}`}
                            >
                                {l.label}
                            </Link>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    className="flex flex-col gap-4 w-[80%] max-w-xs mt-8"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: open ? 1 : 0, y: open ? 0 : 10 }}
                    transition={{ delay: 0.3 }}
                >
                    <Link
                        href="/signin"
                        onClick={() => setOpen(false)}
                        className="w-full py-4 text-center text-white border border-white/10 rounded-2xl font-bold uppercase tracking-widest text-xs"
                    >
                        Sign In
                    </Link>
                    <Link
                        href="/signup"
                        onClick={() => setOpen(false)}
                        className="w-full py-4 text-center bg-[#00FFA3] text-[#020617] rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-[#00FFA3]/20"
                    >
                        Get Started
                    </Link>
                </motion.div>
            </motion.div>
        </motion.nav>
    );
}
