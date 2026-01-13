"use client";

import { useParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ReportHeader,
  OverviewSection,
  TechnicalSection,
  PerformanceSection,
  ContentSection,
  RecommendationsSection,
} from "@/components/report";
import { getReportData } from "@/lib/mock-data";
import { LayoutDashboard, Wrench, Gauge, FileText, ListChecks } from "lucide-react";

export default function AuditReportPage() {
  const params = useParams();
  const auditId = params.auditId as string;
  const report = getReportData(auditId);

  if (!report) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Report not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Report Header */}
      <ReportHeader report={report} />

      {/* Report Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-flex">
          <TabsTrigger value="overview" className="gap-2">
            <LayoutDashboard className="h-4 w-4 hidden sm:block" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="technical" className="gap-2">
            <Wrench className="h-4 w-4 hidden sm:block" />
            Technical
          </TabsTrigger>
          <TabsTrigger value="performance" className="gap-2">
            <Gauge className="h-4 w-4 hidden sm:block" />
            Performance
          </TabsTrigger>
          <TabsTrigger value="content" className="gap-2">
            <FileText className="h-4 w-4 hidden sm:block" />
            Content
          </TabsTrigger>
          <TabsTrigger value="recommendations" className="gap-2">
            <ListChecks className="h-4 w-4 hidden sm:block" />
            Actions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <OverviewSection report={report} />
        </TabsContent>

        <TabsContent value="technical">
          <TechnicalSection report={report} />
        </TabsContent>

        <TabsContent value="performance">
          <PerformanceSection report={report} />
        </TabsContent>

        <TabsContent value="content">
          <ContentSection report={report} />
        </TabsContent>

        <TabsContent value="recommendations">
          <RecommendationsSection report={report} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
