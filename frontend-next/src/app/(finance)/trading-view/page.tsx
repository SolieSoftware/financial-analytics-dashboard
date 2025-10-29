"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const TradingViewPage = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect to default ticker (AAPL)
    router.push("/trading-view/AAPL");
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-text-secondary">Redirecting to Trading View...</p>
    </div>
  );
};

export default TradingViewPage;
