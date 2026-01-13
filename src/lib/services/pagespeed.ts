/**
 * Google PageSpeed Insights API Service
 * Free tier: ~25 requests/day without API key
 * Docs: https://developers.google.com/speed/docs/insights/v5/get-started
 */

const PAGESPEED_API_URL = "https://www.googleapis.com/pagespeedonline/v5/runPagespeed";

export interface PageSpeedRequest {
  url: string;
  strategy?: "mobile" | "desktop";
  categories?: ("performance" | "accessibility" | "best-practices" | "seo")[];
}

export interface LighthouseAudit {
  id: string;
  title: string;
  description: string;
  score: number | null;
  scoreDisplayMode: string;
  displayValue?: string;
  numericValue?: number;
  numericUnit?: string;
}

export interface PageSpeedResult {
  url: string;
  strategy: "mobile" | "desktop";
  fetchTime: string;
  scores: {
    performance: number;
    accessibility: number;
    bestPractices: number;
    seo: number;
  };
  coreWebVitals: {
    lcp: { value: number; rating: "good" | "needs-improvement" | "poor" };
    fid: { value: number; rating: "good" | "needs-improvement" | "poor" };
    cls: { value: number; rating: "good" | "needs-improvement" | "poor" };
    fcp: { value: number; rating: "good" | "needs-improvement" | "poor" };
    ttfb: { value: number; rating: "good" | "needs-improvement" | "poor" };
  };
  metrics: {
    firstContentfulPaint: number;
    largestContentfulPaint: number;
    totalBlockingTime: number;
    cumulativeLayoutShift: number;
    speedIndex: number;
    timeToInteractive: number;
  };
  audits: {
    passed: string[];
    failed: LighthouseAudit[];
    opportunities: LighthouseAudit[];
    diagnostics: LighthouseAudit[];
  };
  resources: {
    totalSize: number;
    htmlSize: number;
    cssSize: number;
    jsSize: number;
    imageSize: number;
    fontCount: number;
    thirdPartySize: number;
  };
  rawResponse?: any;
}

function getRating(value: number, thresholds: { good: number; poor: number }): "good" | "needs-improvement" | "poor" {
  if (value <= thresholds.good) return "good";
  if (value <= thresholds.poor) return "needs-improvement";
  return "poor";
}

function bytesToMB(bytes: number): number {
  return Math.round((bytes / 1024 / 1024) * 100) / 100;
}

function msToSeconds(ms: number): number {
  return Math.round((ms / 1000) * 100) / 100;
}

export async function runPageSpeedAnalysis(
  request: PageSpeedRequest
): Promise<PageSpeedResult> {
  const { url, strategy = "mobile", categories = ["performance", "accessibility", "best-practices", "seo"] } = request;

  // Build API URL
  const params = new URLSearchParams({
    url,
    strategy,
    ...Object.fromEntries(categories.map((cat) => ["category", cat])),
  });

  // Add all categories
  const apiUrl = `${PAGESPEED_API_URL}?url=${encodeURIComponent(url)}&strategy=${strategy}&category=performance&category=accessibility&category=best-practices&category=seo`;

  const response = await fetch(apiUrl);

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(
      error.error?.message || `PageSpeed API error: ${response.status}`
    );
  }

  const data = await response.json();

  return parsePageSpeedResponse(data, strategy);
}

function parsePageSpeedResponse(
  data: any,
  strategy: "mobile" | "desktop"
): PageSpeedResult {
  const lighthouse = data.lighthouseResult;
  const categories = lighthouse.categories;
  const audits = lighthouse.audits;

  // Extract scores (0-100)
  const scores = {
    performance: Math.round((categories.performance?.score || 0) * 100),
    accessibility: Math.round((categories.accessibility?.score || 0) * 100),
    bestPractices: Math.round((categories["best-practices"]?.score || 0) * 100),
    seo: Math.round((categories.seo?.score || 0) * 100),
  };

  // Extract Core Web Vitals
  const lcpMs = audits["largest-contentful-paint"]?.numericValue || 0;
  const fidMs = audits["max-potential-fid"]?.numericValue || 0;
  const clsValue = audits["cumulative-layout-shift"]?.numericValue || 0;
  const fcpMs = audits["first-contentful-paint"]?.numericValue || 0;
  const ttfbMs = audits["server-response-time"]?.numericValue || 0;

  const coreWebVitals = {
    lcp: {
      value: msToSeconds(lcpMs),
      rating: getRating(lcpMs, { good: 2500, poor: 4000 }),
    },
    fid: {
      value: Math.round(fidMs),
      rating: getRating(fidMs, { good: 100, poor: 300 }),
    },
    cls: {
      value: Math.round(clsValue * 1000) / 1000,
      rating: getRating(clsValue, { good: 0.1, poor: 0.25 }),
    },
    fcp: {
      value: msToSeconds(fcpMs),
      rating: getRating(fcpMs, { good: 1800, poor: 3000 }),
    },
    ttfb: {
      value: Math.round(ttfbMs),
      rating: getRating(ttfbMs, { good: 800, poor: 1800 }),
    },
  };

  // Extract metrics
  const metrics = {
    firstContentfulPaint: msToSeconds(fcpMs),
    largestContentfulPaint: msToSeconds(lcpMs),
    totalBlockingTime: Math.round(audits["total-blocking-time"]?.numericValue || 0),
    cumulativeLayoutShift: clsValue,
    speedIndex: msToSeconds(audits["speed-index"]?.numericValue || 0),
    timeToInteractive: msToSeconds(audits["interactive"]?.numericValue || 0),
  };

  // Extract resource breakdown
  const resourceSummary = audits["resource-summary"]?.details?.items || [];
  const getResourceSize = (type: string) => {
    const item = resourceSummary.find((r: any) => r.resourceType === type);
    return item?.transferSize || 0;
  };

  const resources = {
    totalSize: bytesToMB(audits["total-byte-weight"]?.numericValue || 0),
    htmlSize: bytesToMB(getResourceSize("document")),
    cssSize: bytesToMB(getResourceSize("stylesheet")),
    jsSize: bytesToMB(getResourceSize("script")),
    imageSize: bytesToMB(getResourceSize("image")),
    fontCount: resourceSummary.find((r: any) => r.resourceType === "font")?.requestCount || 0,
    thirdPartySize: bytesToMB(audits["third-party-summary"]?.details?.summary?.wastedBytes || 0),
  };

  // Categorize audits
  const passedAudits: string[] = [];
  const failedAudits: LighthouseAudit[] = [];
  const opportunities: LighthouseAudit[] = [];
  const diagnostics: LighthouseAudit[] = [];

  for (const [id, audit] of Object.entries(audits) as [string, any][]) {
    if (!audit.title) continue;

    const auditInfo: LighthouseAudit = {
      id,
      title: audit.title,
      description: audit.description || "",
      score: audit.score,
      scoreDisplayMode: audit.scoreDisplayMode,
      displayValue: audit.displayValue,
      numericValue: audit.numericValue,
      numericUnit: audit.numericUnit,
    };

    if (audit.score === 1) {
      passedAudits.push(audit.title);
    } else if (audit.score === 0 || audit.score === null) {
      if (audit.scoreDisplayMode === "opportunity" || audit.details?.type === "opportunity") {
        opportunities.push(auditInfo);
      } else if (audit.scoreDisplayMode === "informative") {
        diagnostics.push(auditInfo);
      } else {
        failedAudits.push(auditInfo);
      }
    } else if (audit.score !== null && audit.score < 0.9) {
      if (audit.details?.overallSavingsMs > 0) {
        opportunities.push(auditInfo);
      } else {
        diagnostics.push(auditInfo);
      }
    }
  }

  return {
    url: data.id,
    strategy,
    fetchTime: lighthouse.fetchTime,
    scores,
    coreWebVitals,
    metrics,
    audits: {
      passed: passedAudits,
      failed: failedAudits,
      opportunities: opportunities.slice(0, 10), // Top 10
      diagnostics: diagnostics.slice(0, 10),
    },
    resources,
    rawResponse: data,
  };
}

export async function runFullAnalysis(url: string): Promise<{
  mobile: PageSpeedResult;
  desktop: PageSpeedResult;
}> {
  // Run both mobile and desktop analysis
  const [mobile, desktop] = await Promise.all([
    runPageSpeedAnalysis({ url, strategy: "mobile" }),
    runPageSpeedAnalysis({ url, strategy: "desktop" }),
  ]);

  return { mobile, desktop };
}
