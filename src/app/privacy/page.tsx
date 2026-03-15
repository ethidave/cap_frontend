"use client";
import { motion } from "framer-motion";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Shield, Lock, Eye, FileText } from "lucide-react";

export default function PrivacyPage() {
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
                            <Shield className="w-6 h-6" />
                            <span className="text-sm font-bold uppercase tracking-widest">Legal Security</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black text-white mb-8">Privacy Policy</h1>
                        <p className="text-slate-400 text-lg mb-12 leading-relaxed">
                            Last Updated: March 13, 2026. Your privacy is our priority. This policy outlines how Cap Trade Pro collects, uses, and protects your personal data.
                        </p>

                        <div className="space-y-12 bg-[#0a0f1d] border border-white/5 p-8 md:p-12 rounded-3xl shadow-2xl">
                            <section>
                                <div className="flex items-center gap-3 mb-4">
                                    <Eye className="w-5 h-5 text-[#00FFA3]" />
                                    <h2 className="text-xl font-bold text-white">1. Data Collection</h2>
                                </div>
                                <p className="leading-relaxed">
                                    We collect information you provide directly to us when creating an account, completing KYC verification, or contacting support. This includes your name, email address, physical address, and government-issued identification.
                                </p>
                            </section>

                            <section>
                                <div className="flex items-center gap-3 mb-4">
                                    <Lock className="w-5 h-5 text-[#00FFA3]" />
                                    <h2 className="text-xl font-bold text-white">2. Data Security</h2>
                                </div>
                                <p className="leading-relaxed">
                                    Cap Trade Pro employs bank-grade 256-bit SSL encryption. We use multi-signature cold storage for digital assets and keep client funds in segregated accounts at top-tier global banks.
                                </p> Section
                            </section>

                            <section>
                                <div className="flex items-center gap-3 mb-4">
                                    <FileText className="w-5 h-5 text-[#00FFA3]" />
                                    <h2 className="text-xl font-bold text-white">3. Third Party Sharing</h2>
                                </div>
                                <p className="leading-relaxed">
                                    We do not sell your personal data. We only share information with regulated third parties necessary to provide our services, such as KYC verification providers and payment processors (e.g., OxaPay).
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-bold text-white mb-4">4. Your Rights</h2>
                                <p className="leading-relaxed">
                                    Under GDPR and other global privacy laws, you have the right to access, correct, or delete your personal data. You can manage most of these settings directly from your account dashboard.
                                </p>
                            </section> section
                        </div>
                    </motion.div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
