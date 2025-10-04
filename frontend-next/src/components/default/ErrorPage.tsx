import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export const ErrorPage = ({ error }: { error: Error }) => {
  return (
    <div className="w-full">
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Error loading market news: {error?.message || error?.toString()}
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default ErrorPage;
