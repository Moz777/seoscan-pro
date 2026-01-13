import { NextRequest, NextResponse } from "next/server";
import { getAudit, StoredAudit } from "@/lib/services/audit-store";
import { ReportData } from "@/lib/mock-data/reports";
import { Issue } from "@/lib/types";

interface RouteParams {
  params: Promise<{ auditId: string }>;
}

// Convert stored audit with PageSpeed results to ReportData format
function auditToReportData(audit: StoredAudit): ReportData | null {
  if (audit.status !== "completed" || !audit.pageSpeedResults) {
    return null;
  }

  const mobile = audit.pageSpeedResults.mobile;
  const desktop = audit.pageSpeedResults.desktop;

  if (!mobile || !desktop) {
    return null;
  }

  // Convert PageSpeed audits to issues
  const issues: Issue[] = [];

  // Add failed audits as issues
  const addIssues = (audits: any[], category: "performance" | "technical" | "content" | "security") => {
    audits.forEach((audit, index) => {
      if (audit.score !== 1 && audit.title) {
        const impact = audit.score === 0 ? "critical" :
                       audit.score !== null && audit.score < 0.5 ? "high" :
                       audit.score !== null && audit.score < 0.9 ? "medium" : "low";

        issues.push({
          id: `iss_${category}_${index}`,
          category,
          type: audit.id || "general",
          title: audit.title,
          description: audit.description || "",
          affectedPages: 1,
          impact,
          effort: audit.numericValue && audit.numericValue > 1000 ? "medium" : "quick",
          recommendation: audit.description || "Review and fix this issue to improve your score.",
          exampleUrls: [audit.websiteUrl],
        });
      }
    });
  };

  addIssues(mobile.audits.failed || [], "performance");
  addIssues(mobile.audits.opportunities || [], "performance");

  // Build report data
  const reportData: ReportData = {
    id: `rep_${audit.id}`,
    auditId: audit.id,
    websiteUrl: audit.websiteUrl,
    displayName: audit.displayName,
    tier: audit.tier,
    generatedAt: audit.completedAt || new Date(),
    scores: audit.scores,
    summary: {
      pagesScanned: audit.pagesScanned || 1,
      issuesFound: issues.length,
      criticalIssues: audit.issuesCount.critical,
      warningIssues: audit.issuesCount.warnings,
      opportunities: audit.issuesCount.opportunities,
      averageLoadTime: mobile.metrics?.largestContentfulPaint || 0,
      mobileScore: mobile.scores?.performance || 0,
    },
    issues,
    technicalData: {
      crawlability: {
        score: Math.round((audit.scores.technical + audit.scores.security) / 2),
        robotsTxt: true,
        sitemap: true,
        blockedResources: 0,
        crawlErrors: 0,
      },
      indexability: {
        score: audit.scores.technical,
        indexablePages: 1,
        noIndexPages: 0,
        canonicalIssues: 0,
        duplicateContent: 0,
      },
      httpStatus: {
        status200: 1,
        status301: 0,
        status404: 0,
        status500: 0,
      },
      structuredData: {
        hasSchema: true,
        schemaTypes: ["WebSite"],
        errors: 0,
      },
    },
    performanceData: {
      coreWebVitals: mobile.coreWebVitals,
      pageSpeed: {
        desktop: desktop.scores?.performance || 0,
        mobile: mobile.scores?.performance || 0,
      },
      resources: mobile.resources || {
        totalSize: 0,
        htmlSize: 0,
        cssSize: 0,
        jsSize: 0,
        imageSize: 0,
        fontSize: 0,
      },
    },
    contentData: {
      metaTags: {
        missingTitle: 0,
        missingDescription: 0,
        duplicateTitles: 0,
        duplicateDescriptions: 0,
        titleTooLong: 0,
        titleTooShort: 0,
        descriptionTooLong: 0,
        descriptionTooShort: 0,
      },
      headings: {
        missingH1: 0,
        multipleH1: 0,
        skippedLevels: 0,
        emptyHeadings: 0,
      },
      images: {
        total: 0,
        missingAlt: 0,
        largeImages: 0,
        unoptimized: 0,
      },
      links: {
        internal: 0,
        external: 0,
        broken: 0,
        nofollow: 0,
      },
    },
    recommendations: issues.slice(0, 8).map((issue, i) => ({
      priority: issue.impact,
      category: issue.category.charAt(0).toUpperCase() + issue.category.slice(1),
      title: issue.title,
      description: issue.description,
      impact: `${issue.impact === "critical" ? "High" : issue.impact === "high" ? "Medium" : "Low"} - Affects user experience and SEO`,
      effort: issue.effort,
    })),
  };

  return reportData;
}

// GET /api/audits/[auditId]/report - Get formatted report data
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { auditId } = await params;
    const audit = getAudit(auditId);

    if (!audit) {
      return NextResponse.json(
        { success: false, error: "Audit not found" },
        { status: 404 }
      );
    }

    if (audit.status !== "completed") {
      return NextResponse.json(
        { success: false, error: "Audit not yet completed", status: audit.status },
        { status: 400 }
      );
    }

    const reportData = auditToReportData(audit);

    if (!reportData) {
      return NextResponse.json(
        { success: false, error: "Report data not available" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: reportData,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
