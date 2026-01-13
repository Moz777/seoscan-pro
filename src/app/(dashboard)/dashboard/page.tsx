import { Metadata } from "next";
import { StatsCards, RecentAudits, QuickActions } from "@/components/dashboard";
import { getAllAudits, StoredAudit } from "@/lib/services/audit-store";
import { Audit } from "@/lib/types";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "View your SEO audit overview and recent activity.",
};

// Ensure fresh data on each request
export const dynamic = "force-dynamic";

// Calculate stats from real audits
function calculateStats(audits: StoredAudit[]) {
  const completed = audits.filter((a) => a.status === "completed");
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
    totalAudits: audits.length,
    completedAudits: completed.length,
    processingAudits: audits.filter((a) => a.status === "processing").length,
    averageScore: avgScore,
    totalIssuesFound: totalIssues,
    criticalIssuesFound: criticalIssues,
    totalPagesScanned: completed.reduce((sum, a) => sum + a.pagesScanned, 0),
  };
}

export default async function DashboardPage() {
  const allAudits = await getAllAudits();

  // Sort by createdAt descending and get recent 5
  const sortedAudits = [...allAudits].sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
  );
  const recentAudits: Audit[] = sortedAudits.slice(0, 5);
  const stats = calculateStats(allAudits);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here&apos;s an overview of your SEO audits.
        </p>
      </div>

      {/* Stats Cards */}
      <StatsCards stats={stats} />

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Audits - Takes 2 columns */}
        <div className="lg:col-span-2">
          <RecentAudits audits={recentAudits} />
        </div>

        {/* Quick Actions - Takes 1 column */}
        <div>
          <QuickActions />
        </div>
      </div>
    </div>
  );
}
