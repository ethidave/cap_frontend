"use client";
import React, { useEffect, useRef } from "react";

interface TradingViewChartProps {
    symbol: string;
}

export function TradingViewChart({ symbol }: TradingViewChartProps) {
    const container = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const containerId = "tradingview_chart_container";

        // Cleanup function for potentially existing widgets or scripts
        const cleanup = () => {
            if (container.current) {
                container.current.innerHTML = "";
            }
        };

        const script = document.createElement("script");
        script.src = "https://s3.tradingview.com/tv.js";
        script.type = "text/javascript";
        script.async = true;
        script.onload = () => {
            if (typeof (window as any).TradingView !== "undefined" && container.current) {
                // Map the symbol to TradingView format if needed
                let tvSymbol = symbol;
                if (!symbol.includes(":")) {
                    const isCrypto = ["BTC", "ETH", "SOL", "BNB", "XRP", "ADA", "DOGE", "LTC", "TRX", "DOT", "AVAX", "LINK", "XLM", "NEAR", "UNI", "ICP", "SHIB", "GALA", "CHZ", "PEPE", "BONK", "FLOKI"].some(coin => symbol.startsWith(coin));

                    if (isCrypto) {
                        // Ensure it ends with USDT for Binance if it's a major crypto
                        const cleanSymbol = symbol.endsWith('USDT') ? symbol : `${symbol}USDT`;
                        tvSymbol = `BINANCE:${cleanSymbol}`;
                    } else if (symbol.startsWith("XAU") || symbol.startsWith("XAG")) {
                        tvSymbol = `OANDA:${symbol.replace("/", "")}`;
                    } else if (["DXY", "US30", "NAS100", "SPX500", "GER40", "UK100", "JP225"].includes(symbol)) {
                        tvSymbol = `TVC:${symbol}`;
                    } else {
                        // Default to Forex for everything else (EURUSD, etc)
                        tvSymbol = `FX_IDC:${symbol.replace("/", "")}`;
                    }
                }

                new (window as any).TradingView.widget({
                    "autosize": true,
                    "symbol": tvSymbol,
                    "interval": "15",
                    "timezone": "Etc/UTC",
                    "theme": "dark",
                    "style": "1",
                    "locale": "en",
                    "toolbar_bg": "#111317",
                    "enable_publishing": false,
                    "hide_legend": true, // User requested no price display in chart
                    "hide_side_toolbar": true,
                    "allow_symbol_change": true,
                    "container_id": containerId,
                    "disabled_features": [
                        "header_symbol_search",
                        "header_compare",
                        "header_undo_redo",
                        "header_saveload",
                        "header_settings",
                        "header_screenshot",
                        "header_fullscreen_button",
                        "legend_context_menu",
                        "show_legend",
                        "symbol_info",
                        "display_market_status",
                    ],
                    "overrides": {
                        "paneProperties.background": "#0b0c0f",
                        "paneProperties.vertGridProperties.color": "#0b0c0f",
                        "paneProperties.horzGridProperties.color": "#0b0c0f",
                        "symbolWatermarkProperties.transparency": 90,
                        "scalesProperties.textColor": "#636c7a",
                        "mainSeriesProperties.candleStyle.upColor": "#00FFA3",
                        "mainSeriesProperties.candleStyle.downColor": "#f6465d",
                        "mainSeriesProperties.candleStyle.borderUpColor": "#00FFA3",
                        "mainSeriesProperties.candleStyle.borderDownColor": "#f6465d",
                        "mainSeriesProperties.candleStyle.wickUpColor": "#00FFA3",
                        "mainSeriesProperties.candleStyle.wickDownColor": "#f6465d",
                        "mainSeriesProperties.showPriceLine": false,
                        "mainSeriesProperties.priceAxisProperties.showLastPriceLabel": false,
                        "scalesProperties.showRightScale": false,
                    }
                });
            }
        };

        cleanup();
        const widgetContainer = document.createElement("div");
        widgetContainer.id = containerId;
        widgetContainer.style.height = "100%";
        widgetContainer.style.width = "100%";
        container.current?.appendChild(widgetContainer);
        container.current?.appendChild(script);

        return () => {
            // Script cleanup is tricky with TV, but emptying container helps
            cleanup();
        };
    }, [symbol]);

    return (
        <div ref={container} className="w-full h-full border-none" />
    );
}
