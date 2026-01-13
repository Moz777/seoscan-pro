"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FileSearch,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

function StatCard({
  title,
  value,
  description,
  icon,
  trend,
  className,
}: StatCardProps) {
  return (
    <Card className={cn("", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
        {trend && (
          <div
            className={cn(
              "flex items-center gap-1 text-xs mt-2",
              trend.isPositive ? "text-green-600" : "text-red-600"
            )}
          >
            <TrendingUp
              className={cn("h-3 w-3", !trend.isPositive && "rotate-180")}
            />
            <span>
              {trend.isPositive ? "+" : ""}
              {trend.value}% from last month
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface StatsCardsProps {
  stats: {
    totalAudits: number;
    completedAudits: number;
    averageScore: number;
    criticalIssuesFound: number;
    totalPagesScanned: number;
  };
}

export function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Audits"
        value={stats.totalAudits}
        description={`${stats.completedAudits} completed`}
        icon={<FileSearch className="h-4 w-4" />}
        trend={{ value: 12, isPositive: true }}
      />
      <StatCard
        title="Average Score"
        value={`${stats.averageScore}/100`}
        description="Across all audits"
        icon={<TrendingUp className="h-4 w-4" />}
        trend={{ value: 5, isPositive: true }}
      />
      <StatCard
        title="Critical Issues"
        value={stats.criticalIssuesFound}
        description="Needs immediate attention"
        icon={<AlertTriangle className="h-4 w-4" />}
        trend={{ value: 8, isPositive: false }}
      />
      <StatCard
        title="Pages Scanned"
        value={stats.totalPagesScanned.toLocaleString()}
        description="Total pages analyzed"
        icon={<CheckCircle className="h-4 w-4" />}
      />
    </div>
  );
}
