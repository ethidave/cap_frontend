"use client";
import { useEffect, useRef } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

const pairs = [
    { pair: "EUR/USD", price: "1.0842", change: "+0.12%", up: true },
    { pair: "GBP/USD", price: "1.2704", change: "+0.08%", up: true },
    { pair: "USD/JPY", price: "149.85", change: "-0.22%", up: false },
    { pair: "USD/CHF", price: "0.8812", change: "-0.05%", up: false },
    { pair: "USD/CAD", price: "1.3578", change: "+0.18%", up: true },
    { pair: "NZD/USD", price: "0.6098", change: "-0.11%", up: false },
    { pair: "EUR/GBP", price: "0.8568", change: "+0.03%", up: true },
    { pair: "AUD/USD", price: "0.6542", change: "+0.14%", up: true },
    { pair: "XAU/USD", price: "2045.6", change: "+0.32%", up: true },
    { pair: "BTC/USD", price: "67,421", change: "+1.12%", up: true },
];

// Duplicate for seamless loop
const allPairs = [...pairs, ...pairs];

export function ForexTicker() {
    return (
        <div className="w-full border-y border-white/[0.05] bg-[#06091A] overflow-hidden py-3">
            <div className="ticker-track gap-12 px-6" style={{ whiteSpace: "nowrap" }}>
                {allPairs.map((item, i) => (
                    <span key={i} className="inline-flex items-center gap-2 mx-6 text-sm font-medium">
                        <span className="text-slate-400 font-mono">{item.pair}</span>
                        <span className="text-white font-semibold tracking-wide">{item.price}</span>
                        <span className={`flex items-center gap-0.5 text-xs font-bold ${item.up ? "text-emerald-400" : "text-red-400"}`}>
                            {item.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                            {item.change}
                        </span>
                    </span>
                ))}
            </div>
        </div>
    );
}
