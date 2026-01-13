"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertCircle,
  AlertTriangle,
  Lightbulb,
  FileSearch,
  Clock,
  Smartphone,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ReportData } from "@/lib/mock-data/reports";
import { IssuesTable } from "./IssuesTable";

interface OverviewSectionProps {
  report: ReportData;
}

export function OverviewSection({ report }: OverviewSectionProps) {
  const criticalIssues = report.issues.filter((i) => i.impact === "critical");
  const highIssues = report.issues.filter((i) => i.impact === "high");

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-blue-100 text-blue-600">
                <FileSearch className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pages Scanned</p>
                <p className="text-2xl font-bold">
                  {report.summary.pagesScanned}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-red-100 text-red-600">
                <AlertCircle className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Critical Issues</p>
                <p className="text-2xl font-bold">
                  {report.summary.criticalIssues}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-yellow-100 text-yellow-600">
                <Clock className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg Load Time</p>
                <p className="text-2xl font-bold">
                  {report.summary.averageLoadTime}s
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-green-100 text-green-600">
                <Smartphone className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Mobile Score</p>
                <p className="text-2xl font-bold">
                  {report.summary.mobileScore}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Issue Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Issue Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex items-center gap-4 p-4 rounded-lg bg-red-50 border border-red-100">
              <AlertCircle className="h-8 w-8 text-red-600" />
              <div>
                <p className="text-3xl font-bold text-red-600">
                  {report.summary.criticalIssues}
                </p>
                <p className="text-sm text-red-600/70">Critical Issues</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-lg bg-yellow-50 border border-yellow-100">
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
              <div>
                <p className="text-3xl font-bold text-yellow-600">
                  {report.summary.warningIssues}
                </p>
                <p className="text-sm text-yellow-600/70">Warnings</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-lg bg-blue-50 border border-blue-100">
              <Lightbulb className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-3xl font-bold text-blue-600">
                  {report.summary.opportunities}
                </p>
                <p className="text-sm text-blue-600/70">Opportunities</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top Issues */}
      <IssuesTable
        issues={[...criticalIssues, ...highIssues].slice(0, 5)}
        title="Top Priority Issues"
      />
    </div>
  );
}
