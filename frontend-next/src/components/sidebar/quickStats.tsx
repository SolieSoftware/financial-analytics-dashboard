"use client";

export const QuickStats = () => {
  return (
    <>
      {/* Quick Stats Header */}
      <div className="mb-4">
        <h2 className="text-xs text-text-muted uppercase tracking-wider font-semibold">
          Quick Stats
        </h2>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Market Stat */}
        <div className="p-3 rounded-lg bg-bullish/10 border border-bullish/20">
          <p className="text-[0.625rem] text-text-muted uppercase tracking-wider mb-1">
            Market
          </p>
          <p className="text-sm text-bullish font-semibold">+2.4%</p>
        </div>

        {/* Volume Stat */}
        <div className="p-3 rounded-lg bg-accent-blue/10 border border-accent-blue/20">
          <p className="text-[0.625rem] text-text-muted uppercase tracking-wider mb-1">
            Volume
          </p>
          <p className="text-sm text-accent-blue font-semibold">High</p>
        </div>
      </div>
    </>
  );
};
