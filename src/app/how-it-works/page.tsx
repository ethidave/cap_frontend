"use client";
import { motion, Variants } from "framer-motion";
import { UserPlus, ShieldCheck, TrendingUp, Zap, LineChart, Globe } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import Link from "next/link";

const fadeUp: Variants = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } } };
const stagger: Variants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.12 } } };

const steps = [
    { num: "01", icon: UserPlus, title: "Create Account", desc: "Sign up in under 60 seconds. No paperwork, no delays.", detail: "Just your email and a password – we'll handle the rest. You can start on demo immediately." },
    { num: "02", icon: ShieldCheck, title: "Verify & Fund", desc: "Quick KYC and instant deposits.", detail: "Upload a photo ID and proof of address. Most verifications complete in under 15 minutes." },
    { num: "03", icon: TrendingUp, title: "Start Trading", desc: "Access 200+ instruments.", detail: "Live spreads from 0.0 pips, ultra-fast execution, and full charting tools at your fingertips." },
];

const tools = [
    { icon: Zap, title: "Ultra-Fast Execution", desc: "Under 10ms order execution powered by our proprietary matching engine." },
    { icon: LineChart, title: "Advanced Charts", desc: "50+ indicators and drawing tools built natively into the platform." },
    { icon: Globe, title: "Global Markets", desc: "Trade Forex, indices, commodities, and crypto CFDs 24/5." },
];

export default function HowItWorksPage() {
    return (
        <main className="min-h-screen bg-[#020617] overflow-x-hidden">
            <Navigation />

            {/* Hero */}
            <section className="relative pt-36 pb-20 px-6 text-center overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[500px] bg-[radial-gradient(circle,rgba(0,255,163,0.06)_0%,transparent_70%)] blur-[80px] pointer-events-none" />
                <div className="relative z-10 max-w-3xl mx-auto">
                    <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-5xl md:text-7xl font-black text-white mb-8"
                    >
                        Start Trading in{" "}
                        <span className="text-[#00FFA3]">3 Simple Steps</span>
                    </motion.h1>
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-slate-400 text-xl max-w-2xl mx-auto"
                    >
                        From signup to your first trade — it only takes minutes.
                    </motion.p>
                </div>
            </section>

            {/* Steps detail */}
            <section className="pb-28 px-6 max-w-5xl mx-auto">
                <motion.div initial="hidden" animate="visible" variants={stagger}
                    className="flex flex-col gap-8"
                >
                    {steps.map((s, i) => (
                        <motion.div key={i} variants={fadeUp}
                            className="glass rounded-2xl p-10 flex flex-col md:flex-row items-start gap-8 group hover:border-[#00FFA3]/30 transition-colors"
                        >
                            <div className="relative flex-shrink-0">
                                <div className="w-20 h-20 rounded-2xl bg-[#00FFA3]/10 flex items-center justify-center group-hover:bg-[#00FFA3]/20 transition-colors">
                                    <s.icon className="w-9 h-9 text-[#00FFA3]" />
                                </div>
                                <span className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-[#00FFA3] text-[#020617] text-xs font-black flex items-center justify-center glow-green">
                                    {s.num}
                                </span>
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-white mb-2">{s.title}</h3>
                                <p className="text-[#00FFA3] font-semibold mb-3">{s.desc}</p>
                                <p className="text-slate-400 leading-relaxed">{s.detail}</p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </section>

            {/* Tools */}
            <section className="py-24 px-6 max-w-7xl mx-auto border-t border-white/[0.05]">
                <motion.div initial="hidden" animate="visible" variants={stagger} className="text-center mb-14">
                    <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-black text-white mb-4">
                        Powerful Tools Included
                    </motion.h2>
                    <motion.p variants={fadeUp} className="text-slate-400 text-lg">Everything you need right out of the box.</motion.p>
                </motion.div>
                <motion.div initial="hidden" animate="visible" variants={stagger} className="grid md:grid-cols-3 gap-6">
                    {tools.map((t, i) => (
                        <motion.div key={i} variants={fadeUp} className="glass rounded-2xl p-8 group hover:border-[#00FFA3]/30 transition-all hover:-translate-y-1">
                            <div className="w-12 h-12 rounded-xl bg-[#00FFA3]/10 flex items-center justify-center mb-5 group-hover:bg-[#00FFA3]/20 transition-colors">
                                <t.icon className="w-6 h-6 text-[#00FFA3]" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">{t.title}</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">{t.desc}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </section>

            {/* Bottom CTA */}
            <section className="py-16 px-6 max-w-4xl mx-auto text-center">
                <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
                    <h2 className="text-4xl font-black text-white mb-5">Ready to get started?</h2>
                    <Link href="/signup" className="btn-primary">
                        Open Free Account
                    </Link>
                </motion.div>
            </section>

            <Footer />
        </main>
    );
}
