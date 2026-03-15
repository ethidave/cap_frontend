"use client";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import Link from "next/link";
import Image from "next/image";

const cols = [
    {
        title: "Sitemap", links: [
            { label: "Home", href: "/" },
            { label: "About Us", href: "/about" },
            { label: "Contact", href: "/contact" },
            { label: "How it Works", href: "/how-it-works" },
        ]
    },
    {
        title: "Legal", links: [
            { label: "Terms of Service", href: "/terms" },
            { label: "Privacy Policy", href: "/privacy" },
            { label: "Risk Disclosure", href: "/terms" },
        ]
    },
];

export function Footer() {
    const [supportEmail, setSupportEmail] = useState("support@captradepro.com");

    useEffect(() => {
        async function loadSettings() {
            try {
                const settings = await api.get("/settings/public");
                if (settings?.SUPPORT_EMAIL) {
                    setSupportEmail(settings.SUPPORT_EMAIL);
                }
            } catch (e) {
                console.error("Failed to load footer settings", e);
            }
        }
        loadSettings();
    }, []);

    const dynamicCols = [
        ...cols,
        {
            title: "Contact Info", links: [
                { label: supportEmail, href: `mailto:${supportEmail}` },
            ]
        }
    ];
    return (
        <footer className="border-t border-white/[0.05] bg-[#030812] pt-20 pb-10 px-6 md:px-12">
            <div className="max-w-7xl mx-auto">
                {/* Top */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-y-12 sm:gap-x-8 md:gap-12 mb-16">
                    {/* Brand */}
                    <div className="col-span-1 sm:col-span-2 md:col-span-1">
                        <div className="flex items-center mb-6">
                            <Image
                                src="/logo.png"
                                alt="CapTrade Pro Logo"
                                width={180}
                                height={50}
                                className="h-8 md:h-10 w-auto object-contain"
                            />
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed max-w-xs px-1 md:px-0">
                            The premium destination for traders worldwide. Fast execution, deep liquidity, and institutional-grade security.
                        </p>
                    </div>

                    {/* Link Columns */}
                    {dynamicCols.map((col) => (
                        <div key={col.title}>
                            <h4 className="font-bold text-white text-sm mb-5 tracking-wide uppercase">{col.title}</h4>
                            <ul className="space-y-3">
                                {col.links.map((l) => (
                                    <li key={l.label}>
                                        <Link href={l.href} className="text-slate-400 text-sm hover:text-[#00FFA3] transition-colors">{l.label}</Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 md:gap-4 pt-8 border-t border-white/[0.05]">
                    <p className="text-slate-500 text-[10px] md:text-xs text-center md:text-left">
                        © 2026 Cap Trade Pro. All rights reserved. Regulated by FCA (No. 491088). CFDs involve risk of loss.
                    </p>
                    <div className="flex gap-6">
                        <Link href="/terms" className="text-slate-500 hover:text-white transition-colors text-xs">Terms</Link>
                        <Link href="/privacy" className="text-slate-500 hover:text-white transition-colors text-xs">Privacy</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
