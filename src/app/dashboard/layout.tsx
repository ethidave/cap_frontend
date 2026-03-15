"use client";
import { useState } from "react";
import { DashboardProvider, useDashboard } from "@/contexts/DashboardContext";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";

function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
    const { sidebarOpen, toggleSidebar, user, currencies, changeCurrency, equity, selectedSymbol, setSelectedSymbol } = useDashboard();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isSymbolDropdownOpen, setIsSymbolDropdownOpen] = useState(false);

    const popularSymbols = ["BTCUSD", "ETHUSD", "XAUUSD", "GBPUSD", "EURUSD"];

    return (
        <div className="flex h-screen bg-[#000000] overflow-hidden text-[#a9b0c0] font-sans antialiased">
            <DashboardSidebar
                sidebarOpen={sidebarOpen}
                toggleSidebar={toggleSidebar}
                user={user}
                equity={equity}
                currencies={currencies}
                isCollapsed={isCollapsed}
                onCollapse={() => setIsCollapsed(!isCollapsed)}
            />

            <div className={`flex-1 flex flex-col ${isCollapsed ? 'lg:ml-20' : 'lg:ml-64'} relative min-h-0 bg-[#0b0c0f] transition-all duration-300`}>
                <DashboardHeader
                    toggleSidebar={() => {
                        if (window.innerWidth >= 1024) {
                            setIsCollapsed(!isCollapsed);
                        } else {
                            toggleSidebar();
                        }
                    }}
                    isSymbolDropdownOpen={isSymbolDropdownOpen}
                    setIsSymbolDropdownOpen={setIsSymbolDropdownOpen}
                    selectedSymbol={selectedSymbol}
                    setSelectedSymbol={setSelectedSymbol}
                    popularSymbols={popularSymbols}
                    user={user}
                    equity={equity}
                    currencies={currencies}
                    changeCurrency={changeCurrency}
                />

                {user && user.kycStatus !== 'VERIFIED' && (
                    <div className="bg-yellow-500/10 border-b border-yellow-500/20 px-6 py-2.5 flex items-center justify-between z-50 shrink-0">
                        <div className="flex items-center gap-3">
                            <span className="flex h-2 w-2 relative">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
                            </span>
                            <p className="text-yellow-400 text-xs font-bold uppercase tracking-wider">KYC Not Verified - Action Required</p>
                        </div>
                        <a href="/kyc-prompt" className="text-[10px] bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 px-3 py-1 rounded-md font-bold uppercase transition-colors">
                            Verify Now
                        </a>
                    </div>
                )}
                {children}
            </div>
        </div>
    );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <DashboardProvider>
            <DashboardLayoutContent>
                {children}
            </DashboardLayoutContent>
        </DashboardProvider>
    );
}
