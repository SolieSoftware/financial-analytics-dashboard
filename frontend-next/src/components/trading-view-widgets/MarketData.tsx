"use client";
import React, { useEffect, useRef, memo } from 'react';

interface MarketDataProps {
  width?: number | string;
  height?: number | string;
  theme?: "light" | "dark";
}

function MarketData({
  width = "100%",
  height = 600,
  theme = "dark"
}: MarketDataProps) {
  const container = useRef<HTMLDivElement>(null);
  const scriptRef = useRef<HTMLScriptElement | null>(null);

  useEffect(() => {
    if (!container.current) return;

    // Clean up previous script if it exists
    if (scriptRef.current && container.current.contains(scriptRef.current)) {
      container.current.removeChild(scriptRef.current);
    }

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-market-quotes.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      colorTheme: theme,
      locale: "en",
      largeChartUrl: "",
      isTransparent: false,
      showSymbolLogo: true,
      backgroundColor: theme === "dark" ? "#0F0F0F" : "#FFFFFF",
      support_host: "https://www.tradingview.com",
      width: width,
      height: height,
      symbolsGroups: [
        {
          name: "Indices",
          symbols: [
            {
              name: "FOREXCOM:SPXUSD",
              displayName: "S&P 500 Index"
            },
            {
              name: "FOREXCOM:NSXUSD",
              displayName: "US 100 Cash CFD"
            },
            {
              name: "FOREXCOM:DJI",
              displayName: "Dow Jones Industrial Average Index"
            },
            {
              name: "INDEX:NKY",
              displayName: "Japan 225"
            },
            {
              name: "INDEX:DEU40",
              displayName: "DAX Index"
            },
            {
              name: "FOREXCOM:UKXGBP",
              displayName: "FTSE 100 Index"
            }
          ]
        },
        {
          name: "Futures",
          symbols: [
            {
              name: "BMFBOVESPA:ISP1!",
              displayName: "S&P 500"
            },
            {
              name: "BMFBOVESPA:EUR1!",
              displayName: "Euro"
            },
            {
              name: "CMCMARKETS:GOLD",
              displayName: "Gold"
            },
            {
              name: "PYTH:WTI3!",
              displayName: "WTI Crude Oil"
            },
            {
              name: "BMFBOVESPA:CCM1!",
              displayName: "Corn"
            }
          ]
        },
        {
          name: "Bonds",
          symbols: [
            {
              name: "EUREX:FGBL1!",
              displayName: "Euro Bund"
            },
            {
              name: "EUREX:FBTP1!",
              displayName: "Euro BTP"
            },
            {
              name: "EUREX:FGBM1!",
              displayName: "Euro BOBL"
            }
          ]
        },
        {
          name: "Forex",
          symbols: [
            {
              name: "FX:EURUSD",
              displayName: "EUR to USD"
            },
            {
              name: "FX:GBPUSD",
              displayName: "GBP to USD"
            },
            {
              name: "FX:USDJPY",
              displayName: "USD to JPY"
            },
            {
              name: "FX:USDCHF",
              displayName: "USD to CHF"
            },
            {
              name: "FX:AUDUSD",
              displayName: "AUD to USD"
            },
            {
              name: "FX:USDCAD",
              displayName: "USD to CAD"
            }
          ]
        }
      ]
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
  }, [width, height, theme]);

  return (
    <div className="tradingview-widget-container" ref={container} style={{ width: "100%", height: "100%" }}>
      <div className="tradingview-widget-container__widget"></div>
      <div className="tradingview-widget-copyright">
        <a href="https://www.tradingview.com/markets/" rel="noopener nofollow" target="_blank">
          <span className="blue-text">Market Data</span>
        </a>
        <span className="trademark"> by TradingView</span>
      </div>
    </div>
  );
}

export default memo(MarketData);
