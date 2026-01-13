import { NextRequest, NextResponse } from "next/server";
import { getAudit, updateAudit } from "@/lib/services/audit-store";
import { runFullAnalysis, PageSpeedResult } from "@/lib/services/pagespeed";
import { analyzeHTML, HTMLAnalysisResult } from "@/lib/services/html-analyzer";

interface RouteParams {
  params: Promise<{ auditId: string }>;
}

// Calculate content score from HTML analysis
function calculateContentScore(htmlAnalysis: HTMLAnalysisResult | null): number {
  if (!htmlAnalysis) return 50;

  let score = 100;
  const meta = htmlAnalysis.metaTags;
  const headings = htmlAnalysis.headings;
  const images = htmlAnalysis.images;

  // Meta tag penalties
  if (!meta.title) score -= 15;
  else if (meta.titleLength < 30 || meta.titleLength > 60) score -= 5;

  if (!meta.description) score -= 15;
  else if (meta.descriptionLength < 70 || meta.descriptionLength > 160) score -= 5;

  if (!meta.canonical) score -= 5;
  if (!meta.viewport) score -= 10;
  if (!meta.language) score -= 3;

  // Open Graph
  if (!meta.ogTitle || !meta.ogDescription || !meta.ogImage) score -= 5;

  // Heading penalties
  if (headings.h1.length === 0) score -= 15;
  else if (headings.h1.length > 1) score -= 5;

  headings.issues.forEach((issue) => {
    if (issue.severity === "critical") score -= 5;
    else if (issue.severity === "warning") score -= 2;
  });

  // Image penalties
  if (images.total > 0) {
    const altPercentage = (images.withAlt / images.total) * 100;
    if (altPercentage < 50) score -= 10;
    else if (altPercentage < 90) score -= 5;
  }

  return Math.max(0, Math.min(100, score));
}

// Convert PageSpeed results to our report format
function mapPageSpeedToReport(
  mobile: PageSpeedResult,
  desktop: PageSpeedResult,
  htmlAnalysis: HTMLAnalysisResult | null
) {
  // Calculate overall scores (weighted average)
  const mobileWeight = 0.6; // Mobile is more important for SEO
  const desktopWeight = 0.4;

  const performanceScore = Math.round(
    mobile.scores.performance * mobileWeight +
    desktop.scores.performance * desktopWeight
  );

  const seoScore = Math.round(
    mobile.scores.seo * mobileWeight +
    desktop.scores.seo * desktopWeight
  );

  const accessibilityScore = Math.round(
    mobile.scores.accessibility * mobileWeight +
    desktop.scores.accessibility * desktopWeight
  );

  const bestPracticesScore = Math.round(
    mobile.scores.bestPractices * mobileWeight +
    desktop.scores.bestPractices * desktopWeight
  );

  // Calculate content score from HTML analysis
  const contentScore = htmlAnalysis
    ? calculateContentScore(htmlAnalysis)
    : Math.round((seoScore + accessibilityScore) / 2);

  // Overall score is weighted combination
  const overallScore = Math.round(
    performanceScore * 0.25 +
    seoScore * 0.25 +
    contentScore * 0.25 +
    bestPracticesScore * 0.25
  );

  // Count issues from PageSpeed
  let criticalCount =
    mobile.audits.failed.filter(a => a.score === 0).length +
    desktop.audits.failed.filter(a => a.score === 0).length;

  let warningsCount =
    mobile.audits.failed.filter(a => a.score !== null && a.score > 0 && a.score < 0.5).length +
    desktop.audits.failed.filter(a => a.score !== null && a.score > 0 && a.score < 0.5).length;

  let opportunitiesCount =
    mobile.audits.opportunities.length +
    desktop.audits.opportunities.length;

  // Add issues from HTML analysis
  if (htmlAnalysis) {
    const allIssues = [
      ...htmlAnalysis.metaTags.issues,
      ...htmlAnalysis.headings.issues,
      ...htmlAnalysis.images.issues,
      ...htmlAnalysis.links.issues,
      ...htmlAnalysis.schema.issues,
    ];

    criticalCount += allIssues.filter((i) => i.severity === "critical").length;
    warningsCount += allIssues.filter((i) => i.severity === "warning").length;
    opportunitiesCount += allIssues.filter((i) => i.severity === "info").length;
  }

  return {
    scores: {
      overall: overallScore,
      technical: seoScore,
      performance: performanceScore,
      content: contentScore,
      mobile: mobile.scores.performance,
      security: bestPracticesScore,
    },
    issuesCount: {
      critical: criticalCount,
      warnings: warningsCount,
      opportunities: opportunitiesCount,
    },
    coreWebVitals: mobile.coreWebVitals,
    pageSpeed: {
      mobile: mobile.scores.performance,
      desktop: desktop.scores.performance,
    },
    resources: mobile.resources,
    metrics: mobile.metrics,
  };
}

// POST /api/audits/[auditId]/run - Run the full SEO analysis
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { auditId } = await params;
    const audit = await getAudit(auditId);

    if (!audit) {
      return NextResponse.json(
        { success: false, error: "Audit not found" },
        { status: 404 }
      );
    }

    // Check if already processing or completed
    if (audit.status === "processing") {
      return NextResponse.json(
        { success: false, error: "Audit is already processing" },
        { status: 400 }
      );
    }

    if (audit.status === "completed") {
      return NextResponse.json(
        { success: false, error: "Audit is already completed" },
        { status: 400 }
      );
    }

    // Update status to processing
    await updateAudit(auditId, { status: "processing" });

    try {
      // Run PageSpeed and HTML analysis in parallel
      const [pageSpeedResults, htmlAnalysis] = await Promise.all([
        runFullAnalysis(audit.websiteUrl),
        analyzeHTML(audit.websiteUrl).catch((err) => {
          console.warn("HTML analysis failed:", err.message);
          return null;
        }),
      ]);

      const { mobile, desktop } = pageSpeedResults;

      // Map results to our report format (now includes HTML analysis)
      const reportData = mapPageSpeedToReport(mobile, desktop, htmlAnalysis);

      // Update audit with results
      const updatedAudit = await updateAudit(auditId, {
        status: "completed",
        completedAt: new Date(),
        pagesScanned: 1,
        scores: reportData.scores,
        issuesCount: reportData.issuesCount,
        pageSpeedResults: { mobile, desktop },
        htmlAnalysis,
      });

      return NextResponse.json({
        success: true,
        data: {
          audit: updatedAudit,
          report: {
            ...reportData,
            mobileResults: mobile,
            desktopResults: desktop,
            htmlAnalysis,
          },
        },
      });
    } catch (analysisError: any) {
      // Update audit with error status
      await updateAudit(auditId, {
        status: "failed",
        error: analysisError.message,
      });

      return NextResponse.json(
        {
          success: false,
          error: `Analysis failed: ${analysisError.message}`
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
