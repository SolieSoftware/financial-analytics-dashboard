import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Building2 } from "lucide-react";

const LoadingPage = ({ title }: { title: React.ReactNode }) => {
  return (
    <div className="bg-background-secondary/40 rounded-lg border-0 p-5 shadow-lg backdrop-blur-sm market-summary-container">
        {title}
    <div className="space-y-3">
      <Skeleton className="w-40 h-6 mb-2" />
      <div className="flex gap-2 mb-3">
        <Skeleton className="w-20 h-5" />
        <Skeleton className="w-24 h-5" />
      </div>
      <Skeleton className="w-full h-16" />
    </div>
  </div>
  );
};

export default LoadingPage;