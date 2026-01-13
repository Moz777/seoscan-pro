"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Check, X, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { ReportData } from "@/lib/mock-data/reports";
import { IssuesTable } from "./IssuesTable";

interface TechnicalSectionProps {
  report: ReportData;
}

function StatusIndicator({ passed }: { passed: boolean }) {
  return passed ? (
    <div className="flex items-center gap-1 text-green-600">
      <Check className="h-4 w-4" />
      <span className="text-sm">Passed</span>
    </div>
  ) : (
    <div className="flex items-center gap-1 text-red-600">
      <X className="h-4 w-4" />
      <span className="text-sm">Failed</span>
    </div>
  );
}

function ScoreBar({ score, label }: { score: number; label: string }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{label}</span>
        <span
          className={cn(
            "text-sm font-bold",
            score >= 80
              ? "text-green-600"
              : score >= 60
                ? "text-yellow-600"
                : "text-red-600"
          )}
        >
          {score}%
        </span>
      </div>
      <Progress
        value={score}
        className={cn(
          "h-2",
          score >= 80
            ? "[&>div]:bg-green-500"
            : score >= 60
              ? "[&>div]:bg-yellow-500"
              : "[&>div]:bg-red-500"
        )}
      />
    </div>
  );
}

export function TechnicalSection({ report }: TechnicalSectionProps) {
  const { technicalData } = report;
  const technicalIssues = report.issues.filter(
    (i) => i.category === "technical"
  );

  return (
    <div className="space-y-6">
      {/* Score Overview */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Crawlability</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ScoreBar
              score={technicalData.crawlability.score}
              label="Crawlability Score"
            />
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">robots.txt</span>
                <StatusIndicator passed={technicalData.crawlability.robotsTxt} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">XML Sitemap</span>
                <StatusIndicator passed={technicalData.crawlability.sitemap} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Blocked Resources</span>
                <Badge
                  variant={
                    technicalData.crawlability.blockedResources > 0
                      ? "destructive"
                      : "secondary"
                  }
                >
                  {technicalData.crawlability.blockedResources}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Crawl Errors</span>
                <Badge
                  variant={
                    technicalData.crawlability.crawlErrors > 0
                      ? "destructive"
                      : "secondary"
                  }
                >
                  {technicalData.crawlability.crawlErrors}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Indexability</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ScoreBar
              score={technicalData.indexability.score}
              label="Indexability Score"
            />
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Indexable Pages</span>
                <Badge variant="secondary">
                  {technicalData.indexability.indexablePages}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">NoIndex Pages</span>
                <Badge variant="outline">
                  {technicalData.indexability.noIndexPages}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Canonical Issues</span>
                <Badge
                  variant={
                    technicalData.indexability.canonicalIssues > 0
                      ? "destructive"
                      : "secondary"
                  }
                >
                  {technicalData.indexability.canonicalIssues}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Duplicate Content</span>
                <Badge
                  variant={
                    technicalData.indexability.duplicateContent > 0
                      ? "destructive"
                      : "secondary"
                  }
                >
                  {technicalData.indexability.duplicateContent}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* HTTP Status Codes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">HTTP Status Codes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 rounded-lg bg-green-50 border border-green-100">
              <p className="text-3xl font-bold text-green-600">
                {technicalData.httpStatus.status200}
              </p>
              <p className="text-sm text-green-600/70">200 OK</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-blue-50 border border-blue-100">
              <p className="text-3xl font-bold text-blue-600">
                {technicalData.httpStatus.status301}
              </p>
              <p className="text-sm text-blue-600/70">301 Redirect</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-yellow-50 border border-yellow-100">
              <p className="text-3xl font-bold text-yellow-600">
                {technicalData.httpStatus.status404}
              </p>
              <p className="text-sm text-yellow-600/70">404 Not Found</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-red-50 border border-red-100">
              <p className="text-3xl font-bold text-red-600">
                {technicalData.httpStatus.status500}
              </p>
              <p className="text-sm text-red-600/70">500 Server Error</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Structured Data */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Structured Data</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm">Schema.org Markup</span>
            <StatusIndicator passed={technicalData.structuredData.hasSchema} />
          </div>
          {technicalData.structuredData.hasSchema && (
            <>
              <div className="flex flex-wrap gap-2 mb-4">
                {technicalData.structuredData.schemaTypes.map((type) => (
                  <Badge key={type} variant="secondary">
                    {type}
                  </Badge>
                ))}
              </div>
              {technicalData.structuredData.errors > 0 && (
                <div className="flex items-center gap-2 text-yellow-600">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="text-sm">
                    {technicalData.structuredData.errors} validation errors
                    found
                  </span>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Technical Issues */}
      <IssuesTable
        issues={technicalIssues}
        title="Technical Issues"
        showCategory={false}
      />
    </div>
  );
}
