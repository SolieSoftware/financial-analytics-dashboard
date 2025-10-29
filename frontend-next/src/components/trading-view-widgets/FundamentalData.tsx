"use client";
import React, { useEffect, useRef, memo } from 'react';

interface FundamentalDataProps {
  ticker?: string;
  exchange?: string;
  width?: number | string;
  height?: number | string;
  theme?: "light" | "dark";
  displayMode?: "regular" | "compact";
}

function FundamentalData({
  ticker = "AAPL",
  exchange = "NASDAQ",
  width = "100%",
  height = 550,
  theme = "dark",
  displayMode = "regular"
}: FundamentalDataProps) {
  const container = useRef<HTMLDivElement>(null);
  const scriptRef = useRef<HTMLScriptElement | null>(null);

  useEffect(() => {
    if (!container.current) return;

    // Clean up previous script if it exists
    if (scriptRef.current && container.current.contains(scriptRef.current)) {
      container.current.removeChild(scriptRef.current);
    }

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-financials.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbol: `${exchange}:${ticker}`,
      colorTheme: theme,
      displayMode: displayMode,
      isTransparent: false,
      locale: "en",
      width: width,
      height: height
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
  }, [ticker, exchange, width, height, theme, displayMode]);

  return (
    <div className="tradingview-widget-container" ref={container} style={{ width: "100%", height: "100%" }}>
      <div className="tradingview-widget-container__widget"></div>
      <div className="tradingview-widget-copyright">
        <a href={`https://www.tradingview.com/symbols/${exchange}-${ticker}/financials-overview/`} rel="noopener nofollow" target="_blank">
          <span className="blue-text">{ticker} Fundamentals</span>
        </a>
        <span className="trademark"> by TradingView</span>
      </div>
    </div>
  );
}

export default memo(FundamentalData);
