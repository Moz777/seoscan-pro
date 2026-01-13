"use client";

import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScoreGauge } from "./ScoreGauge";
import {
  ArrowLeft,
  ExternalLink,
  Download,
  RefreshCw,
  Share2,
  Calendar,
  FileText,
  Globe,
} from "lucide-react";
import { ReportData } from "@/lib/mock-data/reports";

interface ReportHeaderProps {
  report: ReportData;
}

const tierLabels = {
  basic: "Basic",
  professional: "Professional",
  agency: "Agency",
};

export function ReportHeader({ report }: ReportHeaderProps) {
  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-xl p-6 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Left side - Info */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-white/70 hover:text-white hover:bg-white/10"
              asChild
            >
              <Link href="/audits">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Audits
              </Link>
            </Button>
          </div>

          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl md:text-3xl font-bold">
                {report.displayName}
              </h1>
              <Badge variant="secondary" className="text-xs">
                {tierLabels[report.tier]}
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-white/70">
              <Globe className="h-4 w-4" />
              <a
                href={report.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white flex items-center gap-1"
              >
                {report.websiteUrl}
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm text-white/70">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>
                Generated{" "}
                {formatDistanceToNow(report.generatedAt, { addSuffix: true })}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              <span>{report.summary.pagesScanned} pages scanned</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-2">
            <Button size="sm" className="bg-white text-slate-900 hover:bg-white/90">
              <Download className="h-4 w-4 mr-1" />
              Download PDF
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              Re-scan
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
            >
              <Share2 className="h-4 w-4 mr-1" />
              Share
            </Button>
          </div>
        </div>

        {/* Right side - Score */}
        <div className="flex items-center gap-6">
          <ScoreGauge
            score={report.scores.overall}
            size="lg"
            label="Overall Score"
          />
        </div>
      </div>

      {/* Score breakdown */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-8 pt-6 border-t border-white/10">
        {[
          { label: "Technical", score: report.scores.technical },
          { label: "Performance", score: report.scores.performance },
          { label: "Content", score: report.scores.content },
          { label: "Mobile", score: report.scores.mobile },
          { label: "Security", score: report.scores.security },
        ].map((item) => (
          <div key={item.label} className="text-center">
            <ScoreGauge score={item.score} size="sm" showLabel={false} />
            <span className="text-sm text-white/70 mt-1 block">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
