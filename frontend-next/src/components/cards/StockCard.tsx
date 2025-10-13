"use client";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, DollarSign } from "lucide-react";

interface StockCardProps {
  ticker: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume?: number;
  className?: string;
  onClick?: () => void;
}

export const StockCard: React.FC<StockCardProps> = ({
  ticker,
  name,
  price,
  change,
  changePercent,
  volume,
  className,
  onClick,
}) => {
  const isPositive = change > 0;

  return (
    <Card className="market-summary-card" onClick={onClick}>
      <CardContent className="market-summary-content">
        <div className="market-summary-header">
          <div className="market-summary-title-section">
            <DollarSign className="market-summary-icon" />
            <h3 className="market-summary-title">{ticker}</h3>
          </div>
          {isPositive ? (
            <div className="text-bullish market-summary-sentiment-icon">
              <TrendingUp className="w-4 h-4" />
            </div>
          ) : (
            <div className="text-bearish market-summary-sentiment-icon">
              <TrendingDown className="w-4 h-4" />
            </div>
          )}
        </div>

        <p className="market-summary-description">{name}</p>

        <div className="market-summary-badges">
          <Badge
            variant={isPositive ? "bullish" : "bearish"}
            className="market-summary-badge"
          >
            ${price.toFixed(2)}
          </Badge>
          <Badge
            variant={isPositive ? "bullish" : "bearish"}
            className="market-summary-badge"
          >
            {isPositive ? "+" : ""}
            {changePercent.toFixed(2)}%
          </Badge>
          <Badge
            variant={isPositive ? "bullish" : "bearish"}
            className="market-summary-badge"
          >
            {isPositive ? "+" : ""}${Math.abs(change).toFixed(2)}
          </Badge>
          {volume && (
            <Badge variant="outline" className="market-summary-badge">
              Vol:{" "}
              {volume >= 1e9
                ? `${(volume / 1e9).toFixed(2)}B`
                : volume >= 1e6
                ? `${(volume / 1e6).toFixed(2)}M`
                : volume >= 1e3
                ? `${(volume / 1e3).toFixed(2)}K`
                : volume.toLocaleString()}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
