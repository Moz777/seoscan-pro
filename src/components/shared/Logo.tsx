"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogoProps {
  variant?: "default" | "white";
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: {
    icon: "h-5 w-5",
    text: "text-lg",
    wrapper: "gap-1.5",
  },
  md: {
    icon: "h-6 w-6",
    text: "text-xl",
    wrapper: "gap-2",
  },
  lg: {
    icon: "h-8 w-8",
    text: "text-2xl",
    wrapper: "gap-2.5",
  },
};

export function Logo({
  variant = "default",
  size = "md",
  showText = true,
  className,
}: LogoProps) {
  const sizes = sizeClasses[size];

  return (
    <Link
      href="/"
      className={cn(
        "flex items-center font-semibold tracking-tight transition-opacity hover:opacity-80",
        sizes.wrapper,
        className
      )}
    >
      <div
        className={cn(
          "flex items-center justify-center rounded-lg p-1.5",
          variant === "default"
            ? "bg-primary text-primary-foreground"
            : "bg-white/10 text-white"
        )}
      >
        <Search className={sizes.icon} strokeWidth={2.5} />
      </div>
      {showText && (
        <span
          className={cn(
            sizes.text,
            variant === "default" ? "text-foreground" : "text-white"
          )}
        >
          SEOScan
          <span
            className={cn(
              variant === "default" ? "text-primary" : "text-white/90"
            )}
          >
            Pro
          </span>
        </span>
      )}
    </Link>
  );
}

export function LogoIcon({
  variant = "default",
  size = "md",
  className,
}: Omit<LogoProps, "showText">) {
  const sizes = sizeClasses[size];

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-lg p-1.5",
        variant === "default"
          ? "bg-primary text-primary-foreground"
          : "bg-white/10 text-white",
        className
      )}
    >
      <Search className={sizes.icon} strokeWidth={2.5} />
    </div>
  );
}
