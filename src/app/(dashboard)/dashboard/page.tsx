import { Metadata } from "next";
import { StatsCards, RecentAudits, QuickActions } from "@/components/dashboard";
import { getAuditStats, getRecentAudits } from "@/lib/mock-data";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "View your SEO audit overview and recent activity.",
};

export default function DashboardPage() {
  const stats = getAuditStats();
  const recentAudits = getRecentAudits(5);

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
