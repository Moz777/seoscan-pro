"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Check, X, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { ReportData } from "@/lib/mock-data/reports";
import { IssuesTable } from "./IssuesTable";

interface ContentSectionProps {
  report: ReportData;
}

function MetricCard({
  label,
  value,
  status,
}: {
  label: string;
  value: number;
  status: "good" | "warning" | "error";
}) {
  const statusConfig = {
    good: { color: "text-green-600", bg: "bg-green-50", border: "border-green-100" },
    warning: { color: "text-yellow-600", bg: "bg-yellow-50", border: "border-yellow-100" },
    error: { color: "text-red-600", bg: "bg-red-50", border: "border-red-100" },
  };

  const config = statusConfig[status];

  return (
    <div className={cn("p-4 rounded-lg border", config.bg, config.border)}>
      <p className={cn("text-2xl font-bold", config.color)}>{value}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

export function ContentSection({ report }: ContentSectionProps) {
  const { contentData } = report;
  const contentIssues = report.issues.filter((i) => i.category === "content");

  const totalMetaIssues =
    contentData.metaTags.missingTitle +
    contentData.metaTags.missingDescription +
    contentData.metaTags.duplicateTitles +
    contentData.metaTags.duplicateDescriptions;

  const totalHeadingIssues =
    contentData.headings.missingH1 +
    contentData.headings.multipleH1 +
    contentData.headings.skippedLevels;

  const imageOptimizationRate = Math.round(
    ((contentData.images.total - contentData.images.missingAlt) /
      contentData.images.total) *
      100
  );

  return (
    <div className="space-y-6">
      {/* Meta Tags Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Meta Tags Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard
              label="Missing Title"
              value={contentData.metaTags.missingTitle}
              status={contentData.metaTags.missingTitle > 0 ? "error" : "good"}
            />
            <MetricCard
              label="Missing Description"
              value={contentData.metaTags.missingDescription}
              status={
                contentData.metaTags.missingDescription > 0 ? "error" : "good"
              }
            />
            <MetricCard
              label="Duplicate Titles"
              value={contentData.metaTags.duplicateTitles}
              status={
                contentData.metaTags.duplicateTitles > 0 ? "warning" : "good"
              }
            />
            <MetricCard
              label="Duplicate Descriptions"
              value={contentData.metaTags.duplicateDescriptions}
              status={
                contentData.metaTags.duplicateDescriptions > 0
                  ? "warning"
                  : "good"
              }
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <MetricCard
              label="Title Too Long"
              value={contentData.metaTags.titleTooLong}
              status={
                contentData.metaTags.titleTooLong > 0 ? "warning" : "good"
              }
            />
            <MetricCard
              label="Title Too Short"
              value={contentData.metaTags.titleTooShort}
              status={
                contentData.metaTags.titleTooShort > 0 ? "warning" : "good"
              }
            />
            <MetricCard
              label="Description Too Long"
              value={contentData.metaTags.descriptionTooLong}
              status={
                contentData.metaTags.descriptionTooLong > 0 ? "warning" : "good"
              }
            />
            <MetricCard
              label="Description Too Short"
              value={contentData.metaTags.descriptionTooShort}
              status={
                contentData.metaTags.descriptionTooShort > 0 ? "warning" : "good"
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Heading Structure */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Heading Structure</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard
              label="Missing H1"
              value={contentData.headings.missingH1}
              status={contentData.headings.missingH1 > 0 ? "error" : "good"}
            />
            <MetricCard
              label="Multiple H1"
              value={contentData.headings.multipleH1}
              status={contentData.headings.multipleH1 > 0 ? "warning" : "good"}
            />
            <MetricCard
              label="Skipped Levels"
              value={contentData.headings.skippedLevels}
              status={
                contentData.headings.skippedLevels > 0 ? "warning" : "good"
              }
            />
            <MetricCard
              label="Empty Headings"
              value={contentData.headings.emptyHeadings}
              status={
                contentData.headings.emptyHeadings > 0 ? "warning" : "good"
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Image SEO */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Image SEO</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">
                  Images with Alt Text
                </span>
                <span className="text-sm text-muted-foreground">
                  {contentData.images.total - contentData.images.missingAlt} /{" "}
                  {contentData.images.total}
                </span>
              </div>
              <Progress
                value={imageOptimizationRate}
                className={cn(
                  "h-3",
                  imageOptimizationRate >= 80
                    ? "[&>div]:bg-green-500"
                    : imageOptimizationRate >= 60
                      ? "[&>div]:bg-yellow-500"
                      : "[&>div]:bg-red-500"
                )}
              />
              <p className="text-xs text-muted-foreground mt-1">
                {imageOptimizationRate}% of images have alt text
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <MetricCard
                label="Missing Alt Text"
                value={contentData.images.missingAlt}
                status={contentData.images.missingAlt > 0 ? "error" : "good"}
              />
              <MetricCard
                label="Large Images"
                value={contentData.images.largeImages}
                status={contentData.images.largeImages > 0 ? "warning" : "good"}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Links Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Links Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg bg-blue-50 border border-blue-100">
              <p className="text-2xl font-bold text-blue-600">
                {contentData.links.internal}
              </p>
              <p className="text-sm text-blue-600/70">Internal Links</p>
            </div>
            <div className="p-4 rounded-lg bg-purple-50 border border-purple-100">
              <p className="text-2xl font-bold text-purple-600">
                {contentData.links.external}
              </p>
              <p className="text-sm text-purple-600/70">External Links</p>
            </div>
            <MetricCard
              label="Broken Links"
              value={contentData.links.broken}
              status={contentData.links.broken > 0 ? "error" : "good"}
            />
            <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
              <p className="text-2xl font-bold text-gray-600">
                {contentData.links.nofollow}
              </p>
              <p className="text-sm text-gray-600/70">Nofollow Links</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content Issues */}
      <IssuesTable
        issues={contentIssues}
        title="Content Issues"
        showCategory={false}
      />
    </div>
  );
}
