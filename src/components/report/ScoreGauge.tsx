"use client";

import { cn } from "@/lib/utils";

interface ScoreGaugeProps {
  score: number;
  size?: "sm" | "md" | "lg";
  label?: string;
  showLabel?: boolean;
  className?: string;
}

function getScoreColor(score: number): string {
  if (score >= 80) return "#22c55e"; // green-500
  if (score >= 60) return "#eab308"; // yellow-500
  return "#ef4444"; // red-500
}

function getScoreLabel(score: number): string {
  if (score >= 80) return "Good";
  if (score >= 60) return "Needs Work";
  return "Poor";
}

const sizeConfig = {
  sm: { size: 80, strokeWidth: 6, fontSize: "text-lg" },
  md: { size: 120, strokeWidth: 8, fontSize: "text-2xl" },
  lg: { size: 180, strokeWidth: 10, fontSize: "text-4xl" },
};

export function ScoreGauge({
  score,
  size = "md",
  label,
  showLabel = true,
  className,
}: ScoreGaugeProps) {
  const config = sizeConfig[size];
  const radius = (config.size - config.strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (score / 100) * circumference;
  const color = getScoreColor(score);

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <div className="relative" style={{ width: config.size, height: config.size }}>
        <svg
          width={config.size}
          height={config.size}
          className="transform -rotate-90"
        >
          {/* Background circle */}
          <circle
            cx={config.size / 2}
            cy={config.size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={config.strokeWidth}
            className="text-muted"
          />
          {/* Progress circle */}
          <circle
            cx={config.size / 2}
            cy={config.size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={config.strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        {/* Score text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn("font-bold", config.fontSize)}>{score}</span>
          {showLabel && size !== "sm" && (
            <span className="text-xs text-muted-foreground">
              {getScoreLabel(score)}
            </span>
          )}
        </div>
      </div>
      {label && (
        <span className="mt-2 text-sm font-medium text-muted-foreground">
          {label}
        </span>
      )}
    </div>
  );
}
