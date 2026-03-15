"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
    LineChart, History, Settings, User as UserIcon, X, Grid, PieChart, Plus, ArrowUpRight
} from "lucide-react";
import { useToast } from "./ToastProvider";
import { SITE_MESSAGES } from "@/lib/messages";

export function DashboardSidebar({ sidebarOpen, toggleSidebar, user, isCollapsed, onCollapse, equity, currencies = [] }: { sidebarOpen: boolean, toggleSidebar: () => void, user: any, isCollapsed?: boolean, onCollapse?: () => void, equity?: number, currencies?: any[] }) {
    const { confirm } = useToast();
    const currentCurrency = currencies.find(c => c.symbol === (user?.currency || 'USD')) || { symbol: 'USD', rate: 1.0 };
    const pathname = usePathname();
    const router = useRouter();

    const NavItem = ({ icon, label, active, href }: any) => (
        <Link href={href} className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-[13px] font-medium transition-all ${active ? 'bg-[#00FFA3]/10 text-[#00FFA3]' : 'text-[#a9b0c0] hover:bg-[#1c1f26] hover:text-white'} ${isCollapsed ? 'justify-center px-0' : ''}`}>
            <div className={`${active ? 'text-[#00FFA3]' : 'text-[#a9b0c0]'} ${isCollapsed ? 'scale-110' : ''}`}>{icon}</div>
            {!isCollapsed && <span className="flex-1 truncate">{label}</span>}
        </Link>
    );

    return (
        <aside className={`fixed inset-y-0 left-0 z-50 bg-[#111317] border-r border-[#1c1f26] transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} ${isCollapsed ? 'w-20' : 'w-64'} transition-all duration-300 flex flex-col pt-[60px] lg:pt-0`}>

            {/* Logo Section */}
            <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} h-[60px] px-6 border-b border-[#1c1f26]`}>
                {!isCollapsed && (
                    <div className="flex items-center gap-2 relative h-full w-full py-3">
                        <Image
                            src="/logo.png"
                            alt="CapTrade Pro Logo"
                            fill
                            className="object-contain object-left scale-[0.8] origin-left"
                            priority
                        />
                    </div>
                )}
                {isCollapsed && (
                    <div
                        onClick={onCollapse}
                        className="w-8 h-8 rounded-lg bg-[#00FFA3] flex items-center justify-center cursor-pointer hover:scale-105 transition-transform"
                    >
                        <PieChart className="w-5 h-5 text-[#020617]" />
                    </div>
                )}
                <button onClick={toggleSidebar} className="lg:hidden text-[#a9b0c0] hover:text-white">
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Mobile Balance Section */}
            {!isCollapsed && (
                <div className="lg:hidden px-6 py-4 border-b border-[#1c1f26] bg-[#16191e]/30">
                    <div className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-1">
                        {user?.accountType === 'DEMO' ? `Demo (${currentCurrency.symbol})` : `Wallet (${currentCurrency.symbol})`}
                    </div>
                    <div className={`text-xl font-black tracking-tight tabular-nums ${(equity ?? 0) >= (user?.accountType === 'DEMO' ? user?.demoBalance : user?.balance) ? 'text-[#00FFA3]' : 'text-[#f6465d]'}`}>
                        {(() => {
                            const symbol = currentCurrency.symbol;
                            const value = (equity ?? (user?.accountType === 'DEMO' ? user?.demoBalance : user?.balance)) * (1 / currentCurrency.rate);

                            const currencySymbols: Record<string, string> = {
                                'USD': '$',
                                'EUR': '€',
                                'GBP': '£',
                                'JPY': '¥',
                                'USDT': '₮'
                            };

                            const fmtValue = value.toLocaleString(undefined, {
                                minimumFractionDigits: symbol.length > 3 ? 6 : 2,
                                maximumFractionDigits: symbol.length > 3 ? 8 : 2
                            });

                            return (
                                <>
                                    {currencySymbols[symbol] || ''}
                                    {fmtValue}
                                    {!currencySymbols[symbol] ? ` ${symbol}` : ''}
                                </>
                            );
                        })()}
                    </div>
                </div>
            )}

            <div className="flex-1 overflow-y-auto py-5 custom-scrollbar">
                <div className="px-5 mb-5 space-y-3">
                    <button
                        onClick={() => router.push('/dashboard/deposit')}
                        className={`flex items-center gap-3 w-full bg-[#1c1f26] hover:bg-[#252a33] text-white px-4 py-2.5 rounded-lg font-semibold text-sm transition-all border border-transparent hover:border-[#2a2f3a] ${isCollapsed ? 'justify-center px-0' : ''}`}
                    >
                        <div className="w-6 h-6 rounded-full bg-[#00FFA3]/20 text-[#00FFA3] flex items-center justify-center text-xs shrink-0">
                            <Plus className="w-4 h-4" />
                        </div>
                        {!isCollapsed && <span>Deposit</span>}
                    </button>

                    <button
                        onClick={() => router.push('/dashboard/withdraw')}
                        className={`flex items-center gap-3 w-full bg-transparent hover:bg-[#1c1f26] text-[#a9b0c0] hover:text-white px-4 py-2.5 rounded-lg font-semibold text-sm transition-all border border-[#1c1f26] hover:border-[#2a2f3a] ${isCollapsed ? 'justify-center px-0' : ''}`}
                    >
                        <div className="w-6 h-6 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center text-xs shrink-0">
                            <ArrowUpRight className="w-4 h-4" />
                        </div>
                        {!isCollapsed && <span>Withdraw</span>}
                    </button>
                </div>

                <div className="px-3 space-y-0.5">
                    {!isCollapsed && <div className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-[#636c7a]">Trading</div>}
                    <NavItem href="/dashboard" icon={<LineChart className="w-4 h-4" />} label="Trade" active={pathname === '/dashboard'} />
                    <NavItem href="/dashboard/history" icon={<History className="w-4 h-4" />} label="Transaction History" active={pathname === '/dashboard/history'} />
                </div>

                <div className="mt-8 px-3 space-y-0.5">
                    {!isCollapsed && <div className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-[#636c7a]">Profile</div>}
                    <NavItem href="/dashboard/settings" icon={<Settings className="w-4 h-4" />} label="Settings" active={pathname === '/dashboard/settings'} />
                    <button
                        onClick={async () => {
                            const confirmed = await confirm(SITE_MESSAGES.AUTH.LOGOUT_TITLE, SITE_MESSAGES.AUTH.LOGOUT_CONFIRM);
                            if (confirmed) {
                                localStorage.removeItem('user_token');
                                router.push('/signin');
                            }
                        }}
                        className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-[13px] font-medium text-red-500 hover:bg-red-500/10 transition-all ${isCollapsed ? 'justify-center px-0' : ''}`}
                    >
                        <X className="w-4 h-4 shrink-0" />
                        {!isCollapsed && <span>Log Out</span>}
                    </button>
                </div>
            </div>

            <div className={`p-4 border-t border-[#1c1f26] Transition-all ${isCollapsed ? 'items-center px-0' : ''}`}>
                <div className={`flex items-center gap-3 bg-[#16191e] p-2 rounded-lg border border-[#1c1f26] ${isCollapsed ? 'justify-center border-none bg-transparent' : ''}`}>
                    <div className="w-8 h-8 rounded-full bg-[#00FFA3]/10 border border-[#00FFA3]/20 flex items-center justify-center shrink-0">
                        <span className="text-[#00FFA3] text-[10px] font-bold">{user?.kycStatus === 'VERIFIED' ? 'Pro' : 'User'}</span>
                    </div>
                    {!isCollapsed && (
                        <div className="overflow-hidden">
                            <div className="text-white text-xs font-bold truncate">{user ? `${user.firstName} ${user.lastName}` : 'Real Account'}</div>
                            <div className="text-[#636c7a] text-[10px] truncate">{user?.email || 'verified user'}</div>
                        </div>
                    )}
                </div>
            </div>
        </aside>
    );
}
