/**
 * Unified Audit Storage Service
 * Uses Firestore when configured, falls back to in-memory storage
 */

import { Audit, AuditStatus, AuditTier } from "@/lib/types";
import {
  isFirestoreAvailable,
  createAuditInFirestore,
  getAuditFromFirestore,
  updateAuditInFirestore,
  getAllAuditsFromFirestore,
  getUserAuditsFromFirestore,
  deleteAuditFromFirestore,
} from "./firestore-audits";

// Extended audit type with PageSpeed and HTML analysis results
export interface StoredAudit extends Audit {
  pageSpeedResults?: {
    mobile?: any;
    desktop?: any;
  };
  htmlAnalysis?: any;
  error?: string;
}

// ============================================
// In-Memory Fallback Storage
// ============================================

const memoryAudits = new Map<string, StoredAudit>();

function generateId(): string {
  return `aud_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

function createAuditInMemory(data: {
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

  memoryAudits.set(id, audit);
  return audit;
}

function getAuditFromMemory(id: string): StoredAudit | null {
  return memoryAudits.get(id) || null;
}

function updateAuditInMemory(
  id: string,
  updates: Partial<StoredAudit>
): StoredAudit | null {
  const audit = memoryAudits.get(id);
  if (!audit) return null;

  const updated = { ...audit, ...updates };
  memoryAudits.set(id, updated);
  return updated;
}

function getAllAuditsFromMemory(userId?: string): StoredAudit[] {
  const all = Array.from(memoryAudits.values());
  if (userId) {
    return all.filter((a) => a.userId === userId);
  }
  return all;
}

function deleteAuditFromMemory(id: string): boolean {
  return memoryAudits.delete(id);
}

// ============================================
// Unified API (auto-selects storage backend)
// ============================================

/**
 * Create a new audit
 */
export async function createAudit(data: {
  websiteUrl: string;
  displayName: string;
  tier: AuditTier;
  userId?: string;
}): Promise<StoredAudit> {
  // Try Firestore first
  if (isFirestoreAvailable()) {
    const audit = await createAuditInFirestore(data);
    if (audit) {
      console.log(`[Firestore] Created audit: ${audit.id}`);
      return audit as StoredAudit;
    }
  }

  // Fallback to memory
  const audit = createAuditInMemory(data);
  console.log(`[Memory] Created audit: ${audit.id}`);
  return audit;
}

/**
 * Get audit by ID
 */
export async function getAudit(id: string): Promise<StoredAudit | null> {
  // Try Firestore first
  if (isFirestoreAvailable()) {
    const audit = await getAuditFromFirestore(id);
    if (audit) {
      return audit as StoredAudit;
    }
  }

  // Fallback to memory
  return getAuditFromMemory(id);
}

/**
 * Update audit
 */
export async function updateAudit(
  id: string,
  updates: Partial<StoredAudit>
): Promise<StoredAudit | null> {
  // Try Firestore first
  if (isFirestoreAvailable()) {
    const audit = await updateAuditInFirestore(id, updates);
    if (audit) {
      console.log(`[Firestore] Updated audit: ${id}`);
      return audit as StoredAudit;
    }
  }

  // Fallback to memory
  const audit = updateAuditInMemory(id, updates);
  if (audit) {
    console.log(`[Memory] Updated audit: ${id}`);
  }
  return audit;
}

/**
 * Get all audits (optionally filtered by user)
 */
export async function getAllAudits(userId?: string): Promise<StoredAudit[]> {
  // Try Firestore first
  if (isFirestoreAvailable()) {
    const audits = userId
      ? await getUserAuditsFromFirestore(userId)
      : await getAllAuditsFromFirestore();
    return audits as StoredAudit[];
  }

  // Fallback to memory
  return getAllAuditsFromMemory(userId);
}

/**
 * Delete audit
 */
export async function deleteAudit(id: string): Promise<boolean> {
  // Try Firestore first
  if (isFirestoreAvailable()) {
    const deleted = await deleteAuditFromFirestore(id);
    if (deleted) {
      console.log(`[Firestore] Deleted audit: ${id}`);
      return true;
    }
  }

  // Fallback to memory
  const deleted = deleteAuditFromMemory(id);
  if (deleted) {
    console.log(`[Memory] Deleted audit: ${id}`);
  }
  return deleted;
}

/**
 * Check which storage backend is being used
 */
export function getStorageBackend(): "firestore" | "memory" {
  return isFirestoreAvailable() ? "firestore" : "memory";
}
