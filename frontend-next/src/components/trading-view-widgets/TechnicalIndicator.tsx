"use client";
import React, { useEffect, useRef, memo } from 'react';

interface TechnicalIndicatorProps {
  ticker?: string;
  exchange?: string;
  width?: number | string;
  height?: number | string;
  theme?: "light" | "dark";
  interval?: "1m" | "5m" | "15m" | "30m" | "1h" | "4h" | "1D" | "1W" | "1M";
  showIntervalTabs?: boolean;
}

function TechnicalIndicator({
  ticker = "AAPL",
  exchange = "NASDAQ",
  width = "100%",
  height = 500,
  theme = "dark",
  interval = "1D",
  showIntervalTabs = true
}: TechnicalIndicatorProps) {
  const container = useRef<HTMLDivElement>(null);
  const scriptRef = useRef<HTMLScriptElement | null>(null);

  useEffect(() => {
    if (!container.current) return;

    // Clean up previous script if it exists
    if (scriptRef.current && container.current.contains(scriptRef.current)) {
      container.current.removeChild(scriptRef.current);
    }

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      colorTheme: theme,
      displayMode: "single",
      isTransparent: false,
      locale: "en",
      interval: interval,
      disableInterval: false,
      width: width,
      height: height,
      symbol: `${exchange}:${ticker}`,
      showIntervalTabs: showIntervalTabs
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
  }, [ticker, exchange, width, height, theme, interval, showIntervalTabs]);

  return (
    <div className="tradingview-widget-container" ref={container} style={{ width: "100%", height: "100%" }}>
      <div className="tradingview-widget-container__widget"></div>
      <div className="tradingview-widget-copyright">
        <a href={`https://www.tradingview.com/symbols/${exchange}-${ticker}/technicals/`} rel="noopener nofollow" target="_blank">
          <span className="blue-text">{ticker} Technical Analysis</span>
        </a>
        <span className="trademark"> by TradingView</span>
      </div>
    </div>
  );
}

export default memo(TechnicalIndicator);
