import { NextRequest, NextResponse } from "next/server";
import { getAudit, StoredAudit } from "@/lib/services/audit-store";
import { ReportData } from "@/lib/mock-data/reports";
import { Issue } from "@/lib/types";

interface RouteParams {
  params: Promise<{ auditId: string }>;
}

// Convert stored audit with PageSpeed and HTML analysis results to ReportData format
function auditToReportData(audit: StoredAudit): ReportData | null {
  if (audit.status !== "completed" || !audit.pageSpeedResults) {
    return null;
  }

  const mobile = audit.pageSpeedResults.mobile;
  const desktop = audit.pageSpeedResults.desktop;
  const htmlAnalysis = audit.htmlAnalysis;

  if (!mobile || !desktop) {
    return null;
  }

  // Convert PageSpeed audits to issues
  const issues: Issue[] = [];

  // Add failed audits as issues
  const addPageSpeedIssues = (audits: any[], category: "performance" | "technical" | "content" | "security") => {
    audits.forEach((psAudit, index) => {
      if (psAudit.score !== 1 && psAudit.title) {
        const impact = psAudit.score === 0 ? "critical" :
                       psAudit.score !== null && psAudit.score < 0.5 ? "high" :
                       psAudit.score !== null && psAudit.score < 0.9 ? "medium" : "low";

        issues.push({
          id: `iss_${category}_${index}`,
          category,
          type: psAudit.id || "general",
          title: psAudit.title,
          description: psAudit.description || "",
          affectedPages: 1,
          impact,
          effort: psAudit.numericValue && psAudit.numericValue > 1000 ? "medium" : "quick",
          recommendation: psAudit.description || "Review and fix this issue to improve your score.",
          exampleUrls: [audit.websiteUrl],
        });
      }
    });
  };

  addPageSpeedIssues(mobile.audits.failed || [], "performance");
  addPageSpeedIssues(mobile.audits.opportunities || [], "performance");

  // Add HTML analysis issues
  if (htmlAnalysis) {
    // Meta tag issues
    htmlAnalysis.metaTags.issues.forEach((issue: any, i: number) => {
      issues.push({
        id: `iss_meta_${i}`,
        category: "content",
        type: issue.field,
        title: issue.message,
        description: issue.message,
        affectedPages: 1,
        impact: issue.severity === "critical" ? "critical" : issue.severity === "warning" ? "high" : "medium",
        effort: "quick",
        recommendation: `Fix the ${issue.field} issue to improve SEO.`,
        exampleUrls: [audit.websiteUrl],
      });
    });

    // Heading issues
    htmlAnalysis.headings.issues.forEach((issue: any, i: number) => {
      issues.push({
        id: `iss_heading_${i}`,
        category: "content",
        type: issue.type,
        title: issue.message,
        description: issue.message,
        affectedPages: 1,
        impact: issue.severity === "critical" ? "critical" : issue.severity === "warning" ? "high" : "medium",
        effort: "quick",
        recommendation: "Fix heading structure for better SEO and accessibility.",
        exampleUrls: [audit.websiteUrl],
      });
    });

    // Image issues (limit to first 10)
    htmlAnalysis.images.issues.slice(0, 10).forEach((issue: any, i: number) => {
      issues.push({
        id: `iss_img_${i}`,
        category: "content",
        type: issue.type,
        title: issue.message,
        description: `Image: ${issue.src.substring(0, 50)}...`,
        affectedPages: 1,
        impact: issue.severity === "critical" ? "critical" : "high",
        effort: "quick",
        recommendation: "Add alt text to images for accessibility and SEO.",
        exampleUrls: [issue.src],
      });
    });

    // Link issues (limit to first 5)
    htmlAnalysis.links.issues.slice(0, 5).forEach((issue: any, i: number) => {
      issues.push({
        id: `iss_link_${i}`,
        category: "technical",
        type: issue.type,
        title: issue.message,
        description: issue.href ? `Link: ${issue.href.substring(0, 50)}...` : issue.message,
        affectedPages: 1,
        impact: issue.severity === "critical" ? "critical" : "medium",
        effort: "quick",
        recommendation: "Fix link issues for better user experience and crawlability.",
        exampleUrls: issue.href ? [issue.href] : [audit.websiteUrl],
      });
    });

    // Schema issues
    htmlAnalysis.schema.issues.forEach((issue: any, i: number) => {
      issues.push({
        id: `iss_schema_${i}`,
        category: "technical",
        type: issue.type,
        title: issue.message,
        description: issue.message,
        affectedPages: 1,
        impact: issue.severity === "critical" ? "critical" : "medium",
        effort: "medium",
        recommendation: "Add structured data to improve search result appearance.",
        exampleUrls: [audit.websiteUrl],
      });
    });
  }

  // Extract content data from HTML analysis
  const metaData = htmlAnalysis?.metaTags;
  const headingsData = htmlAnalysis?.headings;
  const imagesData = htmlAnalysis?.images;
  const linksData = htmlAnalysis?.links;
  const schemaData = htmlAnalysis?.schema;

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
        noIndexPages: metaData?.robots?.includes("noindex") ? 1 : 0,
        canonicalIssues: metaData?.canonical ? 0 : 1,
        duplicateContent: 0,
      },
      httpStatus: {
        status200: htmlAnalysis?.statusCode === 200 ? 1 : 0,
        status301: 0,
        status404: 0,
        status500: 0,
      },
      structuredData: {
        hasSchema: schemaData?.hasSchema || false,
        schemaTypes: schemaData?.schemas?.map((s: any) => s.type) || [],
        errors: schemaData?.issues?.filter((i: any) => i.type === "invalid_json").length || 0,
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
        missingTitle: metaData?.title ? 0 : 1,
        missingDescription: metaData?.description ? 0 : 1,
        duplicateTitles: 0,
        duplicateDescriptions: 0,
        titleTooLong: metaData?.titleLength > 60 ? 1 : 0,
        titleTooShort: metaData?.titleLength < 30 && metaData?.titleLength > 0 ? 1 : 0,
        descriptionTooLong: metaData?.descriptionLength > 160 ? 1 : 0,
        descriptionTooShort: metaData?.descriptionLength < 70 && metaData?.descriptionLength > 0 ? 1 : 0,
      },
      headings: {
        missingH1: headingsData?.h1?.length === 0 ? 1 : 0,
        multipleH1: headingsData?.h1?.length > 1 ? 1 : 0,
        skippedLevels: headingsData?.issues?.filter((i: any) => i.type === "skipped_level").length || 0,
        emptyHeadings: headingsData?.issues?.filter((i: any) => i.type === "empty_heading").length || 0,
      },
      images: {
        total: imagesData?.total || 0,
        missingAlt: imagesData?.withoutAlt || 0,
        largeImages: 0,
        unoptimized: 0,
      },
      links: {
        internal: linksData?.internalCount || 0,
        external: linksData?.externalCount || 0,
        broken: linksData?.brokenPatterns?.length || 0,
        nofollow: linksData?.nofollow?.length || 0,
      },
    },
    recommendations: issues.slice(0, 8).map((issue) => ({
      priority: issue.impact,
      category: issue.category.charAt(0).toUpperCase() + issue.category.slice(1),
      title: issue.title,
      description: issue.description,
      impact: `${issue.impact === "critical" ? "High" : issue.impact === "high" ? "Medium" : "Low"} - Affects user experience and SEO`,
      effort: issue.effort,
    })),
    // Add raw HTML analysis data for detailed views
    htmlAnalysis: htmlAnalysis || null,
  };

  return reportData;
}

// GET /api/audits/[auditId]/report - Get formatted report data
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { auditId } = await params;
    const audit = await getAudit(auditId);

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
