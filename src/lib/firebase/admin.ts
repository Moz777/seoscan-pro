/**
 * Firebase Admin SDK Configuration
 * Used for server-side operations (API routes)
 *
 * Required environment variables:
 * - FIREBASE_PROJECT_ID
 * - FIREBASE_CLIENT_EMAIL
 * - FIREBASE_PRIVATE_KEY (base64 encoded or raw with \n)
 */

import {
  initializeApp,
  getApps,
  cert,
  App,
  ServiceAccount,
} from "firebase-admin/app";
import { getFirestore, Firestore } from "firebase-admin/firestore";
import { getAuth, Auth } from "firebase-admin/auth";

let adminApp: App | null = null;
let adminDb: Firestore | null = null;
let adminAuth: Auth | null = null;

// Check if Firebase Admin is configured
function isAdminConfigured(): boolean {
  return !!(
    process.env.FIREBASE_PROJECT_ID &&
    process.env.FIREBASE_CLIENT_EMAIL &&
    process.env.FIREBASE_PRIVATE_KEY
  );
}

// Decode private key (handles base64 or escaped newlines)
function decodePrivateKey(key: string): string {
  // Check if it's base64 encoded
  if (!key.includes("-----BEGIN")) {
    try {
      return Buffer.from(key, "base64").toString("utf-8");
    } catch {
      // Not base64, return as-is
    }
  }
  // Handle escaped newlines
  return key.replace(/\\n/g, "\n");
}

// Initialize Firebase Admin
function initializeAdmin(): App | null {
  if (!isAdminConfigured()) {
    console.warn(
      "Firebase Admin not configured. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY."
    );
    return null;
  }

  // Check if already initialized
  const apps = getApps();
  if (apps.length > 0) {
    return apps[0];
  }

  try {
    const privateKey = decodePrivateKey(process.env.FIREBASE_PRIVATE_KEY!);

    const serviceAccount: ServiceAccount = {
      projectId: process.env.FIREBASE_PROJECT_ID!,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
      privateKey,
    };

    const app = initializeApp({
      credential: cert(serviceAccount),
      projectId: process.env.FIREBASE_PROJECT_ID,
    });

    console.log("Firebase Admin initialized successfully");
    return app;
  } catch (error) {
    console.error("Failed to initialize Firebase Admin:", error);
    return null;
  }
}

// Get Admin App instance
export function getAdminApp(): App | null {
  if (!adminApp) {
    adminApp = initializeAdmin();
  }
  return adminApp;
}

// Get Firestore instance
export function getAdminFirestore(): Firestore | null {
  const app = getAdminApp();
  if (!app) return null;

  if (!adminDb) {
    adminDb = getFirestore(app);
  }
  return adminDb;
}

// Get Auth instance
export function getAdminAuth(): Auth | null {
  const app = getAdminApp();
  if (!app) return null;

  if (!adminAuth) {
    adminAuth = getAuth(app);
  }
  return adminAuth;
}

// Check if Firestore is available
export function isFirestoreAvailable(): boolean {
  return getAdminFirestore() !== null;
}

// Export config check
export { isAdminConfigured };
