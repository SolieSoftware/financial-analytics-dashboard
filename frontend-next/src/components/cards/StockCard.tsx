"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

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
    <Card
      className={cn(
        "hover:shadow-xl transition-all duration-200 cursor-pointer border-l-4",
        isPositive ? "border-l-bullish" : "border-l-bearish",
        className
      )}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{ticker}</CardTitle>
            <p className="text-text-secondary text-sm mt-1">{name}</p>
          </div>
          <Badge variant={isPositive ? "bullish" : "bearish"}>
            {isPositive ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
            {isPositive ? "+" : ""}
            {changePercent.toFixed(2)}%
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between items-end">
            <span className="text-text-primary text-2xl font-bold">
              ${price.toFixed(2)}
            </span>
            <span
              className={cn(
                "text-sm font-semibold",
                isPositive ? "text-bullish" : "text-bearish"
              )}
            >
              {isPositive ? "+" : ""}${change.toFixed(2)}
            </span>
          </div>
          {volume && (
            <div className="pt-2 border-t border-border">
              <span className="text-text-muted text-xs">Volume: </span>
              <span className="text-text-secondary text-xs font-medium">
                {volume.toLocaleString()}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
