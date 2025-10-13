import { Building2 } from "lucide-react";
import { Info } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";


const NoData = ({ title }: { title: React.ReactNode }) => {
    return (
        <div className="bg-background-secondary/40 rounded-lg border-0 p-5 shadow-lg backdrop-blur-sm market-summary-container">
            {title}
        <Alert variant="info" className="border-0 flex flex-col items-center text-center mt-4">
          <Info className="h-4 w-4 mt-4" />
          <AlertTitle>Info</AlertTitle>
          <AlertDescription>No company information available</AlertDescription>
        </Alert>
      </div>
    )
}

export default NoData;