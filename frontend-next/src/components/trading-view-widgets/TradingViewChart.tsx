// TradingViewWidget.jsx

"use client";
import React, { useEffect, useRef, memo } from 'react';

interface TradingViewChartProps {
  ticker?: string;
  exchange?: string;
  height?: string;
  theme?: "light" | "dark";
  interval?: "1" | "5" | "15" | "30" | "60" | "D" | "W" | "M";
  allowSymbolChange?: boolean;
  hideSideToolbar?: boolean;
  hideTopToolbar?: boolean;
  compareSymbols?: string[];
}

export const TradingViewChart = ({
  ticker = "AAPL",
  exchange = "NASDAQ",
  height = "100%",
  theme = "dark",
  interval = "D",
  allowSymbolChange = true,
  hideSideToolbar = true,
  hideTopToolbar = false,
  compareSymbols = [],
}: TradingViewChartProps) => {
  const container = useRef<HTMLDivElement>(null);
  const scriptRef = useRef<HTMLScriptElement | null>(null);

  useEffect(() => {
    if (!container.current) return;

    // Clean up previous script if it exists
    if (scriptRef.current && container.current.contains(scriptRef.current)) {
      container.current.removeChild(scriptRef.current);
    }

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      allow_symbol_change: allowSymbolChange,
      calendar: false,
      details: false,
      hide_side_toolbar: hideSideToolbar,
      hide_top_toolbar: hideTopToolbar,
      hide_legend: false,
      hide_volume: false,
      hotlist: false,
      interval: interval,
      locale: "en",
      save_image: true,
      style: "1",
      symbol: `${exchange}:${ticker}`,
      theme: theme,
      timezone: "Etc/UTC",
      backgroundColor: theme === "dark" ? "#0F0F0F" : "#FFFFFF",
      gridColor: theme === "dark" ? "rgba(242, 242, 242, 0.06)" : "rgba(0, 0, 0, 0.06)",
      watchlist: [],
      withdateranges: false,
      compareSymbols: compareSymbols,
      studies: [],
      autosize: true
    });

    scriptRef.current = script;
    container.current.appendChild(script);

    // Cleanup function
    return () => {
      if (scriptRef.current && container.current?.contains(scriptRef.current)) {
        container.current.removeChild(scriptRef.current);
      }
      scriptRef.current = null;
    };
  }, [ticker, exchange, theme, interval, allowSymbolChange, hideSideToolbar, hideTopToolbar, compareSymbols]);

  return (
    <div className="tradingview-widget-container" ref={container} style={{ height, width: "100%" }}>
      <div className="tradingview-widget-container__widget" style={{ height: "100%", width: "100%" }}></div>
      <div className="tradingview-widget-copyright">
        <a href={`https://www.tradingview.com/symbols/${exchange}-${ticker}/`} rel="noopener nofollow" target="_blank">
          <span className="blue-text">{ticker} stock chart</span>
        </a>
        <span className="trademark"> by TradingView</span>
      </div>
    </div>
  );
}

export default memo(TradingViewChart);
