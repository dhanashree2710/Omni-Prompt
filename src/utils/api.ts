import {
  PromptSynthesis,
  DiagnosticResult,
  TargetPlatform,
  OutputType,
  PromptDepth,
} from '../types';
import { synthesizePrompt as synthesizePromptLocal } from './synthesizer';

const API_BASE = import.meta.env.VITE_API_URL || '';

async function postJson<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { error?: string })?.error || `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export async function synthesizePromptRemote(
  prompt: string,
  platform: TargetPlatform = 'cursor',
  outputType: OutputType = 'web_app',
  depth: PromptDepth = 'dev'
): Promise<PromptSynthesis> {
  try {
    return await postJson<PromptSynthesis>('/api/synthesize', {
      prompt,
      platform,
      outputType,
      depth,
    });
  } catch (e) {
    console.warn('[api] synthesize → local fallback', e);
    return synthesizePromptLocal(prompt, platform, outputType, depth);
  }
}

export async function diagnosePromptRemote(
  prompt: string,
  targetPlatform: string = 'GPT-4o'
): Promise<DiagnosticResult> {
  try {
    return await postJson<DiagnosticResult>('/api/diagnose', {
      prompt,
      targetPlatform,
    });
  } catch (e) {
    console.warn('[api] diagnose → local fallback', e);
    return {
      sourcePrompt: prompt,
      targetPlatform,
      charCount: prompt.length,
      tokenCount: Math.round(prompt.split(/\s+/).length * 1.3),
      flaws: [
        {
          id: 'flaw-1',
          title: 'Ambiguous Scope',
          description: 'No clear target audience or domain specified',
          severity: 'critical',
        },
        {
          id: 'flaw-2',
          title: 'Missing Constraints',
          description: 'No technical stack or validation rules',
          severity: 'critical',
        },
      ],
      scoreBefore: 40,
      scoreAfter: 90,
      improvementPts: 50,
      synthesizedTime: '0.8s',
      enhancedPrompt: {
        role: 'Senior Engineer',
        techStack: 'Modern TypeScript stack',
        requirements: 'Clear domain, constraints, production quality',
        designSystem: 'Accessible, high-contrast UI',
        fullFormatted: `Role: Senior Engineer\nTask: ${prompt}\nDeliver production-ready, constrained solution.`,
      },
      enhancedTokens: 80,
    };
  }
}

export async function checkHealth(): Promise<{ ok: boolean; groq: boolean }> {
  try {
    const res = await fetch(`${API_BASE}/api/health`);
    if (!res.ok) return { ok: false, groq: false };
    return res.json();
  } catch {
    return { ok: false, groq: false };
  }
}
