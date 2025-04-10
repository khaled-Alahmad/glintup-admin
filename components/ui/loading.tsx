import { Loader2 } from "lucide-react";

interface LoadingProps {
  size?: number;
  text?: string;
}

export function Loading({ size = 24, text = "جاري التحميل..." }: LoadingProps) {
  return (
    <div className="flex flex-col items-center justify-center p-4">
      <Loader2 className="h-[${size}px] w-[${size}px] animate-spin" />
      {text && <p className="mt-2 text-sm text-muted-foreground">{text}</p>}
    </div>
  );
}

export function LoadingPage() {
  return (
    <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
      <Loading size={32} />
    </div>
  );
}

export function LoadingInline() {
  return <Loader2 className="h-4 w-4 animate-spin" />;
}