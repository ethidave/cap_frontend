"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, MessageCircle, Send, Loader2 } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { api } from "@/lib/api";
import { useToast } from "@/components/ToastProvider";

const contactCards = [
    { icon: Mail, title: "Email Support", info: "support@captradepro.com", sub: "24/7 dedicated support team" },
];

export default function ContactPage() {
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [supportEmail, setSupportEmail] = useState("support@captradepro.com");
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        subject: "",
        message: ""
    });

    useEffect(() => {
        async function fetchSettings() {
            try {
                const settings = await api.get("/settings/public");
                if (settings && settings.SUPPORT_EMAIL) {
                    setSupportEmail(settings.SUPPORT_EMAIL);
                }
            } catch (e) {
                console.error("Failed to load settings in ContactPage", e);
            }
        }
        fetchSettings();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.email || !formData.message) return;

        setIsSubmitting(true);
        try {
            await api.post("/support", {
                name: `${formData.firstName} ${formData.lastName}`.trim(),
                email: formData.email,
                subject: formData.subject,
                message: formData.message
            });
            toast("success", "Message Sent", "We've received your message and will get back to you soon.");
            setFormData({
                firstName: "",
                lastName: "",
                email: "",
                subject: "",
                message: ""
            });
        } catch (error: any) {
            toast("error", "Submission Failed", error.message || "Please check your network and try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#020617] overflow-x-hidden">
            <Navigation />

            {/* Hero */}
            <section className="pt-36 pb-16 px-6 text-center relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[400px] bg-[radial-gradient(circle,rgba(0,240,255,0.07)_0%,transparent_70%)] blur-[80px] pointer-events-none" />
                <div className="relative z-10 max-w-2xl mx-auto">
                    <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-5xl md:text-6xl font-black text-white mb-5"
                    >
                        Contact Us
                    </motion.h1>
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-slate-400 text-lg"
                    >
                        Our support team is available 24/7 to help you with any inquiries.
                    </motion.p>
                </div>
            </section>
 
            {/* Content */}
            <section className="pb-24 px-6 max-w-6xl mx-auto">
                <div className="flex justify-center mb-16">
                    {contactCards.map((c, i) => (
                        <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }}
                            className="p-10 px-16 text-center group relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,163,0.03)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="w-16 h-16 rounded-2xl bg-[#00FFA3]/10 flex items-center justify-center mb-6 mx-auto group-hover:bg-[#00FFA3]/20 transition-colors relative z-10">
                                <c.icon className="w-8 h-8 text-[#00FFA3]" />
                            </div>
                            <h3 className="text-white font-black text-2xl mb-2 relative z-10 tracking-tight">{c.title}</h3>
                            <p className="text-[#00FFA3] font-black text-lg mb-2 relative z-10">{supportEmail}</p>
                            <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] relative z-10">{c.sub}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Form */}
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
                    className="p-0"
                >
                    <div className="max-w-4xl mx-auto text-center mb-12">
                        <h2 className="text-3xl font-black text-white mb-2">Send us a message</h2>
                        <p className="text-slate-400">We'll get back to you within 24 hours.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
                        <div className="grid md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-[0.2em] mb-3 px-1">First Name</label>
                                <input
                                    className="input-field h-14 bg-white/[0.02] border-white/5 focus:bg-white/[0.04]"
                                    placeholder="John"
                                    value={formData.firstName}
                                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-[0.2em] mb-3 px-1">Last Name</label>
                                <input
                                    className="input-field h-14 bg-white/[0.02] border-white/5 focus:bg-white/[0.04]"
                                    placeholder="Doe"
                                    value={formData.lastName}
                                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="mb-6">
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-[0.2em] mb-3 px-1">Email</label>
                            <input
                                className="input-field h-14 bg-white/[0.02] border-white/5 focus:bg-white/[0.04]"
                                placeholder="john@example.com"
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                        <div className="mb-6">
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-[0.2em] mb-3 px-1">Subject</label>
                            <input
                                className="input-field h-14 bg-white/[0.02] border-white/5 focus:bg-white/[0.04]"
                                placeholder="How can we help?"
                                value={formData.subject}
                                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                            />
                        </div>
                        <div className="mb-10">
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-[0.2em] mb-3 px-1">Message</label>
                            <textarea
                                className="input-field py-5 min-h-[180px] resize-none bg-white/[0.02] border-white/5 focus:bg-white/[0.04]"
                                placeholder="Tell us more about your inquiry..."
                                required
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            />
                        </div>
                        <div className="flex justify-center">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="btn-primary min-w-[200px] h-14 shadow-[0_0_30px_rgba(0,255,163,0.15)] flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                                {isSubmitting ? "Sending..." : "Submit Message"}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </section>

            <Footer />
        </main>
    );
}
