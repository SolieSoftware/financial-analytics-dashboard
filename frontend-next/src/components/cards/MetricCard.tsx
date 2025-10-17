"use client";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, LucideIcon } from "lucide-react";
import { cn } from "../../lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon?: LucideIcon;
  className?: string;
  variant?: "default" | "bullish" | "bearish";
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  changeLabel,
  icon: Icon,
  className,
  variant = "default",
}) => {
  const isPositive = change !== undefined && change > 0;
  const isNegative = change !== undefined && change < 0;

  const getBorderColor = () => {
    if (variant === "bullish") return "border-l-bullish";
    if (variant === "bearish") return "border-l-bearish";
    if (isPositive) return "border-l-bullish";
    if (isNegative) return "border-l-bearish";
    return "border-l-accent-blue";
  };

  return (
    <Card
      className={cn(
        "border-l-4 hover:shadow-xl transition-all duration-200",
        getBorderColor(),
        className
      )}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-text-secondary text-sm font-medium mb-1">
              {title}
            </p>
            <p className="text-text-primary text-2xl font-bold">{value}</p>
            {change !== undefined && (
              <div className="mt-2 flex items-center gap-1">
                {isPositive ? (
                  <TrendingUp className="w-4 h-4 text-bullish" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-bearish" />
                )}
                <Badge variant={isPositive ? "bullish" : "bearish"}>
                  {isPositive ? "+" : ""}
                  {change.toFixed(2)}%
                </Badge>
                {changeLabel && (
                  <span className="text-text-muted text-xs ml-1">
                    {changeLabel}
                  </span>
                )}
              </div>
            )}
          </div>
          {Icon && (
            <div
              className={cn(
                "p-2 rounded-lg",
                isPositive && "bg-bullish-bg",
                isNegative && "bg-bearish-bg",
                !isPositive && !isNegative && "bg-accent-blue/10"
              )}
            >
              <Icon
                className={cn(
                  "w-6 h-6",
                  isPositive && "text-bullish",
                  isNegative && "text-bearish",
                  !isPositive && !isNegative && "text-accent-blue"
                )}
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
