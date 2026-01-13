import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
  User,
  Unsubscribe,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "./config";

// Google Auth Provider
const googleProvider = new GoogleAuthProvider();
googleProvider.addScope("profile");
googleProvider.addScope("email");

// Error for unconfigured Firebase
const notConfiguredError = "Firebase is not configured. Please set up environment variables.";

// Sign in with email and password
export async function signInWithEmail(email: string, password: string) {
  if (!auth) {
    return { user: null, error: notConfiguredError };
  }
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return { user: result.user, error: null };
  } catch (error: any) {
    return { user: null, error: getErrorMessage(error.code) };
  }
}

// Sign up with email and password
export async function signUpWithEmail(
  email: string,
  password: string,
  displayName: string
) {
  if (!auth) {
    return { user: null, error: notConfiguredError };
  }
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);

    // Update profile with display name
    await updateProfile(result.user, { displayName });

    // Create user document in Firestore
    await createUserDocument(result.user, { displayName });

    return { user: result.user, error: null };
  } catch (error: any) {
    return { user: null, error: getErrorMessage(error.code) };
  }
}

// Sign in with Google
export async function signInWithGoogle() {
  if (!auth || !db) {
    return { user: null, error: notConfiguredError };
  }
  try {
    const result = await signInWithPopup(auth, googleProvider);

    // Check if user document exists, if not create one
    const userDoc = await getDoc(doc(db, "users", result.user.uid));
    if (!userDoc.exists()) {
      await createUserDocument(result.user);
    }

    return { user: result.user, error: null };
  } catch (error: any) {
    return { user: null, error: getErrorMessage(error.code) };
  }
}

// Sign out
export async function signOut() {
  if (!auth) {
    return { error: notConfiguredError };
  }
  try {
    await firebaseSignOut(auth);
    return { error: null };
  } catch (error: any) {
    return { error: getErrorMessage(error.code) };
  }
}

// Send password reset email
export async function resetPassword(email: string) {
  if (!auth) {
    return { error: notConfiguredError };
  }
  try {
    await sendPasswordResetEmail(auth, email);
    return { error: null };
  } catch (error: any) {
    return { error: getErrorMessage(error.code) };
  }
}

// Create user document in Firestore
async function createUserDocument(
  user: User,
  additionalData?: { displayName?: string }
) {
  if (!db) return;

  const userRef = doc(db, "users", user.uid);

  const userData = {
    email: user.email,
    displayName: additionalData?.displayName || user.displayName || "",
    photoURL: user.photoURL || null,
    company: null,
    role: null,
    createdAt: serverTimestamp(),
    lastLoginAt: serverTimestamp(),
    subscription: {
      type: "free",
      status: "active",
      auditsRemaining: 0,
      rescansRemaining: 0,
      expiresAt: null,
    },
    integrations: {
      googleSearchConsole: {
        connected: false,
        siteUrl: null,
        connectedAt: null,
      },
      googleAnalytics: {
        connected: false,
        propertyId: null,
        connectedAt: null,
      },
    },
    whiteLabel: null,
    stripeCustomerId: null,
    totalAuditsRun: 0,
    preferences: {
      emailNotifications: true,
      reportLanguage: "en",
      defaultTier: "professional",
    },
  };

  await setDoc(userRef, userData);
}

// Listen to auth state changes
export function onAuthChange(callback: (user: User | null) => void): Unsubscribe {
  if (!auth) {
    // Return a no-op unsubscribe function
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
}

// Get current user
export function getCurrentUser(): User | null {
  if (!auth) return null;
  return auth.currentUser;
}

// Error messages
function getErrorMessage(errorCode: string): string {
  switch (errorCode) {
    case "auth/email-already-in-use":
      return "This email is already registered. Please sign in instead.";
    case "auth/invalid-email":
      return "Invalid email address.";
    case "auth/operation-not-allowed":
      return "Email/password accounts are not enabled.";
    case "auth/weak-password":
      return "Password is too weak. Please use at least 6 characters.";
    case "auth/user-disabled":
      return "This account has been disabled.";
    case "auth/user-not-found":
      return "No account found with this email.";
    case "auth/wrong-password":
      return "Incorrect password.";
    case "auth/invalid-credential":
      return "Invalid email or password.";
    case "auth/too-many-requests":
      return "Too many failed attempts. Please try again later.";
    case "auth/popup-closed-by-user":
      return "Sign in was cancelled.";
    case "auth/popup-blocked":
      return "Popup was blocked. Please allow popups for this site.";
    default:
      return "An error occurred. Please try again.";
  }
}
