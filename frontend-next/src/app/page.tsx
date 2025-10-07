"use client";

import "./global.css";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push("/market-overview");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background-primary via-background-secondary to-background-tertiary text-text-primary flex flex-col justify-center items-center text-center w-full px-4">
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-text-primary to-accent-blue bg-clip-text text-transparent">
        Financial Analytics Dashboard
      </h1>

      <p className="text-lg md:text-xl text-text-secondary mb-8 max-w-2xl">
        Welcome to your financial analysis platform. Track stocks, analyze
        market data, and manage your portfolio with real-time insights.
      </p>

      <Button
        variant="default"
        size="lg"
        onClick={handleGetStarted}
        className="px-8 py-6 text-lg font-semibold transition-all duration-200 hover:scale-105"
      >
        Get Started
      </Button>
    </div>
  );
}
