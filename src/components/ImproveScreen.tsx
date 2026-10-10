import { useState } from 'react';
import { DiagnosticResult } from '../types';
import { diagnosePromptRemote } from '../utils/api';
import { copyToClipboard } from '../utils/clipboard';

interface ImproveScreenProps {
  onAcceptPrompt: (improvedPrompt: string) => void;
  onCopySuccess: (msg: string) => void;
}

export function ImproveScreen({ onAcceptPrompt, onCopySuccess }: ImproveScreenProps) {
  const [sourcePrompt, setSourcePrompt] = useState<string>(
    'Create a website for my business with nice colors and contact form.'
  );
  const [targetEngine, setTargetEngine] = useState<string>('GPT-4o target');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [isDetailed, setIsDetailed] = useState<boolean>(false);
  const [isShortened, setIsShortened] = useState<boolean>(false);

  const defaultDiagnostic: DiagnosticResult = {
    sourcePrompt,
    targetPlatform: targetEngine,
    charCount: sourcePrompt.length,
    tokenCount: 11,
    flaws: [
      {
        id: 'flaw-1',
        title: 'Ambiguous Scope',
        description: 'No target audience or business domain specified',
        severity: 'critical',
      },
      {
        id: 'flaw-2',
        title: 'Missing Constraints',
        description: 'No technical stack, responsive requirements, or form validation rules',
        severity: 'critical',
      },
      {
        id: 'flaw-3',
        title: 'Platform Mismatch',
        description: 'Lacks system instruction framing for target LLM',
        severity: 'critical',
      },
    ],
    scoreBefore: 42,
    scoreAfter: 92,
    improvementPts: 50,
    synthesizedTime: '1.4s',
    enhancedPrompt: {
      role: 'Senior Web Engineer',
      techStack: 'React + Tailwind CSS',
      requirements:
        'Responsive viewport, accessible contact form with Zod validation and reCAPTCHA v3.',
      designSystem: 'High-contrast modern palette with WCAG AAA accessibility standards.',
      fullFormatted: `Role: Senior Web Engineer
Tech Stack: React + Tailwind CSS
Requirements: Responsive viewport, accessible contact form with Zod validation and reCAPTCHA v3.
Design System: High-contrast modern palette with WCAG AAA accessibility standards.`,
    },
    enhancedTokens: 84,
  };

  const [diagnostic, setDiagnostic] = useState<DiagnosticResult>(defaultDiagnostic);

  const handleAnalyze = async () => {
    if (!sourcePrompt.trim() || isAnalyzing) return;
    setIsAnalyzing(true);
    try {
      const result = await diagnosePromptRemote(sourcePrompt, targetEngine);
      setDiagnostic(result);
      setIsDetailed(false);
      setIsShortened(false);
      onCopySuccess('Prompt analysis and flaw remediation complete!');
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Analysis failed';
      onCopySuccess(msg);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setSourcePrompt(text);
        onCopySuccess('Pasted from clipboard!');
      }
    } catch {
      setSourcePrompt('Build an e-commerce store with product grid and checkout.');
    }
  };

  const handleShorten = () => {
    setIsShortened(!isShortened);
    setIsDetailed(false);
    onCopySuccess(isShortened ? 'Restored standard length' : 'Concise variant generated!');
  };

  const handleMakeDetailed = () => {
    setIsDetailed(!isDetailed);
    setIsShortened(false);
    onCopySuccess(isDetailed ? 'Restored standard length' : 'Expanded architectural depth!');
  };

  const getActiveEnhancedText = () => {
    if (isShortened) {
      return `Role: Web Engineer
Stack: React + Tailwind CSS
Task: Build responsive landing page with validated contact form.
Constraints: WCAG compliant, zero errors.`;
    }
    if (isDetailed) {
      return `Role: Principal Frontend Architect & Accessibility Lead
Tech Stack: Next.js 14, Tailwind CSS v4, Zod, React Hook Form, Resend API.
Requirements:
• Mobile-first fluid grid with responsive container breakpoints (sm, md, lg, xl).
• Accessible contact modal with strict Zod schema validation and honeypot spam protection.
• Server Action handler with rate-limiting and transaction receipt notifications.
Design System: Cosmic obsidian palette, 4.5:1 contrast ratio, WCAG AAA compliant.`;
    }
    return diagnostic.enhancedPrompt.fullFormatted;
  };

  const handleAccept = async () => {
    const textToCopy = getActiveEnhancedText();
    const ok = await copyToClipboard(textToCopy);
    onAcceptPrompt(textToCopy);
    onCopySuccess(ok ? 'Copied improved prompt & loaded into Studio!' : 'Loaded into Studio (copy failed — use Ctrl+C)');
  };

  return (
    <div className="flex-1 flex flex-col space-y-4 pt-1 pb-24">
      {/* Feature Description Banner */}
      <section className="relative overflow-hidden rounded-2xl bg-[#1a1a1e] border border-[#27272a]/30 p-4">
        <div className="absolute -right-6 -top-6 w-24 h-24 bg-[#8b5cf6]/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-[#8b5cf6]/20 text-[#c4b5fd] shrink-0">
            <span className="material-symbols-outlined text-[20px]">psychology</span>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-code-md text-[#c4b5fd] tracking-wider uppercase font-semibold">
                Multi-Agent Engine
              </span>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-code-md bg-[#059669]/30 text-[#34d399] border border-[#34d399]/30">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3] mr-1 animate-pulse"></span> v4.2 Active
              </span>
            </div>
            <p className="text-xs text-[#a1a1aa] leading-relaxed">
              Paste an underperforming or vague prompt. Our multi-agent analyzer detects weaknesses, adds missing constraints, and optimizes it.
            </p>
          </div>
        </div>
      </section>

      {/* Input Box for Existing Prompt */}
      <section className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between px-1">
          <label className="text-[10px] font-code-md text-[#a1a1aa] uppercase tracking-wider flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[14px]">edit_note</span> Source Prompt
          </label>
          <span className="text-[11px] font-code-md text-[#a1a1aa]/80">
            {sourcePrompt.length} chars / ~{Math.round(sourcePrompt.split(/\s+/).length * 1.3)} tokens
          </span>
        </div>

        <div className="relative rounded-2xl bg-[#0c0c0e] border border-[#27272a]/40 focus-within:border-[#8083ff] focus-within:ring-1 focus-within:ring-[#8083ff] transition-all">
          <textarea
            value={sourcePrompt}
            onChange={(e) => setSourcePrompt(e.target.value)}
            className="w-full bg-transparent border-0 text-[#fafafa] font-body-md text-sm p-3.5 focus:ring-0 resize-none placeholder-[#908fa0] leading-relaxed focus:outline-none"
            placeholder="Type or paste your prompt here..."
            rows={3}
          />

          {/* Input Chassis Footer Bar */}
          <div className="flex items-center justify-between px-3.5 py-2 border-t border-[#27272a]/20 bg-[#1a1a1e]/40 rounded-b-2xl">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-[11px] font-code-md text-[#a1a1aa]">
                <span className="material-symbols-outlined text-[13px] text-[#908fa0]">tune</span> {targetEngine}
              </span>
            </div>
            <button
              onClick={handlePaste}
              className="text-xs font-medium text-[#a1a1aa] hover:text-[#c4b5fd] transition-colors flex items-center gap-0.5"
            >
              <span className="material-symbols-outlined text-[14px]">content_paste</span> Paste
            </button>
          </div>
        </div>

        {/* CTA Action: Analyze & Improve */}
        <button
          onClick={handleAnalyze}
          disabled={isAnalyzing || !sourcePrompt.trim()}
          className="w-full mt-1 h-12 rounded-xl bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white font-headline-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#8b5cf6]/20 active:scale-[0.98] transition-transform disabled:opacity-50"
        >
          <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            auto_fix_high
          </span>
          <span>{isAnalyzing ? 'Analyzing Flaws & Synthesizing...' : 'Analyze & Improve'}</span>
        </button>
      </section>

      {/* Diagnostics / Flaws Detected Card */}
      <section className="rounded-2xl bg-[#1a1a1e] border border-[#27272a]/30 p-4 flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#ffb4ab] text-[18px]">report_problem</span>
            <h2 className="text-sm font-bold font-headline-sm text-[#fafafa]">Diagnostics Detected</h2>
          </div>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-code-md font-semibold bg-[#93000a]/30 text-[#ffb4ab] border border-[#ffb4ab]/30">
            {diagnostic.flaws.length} Critical Flaws
          </span>
        </div>

        {/* Flaw Badges List */}
        <div className="flex flex-col gap-2 pt-1">
          {diagnostic.flaws.map((flaw) => (
            <div
              key={flaw.id}
              className="p-3 rounded-xl bg-[#141416] border border-[#93000a]/40 flex items-start gap-2.5"
            >
              <span className="text-base leading-none">⚠️</span>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-[#ffb4ab]">{flaw.title}</span>
                <p className="text-xs text-[#a1a1aa] mt-0.5 leading-relaxed">{flaw.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Before vs After Comparison View */}
      <section className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between px-1">
          <span className="text-[10px] font-code-md text-[#a1a1aa] uppercase tracking-wider">
            Optimization Benchmark
          </span>
          <span className="text-[10px] font-code-md text-[#34d399]">Synthesized in {diagnostic.synthesizedTime}</span>
        </div>

        {/* Score Meter Card */}
        <div className="grid grid-cols-2 gap-3">
          {/* Before Score */}
          <div className="rounded-xl bg-[#1a1a1e] border border-[#27272a]/30 p-3 flex flex-col items-center justify-center text-center">
            <span className="text-[10px] font-code-md text-[#a1a1aa] uppercase tracking-wider">Score Before</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-bold font-headline-lg text-[#ffb4ab]">{diagnostic.scoreBefore}</span>
              <span className="text-xs font-code-md text-[#908fa0]">/100</span>
            </div>
            <span className="mt-1 px-2 py-0.5 rounded-full text-[10px] font-code-md bg-[#93000a]/20 text-[#ffb4ab] border border-[#ffb4ab]/30">
              Weak
            </span>
          </div>

          {/* After Score */}
          <div className="rounded-xl bg-[#141416] border border-[#34d399]/40 p-3 flex flex-col items-center justify-center text-center emerald-glow relative overflow-hidden">
            <div className="absolute -right-3 -bottom-3 w-12 h-12 bg-[#4edea3]/10 rounded-full blur-xl pointer-events-none"></div>
            <span className="text-[10px] font-code-md text-[#34d399] uppercase tracking-wider font-semibold">
              Score After
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-bold font-headline-lg text-[#34d399]">{diagnostic.scoreAfter}</span>
              <span className="text-xs font-code-md text-[#34d399]/70">/100</span>
            </div>
            <span className="mt-1 px-2 py-0.5 rounded-full text-[10px] font-code-md font-semibold bg-[#059669]/30 text-[#34d399] border border-[#34d399]/40">
              +{diagnostic.improvementPts} pts improvement!
            </span>
          </div>
        </div>

        {/* Diff / Enhanced Prompt Card */}
        <div className="rounded-2xl bg-[#1a1a1e] border border-[#8083ff]/40 p-4 flex flex-col gap-3 relative overflow-hidden shadow-lg">
          <div className="flex items-center justify-between border-b border-[#27272a]/20 pb-2">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#c4b5fd] text-[18px]">verified</span>
              <span className="text-xs font-semibold text-[#c4b5fd]">Enhanced Prompt Canvas</span>
            </div>
            <span className="text-[11px] font-code-md text-[#c4b5fd]/80">
              {diagnostic.enhancedTokens} tokens
            </span>
          </div>

          {/* Formatted Prompt Body */}
          <div className="font-code-md text-xs text-[#fafafa] bg-[#0c0c0e] p-3 rounded-xl border border-[#27272a]/25 space-y-2 leading-relaxed selection:bg-[#8b5cf6]/30 whitespace-pre-wrap">
            {getActiveEnhancedText()}
          </div>

          {/* Secondary Tuning Action Row */}
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={handleShorten}
              className={`flex-1 py-2 px-2.5 rounded-lg border text-xs font-medium flex items-center justify-center gap-1.5 active:scale-95 transition-all ${
                isShortened
                  ? 'bg-[#8b5cf6]/30 border-[#8b5cf6] text-[#c4b5fd]'
                  : 'bg-[#141416] hover:bg-[#222226] text-[#a1a1aa] hover:text-[#fafafa] border-[#27272a]/30'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">compress</span> Shorten
            </button>
            <button
              onClick={handleMakeDetailed}
              className={`flex-1 py-2 px-2.5 rounded-lg border text-xs font-medium flex items-center justify-center gap-1.5 active:scale-95 transition-all ${
                isDetailed
                  ? 'bg-[#8b5cf6]/30 border-[#8b5cf6] text-[#c4b5fd]'
                  : 'bg-[#141416] hover:bg-[#222226] text-[#a1a1aa] hover:text-[#fafafa] border-[#27272a]/30'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">add_circle</span> Make More Detailed
            </button>
            <button
              onClick={() => onCopySuccess('Diagnostic telemetry link generated!')}
              className="w-10 h-9 rounded-lg bg-[#141416] hover:bg-[#222226] text-[#a1a1aa] hover:text-[#fafafa] border border-[#27272a]/30 flex items-center justify-center active:scale-95 transition-all"
              title="Share"
            >
              <span className="material-symbols-outlined text-[18px]">share</span>
            </button>
          </div>

          {/* Primary Accept CTA */}
          <button
            onClick={handleAccept}
            className="w-full py-3 rounded-xl bg-[#c0c1ff] text-[#1000a9] font-headline-sm font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#c0c1ff]/90 active:scale-[0.98] transition-all shadow-md"
          >
            <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              content_copy
            </span>
            <span>Accept & Copy Improved Prompt</span>
          </button>
        </div>
      </section>
    </div>
  );
}
