"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { TradingViewChart } from "@/components/TradingViewChart";
import { api } from "@/lib/api";
import { useDashboard } from "@/contexts/DashboardContext";
import { useToast } from "@/components/ToastProvider";
import { SITE_MESSAGES } from "@/lib/messages";

export default function DashboardPage() {
    const { user, refreshUser, activeTrades, setActiveTrades, prices, selectedSymbol, setSelectedSymbol } = useDashboard();
    const { confirm, toast } = useToast();
    const isDemo = user?.accountType === 'DEMO';
    const [tradeHistory, setTradeHistory] = useState<any[]>([]);
    const [tradeVolume, setTradeVolume] = useState("0.10");
    const [leverage, setLeverage] = useState(10);
    const [activeTab, setActiveTab] = useState<'open' | 'pending' | 'history'>('open');
    const [stopLoss, setStopLoss] = useState("");
    const [takeProfit, setTakeProfit] = useState("");
    const [isTrading, setIsTrading] = useState(false);
    const [isToppingUp, setIsToppingUp] = useState(false);

    const popularSymbols = ["BTCUSD", "ETHUSD", "XAUUSD", "GBPUSD", "EURUSD"];

    // Trade History still local to this page
    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const history = await api.get('/trading/history');
                setTradeHistory(history);
            } catch (err) { }
        };
        if (user) fetchHistory();
    }, [user]);

    const handleOpenTrade = async (type: 'BUY' | 'SELL') => {
        setIsTrading(true);
        try {
            await api.post('/trading/open', {
                symbol: selectedSymbol,
                type,
                quantity: parseFloat(tradeVolume),
                leverage: leverage,
                stopLoss: stopLoss ? parseFloat(stopLoss) : null,
                takeProfit: takeProfit ? parseFloat(takeProfit) : null,
                isDemo: isDemo
            });
            // Refresh trades
            const data = await api.get('/trading/active');
            setActiveTrades(data);
            setStopLoss("");
            setTakeProfit("");
        } catch (err: any) {
            toast("error", SITE_MESSAGES.TRADING.OPEN_ERROR, err.message || "Failed to open trade");
        } finally {
            setIsTrading(false);
        }
    };

    const handleCloseTrade = async (id: string) => {
        const confirmed = await confirm(SITE_MESSAGES.TRADING.CLOSE_TITLE, SITE_MESSAGES.TRADING.CLOSE_CONFIRM);
        if (!confirmed) return;
        try {
            await api.post(`/trading/close/${id}`, {});
            const data = await api.get('/trading/active');
            setActiveTrades(data);
            const history = await api.get('/trading/history');
            setTradeHistory(history);
            refreshUser(); // Update balance
        } catch (err) {
            console.error("Failed to close trade", err);
        }
    };

    const currentPrice = prices[selectedSymbol] || prices[selectedSymbol.replace('USD', 'USDT')] || 0;

    const getContractSize = (symbol: string) => {
        if (symbol.startsWith('XAU')) return 100; // Gold
        if (symbol.startsWith('XAG')) return 5000; // Silver
        if (symbol.length <= 6) return 100000; // Forex
        return 1; // Crypto
    };

    const totalUnrealizedPnl = activeTrades.reduce((sum: number, trade: any) => {
        const livePrice = prices[trade.symbol] || trade.openPrice;
        const contractSize = getContractSize(trade.symbol);
        let pnl = 0;
        if (trade.type === 'BUY') {
            pnl = (livePrice - trade.openPrice) * trade.quantity * contractSize;
        } else {
            pnl = (trade.openPrice - livePrice) * trade.quantity * contractSize;
        }
        return sum + pnl;
    }, 0);

    const equity = (user?.accountType === 'DEMO' ? user?.demoBalance : user?.balance) + totalUnrealizedPnl;

    return (
        <div className="flex-1 min-h-0 flex flex-col lg:flex-row bg-[#0b0c0f] overflow-y-auto lg:overflow-hidden overflow-x-hidden">
            {/* Left Column - Chart & History */}
            <div className="flex-1 flex flex-col min-w-0 border-r border-[#1c1f26] h-full lg:h-auto">
                {/* Chart Area */}
                <div className="h-[400px] lg:h-0 lg:flex-1 bg-[#0b0c0f] relative group px-4 lg:px-0 min-h-[400px]">
                    <TradingViewChart symbol={selectedSymbol} />
                </div>

                {/* Bottom Panel */}
                <div className="h-[350px] lg:h-[320px] bg-[#111317] border-t border-[#1c1f26] flex flex-col shrink-0">
                    {/* Panel Tabs */}
                    <div className="flex items-end px-1 sm:px-4 pr-10 pt-2 border-b border-[#1c1f26] bg-[#0b0c0f] overflow-x-auto custom-scrollbar whitespace-nowrap scroll-smooth">
                        <TabBtn active={activeTab === 'open'} onClick={() => setActiveTab('open')}>Open ({activeTrades.length || 0})</TabBtn>
                        <TabBtn active={activeTab === 'history'} onClick={() => setActiveTab('history')}>History</TabBtn>
                    </div>

                    {/* Table content */}
                    <div className="flex-1 overflow-auto custom-scrollbar px-4 lg:px-0">
                        {activeTab === 'open' ? (
                            <table className="w-full text-[13px] text-left">
                                <thead className="text-[#636c7a] bg-[#111317] sticky top-0 z-10 border-b border-[#1c1f26]">
                                    <tr>
                                        <th className="px-4 py-2 font-medium">Symbol</th>
                                        <th className="px-4 py-2 font-medium hidden sm:table-cell">Volume</th>
                                        <th className="px-4 py-2 font-medium font-sans">Open</th>
                                        <th className="px-4 py-2 font-medium font-sans hidden md:table-cell">S/L</th>
                                        <th className="px-4 py-2 font-medium font-sans hidden md:table-cell">T/P</th>
                                        <th className="px-4 py-2 font-medium font-sans text-right">P/L</th>
                                        <th className="px-4 py-2 font-medium font-sans text-center w-12">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#1c1f26]">
                                    {activeTrades.length > 0 ? activeTrades.map((trade: any) => {
                                        const livePrice = prices[trade.symbol] || trade.openPrice;
                                        const contractSize = getContractSize(trade.symbol);
                                        let livePnl = trade.pnl || 0;
                                        if (trade.status === 'OPEN') {
                                            if (trade.type === 'BUY') {
                                                livePnl = (livePrice - trade.openPrice) * trade.quantity * contractSize;
                                            } else {
                                                livePnl = (trade.openPrice - livePrice) * trade.quantity * contractSize;
                                            }
                                        }

                                        return (
                                            <TableRow
                                                key={trade.id}
                                                symbol={trade.symbol}
                                                volume={trade.quantity}
                                                type={trade.type === 'BUY' ? 'Buy' : 'Sell'}
                                                open={trade.openPrice.toLocaleString()}
                                                sl={trade.stopLoss?.toLocaleString() || "—"}
                                                tp={trade.takeProfit?.toLocaleString() || "—"}
                                                profit={livePnl.toFixed(2)}
                                                isProfit={livePnl >= 0}
                                                onClick={() => setSelectedSymbol(trade.symbol.replace('USDT', 'USD'))}
                                                onClose={() => handleCloseTrade(trade.id)}
                                            />
                                        );
                                    }) : (
                                        <tr>
                                            <td colSpan={9} className="px-4 py-8 text-center text-[#636c7a]">No active positions</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        ) : activeTab === 'history' ? (
                            <table className="w-full text-[13px] text-left">
                                <thead className="text-[#636c7a] bg-[#111317] sticky top-0 z-10 border-b border-[#1c1f26]">
                                    <tr>
                                        <th className="px-4 py-2 font-medium">Symbol</th>
                                        <th className="px-4 py-2 font-medium">Type</th>
                                        <th className="px-4 py-2 font-medium font-sans hidden sm:table-cell">Open</th>
                                        <th className="px-4 py-2 font-medium font-sans">Close</th>
                                        <th className="px-4 py-2 font-medium font-sans text-right">Profit</th>
                                        <th className="px-4 py-2 font-medium font-sans text-right hidden md:table-cell">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#1c1f26]">
                                    {tradeHistory.map((trade: any) => (
                                        <tr key={trade.id} className="hover:bg-[#16191e] border-b border-[#1c1f26] last:border-0 h-11">
                                            <td className="px-4 font-bold text-white">{trade.symbol}</td>
                                            <td className={`px-4 font-bold ${trade.type === 'BUY' ? 'text-[#0ecb81]' : 'text-[#f6465d]'}`}>{trade.type}</td>
                                            <td className="px-4 text-[#a9b0c0] hidden sm:table-cell">{trade.openPrice.toLocaleString()}</td>
                                            <td className="px-4 text-[#a9b0c0]">{trade.closePrice?.toLocaleString() || "—"}</td>
                                            <td className={`px-4 text-right font-bold ${(trade.pnl || 0) >= 0 ? 'text-[#00FFA3]' : 'text-red-500'}`}>
                                                {(trade.pnl || 0).toLocaleString()}
                                            </td>
                                            <td className="px-4 text-right text-[#636c7a] hidden md:table-cell">{new Date(trade.createdAt).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="h-full flex items-center justify-center text-[#636c7a] text-sm italic">No records found</div>
                        )}
                    </div>
                </div>
            </div>

            {/* Right Column - Order Entry */}
            <div className="w-full lg:w-[320px] bg-[#111317] flex flex-col shrink-0 overflow-y-auto border-t lg:border-t-0 lg:border-l border-[#1c1f26] h-full">
                <div className="flex px-4 lg:px-0 border-b border-[#1c1f26] bg-[#0b0c0f] justify-center lg:justify-start">
                    <div className="px-6 sm:flex-1 py-3 text-[10px] sm:text-sm font-semibold text-white border-b-2 border-[#00FFA3] bg-[#00FFA3]/5 text-center -mb-[1px]">Market</div>
                </div>

                {isDemo && (user?.demoBalance || 0) < 1000 && (
                    <button
                        disabled={isToppingUp}
                        onClick={async () => {
                            setIsToppingUp(true);
                            try {
                                await api.post('/auth/demo/reset', {});
                                refreshUser();
                            } catch (e) { } finally { setIsToppingUp(false); }
                        }}
                        className="mx-5 mt-4 p-2 bg-orange-500/10 border border-orange-500/20 text-orange-400 hover:bg-orange-500/20 text-[10px] uppercase font-black rounded-md transition-all text-center font-sans tracking-widest"
                    >
                        {isToppingUp ? 'Topping up...' : 'Reset Demo to $10,000'}
                    </button>
                )}


                <div className="p-3 sm:p-5 flex-1 flex flex-col gap-4 sm:gap-6">
                    <div>
                        <div className="flex justify-between items-center mb-1.5">
                            <label className="text-xs font-bold text-[#636c7a] uppercase tracking-widest">Volume (Lots)</label>
                        </div>
                        <div className="flex bg-[#0b0c0f] border border-[#252a33] rounded-lg overflow-hidden focus-within:border-[#00FFA3] transition-colors">
                            <button
                                onClick={() => setTradeVolume(Math.max(0.01, parseFloat(tradeVolume) - 0.01).toFixed(2))}
                                className="w-10 flex items-center justify-center text-[#636c7a] hover:text-white hover:bg-[#1c1f26]"
                            >-</button>
                            <input
                                type="text"
                                className="flex-1 bg-transparent text-center font-sans font-bold text-white text-base py-2.5 outline-none"
                                value={tradeVolume}
                                onChange={(e) => setTradeVolume(e.target.value)}
                            />
                            <button
                                onClick={() => setTradeVolume((parseFloat(tradeVolume) + 0.01).toFixed(2))}
                                className="w-10 flex items-center justify-center text-[#636c7a] hover:text-white hover:bg-[#1c1f26]"
                            >+</button>
                        </div>
                        <div className="flex gap-0.5 sm:gap-1 mt-2">
                            {['0.01', '0.10', '0.50', '1.00'].map(val => (
                                <button
                                    key={val}
                                    onClick={() => setTradeVolume(val)}
                                    className={`flex-1 py-1 text-[10px] font-bold bg-[#1c1f26] text-[#a9b0c0] rounded border transition-all ${tradeVolume === val ? 'border-[#00FFA3] text-[#00FFA3]' : 'border-transparent hover:text-white'}`}
                                >{val}</button>
                            ))}
                        </div>
                    </div>

                    <div className="pt-2">
                        <div className="flex justify-between items-center mb-1.5">
                            <label className="text-xs font-bold text-[#636c7a] uppercase tracking-widest">Leverage</label>
                            <span className="text-xs font-bold text-[#00FFA3]">{leverage}x</span>
                        </div>
                        <div className="flex gap-0.5 sm:gap-1 mt-2">
                            {[1, 10, 50, 100].map(val => (
                                <button
                                    key={val}
                                    onClick={() => setLeverage(val)}
                                    className={`flex-1 py-1 text-[10px] font-bold rounded border transition-all ${leverage === val ? 'bg-[#00FFA3]/10 border-[#00FFA3] text-[#00FFA3]' : 'bg-[#1c1f26] border-transparent text-[#a9b0c0] hover:text-white hover:bg-[#252a33]'}`}
                                >{val}x</button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4 pt-4">
                        <div className="grid grid-cols-2 gap-2 sm:gap-3">
                            <div>
                                <label className="text-[10px] font-bold uppercase tracking-widest text-[#636c7a] mb-1.5 block">Stop Loss</label>
                                    <input
                                        type="number"
                                        className="w-full bg-[#0b0c0f] border border-[#252a33] text-white rounded-lg px-2 sm:px-3 py-2.5 text-xs sm:text-sm focus:border-[#00FFA3] outline-none transition-all font-sans font-bold"
                                        placeholder="0.00"
                                        value={stopLoss}
                                        onChange={(e) => setStopLoss(e.target.value)}
                                    />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold uppercase tracking-widest text-[#636c7a] mb-1.5 block">Take Profit</label>
                                    <input
                                        type="number"
                                        className="w-full bg-[#0b0c0f] border border-[#252a33] text-white rounded-lg px-2 sm:px-3 py-2.5 text-xs sm:text-sm focus:border-[#00FFA3] outline-none transition-all font-sans font-bold"
                                        placeholder="0.00"
                                        value={takeProfit}
                                        onChange={(e) => setTakeProfit(e.target.value)}
                                    />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4 pt-3 lg:pt-6 lg:mt-auto">
                        <div className="flex justify-between items-center px-1 mb-1">
                            <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-[#636c7a] shrink-0">Active Asset</span>
                            <span className="text-[9px] sm:text-[10px] font-black text-[#00FFA3] px-2 py-0.5 rounded bg-[#00FFA3]/5 border border-[#00FFA3]/20 max-w-[100px] truncate">{selectedSymbol}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-1.5 sm:gap-3">
                            <button
                                disabled={isTrading}
                                onClick={() => handleOpenTrade('SELL')}
                                className="h-[52px] bg-[#f6465d] hover:bg-[#e03a50] text-white rounded font-bold text-sm shadow-sm transition-all flex items-center justify-center disabled:opacity-50 uppercase tracking-widest"
                            >
                                <span>Sell</span>
                            </button>
                            <button
                                disabled={isTrading}
                                onClick={() => handleOpenTrade('BUY')}
                                className="h-[52px] bg-[#0ecb81] hover:bg-[#0ba86b] text-white rounded font-bold text-sm shadow-sm transition-all flex items-center justify-center disabled:opacity-50 uppercase tracking-widest mr-2 sm:mr-0"
                            >
                                <span>Buy</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function TabBtn({ children, active, onClick }: any) {
    return (
        <button
            onClick={onClick}
            className={`px-4 sm:px-5 py-2.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.1em] sm:tracking-widest transition-all border-b-2 -mb-[1px] relative z-10 ${active ? 'text-white border-[#00FFA3] bg-white/[0.02]' : 'text-[#636c7a] border-transparent hover:text-[#a9b0c0]'}`}
        >
            {children}
        </button>
    );
}

function TableRow({ symbol, volume, type, open, sl, tp, profit, isProfit, onClick, onClose }: any) {
    const isLong = type === "Buy";
    const typeColor = isLong ? "text-[#0ecb81]" : "text-[#f6465d]";
    const pnlColor = isProfit ? "text-[#00FFA3]" : "text-red-500";

    return (
        <tr className="hover:bg-[#16191e] transition-colors group border-b border-[#1c1f26] last:border-0 h-11 text-[#a9b0c0]">
            <td className="px-2 sm:px-4 cursor-pointer" onClick={onClick}>
                <div className="font-bold text-white flex items-center gap-1 sm:gap-2">
                    {symbol}
                    <span className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded-sm bg-[#1c1f26] ${typeColor}`}>{type}</span>
                </div>
            </td>
            <td className="px-2 sm:px-4 font-bold text-white hidden sm:table-cell">{volume}</td>
            <td className="px-2 sm:px-4 font-sans text-xs sm:text-base">{open}</td>
            <td className="px-2 sm:px-4 font-sans opacity-50 hidden md:table-cell">{sl}</td>
            <td className="px-2 sm:px-4 font-sans opacity-50 hidden md:table-cell">{tp}</td>
            <td className={`px-2 sm:px-4 text-right font-sans font-bold text-xs sm:text-base ${pnlColor}`}>{profit}</td>
            <td className="px-2 pr-10 sm:px-4 text-center">
                <button
                    onClick={onClose}
                    title="Close Trade"
                    className="w-7 h-7 rounded-md flex items-center justify-center bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-all mx-auto"
                >
                    <X className="w-3.5 h-3.5" />
                </button>
            </td>
        </tr>
    );
}
