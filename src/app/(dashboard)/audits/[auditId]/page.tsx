"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ReportHeader,
  OverviewSection,
  TechnicalSection,
  PerformanceSection,
  ContentSection,
  RecommendationsSection,
} from "@/components/report";
import { getReportData, ReportData } from "@/lib/mock-data";
import { LayoutDashboard, Wrench, Gauge, FileText, ListChecks, Loader2 } from "lucide-react";

export default function AuditReportPage() {
  const params = useParams();
  const auditId = params.auditId as string;
  const [report, setReport] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchReport() {
      setLoading(true);
      setError(null);

      try {
        // First try to fetch from API (real audit)
        const response = await fetch(`/api/audits/${auditId}/report`);
        const result = await response.json();

        if (result.success && result.data) {
          setReport(result.data);
        } else {
          // Fall back to mock data for demo audits
          const mockReport = getReportData(auditId);
          if (mockReport) {
            setReport(mockReport);
          } else {
            setError(result.error || "Report not found");
          }
        }
      } catch (err) {
        // Fall back to mock data on network error
        const mockReport = getReportData(auditId);
        if (mockReport) {
          setReport(mockReport);
        } else {
          setError("Failed to load report");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchReport();
  }, [auditId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading report...</p>
        </div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">{error || "Report not found"}</p>
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
