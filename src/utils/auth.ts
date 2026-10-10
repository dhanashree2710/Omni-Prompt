import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  User,
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

export interface AuthUser {
  id: string;
  username: string;
  email: string;
}

function toAuthUser(user: User): AuthUser {
  const email = user.email || '';
  const username =
    user.displayName ||
    (email.includes('@') ? email.split('@')[0] : email) ||
    'user';
  return { id: user.uid, username, email };
}

export function getStoredUser(): AuthUser | null {
  const u = auth.currentUser;
  return u ? toAuthUser(u) : null;
}

/** Wait for Firebase to restore session from IndexedDB */
export function fetchMe(): Promise<AuthUser | null> {
  return new Promise((resolve) => {
    const unsub = onAuthStateChanged(auth, (user) => {
      unsub();
      resolve(user ? toAuthUser(user) : null);
    });
  });
}

export async function register(email: string, password: string, displayName?: string) {
  const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
  const name = (displayName || email.split('@')[0] || 'user').trim();
  try {
    await updateProfile(cred.user, { displayName: name });
  } catch {
    /* optional */
  }
  try {
    await setDoc(doc(db, 'users', cred.user.uid), {
      email: cred.user.email,
      displayName: name,
      createdAt: serverTimestamp(),
    });
  } catch {
    /* rules may block until user enables Firestore */
  }
  return { user: toAuthUser(cred.user) };
}

export async function login(email: string, password: string) {
  const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
  return { user: toAuthUser(cred.user) };
}

export async function logout() {
  await signOut(auth);
}

export function authHeaders(): HeadersInit {
  return { 'Content-Type': 'application/json' };
}

/** Map Firebase auth errors to readable messages */
export function authErrorMessage(err: unknown): string {
  const code = (err as { code?: string })?.code || '';
  const map: Record<string, string> = {
    'auth/email-already-in-use': 'This email is already registered',
    'auth/invalid-email': 'Invalid email address',
    'auth/weak-password': 'Password should be at least 6 characters',
    'auth/user-not-found': 'No account found with this email',
    'auth/wrong-password': 'Incorrect password',
    'auth/invalid-credential': 'Invalid email or password',
    'auth/too-many-requests': 'Too many attempts. Try again later',
    'auth/network-request-failed': 'Network error. Check your connection',
  };
  if (map[code]) return map[code];
  if (err instanceof Error) return err.message;
  return 'Authentication failed';
}
