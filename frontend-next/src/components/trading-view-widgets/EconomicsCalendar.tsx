"use client";
import React, { useEffect, useRef, memo } from 'react';

interface EconomicsCalendarProps {
  width?: number | string;
  height?: number | string;
  theme?: "light" | "dark";
  countryFilter?: string;
  importanceFilter?: string;
}

function EconomicsCalendar({
  width = "100%",
  height = 600,
  theme = "dark",
  countryFilter = "ar,au,br,ca,cn,fr,de,in,id,it,jp,kr,mx,ru,sa,za,tr,gb,us,eu",
  importanceFilter = "-1,0,1"
}: EconomicsCalendarProps) {
  const container = useRef<HTMLDivElement>(null);
  const scriptRef = useRef<HTMLScriptElement | null>(null);

  useEffect(() => {
    if (!container.current) return;

    // Clean up previous script if it exists
    if (scriptRef.current && container.current.contains(scriptRef.current)) {
      container.current.removeChild(scriptRef.current);
    }

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-events.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      colorTheme: theme,
      isTransparent: false,
      locale: "en",
      countryFilter: countryFilter,
      importanceFilter: importanceFilter,
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
  }, [width, height, theme, countryFilter, importanceFilter]);

  return (
    <div className="tradingview-widget-container" ref={container} style={{ width: "100%", height: "100%" }}>
      <div className="tradingview-widget-container__widget"></div>
      <div className="tradingview-widget-copyright">
        <a href="https://www.tradingview.com/economic-calendar/" rel="noopener nofollow" target="_blank">
          <span className="blue-text">Economic Calendar</span>
        </a>
        <span className="trademark"> by TradingView</span>
      </div>
    </div>
  );
}

export default memo(EconomicsCalendar);
