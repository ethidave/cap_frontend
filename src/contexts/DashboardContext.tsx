"use client";

import { createContext, useContext, useState, useEffect, useMemo } from "react";
import { api } from "@/lib/api";

const DashboardContext = createContext<any>(null);

export const useDashboard = () => useContext(DashboardContext);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [currencies, setCurrencies] = useState<any[]>([]);
    const [activeTrades, setActiveTrades] = useState<any[]>([]);
    const [prices, setPrices] = useState<Record<string, number>>({});
    const [selectedSymbol, setSelectedSymbol] = useState("BTCUSDT");
    const [isLoading, setIsLoading] = useState(true);
    const [maintenanceTime, setMaintenanceTime] = useState("45 Minutes");

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    const refreshUser = async () => {
        try {
            const profile = await api.get("/auth/profile/me");
            setUser(profile);

            const rates = await api.get("/prices/supported-currencies");
            setCurrencies(rates);

            // Fetch maintenance info via public endpoint
            try {
                const maintenanceRes = await api.get("/maintenance-status");
                if (maintenanceRes.estimatedEnd) {
                    const end = new Date(maintenanceRes.estimatedEnd);
                    const diff = end.getTime() - Date.now();
                    if (diff > 0) {
                        setMaintenanceTime(`${Math.ceil(diff / 60000)} Minutes`);
                    }
                }
            } catch (e) { }
        } catch (error) {
            console.error("Dashboard context fetch profile error:", error);
        }
    };

    const fetchTrades = async () => {
        try {
            const data = await api.get('/trading/active');
            setActiveTrades(data);
        } catch (err) {
            console.error("Failed to fetch trades in context", err);
        }
    };

    const fetchPrices = async () => {
        try {
            const data = await api.get('/prices');
            const priceMap: Record<string, number> = {};
            data.forEach((p: any) => {
                priceMap[p.symbol] = p.price;
            });
            setPrices(priceMap);
        } catch (e) { }
    };

    const changeCurrency = async (currency: string) => {
        try {
            await api.patch("/auth/profile", { currency });
            await refreshUser();
        } catch (error) {
            console.error("Failed to change currency:", error);
        }
    };

    const getContractSize = (symbol: string) => {
        const s = symbol.toUpperCase();
        if ((s.includes('USD') && !s.includes('USDT')) && (s.startsWith('EUR') || s.startsWith('GBP') || s.startsWith('AUD') || s.startsWith('NZD') || s.startsWith('CAD') || s.startsWith('CHF') || s.startsWith('USD'))) {
            return 100000; // Standard Forex
        }
        if (s.includes('XAU')) return 100; // Gold
        if (s.includes('XAG')) return 5000; // Silver
        if (s.includes('NAS') || s.includes('US30') || s.includes('SPX') || s.includes('GER') || s.includes('UK') || s.includes('JP225')) return 10; // Indices
        return 1; // Default for Crypto
    };

    // Calculate Total P/L and Equity
    const { totalPnL, equity } = useMemo(() => {
        let pnl = 0;
        const currentBalance = user?.accountType === 'DEMO' ? user?.demoBalance : user?.balance;
        if (!user || Object.keys(prices).length === 0) return { totalPnL: 0, equity: currentBalance || 0 };

        activeTrades.forEach(trade => {
            const currentPrice = prices[trade.symbol] || trade.openPrice;
            const diff = trade.type === 'BUY' ? (currentPrice - trade.openPrice) : (trade.openPrice - currentPrice);
            const contractSize = getContractSize(trade.symbol);
            pnl += (diff * trade.quantity * contractSize);
        });

        return {
            totalPnL: pnl,
            equity: (currentBalance || 0) + pnl
        };
    }, [user, activeTrades, prices]);

    useEffect(() => {
        const init = async () => {
            await refreshUser();
            await fetchTrades();
            await fetchPrices();
            setIsLoading(false);
        };
        init();

        const tradeInterval = setInterval(fetchTrades, 5000);
        const priceInterval = setInterval(fetchPrices, 2000);

        return () => {
            clearInterval(tradeInterval);
            clearInterval(priceInterval);
        };
    }, []);

    return (
        <DashboardContext.Provider value={{
            sidebarOpen,
            toggleSidebar,
            user,
            refreshUser,
            currencies,
            changeCurrency,
            activeTrades,
            setActiveTrades,
            prices,
            totalPnL,
            equity,
            isLoading,
            maintenanceTime,
            selectedSymbol,
            setSelectedSymbol
        }}>
            {children}
        </DashboardContext.Provider>
    );
}
