import { Audit, AuditStatus, AuditTier } from "@/lib/types";

export const mockAudits: Audit[] = [
  {
    id: "aud_001",
    userId: "user_001",
    websiteUrl: "https://example.com",
    displayName: "Example Corp",
    tier: "professional",
    status: "completed",
    createdAt: new Date("2025-01-10T10:30:00"),
    completedAt: new Date("2025-01-10T10:42:00"),
    pagesScanned: 156,
    scores: {
      overall: 78,
      technical: 82,
      performance: 71,
      content: 85,
      mobile: 76,
      security: 74,
    },
    issuesCount: {
      critical: 3,
      warnings: 12,
      opportunities: 24,
    },
  },
  {
    id: "aud_002",
    userId: "user_001",
    websiteUrl: "https://techstartup.io",
    displayName: "TechStartup",
    tier: "agency",
    status: "completed",
    createdAt: new Date("2025-01-08T14:20:00"),
    completedAt: new Date("2025-01-08T14:35:00"),
    pagesScanned: 312,
    scores: {
      overall: 64,
      technical: 58,
      performance: 62,
      content: 71,
      mobile: 65,
      security: 68,
    },
    issuesCount: {
      critical: 8,
      warnings: 27,
      opportunities: 45,
    },
  },
  {
    id: "aud_003",
    userId: "user_001",
    websiteUrl: "https://onlinestore.shop",
    displayName: "Online Store",
    tier: "basic",
    status: "completed",
    createdAt: new Date("2025-01-05T09:15:00"),
    completedAt: new Date("2025-01-05T09:22:00"),
    pagesScanned: 48,
    scores: {
      overall: 91,
      technical: 94,
      performance: 88,
      content: 92,
      mobile: 89,
      security: 95,
    },
    issuesCount: {
      critical: 0,
      warnings: 4,
      opportunities: 11,
    },
  },
  {
    id: "aud_004",
    userId: "user_001",
    websiteUrl: "https://newproject.dev",
    displayName: "New Project",
    tier: "professional",
    status: "processing",
    createdAt: new Date("2025-01-12T16:45:00"),
    completedAt: null,
    pagesScanned: 0,
    scores: {
      overall: 0,
      technical: 0,
      performance: 0,
      content: 0,
      mobile: 0,
      security: 0,
    },
    issuesCount: {
      critical: 0,
      warnings: 0,
      opportunities: 0,
    },
  },
  {
    id: "aud_005",
    userId: "user_001",
    websiteUrl: "https://myblog.net",
    displayName: "My Blog",
    tier: "basic",
    status: "completed",
    createdAt: new Date("2024-12-28T11:00:00"),
    completedAt: new Date("2024-12-28T11:08:00"),
    pagesScanned: 32,
    scores: {
      overall: 83,
      technical: 79,
      performance: 85,
      content: 88,
      mobile: 81,
      security: 82,
    },
    issuesCount: {
      critical: 1,
      warnings: 7,
      opportunities: 15,
    },
  },
];

export const getAuditById = (id: string): Audit | undefined => {
  return mockAudits.find((audit) => audit.id === id);
};

export const getAuditsByStatus = (status: AuditStatus): Audit[] => {
  return mockAudits.filter((audit) => audit.status === status);
};

export const getAuditsByTier = (tier: AuditTier): Audit[] => {
  return mockAudits.filter((audit) => audit.tier === tier);
};

export const getRecentAudits = (limit: number = 5): Audit[] => {
  return [...mockAudits]
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, limit);
};

export const getAuditStats = () => {
  const completed = mockAudits.filter((a) => a.status === "completed");
  const avgScore =
    completed.length > 0
      ? Math.round(
          completed.reduce((sum, a) => sum + a.scores.overall, 0) /
            completed.length
        )
      : 0;

  const totalIssues = completed.reduce(
    (sum, a) =>
      sum +
      a.issuesCount.critical +
      a.issuesCount.warnings +
      a.issuesCount.opportunities,
    0
  );

  const criticalIssues = completed.reduce(
    (sum, a) => sum + a.issuesCount.critical,
    0
  );

  return {
    totalAudits: mockAudits.length,
    completedAudits: completed.length,
    processingAudits: mockAudits.filter((a) => a.status === "processing")
      .length,
    averageScore: avgScore,
    totalIssuesFound: totalIssues,
    criticalIssuesFound: criticalIssues,
    totalPagesScanned: completed.reduce((sum, a) => sum + a.pagesScanned, 0),
  };
};
