// ============================================
// SEOScan Pro Type Definitions
// ============================================

// User Types
export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL: string | null;
  company: string | null;
  role: string | null;
  createdAt: Date;
  lastLoginAt: Date;
  subscription: UserSubscription;
  integrations: UserIntegrations;
  whiteLabel: WhiteLabelConfig | null;
  stripeCustomerId: string | null;
  totalAuditsRun: number;
  preferences: UserPreferences;
}

export interface UserSubscription {
  type: "free" | "basic" | "professional" | "agency";
  status: "active" | "cancelled" | "expired";
  auditsRemaining: number;
  rescansRemaining: number;
  expiresAt: Date | null;
}

export interface UserIntegrations {
  googleSearchConsole: {
    connected: boolean;
    siteUrl: string | null;
    connectedAt: Date | null;
  };
  googleAnalytics: {
    connected: boolean;
    propertyId: string | null;
    connectedAt: Date | null;
  };
}

export interface WhiteLabelConfig {
  enabled: boolean;
  logo: string | null;
  brandName: string | null;
  brandColor: string | null;
  reportFooter: string | null;
}

export interface UserPreferences {
  emailNotifications: boolean;
  reportLanguage: "en" | "fr" | "es";
  defaultTier: AuditTier;
}

// Audit Types
export type AuditTier = "basic" | "professional" | "agency";

export type AuditStatus =
  | "pending"
  | "processing"
  | "completed"
  | "failed";

export interface Audit {
  id: string;
  userId: string;
  websiteUrl: string;
  displayName: string;
  tier: AuditTier;
  status: AuditStatus;
  createdAt: Date;
  completedAt: Date | null;
  pagesScanned: number;
  scores: {
    overall: number;
    technical: number;
    performance: number;
    content: number;
    mobile: number;
    security: number;
  };
  issuesCount: {
    critical: number;
    warnings: number;
    opportunities: number;
  };
}

// Full Audit with all analysis data (for detailed views)
export interface AuditFull extends Audit {
  startedAt: Date | null;
  expiresAt: Date;
  progress: AuditProgress;
  config: AuditConfig;
  crawlData: CrawlData | null;
  issues: AuditIssues | null;
  technicalData: TechnicalData | null;
  performanceData: PerformanceData | null;
  contentData: ContentData | null;
  competitorData: CompetitorData | null;
  backlinkData: BacklinkData | null;
  recommendations: Recommendations | null;
  report: ReportInfo | null;
}

export interface AuditProgress {
  percentage: number;
  currentStep: string;
  steps: AuditStep[];
}

export interface AuditStep {
  name: string;
  status: "pending" | "in_progress" | "completed" | "failed";
  startedAt: Date | null;
  completedAt: Date | null;
}

export interface AuditConfig {
  maxPages: number;
  includeCompetitors: boolean;
  competitorUrls: string[];
  includeBacklinks: boolean;
  includeGSC: boolean;
  includeGA4: boolean;
}

export interface CrawlData {
  totalPages: number;
  crawledPages: number;
  errorPages: number;
  redirectPages: number;
  crawlDuration: number;
  lastCrawled: Date;
}

export interface AuditScores {
  overall: number;
  technical: number;
  performance: number;
  content: number;
  mobile: number;
  security: number;
  breakdown: {
    crawlability: number;
    indexability: number;
    siteSpeed: number;
    mobileUsability: number;
    onPageSEO: number;
    technicalSEO: number;
  };
}

export interface AuditIssues {
  critical: Issue[];
  warnings: Issue[];
  opportunities: Issue[];
}

export type IssueCategory = "technical" | "performance" | "content" | "security";
export type IssueImpact = "critical" | "high" | "medium" | "low";
export type IssueEffort = "quick" | "medium" | "complex";

export interface Issue {
  id: string;
  category: IssueCategory;
  type: string;
  title: string;
  description: string;
  affectedPages: number;
  impact: IssueImpact;
  effort: IssueEffort;
  recommendation: string;
  resources?: { title: string; url: string }[];
  exampleUrls: string[];
}

// Technical Analysis Data
export interface TechnicalData {
  crawlability: {
    robotsTxtValid: boolean;
    robotsTxtUrl: string;
    sitemapPresent: boolean;
    sitemapUrls: string[];
    sitemapValid: boolean;
    crawlErrors: number;
    blockedPages: number;
  };
  indexability: {
    indexablePages: number;
    noindexPages: number;
    canonicalIssues: number;
    duplicateContent: {
      pagesWithDuplicates: number;
      duplicateClusters: { urls: string[]; similarity: number }[];
    };
  };
  httpStatus: {
    http200: number;
    http301: number;
    http302: number;
    http404: number;
    http500: number;
    redirectChains: {
      startUrl: string;
      chain: string[];
      length: number;
    }[];
  };
  structuredData: {
    pagesWithSchema: number;
    schemaTypes: { type: string; count: number }[];
    validationErrors: number;
    validationWarnings: number;
  };
  internalLinking: {
    averageLinksPerPage: number;
    orphanPages: number;
    pagesWithFewLinks: number;
    linkDepthDistribution: {
      depth1: number;
      depth2: number;
      depth3plus: number;
    };
  };
  security: {
    httpsEnabled: boolean;
    sslValid: boolean;
    sslGrade: string;
    mixedContent: boolean;
    insecureResources: number;
  };
}

// Performance Analysis Data
export interface PerformanceData {
  coreWebVitals: {
    lcp: { value: number; rating: "good" | "needs-improvement" | "poor" };
    fid: { value: number; rating: "good" | "needs-improvement" | "poor" };
    cls: { value: number; rating: "good" | "needs-improvement" | "poor" };
    percentageGoodPages: number;
  };
  pageSpeed: {
    mobileScore: number;
    desktopScore: number;
    firstContentfulPaint: number;
    timeToInteractive: number;
    speedIndex: number;
    totalBlockingTime: number;
  };
  resources: {
    totalSize: number;
    imageSize: number;
    jsSize: number;
    cssSize: number;
    uncompressedImages: number;
    oversizedImages: number;
    unusedCss: number;
    renderBlockingResources: number;
  };
  mobile: {
    mobileFriendly: boolean;
    viewportConfigured: boolean;
    fontSizeReadable: boolean;
    tapTargetsAppropriate: boolean;
    contentWidthSet: boolean;
  };
  caching: {
    cachedResources: number;
    uncachedResources: number;
    cacheHitRate: number;
  };
}

// Content Analysis Data
export interface ContentData {
  metaTags: {
    pagesWithTitle: number;
    uniqueTitles: number;
    duplicateTitles: number;
    longTitles: number;
    shortTitles: number;
    pagesWithDescription: number;
    uniqueDescriptions: number;
    duplicateDescriptions: number;
    longDescriptions: number;
    shortDescriptions: number;
  };
  headings: {
    pagesWithH1: number;
    multipleH1: number;
    missingH1: number;
    properHeadingHierarchy: number;
  };
  content: {
    totalWords: number;
    averageWordsPerPage: number;
    thinContentPages: number;
    duplicateContentPages: number;
    readabilityScoreAverage: number;
  };
  images: {
    totalImages: number;
    imagesWithoutAlt: number;
    imagesWithEmptyAlt: number;
    oversizedImages: number;
    unoptimizedFormats: number;
  };
  keywords: {
    topKeywords: {
      keyword: string;
      position: number;
      clicks: number;
      impressions: number;
      ctr: number;
    }[];
    keywordCannibalization: {
      keyword: string;
      urls: string[];
    }[];
  } | null;
}

// Competitor Analysis Data
export interface CompetitorData {
  competitors: Competitor[];
  positioning: {
    rank: number;
    strengthsVsCompetitors: string[];
    weaknessesVsCompetitors: string[];
    opportunities: string[];
  };
}

export interface Competitor {
  url: string;
  name: string;
  domainAuthority: number;
  pageAuthority: number;
  totalBacklinks: number;
  referringDomains: number;
  organicTraffic: number;
  organicKeywords: number;
  topKeywords: string[];
  contentGaps: string[];
  technicalScore: number;
  performanceScore: number;
}

// Backlink Analysis Data
export interface BacklinkData {
  totalBacklinks: number;
  referringDomains: number;
  followBacklinks: number;
  nofollowBacklinks: number;
  domainAuthority: number;
  pageAuthority: number;
  spamScore: number;
  topBacklinks: Backlink[];
  toxicBacklinks: ToxicBacklink[];
  lostBacklinks: number;
}

export interface Backlink {
  sourceUrl: string;
  targetUrl: string;
  anchorText: string;
  domainAuthority: number;
  dofollow: boolean;
  firstSeen: string;
}

export interface ToxicBacklink {
  sourceUrl: string;
  targetUrl: string;
  toxicityScore: number;
  reason: string;
}

// Recommendations
export interface Recommendations {
  quickWins: Recommendation[];
  mediumTerm: Recommendation[];
  longTerm: Recommendation[];
  priorityMatrix: {
    highImpactLowEffort: number;
    highImpactHighEffort: number;
    lowImpactLowEffort: number;
    lowImpactHighEffort: number;
  };
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  impact: IssueImpact;
  effort: IssueEffort;
  priority: number;
  estimatedTimeHours: number;
  category: string;
  steps: string[];
}

// Report Info
export interface ReportInfo {
  pdfUrl: string;
  docxUrl: string | null;
  csvDataUrl: string | null;
  pageCount: number;
  fileSize: number;
  generatedAt: Date;
  validUntil: Date;
}

// Pricing Types
export interface PricingTier {
  id: AuditTier;
  name: string;
  price: number;
  description: string;
  features: string[];
  maxPages: number;
  maxCompetitors: number;
  highlighted?: boolean;
  badge?: string;
}

// Navigation Types
export interface NavItem {
  label: string;
  href: string;
  external?: boolean;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

// Component Props
export interface ScoreGaugeProps {
  score: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  label?: string;
}

export interface IssueCardProps {
  issue: Issue;
  expanded?: boolean;
  onToggle?: () => void;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}
