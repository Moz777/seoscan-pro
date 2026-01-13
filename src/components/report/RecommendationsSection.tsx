"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertCircle,
  AlertTriangle,
  Info,
  Zap,
  Clock,
  Wrench,
  CheckCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ReportData } from "@/lib/mock-data/reports";

interface RecommendationsSectionProps {
  report: ReportData;
}

const priorityConfig = {
  critical: {
    label: "Critical",
    icon: <AlertCircle className="h-4 w-4" />,
    className: "bg-red-100 text-red-800 border-red-200",
    bgColor: "bg-red-50",
    borderColor: "border-red-100",
  },
  high: {
    label: "High",
    icon: <AlertTriangle className="h-4 w-4" />,
    className: "bg-orange-100 text-orange-800 border-orange-200",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-100",
  },
  medium: {
    label: "Medium",
    icon: <AlertTriangle className="h-4 w-4" />,
    className: "bg-yellow-100 text-yellow-800 border-yellow-200",
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-100",
  },
  low: {
    label: "Low",
    icon: <Info className="h-4 w-4" />,
    className: "bg-blue-100 text-blue-800 border-blue-200",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-100",
  },
};

const effortConfig = {
  quick: {
    label: "Quick Fix",
    icon: <Zap className="h-3 w-3" />,
    className: "bg-green-100 text-green-700",
  },
  medium: {
    label: "Medium Effort",
    icon: <Clock className="h-3 w-3" />,
    className: "bg-yellow-100 text-yellow-700",
  },
  complex: {
    label: "Complex",
    icon: <Wrench className="h-3 w-3" />,
    className: "bg-purple-100 text-purple-700",
  },
};

export function RecommendationsSection({ report }: RecommendationsSectionProps) {
  const { recommendations } = report;

  // Group by priority
  const groupedRecommendations = {
    critical: recommendations.filter((r) => r.priority === "critical"),
    high: recommendations.filter((r) => r.priority === "high"),
    medium: recommendations.filter((r) => r.priority === "medium"),
    low: recommendations.filter((r) => r.priority === "low"),
  };

  return (
    <div className="space-y-6">
      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Action Plan Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 rounded-lg bg-red-50 border border-red-100">
              <p className="text-3xl font-bold text-red-600">
                {groupedRecommendations.critical.length}
              </p>
              <p className="text-sm text-red-600/70">Critical</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-orange-50 border border-orange-100">
              <p className="text-3xl font-bold text-orange-600">
                {groupedRecommendations.high.length}
              </p>
              <p className="text-sm text-orange-600/70">High Priority</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-yellow-50 border border-yellow-100">
              <p className="text-3xl font-bold text-yellow-600">
                {groupedRecommendations.medium.length}
              </p>
              <p className="text-sm text-yellow-600/70">Medium Priority</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-blue-50 border border-blue-100">
              <p className="text-3xl font-bold text-blue-600">
                {groupedRecommendations.low.length}
              </p>
              <p className="text-sm text-blue-600/70">Low Priority</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Wins */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Zap className="h-5 w-5 text-green-600" />
            Quick Wins
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            These high-impact fixes can be implemented quickly:
          </p>
          <div className="space-y-3">
            {recommendations
              .filter((r) => r.effort === "quick" && r.priority !== "low")
              .map((rec, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-3 rounded-lg bg-green-50 border border-green-100"
                >
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium">{rec.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {rec.description}
                    </p>
                    <p className="text-xs text-green-600 mt-1">{rec.impact}</p>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* All Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">All Recommendations</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            {recommendations.map((rec, i) => {
              const priority = priorityConfig[rec.priority];
              const effort = effortConfig[rec.effort];

              return (
                <div key={i} className="p-4 hover:bg-muted/50">
                  <div className="flex items-start gap-4">
                    <div
                      className={cn(
                        "flex items-center justify-center w-8 h-8 rounded-full",
                        priority.bgColor
                      )}
                    >
                      <span className="text-sm font-bold">{i + 1}</span>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <Badge
                          variant="outline"
                          className={cn("gap-1", priority.className)}
                        >
                          {priority.icon}
                          {priority.label}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {rec.category}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={cn("gap-1 text-xs", effort.className)}
                        >
                          {effort.icon}
                          {effort.label}
                        </Badge>
                      </div>

                      <h4 className="font-medium">{rec.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {rec.description}
                      </p>
                      <p className="text-xs text-primary mt-2">{rec.impact}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
