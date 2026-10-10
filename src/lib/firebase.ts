import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyBic4XvRmfgzB01_uyWjHcaXak-h1u-1Qo',
  authDomain: 'omni-prompt-d1433.firebaseapp.com',
  projectId: 'omni-prompt-d1433',
  storageBucket: 'omni-prompt-d1433.firebasestorage.app',
  messagingSenderId: '318853777124',
  appId: '1:318853777124:web:7a3187ee39b3f51b0e4ef1',
  measurementId: 'G-6QTVVMVY6B',
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
