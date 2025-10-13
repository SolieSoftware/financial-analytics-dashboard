import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Building2 } from "lucide-react";

const ErrorPage = ({ error, title }: { error: Error, title: React.ReactNode }) => {
  return (
    <div className="w-full market-summary-container">
      {title}
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Error loading data: {error?.message || error?.toString()}
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default ErrorPage;
