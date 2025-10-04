import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const LoadingPage = () => {
  return (
    <div className="w-full">
      <Card className="bg-background-secondary/90 border-border/30 backdrop-blur-sm shadow-2xl">
        <CardContent className="p-6">
          <Skeleton className="w-52 h-8 mb-4" />
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="mb-4">
              <Skeleton className="w-full h-32 mb-2 rounded-lg" />
              <Skeleton className="w-full h-6 mb-1" />
              <Skeleton className="w-4/5 h-5" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
