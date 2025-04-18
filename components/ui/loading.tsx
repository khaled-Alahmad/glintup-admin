import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center space-y-2">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-base text-muted-foreground">جاري تحميل ...</p>
        </div>
      </div>
    </div>
  );
}