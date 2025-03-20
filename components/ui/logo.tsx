import Link from "next/link";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "light" | "dark";
}

export function Logo({
  className = "",
  size = "md",
  variant = "dark",
}: LogoProps) {
  const sizeClasses = {
    sm: "h-8",
    md: "h-10",
    lg: "h-12",
  };

  return (
    <Link href="/" className={`flex items-center ${className}`}>
      <div className="relative flex items-center">
        <span
          className={`font-bold ${sizeClasses[size]} ${
            variant === "light" ? "text-white" : "text-primary"
          }`}
        >
          GLINT<span className="text-accent">UP</span>
        </span>
      </div>
    </Link>
  );
}
