"use client";
import { motion, Variants } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import {
    Sparkles, ArrowRight, Apple, Play, MessageCircle,
    Zap, LineChart, Shield, Globe, Wallet, BarChart2,
    UserPlus, ShieldCheck, TrendingUp, Star,
} from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { ForexTicker } from "@/components/ForexTicker";
import { Footer } from "@/components/Footer";
import Link from "next/link";
import Image from "next/image";
import { api } from "@/lib/api";

/* ── animation presets ── */
const fadeUp: Variants = {
    hidden: { opacity: 0, y: 28 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: "easeOut" } },
};
const stagger: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

const features = [
    { icon: BarChart2, title: "Smart Analytics", desc: "AI-powered trade analytics, risk assessment, and market sentiment indicators." },
    { icon: LineChart, title: "Advanced Charting", desc: "50+ technical indicators, drawing tools, and real-time price action analysis on TradingView charts." },
    { icon: Zap, title: "Ultra-Fast Execution", desc: "Execute trades in under 10ms with our proprietary matching engine and global server infrastructure." },
    { icon: Shield, title: "Bank-Grade Security", desc: "256-bit SSL encryption, 2FA authentication, and segregated client funds for maximum protection." },
    { icon: Globe, title: "100+ Currency Pairs", desc: "Trade major, minor, and exotic pairs with competitive spreads starting from 0.0 pips." },
    { icon: Wallet, title: "Instant Withdrawals", desc: "Withdraw your profits instantly. No hidden fees, no delays. Your money, your control." },
];

const steps = [
    { num: "01", icon: UserPlus, title: "Create Account", desc: "Sign up in under 60 seconds with just your email. No paperwork, no delays." },
    { num: "02", icon: ShieldCheck, title: "Verify & Fund", desc: "Quick KYC verification and instant deposits via bank, card, or crypto." },
    { num: "03", icon: TrendingUp, title: "Start Trading", desc: "Access 200+ instruments with ultra-low spreads and lightning execution." },
];

const testimonials = [
    { name: "Marcus Chen", role: "Elite Trader", initials: "MC", quote: "The payout speed is industry-leading. I've never had to wait more than 15 minutes for a withdrawal. Combined with the incredible site speed, it's the perfect environment for scalping." },
    { name: "Sarah Williams", role: "Daily Investor", initials: "SW", quote: "Institutional-grade customer service. Every time I have a question about my deposit or KYC, the team responds in seconds 24/7. Truly a premium experience." },
    { name: "Ahmed Hassan", role: "Portfolio Manager", initials: "AH", quote: "Site speed and execution are flawless. Deposits are instant, and the platform remains responsive even during high-impact news events. Best in the business." },
];

export default function HomeContent() {
    const gradRef = useRef<HTMLSpanElement>(null);
    const [publicSettings, setPublicSettings] = useState<Record<string, string>>({});

    useEffect(() => {
        async function loadSettings() {
            try {
                const settings = await api.get("/settings/public");
                setPublicSettings(settings);
            } catch (e) {
                console.error("Failed to load home public settings", e);
            }
        }
        loadSettings();

        if (gradRef.current) {
            gsap.to(gradRef.current, {
                backgroundPosition: "200% center",
                duration: 8,
                repeat: -1,
                ease: "none"
            });
        }
    }, []);

    return (
        <main className="relative overflow-hidden selection:bg-[#00FFA3]/30">
            {/* 1. Navbar */}
            <Navigation />

            {/* 2. Hero Section */}
            <section className="relative pt-32 pb-20 md:pt-48 md:pb-36 px-4 md:px-10 max-w-7xl mx-auto z-10">
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={stagger}
                    className="text-center space-y-6 md:space-y-10"
                >

                    {/* Headline */}
                    <motion.h1
                        variants={fadeUp}
                        className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-black text-white leading-[0.9] tracking-tighter"
                    >
                        THE FUTURE OF <br className="hidden sm:block" />
                        <span ref={gradRef} className="bg-gradient-to-r from-[#00FFA3] via-[#00E5FF] to-[#00FFA3] bg-[length:200%_auto] bg-clip-text text-transparent">
                            PRECISION TRADING
                        </span>
                    </motion.h1>

                    <motion.p
                        variants={fadeUp}
                        className="max-w-xl md:max-w-2xl mx-auto text-slate-400 text-base md:text-xl font-medium leading-relaxed px-4"
                    >
                        Experience the next generation of trading. Leverage AI-powered Smart Analytics, 50+ Advanced Charting tools, and lightning-fast execution on the world's most precise platform.
                    </motion.p>

                    <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4 px-4 sm:px-0">
                        <Link
                            href="/signup"
                            className="w-full sm:w-auto px-10 py-5 bg-[#00FFA3] text-[#020617] rounded-2xl font-black text-base md:text-lg hover:scale-[1.05] transition-all flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(0,255,163,0.15)] group"
                        >
                            Get Started
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                            href="/trading"
                            className="w-full sm:w-auto px-10 py-5 bg-white/[0.03] border border-white/10 text-white rounded-2xl font-black text-base md:text-lg hover:bg-white/[0.08] transition-all flex items-center justify-center gap-3"
                        >
                            Explore Markets
                        </Link>
                    </motion.div>
                </motion.div>
            </section>

            {/* 3. Ticker Section */}
            <section className="relative z-10 border-y border-white/5 bg-white/[0.01]">
                <ForexTicker />
            </section>

            {/* 4. Features Grid */}
            <section className="relative py-16 md:py-32 px-4 md:px-10 max-w-7xl mx-auto z-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {features.map((f, i) => (
                        <motion.div
                            key={i}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeUp}
                            className="p-6 md:p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all group"
                        >
                            <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-[#00FFA3]/10 border border-[#00FFA3]/20 flex items-center justify-center text-[#00FFA3] mb-5 md:mb-6 group-hover:scale-110 transition-transform">
                                <f.icon className="w-6 h-6 md:w-7 md:h-7" />
                            </div>
                            <h3 className="text-lg md:text-xl font-black text-white mb-2 md:mb-3 tracking-tight">{f.title}</h3>
                            <p className="text-slate-400 font-medium leading-relaxed text-xs md:text-sm">{f.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* 5. App Promo Section */}
            <section className="relative py-16 md:py-24 overflow-hidden px-4 md:px-0">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[radial-gradient(circle_at_center,rgba(0,255,163,0.03)_0%,transparent_70%)] pointer-events-none" />
                <div className="max-w-7xl mx-auto px-0 md:px-10 relative z-10">
                    <div className="bg-gradient-to-br from-white/[0.05] to-transparent border border-white/10 rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-16 flex flex-col lg:flex-row items-center gap-10 md:gap-16">
                        <div className="flex-1 space-y-6 md:space-y-8 text-center lg:text-left">
                            <h2 className="text-3xl md:text-6xl font-black text-white leading-[0.9] md:leading-[0.95] tracking-tighter">
                                TRADE ANYWHERE <br />
                                <span className="text-[#00FFA3]">ANY TIME.</span>
                            </h2>
                            <p className="text-slate-400 text-sm md:text-lg font-medium leading-relaxed max-w-xl mx-auto lg:mx-0">
                                Get the full power of the CapTrade Pro engine on your mobile device. Lightning-fast site speed, instant deposits, and 24/7 customer support in your pocket.
                            </p>
                            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                                {/* App Store Button */}
                                <Link 
                                    href={publicSettings.APP_STORE_LINK || "#"} 
                                    target="_blank"
                                    className="w-full sm:w-auto px-6 py-3 bg-black border border-white/20 hover:border-[#00FFA3] rounded-xl flex items-center gap-3 transition-all group scale-100 hover:scale-105 active:scale-95"
                                >
                                    <Apple className="w-8 h-8 text-white group-hover:text-[#00FFA3] transition-colors" />
                                    <div className="text-left flex flex-col justify-center">
                                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mb-1">Download on the</span>
                                        <span className="text-lg text-white font-black leading-tight">App Store</span>
                                    </div>
                                </Link>
                                
                                {/* Google Play Button */}
                                <Link 
                                    href={publicSettings.PLAY_STORE_LINK || "#"} 
                                    target="_blank"
                                    className="w-full sm:w-auto px-6 py-3 bg-black border border-white/20 hover:border-[#00FFA3] rounded-xl flex items-center gap-3 transition-all group scale-100 hover:scale-105 active:scale-95"
                                >
                                    <Play className="w-8 h-8 text-white group-hover:text-[#00FFA3] fill-current transition-colors" />
                                    <div className="text-left flex flex-col justify-center">
                                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mb-1">Get it on</span>
                                        <span className="text-lg text-white font-black leading-tight">Google Play</span>
                                    </div>
                                </Link>
                            </div>
                        </div>

                        {/* Amazing Mockup Image */}
                        <div className="flex-1 relative w-full aspect-square max-w-[500px] hidden md:block">
                            <Image
                                src={publicSettings.MOBILE_APP_MOCKUP || "/trading_app_mockup.png"}
                                alt="CapTrade Pro Mobile App"
                                width={600}
                                height={600}
                                className="relative z-10 w-full h-full object-contain hover:scale-105 transition-transform duration-1000 p-8 mix-blend-screen"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* 6. Steps Section */}
            <section className="relative py-24 px-6 md:px-10 max-w-7xl mx-auto z-10">
                <div className="text-center mb-16 space-y-4">
                    <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase">Start in Minutes</h2>
                    <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-xs">Simple three step process</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                    <div className="hidden md:block absolute top-1/2 left-0 w-full h-px bg-white/5 -z-10" />
                    {steps.map((s, i) => (
                        <div key={i} className="text-center space-y-6">
                            <div className="w-20 h-20 rounded-full bg-[#020617] border-4 border-white/5 flex items-center justify-center mx-auto relative group">
                                <div className="absolute inset-2 rounded-full bg-[#00FFA3] scale-0 group-hover:scale-100 transition-transform duration-500 opacity-10" />
                                <s.icon className="w-8 h-8 text-[#00FFA3]" />
                                <div className="absolute -top-2 -right-2 bg-white text-[#020617] w-8 h-8 rounded-full font-black text-sm flex items-center justify-center border-4 border-[#020617]">
                                    {s.num}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <h4 className="text-xl font-black text-white tracking-tight">{s.title}</h4>
                                <p className="text-slate-400 text-sm leading-relaxed">{s.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* 7. Testimonials */}
            <section className="relative py-24 px-6 md:px-10 max-w-7xl mx-auto z-10 overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {testimonials.map((t, i) => (
                        <motion.div
                            key={i}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeUp}
                            className="p-10 rounded-[2.5rem] bg-white/[0.02] border border-white/5 flex flex-col justify-between space-y-8"
                        >
                            <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, j) => (
                                    <Star key={j} className="w-4 h-4 text-[#00FFA3] fill-[#00FFA3]/20" />
                                ))}
                            </div>
                            <p className="text-lg text-slate-300 font-medium italic leading-relaxed">"{t.quote}"</p>
                            <div className="flex items-center gap-4 pt-4 border-t border-white/5">
                                <div className="w-12 h-12 rounded-full bg-white text-[#020617] font-black flex items-center justify-center">
                                    {t.initials}
                                </div>
                                <div>
                                    <h5 className="font-black text-white">{t.name}</h5>
                                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">{t.role}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* 8. Final CTA */}
            <section className="relative py-16 md:py-32 px-4 md:px-10 max-w-7xl mx-auto z-10">
                <div className="bg-[#00FFA3] rounded-[2.5rem] md:rounded-[3rem] p-10 md:p-24 text-center space-y-8 md:space-y-10 relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.4)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                    <h2 className="text-4xl md:text-8xl font-black text-[#020617] leading-[0.9] tracking-tighter relative z-10 uppercase">
                        JOIN THE ELITE <br /> MARKET TRADERS.
                    </h2>
                    <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            href="/signup"
                            className="w-full sm:w-auto px-10 py-5 bg-[#020617] text-[#00FFA3] rounded-2xl font-black text-lg md:text-xl hover:scale-105 transition-all shadow-2xl flex items-center justify-center"
                        >
                            Create Account
                        </Link>
                        <Link
                            href="/contact"
                            className="w-full sm:w-auto px-10 py-5 bg-[#020617]/10 text-[#020617] rounded-2xl font-black text-lg md:text-xl hover:bg-[#020617]/20 transition-all flex items-center justify-center gap-3"
                        >
                            <MessageCircle className="w-6 h-6" />
                            Talk to Expert
                        </Link>
                    </div>
                </div>
            </section>

            {/* 9. Footer */}
            <Footer />
        </main>
    );
}
