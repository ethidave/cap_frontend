"use client";

import { motion } from "framer-motion";

export function ForexChart() {
    const chartPath = "M0,150 L30,140 L60,160 L90,120 L120,130 L150,90 L180,100 L210,60 L240,75 L270,40 L300,50 L330,20 L360,30 L400,0";

    return (
        <div className="relative w-full h-[300px] bg-[#0A0F1E]/60 border border-slate-800 rounded-2xl overflow-hidden p-6 shadow-2xl backdrop-blur-xl">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    <div className="px-3 py-1 rounded bg-slate-800/80 text-white text-xs font-semibold tracking-wide flex items-center gap-2">
                        EUR/USD <span className="text-[#00F0FF]">+0.42%</span>
                    </div>
                    <div className="px-3 py-1 rounded bg-slate-800/80 text-white text-xs font-semibold tracking-wide flex items-center gap-2">
                        GBP/JPY <span className="text-[#00FFA3]">+1.12%</span>
                    </div>
                </div>
                <div className="flex gap-2 text-xs text-slate-500 font-medium">
                    <span className="hover:text-white cursor-pointer px-1">1H</span>
                    <span className="hover:text-white cursor-pointer text-[#00F0FF] px-1">4H</span>
                    <span className="hover:text-white cursor-pointer px-1">1D</span>
                    <span className="hover:text-white cursor-pointer px-1">1W</span>
                </div>
            </div>

            <div className="relative h-full w-full">
                {/* Background Grid Lines */}
                <div className="absolute inset-0 flex flex-col justify-between opacity-10">
                    {[...Array(5)].map((_, i) => (
                        <div key={`h-grid-${i}`} className="w-full h-px bg-slate-400" />
                    ))}
                </div>
                <div className="absolute inset-0 flex justify-between opacity-10">
                    {[...Array(8)].map((_, i) => (
                        <div key={`v-grid-${i}`} className="h-full w-px bg-slate-400" />
                    ))}
                </div>

                {/* Glow effect behind chart */}
                <div className="absolute bottom-0 right-10 w-44 h-44 bg-[#00F0FF]/20 rounded-full blur-[80px]" />

                <svg
                    viewBox="0 0 400 200"
                    className="w-full h-full drop-shadow-[0_0_15px_rgba(0,240,255,0.4)] relative z-10"
                    preserveAspectRatio="none"
                >
                    {/* Gradient for fill */}
                    <defs>
                        <linearGradient id="chart-gradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#00F0FF" stopOpacity="0.4" />
                            <stop offset="100%" stopColor="#00F0FF" stopOpacity="0" />
                        </linearGradient>
                        <linearGradient id="line-gradient" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#00FFA3" />
                            <stop offset="100%" stopColor="#00F0FF" />
                        </linearGradient>
                    </defs>

                    <motion.path
                        d={`${chartPath} L400,200 L0,200 Z`}
                        fill="url(#chart-gradient)"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                    />

                    <motion.path
                        d={chartPath}
                        fill="none"
                        stroke="url(#line-gradient)"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 2, ease: "easeInOut" }}
                    />

                    {/* Pulse Dot at end */}
                    <motion.circle
                        cx="400"
                        cy="0"
                        r="5"
                        fill="#00F0FF"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: [1, 1.5, 1], opacity: [0.8, 1, 0.8] }}
                        transition={{ delay: 2, duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        className="drop-shadow-[0_0_8px_rgba(0,240,255,1)]"
                    />
                </svg>

                {/* Floating Candlestick UI overlays */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 1.5, duration: 0.8, ease: "easeOut" }}
                    className="absolute top-8 left-1/3 bg-slate-900/80 backdrop-blur-md rounded-lg p-3 border border-slate-700/50 shadow-xl"
                >
                    <div className="text-slate-400 text-[10px] uppercase font-bold tracking-widest mb-1">Buy Order</div>
                    <div className="text-white text-sm font-bold flex items-center gap-2">
                        1.08452 <br /> <span className="text-[#00FFA3] text-xs font-medium bg-[#00FFA3]/10 px-1 rounded">Filled</span>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
