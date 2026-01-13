"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScoreGauge } from "./ScoreGauge";
import { cn } from "@/lib/utils";
import { ReportData } from "@/lib/mock-data/reports";
import { IssuesTable } from "./IssuesTable";

interface PerformanceSectionProps {
  report: ReportData;
}

function CoreWebVitalCard({
  name,
  value,
  unit,
  rating,
  threshold,
}: {
  name: string;
  value: number;
  unit: string;
  rating: "good" | "needs-improvement" | "poor";
  threshold: { good: string; poor: string };
}) {
  const ratingColors = {
    good: "bg-green-100 text-green-800 border-green-200",
    "needs-improvement": "bg-yellow-100 text-yellow-800 border-yellow-200",
    poor: "bg-red-100 text-red-800 border-red-200",
  };

  const ratingLabels = {
    good: "Good",
    "needs-improvement": "Needs Improvement",
    poor: "Poor",
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="text-center">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">
            {name}
          </h3>
          <p className="text-3xl font-bold mb-2">
            {value}
            <span className="text-lg text-muted-foreground">{unit}</span>
          </p>
          <Badge variant="outline" className={cn(ratingColors[rating])}>
            {ratingLabels[rating]}
          </Badge>
          <div className="mt-4 text-xs text-muted-foreground">
            <p>Good: {threshold.good}</p>
            <p>Poor: {threshold.poor}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ResourceBar({
  label,
  size,
  total,
  color,
}: {
  label: string;
  size: number;
  total: number;
  color: string;
}) {
  const percentage = (size / total) * 100;

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm">
        <span>{label}</span>
        <span className="text-muted-foreground">{size.toFixed(2)} MB</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div
          className={cn("h-full rounded-full", color)}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

export function PerformanceSection({ report }: PerformanceSectionProps) {
  const { performanceData } = report;
  const performanceIssues = report.issues.filter(
    (i) => i.category === "performance"
  );

  return (
    <div className="space-y-6">
      {/* Core Web Vitals */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Core Web Vitals</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <CoreWebVitalCard
            name="Largest Contentful Paint (LCP)"
            value={performanceData.coreWebVitals.lcp.value}
            unit="s"
            rating={performanceData.coreWebVitals.lcp.rating}
            threshold={{ good: "≤ 2.5s", poor: "> 4.0s" }}
          />
          <CoreWebVitalCard
            name="First Input Delay (FID)"
            value={performanceData.coreWebVitals.fid.value}
            unit="ms"
            rating={performanceData.coreWebVitals.fid.rating}
            threshold={{ good: "≤ 100ms", poor: "> 300ms" }}
          />
          <CoreWebVitalCard
            name="Cumulative Layout Shift (CLS)"
            value={performanceData.coreWebVitals.cls.value}
            unit=""
            rating={performanceData.coreWebVitals.cls.rating}
            threshold={{ good: "≤ 0.1", poor: "> 0.25" }}
          />
        </div>
      </div>

      {/* PageSpeed Scores */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">PageSpeed Scores</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center gap-16">
            <ScoreGauge
              score={performanceData.pageSpeed.desktop}
              size="md"
              label="Desktop"
            />
            <ScoreGauge
              score={performanceData.pageSpeed.mobile}
              size="md"
              label="Mobile"
            />
          </div>
        </CardContent>
      </Card>

      {/* Resource Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Resource Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <span className="font-medium">Total Page Size</span>
            <span className="text-2xl font-bold">
              {performanceData.resources.totalSize.toFixed(2)} MB
            </span>
          </div>

          <ResourceBar
            label="JavaScript"
            size={performanceData.resources.jsSize}
            total={performanceData.resources.totalSize}
            color="bg-yellow-500"
          />
          <ResourceBar
            label="Images"
            size={performanceData.resources.imageSize}
            total={performanceData.resources.totalSize}
            color="bg-blue-500"
          />
          <ResourceBar
            label="CSS"
            size={performanceData.resources.cssSize}
            total={performanceData.resources.totalSize}
            color="bg-purple-500"
          />
          <ResourceBar
            label="HTML"
            size={performanceData.resources.htmlSize}
            total={performanceData.resources.totalSize}
            color="bg-green-500"
          />
          <ResourceBar
            label="Fonts"
            size={performanceData.resources.fontSize}
            total={performanceData.resources.totalSize}
            color="bg-pink-500"
          />
        </CardContent>
      </Card>

      {/* Performance Issues */}
      <IssuesTable
        issues={performanceIssues}
        title="Performance Issues"
        showCategory={false}
      />
    </div>
  );
}
