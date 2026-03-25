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

            {/* Backdrop for mobile */}
            {sidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] lg:hidden transition-opacity duration-300" 
                    onClick={toggleSidebar}
                />
            )}

            {/* Backdrop for symbol selection */}
            {isSymbolDropdownOpen && (
                <div 
                    className="fixed inset-0 z-40 bg-transparent" 
                    onClick={() => setIsSymbolDropdownOpen(false)}
                />
            )}

            <div className={`flex-1 flex flex-col ${isCollapsed ? 'lg:ml-20' : 'lg:ml-64'} transition-all duration-300 relative min-h-0 bg-[#0b0c0f]`}>
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
                    <div className="bg-yellow-500/10 border-b border-yellow-500/20 px-3 sm:px-6 py-2 flex items-center justify-between shrink-0 z-10">
                        <div className="flex items-center gap-2 sm:gap-3">
                            <span className="flex h-2 w-2 relative">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
                            </span>
                            <p className="text-yellow-400 text-[10px] sm:text-xs font-bold uppercase tracking-wider">KYC Unverified - Limitations Apply</p>
                        </div>
                        <a href="/kyc-prompt" className="text-[9px] sm:text-[10px] bg-yellow-500 text-[#020617] hover:bg-yellow-400 px-3 py-1 rounded-md font-bold uppercase transition-colors shrink-0">
                            Verify Now
                        </a>
                    </div>
                )}

                <main className="flex-1 flex flex-col relative custom-scrollbar overflow-hidden">
                    {children}
                </main>
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
