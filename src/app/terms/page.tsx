"use client";
import { motion } from "framer-motion";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Scale, AlertTriangle, CheckCircle, FileText } from "lucide-react";

export default function TermsPage() {
    return (
        <main className="min-h-screen bg-[#020617] text-slate-300">
            <Navigation />

            <div className="pt-32 pb-20 px-6">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="flex items-center gap-3 text-[#00FFA3] mb-4">
                            <Scale className="w-6 h-6" />
                            <span className="text-sm font-bold uppercase tracking-widest">User Agreement</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black text-white mb-8">Terms & Conditions</h1>
                        <p className="text-slate-400 text-lg mb-12 leading-relaxed">
                            Please read these terms carefully before using Cap Trade Pro. By accessing our platform, you agree to be bound by these institutional-grade trading conditions.
                        </p>

                        <div className="space-y-12 bg-[#0a0f1d] border border-white/5 p-8 md:p-12 rounded-3xl shadow-2xl">
                            <section>
                                <div className="flex items-center gap-3 mb-4">
                                    <CheckCircle className="w-5 h-5 text-[#00FFA3]" />
                                    <h2 className="text-xl font-bold text-white">1. Eligibility</h2>
                                </div>
                                <p className="leading-relaxed">
                                    You must be at least 18 years old or the legal age of majority in your jurisdiction to use this platform. We do not offer services to residents of certain restricted regions including the USA, North Korea, and Iran.
                                </p>
                            </section>

                            <section>
                                <div className="flex items-center gap-3 mb-4">
                                    <AlertTriangle className="w-5 h-5 text-red-400" />
                                    <h2 className="text-xl font-bold text-white">2. Risk Disclosure</h2>
                                </div>
                                <p className="leading-relaxed">
                                    Trading Forex, Commodities, and CFDs involves significant risk of loss. You should only trade with capital that you can afford to lose. Past performance is not indicative of future results.
                                </p>
                            </section>

                            <section>
                                <div className="flex items-center gap-3 mb-4">
                                    <FileText className="w-5 h-5 text-[#00FFA3]" />
                                    <h2 className="text-xl font-bold text-white">3. Account Integrity</h2>
                                </div>
                                <p className="leading-relaxed">
                                    Users are responsible for maintaining the confidentiality of their login credentials. Any automated trading or "high-frequency" strategies must comply with our platform's technical limits.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-bold text-white mb-4">4. Withdrawals & Funding</h2>
                                <p className="leading-relaxed">
                                    Deposits must originate from accounts in the user's own name. Withdrawals are processed within 24 hours of administrative approval, subject to completed KYC verification.
                                </p>
                            </section>
                        </div>
                    </motion.div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
