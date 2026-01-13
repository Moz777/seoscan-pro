"use client";

import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ExternalLink,
  ArrowRight,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Audit, AuditStatus, AuditTier } from "@/lib/types";

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

interface RecentAuditsProps {
  audits: Audit[];
}

export function RecentAudits({ audits }: RecentAuditsProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Audits</CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/audits" className="flex items-center gap-1">
            View All
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {audits.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No audits yet</p>
            <Button asChild className="mt-4">
              <Link href="/new-audit">Run Your First Audit</Link>
            </Button>
          </div>
        ) : (
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
                          "flex items-center justify-center w-12 h-12 rounded-full font-bold text-lg",
                          getScoreBgColor(audit.scores.overall),
                          getScoreColor(audit.scores.overall)
                        )}
                      >
                        {audit.scores.overall}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-muted text-muted-foreground">
                        {audit.status === "processing" ? (
                          <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                          <Clock className="h-5 w-5" />
                        )}
                      </div>
                    )}

                    {/* Audit Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium truncate">
                          {audit.displayName}
                        </h3>
                        <Badge variant="outline" className="text-xs">
                          {tierLabels[audit.tier]}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="truncate">{audit.websiteUrl}</span>
                        <a
                          href={audit.websiteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-primary"
                        >
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                        <Badge
                          variant="outline"
                          className={cn("text-xs gap-1", status.className)}
                        >
                          {status.icon}
                          {status.label}
                        </Badge>
                        <span>
                          {formatDistanceToNow(audit.createdAt, {
                            addSuffix: true,
                          })}
                        </span>
                        {audit.status === "completed" && (
                          <>
                            <span>•</span>
                            <span>{audit.pagesScanned} pages</span>
                            <span>•</span>
                            <span
                              className={
                                audit.issuesCount.critical > 0
                                  ? "text-red-600"
                                  : ""
                              }
                            >
                              {audit.issuesCount.critical} critical
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action */}
                  {audit.status === "completed" && (
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/audits/${audit.id}`}>View Report</Link>
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
