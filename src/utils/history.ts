import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  limit,
  writeBatch,
} from 'firebase/firestore';
import { PromptSynthesis } from '../types';
import { getStoredUser } from './auth';
import { db } from '../lib/firebase';

export interface HistoryItem {
  id: string;
  title: string;
  timeAgo: string;
  engine: string;
  engineIcon: string;
  tag: string;
  tagColor: 'tertiary' | 'secondary' | 'primary';
  snippet: string;
  fullPrompt: string;
  createdAt: number;
}

const MAX = 40;

function historyCol(uid: string) {
  return collection(db, 'users', uid, 'history');
}

function localKey(uid: string) {
  return `omniprompt_history_${uid}`;
}

function readLocal(uid: string): HistoryItem[] {
  try {
    const raw = localStorage.getItem(localKey(uid));
    if (!raw) return [];
    return JSON.parse(raw) as HistoryItem[];
  } catch {
    return [];
  }
}

function writeLocal(uid: string, items: HistoryItem[]) {
  try {
    localStorage.setItem(localKey(uid), JSON.stringify(items.slice(0, MAX)));
  } catch {
    /* ignore */
  }
}

export function loadHistory(): HistoryItem[] {
  const user = getStoredUser();
  if (!user) return [];
  return readLocal(user.id);
}

export function saveHistoryItem(
  synthesis: PromptSynthesis,
  engine = 'Cursor'
): HistoryItem[] {
  const user = getStoredUser();
  if (!user) return [];

  const prompt =
    synthesis.versions[synthesis.activeVersion || 'expert'] ||
    synthesis.versions.expert;
  const item: HistoryItem = {
    id: `h-${Date.now()}`,
    title: (synthesis.decodedIntent || 'Prompt').slice(0, 48),
    timeAgo: 'Just now',
    engine,
    engineIcon: 'terminal',
    tag: synthesis.intentCode || 'PROMPT',
    tagColor: 'tertiary',
    snippet: prompt.slice(0, 100) + (prompt.length > 100 ? '…' : ''),
    fullPrompt: prompt,
    createdAt: Date.now(),
  };

  const next = [item, ...readLocal(user.id)].slice(0, MAX);
  writeLocal(user.id, next);

  addDoc(historyCol(user.id), {
    title: item.title,
    engine: item.engine,
    engineIcon: item.engineIcon,
    tag: item.tag,
    tagColor: item.tagColor,
    snippet: item.snippet,
    fullPrompt: item.fullPrompt,
    createdAt: item.createdAt,
  }).catch((e) => console.warn('[history] Firestore write failed', e));

  return next;
}

export function clearHistory(): void {
  const user = getStoredUser();
  if (!user) return;
  writeLocal(user.id, []);

  (async () => {
    try {
      const snap = await getDocs(historyCol(user.id));
      const batch = writeBatch(db);
      snap.docs.forEach((d) => batch.delete(d.ref));
      await batch.commit();
    } catch (e) {
      console.warn('[history] Firestore clear failed', e);
    }
  })();
}

export async function syncHistoryFromServer(): Promise<HistoryItem[]> {
  const user = getStoredUser();
  if (!user) return [];

  try {
    const q = query(historyCol(user.id), orderBy('createdAt', 'desc'), limit(MAX));
    const snap = await getDocs(q);
    const items: HistoryItem[] = snap.docs.map((d) => {
      const data = d.data() as Omit<HistoryItem, 'id' | 'timeAgo'>;
      return {
        id: d.id,
        title: data.title || 'Prompt',
        timeAgo: '',
        engine: data.engine || 'Cursor',
        engineIcon: data.engineIcon || 'terminal',
        tag: data.tag || 'PROMPT',
        tagColor: data.tagColor || 'tertiary',
        snippet: data.snippet || '',
        fullPrompt: data.fullPrompt || '',
        createdAt: data.createdAt || Date.now(),
      };
    });
    writeLocal(user.id, items);
    return items;
  } catch (e) {
    console.warn('[history] Firestore sync failed, using local', e);
    return readLocal(user.id);
  }
}

export function formatTimeAgo(ts: number): string {
  const sec = Math.floor((Date.now() - ts) / 1000);
  if (sec < 60) return 'Just now';
  if (sec < 3600) return `${Math.floor(sec / 60)}m ago`;
  if (sec < 86400) return `${Math.floor(sec / 3600)}h ago`;
  if (sec < 172800) return 'Yesterday';
  return `${Math.floor(sec / 86400)}d ago`;
}
