"use client";
import { motion, Variants } from "framer-motion";
import { TrendingUp, Users, BarChart2, Globe, Zap, Shield, Award, Target } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";

const fadeUp: Variants = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } } };
const stagger: Variants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };

const stats = [
    { icon: Users, num: "250K+", label: "Active Traders" },
    { icon: BarChart2, num: "$2.4B", label: "Daily Volume" },
    { icon: Globe, num: "200+", label: "Instruments" },
    { icon: Zap, num: "<10ms", label: "Execution Speed" },
];

const values = [
    { icon: Shield, title: "Security First", desc: "We employ bank-grade 256-bit SSL encryption and segregated client funds to ensure your assets are always protected." },
    { icon: Target, title: "Trader-Focused", desc: "Every feature is built with traders in mind. We listen to our community and continuously improve based on real feedback." },
    { icon: Award, title: "Excellence", desc: "Award-winning platform recognized globally for innovation, reliability, and exceptional trading conditions." },
    { icon: Globe, title: "Global Reach", desc: "Operating in 180+ countries with 24/5 support in multiple languages to serve traders across every time zone." },
];

export default function AboutContent() {
    return (
        <main className="min-h-screen bg-[#020617] overflow-x-hidden">
            <Navigation />

            {/* Hero */}
            <section className="relative pt-36 pb-24 px-6 text-center overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(0,255,163,0.07)_0%,transparent_70%)] blur-[100px] pointer-events-none" />
                <div className="relative z-10 max-w-4xl mx-auto">

                    <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-4xl md:text-7xl font-black text-white leading-tight mb-6 md:mb-8 tracking-tight"
                    >
                        Empowering Traders{" "}
                        <span className="text-[#00FFA3]">Worldwide</span>
                    </motion.h1>

                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-slate-400 text-base md:text-xl max-w-2xl mx-auto leading-relaxed px-4 md:px-0"
                    >
                        Founded in 2020, Cap Trade Pro has grown from a small fintech startup to a globally regulated trading platform serving over 250,000 traders across 180+ countries.
                    </motion.p>
                </div>
            </section>

            {/* Stats */}
            <section className="border-y border-white/[0.05] bg-[#06091A]">
                <motion.div initial="hidden" animate="visible" variants={stagger}
                    className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y overflow-hidden sm:divide-x divide-white/[0.05]"
                >
                    {stats.map((s, i) => (
                        <motion.div key={i} variants={fadeUp} className="flex flex-col items-center gap-2 md:gap-3 py-10 md:py-12 px-6 md:px-8 text-center border-white/[0.05] last:border-b-0 lg:border-r">
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-[#00FFA3]/10 flex items-center justify-center">
                                <s.icon className="w-5 h-5 md:w-6 md:h-6 text-[#00FFA3]" />
                            </div>
                            <span className="text-3xl md:text-4xl font-black text-[#00FFA3]">{s.num}</span>
                            <span className="text-xs md:text-sm font-medium text-slate-400 uppercase tracking-tighter md:tracking-wider">{s.label}</span>
                        </motion.div>
                    ))}
                </motion.div>
            </section>

            {/* Mission */}
            <section className="py-28 px-6 max-w-7xl mx-auto">
                <div className="grid md:grid-cols-2 gap-16 items-center">
                    <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
                        <p className="text-[#00FFA3] text-xs font-bold uppercase tracking-[0.2em] mb-4">Our Mission</p>
                        <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
                            Democratizing <span className="text-[#00FFA3]">Global Trading</span>
                        </h2>
                        <p className="text-slate-400 leading-relaxed text-lg mb-6">
                            We believe every trader, regardless of their background or experience level, deserves access to institutional-quality tools and ultra-competitive trading conditions.
                        </p>
                        <p className="text-slate-400 leading-relaxed">
                            Our platform is built on three pillars: lightning-fast execution, uncompromising security, and radical transparency. No hidden fees, no conflicts of interest — just fair, efficient markets.
                        </p>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}
                        className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5"
                    >
                        {values.map((v, i) => (
                            <div key={i} className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 group hover:border-[#00FFA3]/30 transition-colors">
                                <div className="w-10 h-10 rounded-xl bg-[#00FFA3]/10 flex items-center justify-center mb-4 group-hover:bg-[#00FFA3]/20 transition-colors">
                                    <v.icon className="w-5 h-5 text-[#00FFA3]" />
                                </div>
                                <h3 className="text-white font-bold mb-2 text-base md:text-lg">{v.title}</h3>
                                <p className="text-slate-400 text-xs md:text-sm leading-relaxed">{v.desc}</p>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
