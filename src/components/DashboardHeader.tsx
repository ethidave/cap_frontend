"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Menu, ChevronDown, Bell, User as UserIcon } from "lucide-react";
import { useToast } from "./ToastProvider";
import { SITE_MESSAGES } from "@/lib/messages";

interface DashboardHeaderProps {
    toggleSidebar: () => void;
    isSymbolDropdownOpen: boolean;
    setIsSymbolDropdownOpen: (open: boolean) => void;
    selectedSymbol: string;
    setSelectedSymbol: (symbol: string) => void;
    popularSymbols: string[];
    user: any;
    equity?: number;
    currencies?: any[];
    changeCurrency?: (currency: string) => void;
}

export function DashboardHeader({
    toggleSidebar,
    isSymbolDropdownOpen,
    setIsSymbolDropdownOpen,
    selectedSymbol,
    setSelectedSymbol,
    popularSymbols,
    user,
    equity,
    currencies = [],
    changeCurrency
}: DashboardHeaderProps) {
    const { confirm } = useToast();
    const router = useRouter();
    const [unreadCount, setUnreadCount] = useState(0);
    const [isCurrencyDropdownOpen, setIsCurrencyDropdownOpen] = useState(false);
    const [categorizedAssets, setCategorizedAssets] = useState<Record<string, any[]>>({
        Crypto: [],
        Comodity: [],
        Forex: []
    });

    useEffect(() => {
        const fetchAndCategorize = async () => {
            try {
                const data = await api.get('/prices');
                if (Array.isArray(data)) {
                    const crypto: any[] = [];
                    const forex: any[] = [];
                    const comodity: any[] = [];

                    data.forEach((item: any) => {
                        const s = item.symbol;
                        if (s.endsWith('USDT') || ['BTCUSD', 'ETHUSD', 'SOLUSD', 'BNBUSD'].includes(s)) {
                            crypto.push(item);
                        } else if (s.startsWith('XAU') || s.startsWith('XAG') || ['WTI', 'BRENT', 'NG', 'XPTUSD', 'XPDUSD', 'DXY', 'US30', 'NAS100', 'SPX500', 'GER40', 'UK100', 'JP225'].includes(s)) {
                            comodity.push(item);
                        } else if (s.length === 6 || s.length === 7) {
                            forex.push(item);
                        }
                    });

                    setCategorizedAssets({
                        Crypto: crypto.sort((a, b) => a.symbol.localeCompare(b.symbol)),
                        Comodity: comodity.sort((a, b) => a.symbol.localeCompare(b.symbol)),
                        Forex: forex.sort((a, b) => a.symbol.localeCompare(b.symbol))
                    });
                }
            } catch (e) {
                console.error("Failed to categorize assets", e);
            }
        };
        fetchAndCategorize();
    }, []);

    const currentCurrency = currencies.find(c => c.symbol === (user?.currency || 'USD')) || { symbol: 'USD', rate: 1.0 };

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const data = await api.get('/notifications');
                if (Array.isArray(data)) {
                    setUnreadCount(data.filter((n: any) => !n.isRead).length);
                } else {
                    setUnreadCount(0);
                }
            } catch (err) {
                console.error("Failed to load notifications", err);
                setUnreadCount(0);
            }
        };

        if (user) {
            fetchNotifications();
            // Optionally, poll every 30 seconds
            const interval = setInterval(fetchNotifications, 30000);
            return () => clearInterval(interval);
        }
    }, [user]);

    return (
        <header className="h-[60px] bg-[#111317] border-b border-[#1c1f26] flex items-center justify-between px-4 sm:px-6 z-40 shrink-0">
            <div className="flex items-center gap-4">
                <button onClick={toggleSidebar} className="lg:hidden text-[#a9b0c0] hover:text-white transition-colors">
                    <Menu className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-3 relative">
                    <div
                        onClick={() => setIsSymbolDropdownOpen(!isSymbolDropdownOpen)}
                        className="flex items-center gap-2 bg-[#1c1f26] px-3 py-1.5 rounded-md border border-[#252a33] cursor-pointer hover:bg-[#252a33] transition-colors"
                    >
                        <span className="text-white font-bold text-sm tracking-tight">{selectedSymbol}</span>
                        <span className="text-[#00FFA3] text-xs font-semibold">+4.28%</span>
                        <ChevronDown className={`w-3 h-3 text-[#636c7a] ml-1 transition-transform ${isSymbolDropdownOpen ? 'rotate-180' : ''}`} />
                    </div>

                    {/* Symbol Dropdown */}
                    {isSymbolDropdownOpen && (
                        <div className="absolute top-full left-0 mt-2 w-64 bg-[#111317] border border-[#1c1f26] rounded-xl shadow-2xl z-50 py-2 max-h-[500px] overflow-y-auto custom-scrollbar backdrop-blur-xl">
                            {Object.entries(categorizedAssets).map(([category, items]) => (
                                items.length > 0 && (
                                    <div key={category} className="mb-2 last:mb-0">
                                        <div className="px-4 py-1.5 text-[9px] font-black uppercase tracking-[0.2em] text-[#636c7a] bg-white/[0.02] border-y border-white/[0.03]">
                                            {category}
                                        </div>
                                        <div className="py-1">
                                            {items.map(item => (
                                                <button
                                                    key={item.symbol}
                                                    onClick={() => {
                                                        setSelectedSymbol(item.symbol);
                                                        setIsSymbolDropdownOpen(false);
                                                    }}
                                                    className={`w-full text-left px-4 py-2 text-xs font-bold transition-all flex items-center justify-between group ${selectedSymbol === item.symbol ? 'bg-[#00FFA3]/10 text-white' : 'text-[#a9b0c0] hover:bg-white/[0.03] hover:text-white'}`}
                                                >
                                                    <div className="flex flex-col">
                                                        <span className="tracking-tight">{item.symbol}</span>
                                                    </div>
                                                    <div className="flex flex-col items-end">
                                                        <span className={`text-[10px] tabular-nums font-mono ${selectedSymbol === item.symbol ? 'text-[#00FFA3]' : 'text-slate-400'}`}>
                                                            {item.price?.toLocaleString(undefined, { minimumFractionDigits: item.symbol.length > 6 ? 2 : 5 })}
                                                        </span>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-5">
                <div className="flex bg-[#1c1f26] rounded-full p-1 border border-[#252a33] items-center">
                    <button
                        onClick={async () => {
                            if (user?.accountType !== 'LIVE') {
                                const confirmed = await confirm(SITE_MESSAGES.ACCOUNT.SWITCH_TITLE, SITE_MESSAGES.ACCOUNT.SWITCH_CONFIRM);
                                if (!confirmed) return;
                                try {
                                    await api.patch('/auth/account-mode', {});
                                    window.location.reload(); // Hard refresh to clear all states and re-fetch for new mode
                                } catch (e) {
                                    console.error("Failed to switch mode", e);
                                }
                            }
                        }}
                        className={`px-3 py-1 rounded-full text-[10px] font-black uppercase transition-all ${user?.accountType === 'LIVE' ? 'bg-[#00FFA3] text-[#0b0c0f] shadow-[0_0_10px_rgba(0,255,163,0.3)]' : 'text-[#636c7a] hover:text-white'}`}
                    >Live</button>
                    <button
                        onClick={async () => {
                            if (user?.accountType !== 'DEMO') {
                                const confirmed = await confirm(SITE_MESSAGES.ACCOUNT.SWITCH_TITLE, SITE_MESSAGES.ACCOUNT.SWITCH_CONFIRM);
                                if (!confirmed) return;
                                try {
                                    await api.patch('/auth/account-mode', {});
                                    window.location.reload();
                                } catch (e) {
                                    console.error("Failed to switch mode", e);
                                }
                            }
                        }}
                        className={`px-3 py-1 rounded-full text-[10px] font-black uppercase transition-all ${user?.accountType === 'DEMO' ? 'bg-orange-500 text-white shadow-[0_0_10px_rgba(249,115,22,0.3)]' : 'text-[#636c7a] hover:text-white'}`}
                    >Demo</button>
                </div>

                <div className="hidden sm:flex flex-col items-end mr-2 relative">
                    <div
                        onClick={() => setIsCurrencyDropdownOpen(!isCurrencyDropdownOpen)}
                        className="flex items-center gap-1 cursor-pointer hover:text-white transition-all group"
                    >
                        <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest leading-none group-hover:text-slate-300">
                            {user?.accountType === 'DEMO' ? `Demo (${currentCurrency.symbol})` : `Wallet (${currentCurrency.symbol})`}
                        </span>
                        <ChevronDown className="w-2.5 h-2.5 text-slate-500 group-hover:text-slate-300" />
                    </div>

                    {isCurrencyDropdownOpen && (
                        <div className="absolute top-full right-0 mt-2 w-32 bg-[#111317] border border-[#1c1f26] rounded-lg shadow-2xl z-50 py-1 max-h-[250px] overflow-y-auto custom-scrollbar">
                            {currencies.map(curr => (
                                <button
                                    key={curr.symbol}
                                    onClick={() => {
                                        changeCurrency?.(curr.symbol);
                                        setIsCurrencyDropdownOpen(false);
                                    }}
                                    className={`w-full text-left px-3 py-1.5 text-xs font-bold transition-colors flex items-center justify-between ${user?.currency === curr.symbol ? 'bg-[#00FFA3]/10 text-[#00FFA3]' : 'text-slate-400 hover:bg-[#1c1f26] hover:text-white'}`}
                                >
                                    {curr.symbol}
                                    {user?.currency === curr.symbol && <div className="w-1 h-1 rounded-full bg-[#00FFA3]"></div>}
                                </button>
                            ))}
                        </div>
                    )}

                    <span className={`text-sm font-black tracking-tight tabular-nums ${(equity ?? 0) >= (user?.accountType === 'DEMO' ? user?.demoBalance : user?.balance) ? 'text-[#00FFA3]' : 'text-[#f6465d]'}`}>
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
                    </span>
                </div>

                <button
                    onClick={() => router.push('/dashboard/notifications')}
                    className="hidden sm:block text-[#a9b0c0] hover:text-white transition-colors relative"
                >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#f6465d] text-[9px] font-bold text-white shadow-[0_0_10px_rgba(246,70,93,0.5)]">
                            {unreadCount > 99 ? '99+' : unreadCount}
                        </span>
                    )}
                </button>

                <div
                    onClick={() => router.push('/dashboard/settings')}
                    className="w-8 h-8 rounded-full bg-[#1c1f26] flex items-center justify-center cursor-pointer border border-[#252a33] hover:border-[#636c7a] transition-all mr-2 sm:mr-0"
                >
                    <UserIcon className="w-4 h-4 text-[#a9b0c0]" />
                </div>
            </div>
        </header>
    );
}
