import { Metadata } from "next";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  PlusCircle,
  Search,
  ExternalLink,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
  Download,
  RefreshCw,
  MoreHorizontal,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { mockAudits } from "@/lib/mock-data";
import { AuditStatus, AuditTier } from "@/lib/types";

export const metadata: Metadata = {
  title: "My Audits",
  description: "View and manage all your SEO audits.",
};

const statusConfig: Record<
  AuditStatus,
  { label: string; icon: React.ReactNode; className: string }
> = {
  pending: {
    label: "Pending",
    icon: <Clock className="h-3 w-3" />,
    className: "bg-yellow-100 text-yellow-800 border-yellow-200",
  },
  processing: {
    label: "Processing",
    icon: <Loader2 className="h-3 w-3 animate-spin" />,
    className: "bg-blue-100 text-blue-800 border-blue-200",
  },
  completed: {
    label: "Completed",
    icon: <CheckCircle className="h-3 w-3" />,
    className: "bg-green-100 text-green-800 border-green-200",
  },
  failed: {
    label: "Failed",
    icon: <AlertCircle className="h-3 w-3" />,
    className: "bg-red-100 text-red-800 border-red-200",
  },
};

const tierLabels: Record<AuditTier, string> = {
  basic: "Basic",
  professional: "Pro",
  agency: "Agency",
};

function getScoreColor(score: number): string {
  if (score >= 80) return "text-green-600";
  if (score >= 60) return "text-yellow-600";
  return "text-red-600";
}

function getScoreBgColor(score: number): string {
  if (score >= 80) return "bg-green-100";
  if (score >= 60) return "bg-yellow-100";
  return "bg-red-100";
}

export default function AuditsPage() {
  const audits = mockAudits;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Audits</h1>
          <p className="text-muted-foreground">
            View and manage all your SEO audits.
          </p>
        </div>
        <Button asChild>
          <Link href="/new-audit" className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            New Audit
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="py-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search audits..."
                className="pl-9"
              />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all">
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Tier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tiers</SelectItem>
                <SelectItem value="basic">Basic</SelectItem>
                <SelectItem value="professional">Professional</SelectItem>
                <SelectItem value="agency">Agency</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Audits List */}
      <Card>
        <CardHeader>
          <CardTitle>All Audits ({audits.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {audits.map((audit) => {
              const status = statusConfig[audit.status];
              return (
                <div
                  key={audit.id}
                  className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    {/* Score Circle */}
                    {audit.status === "completed" ? (
                      <div
                        className={cn(
                          "flex items-center justify-center w-14 h-14 rounded-full font-bold text-xl",
                          getScoreBgColor(audit.scores.overall),
                          getScoreColor(audit.scores.overall)
                        )}
                      >
                        {audit.scores.overall}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center w-14 h-14 rounded-full bg-muted text-muted-foreground">
                        {audit.status === "processing" ? (
                          <Loader2 className="h-6 w-6 animate-spin" />
                        ) : (
                          <Clock className="h-6 w-6" />
                        )}
                      </div>
                    )}

                    {/* Audit Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold truncate">
                          {audit.displayName}
                        </h3>
                        <Badge variant="outline" className="text-xs">
                          {tierLabels[audit.tier]}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={cn("text-xs gap-1", status.className)}
                        >
                          {status.icon}
                          {status.label}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                        <span className="truncate">{audit.websiteUrl}</span>
                        <a
                          href={audit.websiteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-primary flex-shrink-0"
                        >
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <span>
                          Created{" "}
                          {formatDistanceToNow(audit.createdAt, {
                            addSuffix: true,
                          })}
                        </span>
                        {audit.status === "completed" && (
                          <>
                            <span>•</span>
                            <span>{audit.pagesScanned} pages scanned</span>
                            <span>•</span>
                            <span>
                              {audit.issuesCount.critical +
                                audit.issuesCount.warnings +
                                audit.issuesCount.opportunities}{" "}
                              issues found
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 ml-4">
                    {audit.status === "completed" && (
                      <>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/audits/${audit.id}`}>View Report</Link>
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Download className="h-4 w-4 mr-2" />
                              Download PDF
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <RefreshCw className="h-4 w-4 mr-2" />
                              Re-scan
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </>
                    )}
                    {audit.status === "processing" && (
                      <span className="text-sm text-muted-foreground">
                        Analyzing...
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
