import { Issue } from "@/lib/types";

export interface ReportData {
  id: string;
  auditId: string;
  websiteUrl: string;
  displayName: string;
  tier: "basic" | "professional" | "agency";
  generatedAt: Date;
  scores: {
    overall: number;
    technical: number;
    performance: number;
    content: number;
    mobile: number;
    security: number;
  };
  summary: {
    pagesScanned: number;
    issuesFound: number;
    criticalIssues: number;
    warningIssues: number;
    opportunities: number;
    averageLoadTime: number;
    mobileScore: number;
  };
  issues: Issue[];
  technicalData: {
    crawlability: {
      score: number;
      robotsTxt: boolean;
      sitemap: boolean;
      blockedResources: number;
      crawlErrors: number;
    };
    indexability: {
      score: number;
      indexablePages: number;
      noIndexPages: number;
      canonicalIssues: number;
      duplicateContent: number;
    };
    httpStatus: {
      status200: number;
      status301: number;
      status404: number;
      status500: number;
    };
    structuredData: {
      hasSchema: boolean;
      schemaTypes: string[];
      errors: number;
    };
  };
  performanceData: {
    coreWebVitals: {
      lcp: { value: number; rating: "good" | "needs-improvement" | "poor" };
      fid: { value: number; rating: "good" | "needs-improvement" | "poor" };
      cls: { value: number; rating: "good" | "needs-improvement" | "poor" };
    };
    pageSpeed: {
      desktop: number;
      mobile: number;
    };
    resources: {
      totalSize: number;
      htmlSize: number;
      cssSize: number;
      jsSize: number;
      imageSize: number;
      fontSize: number;
    };
  };
  contentData: {
    metaTags: {
      missingTitle: number;
      missingDescription: number;
      duplicateTitles: number;
      duplicateDescriptions: number;
      titleTooLong: number;
      titleTooShort: number;
      descriptionTooLong: number;
      descriptionTooShort: number;
    };
    headings: {
      missingH1: number;
      multipleH1: number;
      skippedLevels: number;
      emptyHeadings: number;
    };
    images: {
      total: number;
      missingAlt: number;
      largeImages: number;
      unoptimized: number;
    };
    links: {
      internal: number;
      external: number;
      broken: number;
      nofollow: number;
    };
  };
  recommendations: {
    priority: "critical" | "high" | "medium" | "low";
    category: string;
    title: string;
    description: string;
    impact: string;
    effort: "quick" | "medium" | "complex";
  }[];
  // Raw HTML analysis data for detailed views
  htmlAnalysis?: any;
}

export const mockReportData: ReportData = {
  id: "rep_001",
  auditId: "aud_001",
  websiteUrl: "https://example.com",
  displayName: "Example Corp",
  tier: "professional",
  generatedAt: new Date("2025-01-10T10:42:00"),
  scores: {
    overall: 78,
    technical: 82,
    performance: 71,
    content: 85,
    mobile: 76,
    security: 74,
  },
  summary: {
    pagesScanned: 156,
    issuesFound: 39,
    criticalIssues: 3,
    warningIssues: 12,
    opportunities: 24,
    averageLoadTime: 2.4,
    mobileScore: 76,
  },
  issues: [
    {
      id: "iss_001",
      category: "technical",
      type: "missing-sitemap",
      title: "XML Sitemap Not Found",
      description:
        "Your website does not have an XML sitemap, making it harder for search engines to discover and index your pages.",
      affectedPages: 1,
      impact: "critical",
      effort: "quick",
      recommendation:
        "Create an XML sitemap and submit it to Google Search Console. Most CMS platforms can generate this automatically.",
      exampleUrls: ["https://example.com/sitemap.xml"],
    },
    {
      id: "iss_002",
      category: "performance",
      type: "slow-lcp",
      title: "Largest Contentful Paint Too Slow",
      description:
        "Your LCP is 4.2 seconds, which is above the recommended 2.5 seconds. This affects user experience and SEO rankings.",
      affectedPages: 45,
      impact: "critical",
      effort: "medium",
      recommendation:
        "Optimize your largest content element. Consider lazy loading images, using a CDN, and optimizing server response times.",
      exampleUrls: [
        "https://example.com/",
        "https://example.com/about",
        "https://example.com/products",
      ],
    },
    {
      id: "iss_003",
      category: "content",
      type: "missing-meta-description",
      title: "Missing Meta Descriptions",
      description:
        "Several pages are missing meta descriptions, which can reduce click-through rates from search results.",
      affectedPages: 23,
      impact: "high",
      effort: "quick",
      recommendation:
        "Add unique, compelling meta descriptions to all pages. Keep them between 150-160 characters.",
      exampleUrls: [
        "https://example.com/blog/post-1",
        "https://example.com/blog/post-2",
      ],
    },
    {
      id: "iss_004",
      category: "security",
      type: "mixed-content",
      title: "Mixed Content Issues",
      description:
        "Some pages load resources over HTTP instead of HTTPS, which can cause security warnings.",
      affectedPages: 8,
      impact: "critical",
      effort: "quick",
      recommendation:
        "Update all resource URLs to use HTTPS. Check images, scripts, and stylesheets.",
      exampleUrls: ["https://example.com/gallery"],
    },
    {
      id: "iss_005",
      category: "technical",
      type: "broken-links",
      title: "Broken Internal Links",
      description:
        "There are broken internal links pointing to non-existent pages, creating a poor user experience.",
      affectedPages: 12,
      impact: "high",
      effort: "medium",
      recommendation:
        "Fix or remove all broken internal links. Set up 301 redirects for moved content.",
      exampleUrls: ["https://example.com/old-page"],
    },
    {
      id: "iss_006",
      category: "content",
      type: "missing-alt-text",
      title: "Images Missing Alt Text",
      description:
        "Many images are missing alt text, reducing accessibility and missing SEO opportunities.",
      affectedPages: 34,
      impact: "medium",
      effort: "medium",
      recommendation:
        "Add descriptive alt text to all images. Keep it concise but informative.",
      exampleUrls: ["https://example.com/products"],
    },
    {
      id: "iss_007",
      category: "performance",
      type: "unoptimized-images",
      title: "Unoptimized Images",
      description:
        "Large image files are slowing down page load times. Some images exceed 1MB.",
      affectedPages: 28,
      impact: "high",
      effort: "medium",
      recommendation:
        "Compress images using tools like TinyPNG or Squoosh. Use modern formats like WebP.",
      exampleUrls: ["https://example.com/gallery"],
    },
  ],
  technicalData: {
    crawlability: {
      score: 85,
      robotsTxt: true,
      sitemap: false,
      blockedResources: 3,
      crawlErrors: 7,
    },
    indexability: {
      score: 79,
      indexablePages: 142,
      noIndexPages: 14,
      canonicalIssues: 5,
      duplicateContent: 8,
    },
    httpStatus: {
      status200: 142,
      status301: 8,
      status404: 4,
      status500: 2,
    },
    structuredData: {
      hasSchema: true,
      schemaTypes: ["Organization", "WebSite", "BreadcrumbList", "Product"],
      errors: 2,
    },
  },
  performanceData: {
    coreWebVitals: {
      lcp: { value: 4.2, rating: "poor" },
      fid: { value: 85, rating: "needs-improvement" },
      cls: { value: 0.08, rating: "good" },
    },
    pageSpeed: {
      desktop: 78,
      mobile: 54,
    },
    resources: {
      totalSize: 3.2,
      htmlSize: 0.12,
      cssSize: 0.28,
      jsSize: 1.4,
      imageSize: 1.3,
      fontSize: 0.1,
    },
  },
  contentData: {
    metaTags: {
      missingTitle: 2,
      missingDescription: 23,
      duplicateTitles: 5,
      duplicateDescriptions: 8,
      titleTooLong: 3,
      titleTooShort: 4,
      descriptionTooLong: 2,
      descriptionTooShort: 6,
    },
    headings: {
      missingH1: 8,
      multipleH1: 4,
      skippedLevels: 12,
      emptyHeadings: 2,
    },
    images: {
      total: 234,
      missingAlt: 67,
      largeImages: 28,
      unoptimized: 45,
    },
    links: {
      internal: 456,
      external: 89,
      broken: 12,
      nofollow: 34,
    },
  },
  recommendations: [
    {
      priority: "critical",
      category: "Technical",
      title: "Create and Submit XML Sitemap",
      description:
        "Generate an XML sitemap and submit it to search engines to improve crawling and indexing.",
      impact: "High - Improves page discovery by 40%",
      effort: "quick",
    },
    {
      priority: "critical",
      category: "Performance",
      title: "Optimize Largest Contentful Paint",
      description:
        "Reduce LCP from 4.2s to under 2.5s by optimizing images and server response time.",
      impact: "High - Core Web Vital affecting rankings",
      effort: "medium",
    },
    {
      priority: "critical",
      category: "Security",
      title: "Fix Mixed Content Issues",
      description:
        "Update all HTTP resources to HTTPS to prevent security warnings.",
      impact: "High - Security and trust factor",
      effort: "quick",
    },
    {
      priority: "high",
      category: "Content",
      title: "Add Meta Descriptions to All Pages",
      description:
        "Write unique meta descriptions for 23 pages missing them.",
      impact: "Medium - Improves CTR by 5-10%",
      effort: "medium",
    },
    {
      priority: "high",
      category: "Technical",
      title: "Fix Broken Internal Links",
      description:
        "Repair or redirect 12 broken internal links to improve user experience.",
      impact: "Medium - Better crawlability and UX",
      effort: "medium",
    },
    {
      priority: "medium",
      category: "Content",
      title: "Add Alt Text to Images",
      description:
        "Add descriptive alt text to 67 images for accessibility and SEO.",
      impact: "Medium - Accessibility and image SEO",
      effort: "medium",
    },
    {
      priority: "medium",
      category: "Performance",
      title: "Compress and Optimize Images",
      description:
        "Reduce image file sizes and use modern formats like WebP.",
      impact: "Medium - Faster page loads",
      effort: "medium",
    },
    {
      priority: "low",
      category: "Technical",
      title: "Fix Canonical Tag Issues",
      description:
        "Review and correct canonical tags on 5 pages to avoid duplicate content.",
      impact: "Low - Prevents ranking dilution",
      effort: "quick",
    },
  ],
};

export const getReportData = (auditId: string): ReportData | null => {
  // In real implementation, fetch from database
  if (auditId === "aud_001" || auditId === "rep_001") {
    return mockReportData;
  }
  // Return mock data for any audit ID for demo purposes
  return { ...mockReportData, auditId };
};
