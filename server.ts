/**
 * OmniPrompt AI – Express backend
 * POST /api/synthesize  – Groq multi-version prompt synthesis
 * POST /api/diagnose    – Groq prompt diagnostic lab
 * GET  /api/health
 * Falls back to local heuristics when GROQ_API_KEY is missing.
 */
import express from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config({ path: ['.env.local', '.env'] });

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT) || 3001;
const GROQ_API_KEY = (process.env.GROQ_API_KEY || '').trim();
const GROQ_MODEL = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';

const app = express();
app.use(express.json({ limit: '1mb' }));
app.use((_req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (_req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});


/* ---------- Auth + per-user history (file-backed) ---------- */
const DATA_DIR = path.join(__dirname, 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const SESSIONS_FILE = path.join(DATA_DIR, 'sessions.json');
const HISTORY_DIR = path.join(DATA_DIR, 'history');

function ensureDataDirs() {
  for (const d of [DATA_DIR, HISTORY_DIR]) {
    if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
  }
  if (!fs.existsSync(USERS_FILE)) fs.writeFileSync(USERS_FILE, '{}');
  if (!fs.existsSync(SESSIONS_FILE)) fs.writeFileSync(SESSIONS_FILE, '{}');
}
ensureDataDirs();

type UserRecord = { id: string; username: string; hash: string; salt: string; createdAt: number };
type SessionRecord = { userId: string; username: string; createdAt: number };

function readJson<T>(file: string, fallback: T): T {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8')) as T;
  } catch {
    return fallback;
  }
}
function writeJson(file: string, data: unknown) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

function hashPassword(password: string, salt?: string) {
  const s = salt || crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, s, 64).toString('hex');
  return { hash, salt: s };
}
function verifyPassword(password: string, hash: string, salt: string) {
  const h = crypto.scryptSync(password, salt, 64).toString('hex');
  return crypto.timingSafeEqual(Buffer.from(h, 'hex'), Buffer.from(hash, 'hex'));
}

function createToken() {
  return crypto.randomBytes(32).toString('hex');
}

function getBearer(req: express.Request): string | null {
  const h = req.headers.authorization || '';
  const m = /^Bearer\s+(.+)$/i.exec(h);
  return m ? m[1].trim() : null;
}

function requireAuth(
  req: express.Request,
  res: express.Response
): SessionRecord | null {
  const token = getBearer(req);
  if (!token) {
    res.status(401).json({ error: 'Login required' });
    return null;
  }
  const sessions = readJson<Record<string, SessionRecord>>(SESSIONS_FILE, {});
  const session = sessions[token];
  if (!session) {
    res.status(401).json({ error: 'Session expired. Please sign in again.' });
    return null;
  }
  return session;
}

function historyFile(userId: string) {
  return path.join(HISTORY_DIR, `${userId}.json`);
}

app.post('/api/auth/register', (req, res) => {
  try {
    const username = String(req.body?.username || '').trim().toLowerCase();
    const password = String(req.body?.password || '');
    if (username.length < 3 || username.length > 32) {
      return res.status(400).json({ error: 'Username must be 3–32 characters' });
    }
    if (!/^[a-z0-9_]+$/.test(username)) {
      return res.status(400).json({ error: 'Username: letters, numbers, underscore only' });
    }
    if (password.length < 4) {
      return res.status(400).json({ error: 'Password must be at least 4 characters' });
    }
    const users = readJson<Record<string, UserRecord>>(USERS_FILE, {});
    if (users[username]) {
      return res.status(409).json({ error: 'Username already taken' });
    }
    const { hash, salt } = hashPassword(password);
    const id = crypto.randomBytes(8).toString('hex');
    users[username] = { id, username, hash, salt, createdAt: Date.now() };
    writeJson(USERS_FILE, users);
    writeJson(historyFile(id), []);

    const token = createToken();
    const sessions = readJson<Record<string, SessionRecord>>(SESSIONS_FILE, {});
    sessions[token] = { userId: id, username, createdAt: Date.now() };
    writeJson(SESSIONS_FILE, sessions);

    res.json({ token, user: { id, username } });
  } catch (e: any) {
    console.error(e);
    res.status(500).json({ error: e?.message || 'Register failed' });
  }
});

app.post('/api/auth/login', (req, res) => {
  try {
    const username = String(req.body?.username || '').trim().toLowerCase();
    const password = String(req.body?.password || '');
    const users = readJson<Record<string, UserRecord>>(USERS_FILE, {});
    const user = users[username];
    if (!user || !verifyPassword(password, user.hash, user.salt)) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }
    const token = createToken();
    const sessions = readJson<Record<string, SessionRecord>>(SESSIONS_FILE, {});
    sessions[token] = { userId: user.id, username: user.username, createdAt: Date.now() };
    writeJson(SESSIONS_FILE, sessions);
    res.json({ token, user: { id: user.id, username: user.username } });
  } catch (e: any) {
    console.error(e);
    res.status(500).json({ error: e?.message || 'Login failed' });
  }
});

app.get('/api/auth/me', (req, res) => {
  const session = requireAuth(req, res);
  if (!session) return;
  res.json({ user: { id: session.userId, username: session.username } });
});

app.post('/api/auth/logout', (req, res) => {
  const token = getBearer(req);
  if (token) {
    const sessions = readJson<Record<string, SessionRecord>>(SESSIONS_FILE, {});
    delete sessions[token];
    writeJson(SESSIONS_FILE, sessions);
  }
  res.json({ ok: true });
});

app.get('/api/history', (req, res) => {
  const session = requireAuth(req, res);
  if (!session) return;
  const items = readJson<unknown[]>(historyFile(session.userId), []);
  res.json({ items });
});

app.post('/api/history', (req, res) => {
  const session = requireAuth(req, res);
  if (!session) return;
  const item = req.body?.item;
  if (!item || typeof item !== 'object') {
    return res.status(400).json({ error: 'item required' });
  }
  const items = readJson<any[]>(historyFile(session.userId), []);
  const next = [item, ...items].slice(0, 40);
  writeJson(historyFile(session.userId), next);
  res.json({ items: next });
});

app.delete('/api/history', (req, res) => {
  const session = requireAuth(req, res);
  if (!session) return;
  writeJson(historyFile(session.userId), []);
  res.json({ items: [] });
});


const hasGroq = Boolean(GROQ_API_KEY && GROQ_API_KEY.startsWith('gsk_'));
if (hasGroq) {
  console.log(`[OmniPrompt] Groq client ready (model: ${GROQ_MODEL})`);
} else {
  console.warn('[OmniPrompt] GROQ_API_KEY missing – local heuristic mode');
}

async function callGroq(system: string, user: string): Promise<string> {
  if (!hasGroq) throw new Error('NO_GROQ');
  const res = await fetch(GROQ_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${GROQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
      temperature: 0.55,
      max_tokens: 4096,
      response_format: { type: 'json_object' },
    }),
  });
  if (!res.ok) {
    const errBody = await res.text().catch(() => '');
    throw new Error(`Groq HTTP ${res.status}: ${errBody.slice(0, 300)}`);
  }
  const data = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const text = data.choices?.[0]?.message?.content?.trim() || '';
  if (!text) throw new Error('Empty Groq response');
  return text;
}

function parseJsonLoose(text: string): any {
  const cleaned = text.replace(/^```json\s*/i, '').replace(/```$/i, '').trim();
  return JSON.parse(cleaned);
}

/* ---------- Local heuristic (covers major material types) ---------- */
function localSynthesize(
  rawInput: string,
  platform = 'cursor',
  outputType = 'web_app',
  depth = 'dev'
) {
  const isHinglish = /mujhe|karna|banani|sake|chahiye|aur|jisme|hai|ho|kar|mein/i.test(rawInput);
  const lang = isHinglish ? 'Hinglish' : 'English';
  const activeVersion =
    depth === 'quick' ? 'simple' : depth === 'pro' ? 'pro' : 'expert';

  const base = {
    originalInput: rawInput,
    detectedLanguage: lang,
    fidelity: 98.5 + Math.random(),
    tokenCount: Math.round(rawInput.split(/\s+/).length * 1.35),
    isBookmarked: false,
    source: 'local' as const,
  };

  // Explicit outputType wins; only use keywords when type is web_app/auto
  let ot = String(outputType || 'web_app').toLowerCase();
  const lower = rawInput.toLowerCase();

  function detectFromText(t: string): string {
    if (/\b(ppt|powerpoint|pitch\s*deck|keynote|slides?|presentation)\b/i.test(t)) return 'ppt';
    if (/\b(pdf|whitepaper|ebook)\b/i.test(t)) return 'pdf';
    if (/\b(research|thesis|dissertation)\b/i.test(t)) return 'research';
    if (/\b(mobile\s*app|android\s*app|ios\s*app|flutter|react\s*native)\b/i.test(t)) return 'mobile_app';
    if (/\b(runway|sora|kling|ai\s*video|cinematic\s*video)\b/i.test(t)) return 'video';
    if (/\b(midjourney|dall-e|flux|logo|portrait|ai\s*image|illustration)\b/i.test(t)) return 'image';
    if (/\b(instagram\s*ad|facebook\s*ad|ad\s*copy|marketing|campaign|viral)\b/i.test(t)) return 'marketing';
    if (/\b(essay|blog\s*post|article|story|novel)\b/i.test(t)) return 'text';
    if (/\b(backend|rest\s*api|graphql|fastapi)\b/i.test(t) && !/website|web\s*app/i.test(t)) return 'backend';
    if (/\b(frontend|html5|landing\s*page)\b/i.test(t) && !/full\s*stack/i.test(t)) return 'frontend';
    if (/logo|poster|banner/i.test(t)) return 'image';
    if (/video|reel|youtube/i.test(t)) return 'video';
    if (/\bad\b|ads|campaign|marketing/i.test(t)) return 'marketing';
    if (/mobile\s*app|android|flutter/i.test(t)) return 'mobile_app';
    if (/website|web\s*site|site\s*banani|ecommerce/i.test(t)) return 'web_app';
    return 'web_app';
  }

  if (!ot || ot === 'web_app' || ot === 'auto') {
    const d = detectFromText(rawInput);
    if (d !== 'web_app') ot = d;
  }

  if (ot === 'ppt') {
    return {
      ...base,
      materialType: 'ppt',
      decodedIntent: 'Investor / Product Pitch Deck',
      intentCode: 'PPT-DECK',
      extractedRequirements: ['10-slide arc', 'Speaker notes', 'Visual layout', 'CTA slide', 'Metrics'],
      smartAssumptions: ['Assumed 16:9 keynote format, 10 slides, dark cosmic theme.'],
      qualityScore: { overall: 93, grade: 'Expert', readyPercent: 98, clarity: 94, specificity: 92, context: 93, constraints: 90, platformFit: 95 },
      versions: {
        simple: `Create a 10-slide pitch deck for: ${rawInput}`,
        pro: `Role: Presentation Strategist\nBuild a 10-slide 16:9 pitch deck for: ${rawInput}\nInclude speaker notes, visual hierarchy, and a clear CTA.`,
        expert: `Role: Principal Presentation Architect\nObjective: Production-ready 10-slide 16:9 keynote for:\n"${rawInput}"\n\nStructure: Hook → Problem → Solution → Product → Market → Business Model → Traction → Team → Ask → Close.\nConstraints: Dark cosmic palette, large type, max 25 words/slide body, speaker notes 40–60 words.\nDeliver: Slide-by-slide blueprint with layout math and speaker scripts.`,
      },
      activeVersion,
      targetStack: 'Gamma / Pitch / Keynote',
      tokensTotal: 280,
    };
  }

  if (ot === 'pdf') {
    return {
      ...base,
      materialType: 'pdf',
      decodedIntent: 'Structured Multi-page Document / Whitepaper',
      intentCode: 'PDF-DOC',
      extractedRequirements: ['A4 layout', 'TOC', '2-column body', 'Figures', 'Citations'],
      smartAssumptions: ['Assumed A4, professional typography, APA-style references where needed.'],
      qualityScore: { overall: 92, grade: 'Expert', readyPercent: 97, clarity: 93, specificity: 91, context: 92, constraints: 90, platformFit: 94 },
      versions: {
        simple: `Write a structured PDF whitepaper about: ${rawInput}`,
        pro: `Role: Technical Writer\nProduce a multi-page A4 whitepaper on: ${rawInput}\nInclude abstract, sections, figures placeholders, and conclusion.`,
        expert: `Role: Principal Technical Author\nObjective: Publication-grade A4 whitepaper for:\n"${rawInput}"\n\nSections: Abstract, Intro, Background, Method/Approach, Findings, Discussion, Conclusion, References.\nLayout: 2-column body, heading hierarchy H1–H3, figure captions, page numbers.\nOutput: Full outline + sample section prose + design tokens.`,
      },
      activeVersion,
      targetStack: 'LaTeX / Notion / Docs',
      tokensTotal: 310,
    };
  }

  if (ot === 'mobile_app') {
    return {
      ...base,
      materialType: 'mobile_app',
      decodedIntent: 'Cross-Platform Mobile Application',
      intentCode: 'MOBILE-APP',
      extractedRequirements: ['Auth', 'Navigation', 'Offline cache', 'Push', 'Safe areas'],
      smartAssumptions: ['Assumed React Native or Flutter with typed API client and secure storage.'],
      qualityScore: { overall: 94, grade: 'Expert', readyPercent: 98.5, clarity: 95, specificity: 93, context: 94, constraints: 92, platformFit: 96 },
      versions: {
        simple: `Build a mobile app: ${rawInput}`,
        pro: `Role: Mobile Engineer\nBuild production RN/Flutter app for: ${rawInput}\nInclude auth, navigation, and offline support.`,
        expert: `Role: Principal Mobile Architect\nObjective: Ship-ready cross-platform app for:\n"${rawInput}"\n\nStack: React Native (Expo) or Flutter, typed API, secure token storage, deep links.\nModules: Auth, main nav, core feature screens, offline cache, push notifications.\nDeliver: File tree, key screens, state model, API contracts — no placeholder stubs.`,
      },
      activeVersion,
      targetStack: platform === 'flutter' ? 'Flutter' : 'React Native / Expo',
      tokensTotal: 340,
    };
  }

  if (ot === 'image') {
    return {
      ...base,
      materialType: 'image',
      decodedIntent: 'Hyper-Realistic Visual Asset Generation',
      intentCode: 'VISUAL-GEN',
      extractedRequirements: ['Aspect ratio', 'Lens/optics', 'Lighting', 'Style raw', 'Negative prompts'],
      smartAssumptions: ['Assumed Midjourney v6.1 / Flux with --style raw and high detail.'],
      qualityScore: { overall: 92, grade: 'Expert', readyPercent: 98, clarity: 94, specificity: 93, context: 91, constraints: 90, platformFit: 97 },
      versions: {
        simple: `${rawInput} --ar 1:1`,
        pro: `Cinematic ${rawInput}, volumetric light, 85mm, subsurface scattering --ar 16:9 --v 6.1 --style raw`,
        expert: `${rawInput}, hyper-detailed, 85mm portrait optics, chiaroscuro rim lighting, Kodak Portra grade, high negative space --ar 16:9 --v 6.1 --style raw --no blur, watermark, text`,
      },
      activeVersion: 'expert',
      targetStack: 'Midjourney v6.1 / Flux',
      tokensTotal: 160,
    };
  }

  if (ot === 'marketing') {
    return {
      ...base,
      materialType: 'marketing',
      decodedIntent: 'High-Converting Marketing Copy',
      intentCode: 'MKT-COPY',
      extractedRequirements: ['Hook', 'Agitation', 'Offer', 'CTA', 'Social proof'],
      smartAssumptions: ['Assumed short-form social + WhatsApp-friendly length for Indian audiences when Hinglish detected.'],
      qualityScore: { overall: 93, grade: 'Expert', readyPercent: 98, clarity: 95, specificity: 92, context: 94, constraints: 91, platformFit: 95 },
      versions: {
        simple: `Write ad copy for: ${rawInput}`,
        pro: `Role: Performance Copywriter\nWrite high-converting ad/script for: ${rawInput}\nHook in 3s, clear offer, strong CTA.`,
        expert: `Role: Principal Growth Copywriter\nObjective: Production ad system for:\n"${rawInput}"\n\nStructure: Pattern interrupt → Problem agitation → Mechanism → Offer → Proof → CTA.\nVariants: Primary, short WhatsApp, Instagram caption.\nTone: ${lang === 'Hinglish' ? 'Hinglish, warm, urgent' : 'Clear, benefit-led'}.\nConstraints: No banned claims; mobile-first line breaks.`,
      },
      activeVersion,
      targetStack: `${platform} / Ads`,
      tokensTotal: 260,
    };
  }

  if (ot === 'backend') {
    return {
      ...base,
      materialType: 'backend',
      decodedIntent: 'Production Backend / API Service',
      intentCode: 'API-BACKEND',
      extractedRequirements: ['Auth', 'Schema', 'Validation', 'Webhooks', 'Idempotency'],
      smartAssumptions: ['Assumed TypeScript or Python, strict validation, zero secret leakage.'],
      qualityScore: { overall: 95, grade: 'Expert', readyPercent: 99, clarity: 96, specificity: 94, context: 95, constraints: 94, platformFit: 97 },
      versions: {
        simple: `Build API for: ${rawInput}`,
        pro: `Role: Backend Engineer\nDesign REST/GraphQL service for: ${rawInput}\nInclude auth, validation, and error model.`,
        expert: `Role: Principal Backend Architect\nObjective: Production API for:\n"${rawInput}"\n\nConstraints: Typed schemas, idempotent webhooks, rate limits, structured errors, no client secret exposure.\nDeliverables: Route map, DB schema, auth flow, sample handlers, env template.`,
      },
      activeVersion,
      targetStack: 'Node/Express or FastAPI',
      tokensTotal: 320,
    };
  }


  if (ot === 'video') {
    return {
      ...base,
      materialType: 'video',
      decodedIntent: 'Cinematic AI Video Generation',
      intentCode: 'VIDEO-GEN',
      extractedRequirements: ['Shot list', 'Camera motion', 'Lens', 'Lighting', 'Audio cues'],
      smartAssumptions: ['Assumed Runway Gen-3 / Sora-style cinematic prompt with camera grammar.'],
      qualityScore: { overall: 93, grade: 'Expert', readyPercent: 98, clarity: 94, specificity: 93, context: 92, constraints: 91, platformFit: 96 },
      versions: {
        simple: `Cinematic video: ${rawInput}`,
        pro: `Cinematic sequence for: ${rawInput}\nCamera: slow push-in, shallow DOF, natural light.`,
        expert: `Role: AI Video Director\nObjective: Production Runway/Sora prompt for:\n"${rawInput}"\n\nShot list: establishing → detail → hero action.\nCamera: anamorphic, 35mm, gentle orbit, motivated practical lights.\nNegative: blur, watermark, text overlay, jitter.\nDeliver: one master prompt + 2 variation prompts.`,
      },
      activeVersion,
      targetStack: 'Runway Gen-3 / Sora',
      tokensTotal: 200,
    };
  }

  if (ot === 'frontend') {
    return {
      ...base,
      materialType: 'frontend',
      decodedIntent: 'Semantic Frontend / HTML5 UI',
      intentCode: 'FRONTEND-UI',
      extractedRequirements: ['Semantic HTML5', 'Responsive layout', 'Accessibility', 'Design system'],
      smartAssumptions: ['Assumed Tailwind + accessible components, no backend scope.'],
      qualityScore: { overall: 93, grade: 'Expert', readyPercent: 98, clarity: 95, specificity: 92, context: 93, constraints: 91, platformFit: 95 },
      versions: {
        simple: `Build frontend UI for: ${rawInput}`,
        pro: `Role: Frontend Engineer\nDeliver accessible HTML5 + Tailwind UI for: ${rawInput}`,
        expert: `Role: Principal UI Engineer\nObjective: Production semantic frontend for:\n"${rawInput}"\n\nDeliver: index.html structure, component breakdown, Tailwind tokens, a11y checklist — client UI only.`,
      },
      activeVersion,
      targetStack: 'HTML5 / Tailwind / React',
      tokensTotal: 280,
    };
  }

  if (ot === 'text') {
    return {
      ...base,
      materialType: 'text',
      decodedIntent: 'Long-form Text & Narrative',
      intentCode: 'TEXT-PROSE',
      extractedRequirements: ['Structure', 'Voice', 'Audience', 'Length', 'CTA optional'],
      smartAssumptions: ['Assumed clear audience and practical tone matching user language.'],
      qualityScore: { overall: 92, grade: 'Expert', readyPercent: 97, clarity: 94, specificity: 91, context: 93, constraints: 90, platformFit: 94 },
      versions: {
        simple: `Write about: ${rawInput}`,
        pro: `Role: Senior Writer\nProduce structured long-form content for: ${rawInput}`,
        expert: `Role: Principal Editor\nObjective: Publication-ready text for:\n"${rawInput}"\n\nOutline → draft voice → section goals → final polished piece. No generic AI fluff.`,
      },
      activeVersion,
      targetStack: 'Docs / Blog / Narrative',
      tokensTotal: 240,
    };
  }

  if (ot === 'research') {
    return {
      ...base,
      materialType: 'research',
      decodedIntent: 'Academic Research Study',
      intentCode: 'RESEARCH',
      extractedRequirements: ['Hypothesis', 'Methodology', 'Citations', 'Limitations'],
      smartAssumptions: ['Assumed empirical structure with clear research questions.'],
      qualityScore: { overall: 93, grade: 'Expert', readyPercent: 98, clarity: 94, specificity: 93, context: 94, constraints: 92, platformFit: 95 },
      versions: {
        simple: `Research plan for: ${rawInput}`,
        pro: `Role: Research Methodologist\nDesign study protocol for: ${rawInput}`,
        expert: `Role: Principal Investigator\nObjective: Rigorous research blueprint for:\n"${rawInput}"\n\nInclude RQ, H0/H1, method, sampling, analysis plan, limitations, APA citation style.`,
      },
      activeVersion,
      targetStack: 'Academic / APA',
      tokensTotal: 300,
    };
  }

  // Default: full-stack / web app
  return {
    ...base,
    materialType: 'web_app',
    decodedIntent: 'Full-Stack Web Application',
    intentCode: 'WEB-APP',
    extractedRequirements: ['Auth', 'Core CRUD', 'Payments optional', 'Responsive UI', 'Admin'],
    smartAssumptions: [
      'Assumed Next.js App Router, Tailwind, typed DB, and production error handling.',
    ],
    qualityScore: {
      overall: 94,
      grade: 'Expert',
      readyPercent: 99,
      clarity: 96,
      specificity: 93,
      context: 95,
      constraints: 92,
      platformFit: 96,
    },
    versions: {
      simple: `Role: Web Developer\nBuild: ${rawInput}\nStack: React, Node, DB.`,
      pro: `Role: Senior Full-Stack Engineer\nBuild production web app for: ${rawInput}\nNext.js + Tailwind + auth + core flows.`,
      expert: `Role: Senior Full-Stack Architect\nObjective: End-to-end production web app for:\n"${rawInput}"\n\nStack: Next.js App Router, TypeScript, Tailwind, PostgreSQL, auth with RBAC.\nModules: Auth, main product flows, payments if needed, admin basics.\nDeliver: Architecture, file tree, key routes, schema, env — production code only, no stubs.`,
    },
    activeVersion,
    targetStack: `${String(platform).toUpperCase()} / Next.js / Claude`,
    tokensTotal: 330,
  };
}

function localDiagnose(sourcePrompt: string, targetPlatform: string) {
  const scoreBefore = Math.min(55, Math.max(28, 65 - Math.floor(sourcePrompt.length / 10)));
  const scoreAfter = Math.min(97, scoreBefore + 38 + Math.floor(Math.random() * 8));
  return {
    sourcePrompt,
    targetPlatform,
    charCount: sourcePrompt.length,
    tokenCount: Math.round(sourcePrompt.split(/\s+/).length * 1.3),
    flaws: [
      {
        id: 'flaw-1',
        title: 'Ambiguous Scope',
        description: 'No clear audience, domain, or success criteria',
        severity: 'critical' as const,
      },
      {
        id: 'flaw-2',
        title: 'Missing Constraints',
        description: 'No stack, responsive rules, or validation requirements',
        severity: 'critical' as const,
      },
      {
        id: 'flaw-3',
        title: 'Platform Framing',
        description: 'Lacks system-instruction structure for the target model',
        severity: 'moderate' as const,
      },
    ],
    scoreBefore,
    scoreAfter,
    improvementPts: scoreAfter - scoreBefore,
    synthesizedTime: '0.9s',
    enhancedPrompt: {
      role: 'Senior Engineer',
      techStack: 'Modern TypeScript stack',
      requirements: 'Clear domain, constraints, production quality, accessible UI',
      designSystem: 'High-contrast, WCAG AA',
      fullFormatted: `Role: Senior Engineer
Tech Stack: Modern TypeScript stack
Requirements: Clear domain context, explicit constraints, production-ready error handling.
Design System: High-contrast, WCAG AA accessible UI.

Expanded intent:
${sourcePrompt}`,
    },
    enhancedTokens: 110,
    source: 'local',
  };
}

/* ---------- Routes ---------- */
app.get('/api/health', (_req, res) => {
  res.json({ ok: true, groq: hasGroq, version: '1.2.0', name: 'OmniPrompt AI' });
});

app.post('/api/synthesize', async (req, res) => {
  try {
    const {
      prompt = '',
      platform = 'cursor',
      outputType = 'web_app',
      depth = 'dev',
    } = req.body || {};

    if (!prompt || typeof prompt !== 'string' || prompt.trim().length < 3) {
      return res.status(400).json({ error: 'prompt is required (min 3 chars)' });
    }
    const rawInput = prompt.trim();

    if (!hasGroq) {
      return res.json(localSynthesize(rawInput, platform, outputType, depth));
    }

    const system = `You are OmniPrompt, an elite multi-agent prompt engineering engine.
Return ONLY valid JSON matching this schema (no markdown fences):
{
  "originalInput": string,
  "detectedLanguage": string,
  "materialType": string,
  "fidelity": number,
  "tokenCount": number,
  "decodedIntent": string,
  "intentCode": string,
  "extractedRequirements": string[],
  "smartAssumptions": string[],
  "qualityScore": {
    "overall": number, "grade": string, "readyPercent": number,
    "clarity": number, "specificity": number, "context": number,
    "constraints": number, "platformFit": number
  },
  "versions": { "simple": string, "pro": string, "expert": string },
  "activeVersion": "simple" | "pro" | "expert",
  "targetStack": string,
  "tokensTotal": number,
  "isBookmarked": false
}
CRITICAL RULES:
1. materialType MUST equal "${outputType}" (or the closest match if outputType is web_app and the user clearly wants something else: image|video|marketing|mobile_app|ppt|pdf|text|backend|frontend|research).
2. NEVER force a website/web-app prompt if the user asked for image, video, marketing, ads, logo, mobile app, PPT, PDF, or text.
3. versions.simple / pro / expert must be prompts for THAT material type only (e.g. Midjourney prompt for image, ad copy brief for marketing, RN/Flutter brief for mobile_app).
4. Detect Hinglish/Hindi. Tailor to platform=${platform}, depth=${depth}.
5. Expert version must be copy-paste ready and production-oriented.`;

    const user = `Raw request:\n"""${rawInput}"""\nPlatform: ${platform}\nOutputType: ${outputType}\nDepth: ${depth}`;

    try {
      const text = await callGroq(system, user);
      const parsed = parseJsonLoose(text);
      parsed.originalInput = rawInput;
      parsed.isBookmarked = false;
      parsed.source = 'groq';
      if (!parsed.versions) {
        const fb = localSynthesize(rawInput, platform, outputType, depth);
        parsed.versions = fb.versions;
      }
      if (!parsed.activeVersion) {
        parsed.activeVersion =
          depth === 'quick' ? 'simple' : depth === 'pro' ? 'pro' : 'expert';
      }
      return res.json(parsed);
    } catch (err) {
      console.error('[synthesize] Groq failed, local fallback:', err);
      return res.json(localSynthesize(rawInput, platform, outputType, depth));
    }
  } catch (e: any) {
    console.error(e);
    res.status(500).json({ error: e?.message || 'Internal error' });
  }
});

app.post('/api/diagnose', async (req, res) => {
  try {
    const { prompt = '', targetPlatform = 'GPT-4o' } = req.body || {};
    if (!prompt || typeof prompt !== 'string' || prompt.trim().length < 3) {
      return res.status(400).json({ error: 'prompt is required' });
    }
    const sourcePrompt = prompt.trim();

    if (!hasGroq) {
      return res.json(localDiagnose(sourcePrompt, targetPlatform));
    }

    const system = `You are OmniPrompt Diagnostic Lab. Analyze a weak prompt and improve it.
Return ONLY valid JSON:
{
  "sourcePrompt": string,
  "targetPlatform": string,
  "charCount": number,
  "tokenCount": number,
  "flaws": [{ "id": string, "title": string, "description": string, "severity": "critical"|"moderate"|"low" }],
  "scoreBefore": number,
  "scoreAfter": number,
  "improvementPts": number,
  "synthesizedTime": string,
  "enhancedPrompt": {
    "role": string, "techStack": string, "requirements": string,
    "designSystem": string, "fullFormatted": string
  },
  "enhancedTokens": number
}
List 2-5 real flaws. Preserve intent. Frame for ${targetPlatform}.`;

    const user = `Weak prompt:\n"""${sourcePrompt}"""\nTarget: ${targetPlatform}`;

    try {
      const text = await callGroq(system, user);
      const parsed = parseJsonLoose(text);
      parsed.sourcePrompt = sourcePrompt;
      parsed.targetPlatform = targetPlatform;
      parsed.charCount = sourcePrompt.length;
      parsed.source = 'groq';
      return res.json(parsed);
    } catch (err) {
      console.error('[diagnose] Groq failed, local fallback:', err);
      return res.json(localDiagnose(sourcePrompt, targetPlatform));
    }
  } catch (e: any) {
    console.error(e);
    res.status(500).json({ error: e?.message || 'Internal error' });
  }
});

const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  res.sendFile(path.join(distPath, 'index.html'), (err) => {
    if (err) next();
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[OmniPrompt] API on http://0.0.0.0:${PORT} | Groq: ${hasGroq ? 'ON' : 'OFF (local)'}`);
});
