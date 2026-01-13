/**
 * Simple in-memory audit storage
 * TODO: Replace with Firestore in production
 */

import { Audit, AuditStatus, AuditTier } from "@/lib/types";

interface StoredAudit extends Audit {
  pageSpeedResults?: {
    mobile?: any;
    desktop?: any;
  };
  error?: string;
}

// In-memory store (will reset on server restart)
const audits = new Map<string, StoredAudit>();

// Generate unique ID
function generateId(): string {
  return `aud_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

export function createAudit(data: {
  websiteUrl: string;
  displayName: string;
  tier: AuditTier;
  userId?: string;
}): StoredAudit {
  const id = generateId();
  const now = new Date();

  const audit: StoredAudit = {
    id,
    userId: data.userId || "anonymous",
    websiteUrl: data.websiteUrl,
    displayName: data.displayName || new URL(data.websiteUrl).hostname,
    tier: data.tier,
    status: "pending",
    createdAt: now,
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
  };

  audits.set(id, audit);
  return audit;
}

export function getAudit(id: string): StoredAudit | null {
  return audits.get(id) || null;
}

export function updateAudit(id: string, updates: Partial<StoredAudit>): StoredAudit | null {
  const audit = audits.get(id);
  if (!audit) return null;

  const updated = { ...audit, ...updates };
  audits.set(id, updated);
  return updated;
}

export function getAllAudits(userId?: string): StoredAudit[] {
  const all = Array.from(audits.values());
  if (userId) {
    return all.filter((a) => a.userId === userId);
  }
  return all;
}

export function deleteAudit(id: string): boolean {
  return audits.delete(id);
}

// Export type
export type { StoredAudit };
