/**
 * Firestore Audit Service
 * Handles all audit CRUD operations with Firestore
 */

import {
  getAdminFirestore,
  isFirestoreAvailable,
} from "@/lib/firebase/admin";
import { Audit, AuditTier, AuditStatus } from "@/lib/types";
import {
  Timestamp,
  FieldValue,
} from "firebase-admin/firestore";

// Collection name
const AUDITS_COLLECTION = "audits";

// Audit document interface (Firestore format)
interface AuditDocument {
  userId: string;
  websiteUrl: string;
  displayName: string;
  tier: AuditTier;
  status: AuditStatus;
  createdAt: Timestamp;
  completedAt: Timestamp | null;
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
  pageSpeedResults?: {
    mobile?: any;
    desktop?: any;
  };
  htmlAnalysis?: any;
  error?: string;
}

// Convert Firestore document to Audit type
function documentToAudit(id: string, doc: AuditDocument): Audit & { pageSpeedResults?: any; htmlAnalysis?: any; error?: string } {
  return {
    id,
    userId: doc.userId,
    websiteUrl: doc.websiteUrl,
    displayName: doc.displayName,
    tier: doc.tier,
    status: doc.status,
    createdAt: doc.createdAt.toDate(),
    completedAt: doc.completedAt?.toDate() || null,
    pagesScanned: doc.pagesScanned,
    scores: doc.scores,
    issuesCount: doc.issuesCount,
    pageSpeedResults: doc.pageSpeedResults,
    htmlAnalysis: doc.htmlAnalysis,
    error: doc.error,
  };
}

// Create a new audit
export async function createAuditInFirestore(data: {
  websiteUrl: string;
  displayName: string;
  tier: AuditTier;
  userId?: string;
}): Promise<Audit | null> {
  const db = getAdminFirestore();
  if (!db) return null;

  const now = Timestamp.now();

  const auditData: AuditDocument = {
    userId: data.userId || "anonymous",
    websiteUrl: data.websiteUrl,
    displayName: data.displayName,
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

  const docRef = await db.collection(AUDITS_COLLECTION).add(auditData);

  return documentToAudit(docRef.id, auditData);
}

// Get audit by ID
export async function getAuditFromFirestore(
  id: string
): Promise<(Audit & { pageSpeedResults?: any; error?: string }) | null> {
  const db = getAdminFirestore();
  if (!db) return null;

  const docRef = db.collection(AUDITS_COLLECTION).doc(id);
  const doc = await docRef.get();

  if (!doc.exists) return null;

  return documentToAudit(doc.id, doc.data() as AuditDocument);
}

// Update audit
export async function updateAuditInFirestore(
  id: string,
  updates: Partial<{
    status: AuditStatus;
    completedAt: Date | null;
    pagesScanned: number;
    scores: Audit["scores"];
    issuesCount: Audit["issuesCount"];
    pageSpeedResults: any;
    htmlAnalysis: any;
    error: string;
  }>
): Promise<Audit | null> {
  const db = getAdminFirestore();
  if (!db) return null;

  const docRef = db.collection(AUDITS_COLLECTION).doc(id);

  // Convert Date to Timestamp if present
  const firestoreUpdates: any = { ...updates };
  if (updates.completedAt !== undefined) {
    firestoreUpdates.completedAt = updates.completedAt
      ? Timestamp.fromDate(updates.completedAt)
      : null;
  }

  await docRef.update(firestoreUpdates);

  // Fetch updated document
  return getAuditFromFirestore(id);
}

// Get all audits for a user
export async function getUserAuditsFromFirestore(
  userId: string
): Promise<Audit[]> {
  const db = getAdminFirestore();
  if (!db) return [];

  const snapshot = await db
    .collection(AUDITS_COLLECTION)
    .where("userId", "==", userId)
    .orderBy("createdAt", "desc")
    .get();

  return snapshot.docs.map((doc) =>
    documentToAudit(doc.id, doc.data() as AuditDocument)
  );
}

// Get all audits (admin)
export async function getAllAuditsFromFirestore(): Promise<Audit[]> {
  const db = getAdminFirestore();
  if (!db) return [];

  const snapshot = await db
    .collection(AUDITS_COLLECTION)
    .orderBy("createdAt", "desc")
    .limit(100)
    .get();

  return snapshot.docs.map((doc) =>
    documentToAudit(doc.id, doc.data() as AuditDocument)
  );
}

// Delete audit
export async function deleteAuditFromFirestore(id: string): Promise<boolean> {
  const db = getAdminFirestore();
  if (!db) return false;

  await db.collection(AUDITS_COLLECTION).doc(id).delete();
  return true;
}

// Export availability check
export { isFirestoreAvailable };
