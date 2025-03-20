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
        <img src="/Asset 1.svg" alt=""  className="object-cover w-30 h-10"/>
      </div>
    </Link>
  );
}
