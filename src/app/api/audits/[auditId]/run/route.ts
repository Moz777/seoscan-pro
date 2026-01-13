import { NextRequest, NextResponse } from "next/server";
import { getAudit, updateAudit } from "@/lib/services/audit-store";
import { runFullAnalysis, PageSpeedResult } from "@/lib/services/pagespeed";

interface RouteParams {
  params: Promise<{ auditId: string }>;
}

// Convert PageSpeed results to our report format
function mapPageSpeedToReport(mobile: PageSpeedResult, desktop: PageSpeedResult) {
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

  // Overall score is weighted combination
  const overallScore = Math.round(
    performanceScore * 0.3 +
    seoScore * 0.3 +
    accessibilityScore * 0.2 +
    bestPracticesScore * 0.2
  );

  // Count issues
  const criticalCount =
    mobile.audits.failed.filter(a => a.score === 0).length +
    desktop.audits.failed.filter(a => a.score === 0).length;

  const warningsCount =
    mobile.audits.failed.filter(a => a.score !== null && a.score > 0 && a.score < 0.5).length +
    desktop.audits.failed.filter(a => a.score !== null && a.score > 0 && a.score < 0.5).length;

  const opportunitiesCount =
    mobile.audits.opportunities.length +
    desktop.audits.opportunities.length;

  return {
    scores: {
      overall: overallScore,
      technical: seoScore,
      performance: performanceScore,
      content: Math.round((seoScore + accessibilityScore) / 2),
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

// POST /api/audits/[auditId]/run - Run the PageSpeed analysis
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { auditId } = await params;
    const audit = getAudit(auditId);

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
    updateAudit(auditId, { status: "processing" });

    try {
      // Run PageSpeed analysis for both mobile and desktop
      const { mobile, desktop } = await runFullAnalysis(audit.websiteUrl);

      // Map results to our report format
      const reportData = mapPageSpeedToReport(mobile, desktop);

      // Update audit with results
      const updatedAudit = updateAudit(auditId, {
        status: "completed",
        completedAt: new Date(),
        pagesScanned: 1, // PageSpeed only analyzes single page
        scores: reportData.scores,
        issuesCount: reportData.issuesCount,
        pageSpeedResults: { mobile, desktop },
      });

      return NextResponse.json({
        success: true,
        data: {
          audit: updatedAudit,
          report: {
            ...reportData,
            mobileResults: mobile,
            desktopResults: desktop,
          },
        },
      });
    } catch (analysisError: any) {
      // Update audit with error status
      updateAudit(auditId, {
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
