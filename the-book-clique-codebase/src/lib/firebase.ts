import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import {
  getAuth,
  Auth,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';

// ----------------------------------------------------------------------------
// THE BOOK CLIQUE - EXCLUSIVE OWNER ADMINISTRATOR IDENTITY
// ----------------------------------------------------------------------------
export const OWNER_ADMIN_UID = 'P7NJg0sVJwM7PEdwKB0JpQ0NIi62';
export const OWNER_ADMIN_EMAIL = 'hollowaylydia.us@gmail.com';

export interface FirebaseClientConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId?: string;
}

/**
 * Resolves Firebase Client Configuration from:
 * 1. Vite environment variables (VITE_FIREBASE_*)
 * 2. Locally stored client configuration in localStorage
 */
export function getFirebaseConfig(): FirebaseClientConfig {
  const envConfig: FirebaseClientConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
    appId: import.meta.env.VITE_FIREBASE_APP_ID || ''
  };

  if (envConfig.apiKey && envConfig.projectId) {
    return envConfig;
  }

  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('tbc_firebase_client_config');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.apiKey && (parsed.projectId || parsed.authDomain)) {
          return {
            apiKey: parsed.apiKey || '',
            authDomain: parsed.authDomain || `${parsed.projectId}.firebaseapp.com`,
            projectId: parsed.projectId || '',
            storageBucket: parsed.storageBucket || '',
            messagingSenderId: parsed.messagingSenderId || '',
            appId: parsed.appId || ''
          };
        }
      } catch {
        // Ignore JSON parse errors
      }
    }
  }

  return envConfig;
}

export function isFirebaseConfigured(): boolean {
  const config = getFirebaseConfig();
  return Boolean(config.apiKey && (config.projectId || config.authDomain));
}

let appInstance: FirebaseApp | null = null;
let authInstance: Auth | null = null;

export function getFirebaseApp(): FirebaseApp | null {
  if (appInstance) return appInstance;
  const existingApps = getApps();
  if (existingApps.length > 0) {
    appInstance = existingApps[0];
    return appInstance;
  }

  const config = getFirebaseConfig();
  if (config.apiKey) {
    try {
      appInstance = initializeApp(config);
      return appInstance;
    } catch (e) {
      console.warn('[Firebase] App initialization error:', e);
    }
  }
  return null;
}

export function getFirebaseAuth(): Auth | null {
  if (authInstance) return authInstance;
  const app = getFirebaseApp();
  if (app) {
    try {
      authInstance = getAuth(app);
      return authInstance;
    } catch (e) {
      console.warn('[Firebase] Auth initialization error:', e);
    }
  }
  return null;
}

/**
 * Saves a user-provided Firebase Web configuration to browser storage
 * for immediate use and testing.
 */
export function saveCustomFirebaseConfig(config: Partial<FirebaseClientConfig>): void {
  if (typeof window === 'undefined') return;
  const current = getFirebaseConfig();
  const updated: FirebaseClientConfig = {
    apiKey: config.apiKey || current.apiKey,
    authDomain: config.authDomain || current.authDomain || (config.projectId ? `${config.projectId}.firebaseapp.com` : ''),
    projectId: config.projectId || current.projectId,
    storageBucket: config.storageBucket || current.storageBucket,
    messagingSenderId: config.messagingSenderId || current.messagingSenderId,
    appId: config.appId || current.appId
  };
  localStorage.setItem('tbc_firebase_client_config', JSON.stringify(updated));
  appInstance = null;
  authInstance = null;
}

/**
 * Authenticates with Firebase using Email/Password provider, verifies the exact
 * owner administrator UID, and retrieves a server-verified session token.
 */
export async function authenticateOwnerWithFirebase(
  email: string,
  pass: string
): Promise<{ success: boolean; token?: string; uid?: string; error?: string }> {
  const cleanEmail = email.trim().toLowerCase();
  const cleanPass = pass.trim();

  // Enforce sole authorized owner identity
  if (cleanEmail !== OWNER_ADMIN_EMAIL.toLowerCase()) {
    return {
      success: false,
      error: `Access denied: Only the verified owner administrator email (${OWNER_ADMIN_EMAIL}) is permitted.`
    };
  }

  const auth = getFirebaseAuth();
  if (!auth) {
    return {
      success: false,
      error: 'Firebase Client SDK is not initialized. Please configure your Firebase Web API keys.'
    };
  }

  try {
    // 1. Authenticate with Firebase Auth directly using Email/Password provider
    const credential = await signInWithEmailAndPassword(auth, cleanEmail, cleanPass);
    const user: User = credential.user;

    // 2. Strict UID Authorization Check
    if (user.uid !== OWNER_ADMIN_UID) {
      await firebaseSignOut(auth);
      return {
        success: false,
        error: `Access denied: Authenticated Firebase UID (${user.uid}) does not match the sole authorized owner UID (${OWNER_ADMIN_UID}).`
      };
    }

    // 3. Obtain Firebase ID token for cryptographically verified server-side session
    const idToken = await user.getIdToken(true);

    // 4. Exchange Firebase ID Token with server for an authorized administrator session
    const res = await fetch('/api/admin/firebase-login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${idToken}`
      },
      body: JSON.stringify({
        idToken,
        email: cleanEmail,
        uid: user.uid
      })
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success && data.token) {
        return {
          success: true,
          token: data.token,
          uid: user.uid
        };
      }
      return {
        success: false,
        error: data.error || 'Server failed to verify Firebase administrator ID token.'
      };
    } else {
      const errData = await res.json().catch(() => ({}));
      return {
        success: false,
        error: errData.error || 'Server rejected administrator authorization.'
      };
    }
  } catch (err: any) {
    // Map Firebase Authentication error codes to clear, friendly explanations
    const code = err.code || '';
    if (code === 'auth/invalid-credential' || code === 'auth/wrong-password') {
      return {
        success: false,
        error: 'Incorrect administrator password for hollowaylydia.us@gmail.com in Firebase Authentication.'
      };
    }
    if (code === 'auth/user-not-found') {
      return {
        success: false,
        error: 'No Firebase user found for hollowaylydia.us@gmail.com. Please confirm the account exists in Firebase.'
      };
    }
    if (code === 'auth/too-many-requests') {
      return {
        success: false,
        error: 'Access temporarily disabled due to many failed attempts. Please try again in a few minutes.'
      };
    }
    if (code === 'auth/network-request-failed') {
      return {
        success: false,
        error: 'Network error connecting to Firebase Authentication servers. Check your connection.'
      };
    }
    return {
      success: false,
      error: err.message || 'Firebase Authentication error.'
    };
  }
}
