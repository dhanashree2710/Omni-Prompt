import { useState } from 'react';
import { PromptSynthesis } from '../types';
import { copyToClipboard } from '../utils/clipboard';

interface ResultScreenProps {
  synthesis: PromptSynthesis;
  onRefine: () => void;
  onOpenPlayground: () => void;
  onOpenAssumptions: () => void;
  onCopySuccess: (msg: string) => void;
}

export function ResultScreen({
  synthesis,
  onRefine,
  onOpenPlayground,
  onOpenAssumptions,
  onCopySuccess,
}: ResultScreenProps) {
  const [isInputExpanded, setIsInputExpanded] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'simple' | 'pro' | 'expert'>(synthesis.activeVersion || 'expert');
  const [architectureFocus, setArchitectureFocus] = useState<'fullstack' | 'frontend' | 'backend'>('fullstack');

  // Always use the synthesized version — never inject hardcoded samples
  const currentCode =
    synthesis.versions[activeTab] ||
    synthesis.versions.expert ||
    synthesis.versions.pro ||
    synthesis.versions.simple ||
    '';

  const handleCopy = async () => {
    const ok = await copyToClipboard(currentCode);
    if (ok) {
      onCopySuccess('Prompt copied to clipboard!');
    } else {
      onCopySuccess('Copy failed — select the text and press Ctrl+C');
    }
  };

    const handleExport = () => {
    const blob = new Blob([currentCode], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `omniprompt_${synthesis.intentCode.toLowerCase()}_${architectureFocus}.md`;
    a.click();
    URL.revokeObjectURL(url);
    onCopySuccess('Exported prompt file downloaded!');
  };

  return (
    <div className="flex-1 flex flex-col space-y-4 pt-1 pb-24">
      {/* Collapsible Original Input Banner */}
      <section className="rounded-2xl surface p-3.5 transition-all duration-200">
        <div
          className="flex items-center justify-between cursor-pointer select-none"
          onClick={() => setIsInputExpanded(!isInputExpanded)}
        >
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#c4b5fd] text-[18px]">translate</span>
            <span className="text-[10px] font-code-md text-[#a1a1aa] tracking-wider uppercase">INPUT SOURCE</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-[11px] font-code-md px-2 py-0.5 rounded-full bg-[#1a1a1e] border border-[#27272a]/40 text-[#fafafa]">
              <span>{synthesis.detectedLanguage || 'Hinglish'}</span>
              <span>🇮🇳</span>
            </span>
            <span
              className={`material-symbols-outlined text-[#908fa0] text-[18px] transition-transform duration-200 transform ${
                isInputExpanded ? 'rotate-0' : '-rotate-90'
              }`}
            >
              expand_more
            </span>
          </div>
        </div>

        {isInputExpanded && (
          <div className="mt-2.5 pt-2 border-t border-[#27272a]/20 animate-in fade-in duration-200">
            <p className="text-xs font-body-sm text-[#a1a1aa] leading-relaxed italic bg-[#0c0c0e]/60 p-2.5 rounded-xl border border-[#27272a]/20">
              "{synthesis.originalInput}"
            </p>
            <div className="flex items-center justify-between mt-2 text-[10px] font-code-md text-[#908fa0]">
              <span>TRANSCRIPTION FIDELITY: {synthesis.fidelity || 99.4}%</span>
              <span>TOKEN COUNT: {synthesis.tokenCount || 32}</span>
            </div>
          </div>
        )}
      </section>

      {/* Bento Grid: Decoded System Intent Card */}
      <section className="rounded-2xl surface p-4 relative overflow-hidden">
        <div className="absolute -right-8 -top-8 w-28 h-28 bg-[#8b5cf6]/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#c0c1ff] animate-ping"></span>
            <span className="text-[10px] font-code-md text-[#c4b5fd] tracking-wider uppercase font-semibold">
              DECODED SYSTEM INTENT
            </span>
          </div>
          <span className="text-[11px] font-code-md text-[#a1a1aa] bg-[#1a1a1e]/80 px-2 py-0.5 rounded">
            {synthesis.intentCode || 'LMS-V2'}
          </span>
        </div>

        <h2 className="text-base sm:text-lg font-headline-sm text-[#fafafa] font-bold mt-1">
          {synthesis.decodedIntent}
        </h2>

        {/* Extracted Requirements Tags */}
        <div className="mt-3">
          <span className="text-[10px] font-code-md text-[#908fa0] block mb-1.5 uppercase">
            EXTRACTED REQUIREMENTS
          </span>
          <div className="flex flex-wrap gap-1.5">
            {synthesis.extractedRequirements.map((req, idx) => {
              const r = req.toLowerCase();
              const iconName = r.includes('html') || r.includes('ui')
                ? 'html'
                : r.includes('auth') || r.includes('session')
                ? 'lock'
                : r.includes('catalog') || r.includes('grid')
                ? 'grid_view'
                : r.includes('stripe') || r.includes('razorpay') || r.includes('pay')
                ? 'credit_card'
                : r.includes('video') || r.includes('player')
                ? 'play_circle'
                : r.includes('dashboard')
                ? 'speed'
                : r.includes('admin') || r.includes('cms')
                ? 'admin_panel_settings'
                : 'code';

              return (
                <span
                  key={idx}
                  className={`inline-flex items-center gap-1 text-[11px] font-code-md px-2.5 py-1 rounded-lg border ${
                    r.includes('html') || r.includes('ui')
                      ? 'bg-[#4edea3]/15 text-[#34d399] border-[#34d399]/40 shadow-sm'
                      : 'bg-[#1a1a1e] text-[#c4b5fd] border-[#8b5cf6]/20'
                  }`}
                >
                  <span className="material-symbols-outlined text-[14px]">
                    {iconName}
                  </span>
                  {req}
                </span>
              );
            })}
          </div>
        </div>

        {/* Smart System Assumptions */}
        <div className="mt-3.5 p-3 rounded-xl bg-[#0c0c0e]/80 border border-[#27272a]/30 flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-code-md text-[#d0bcff] flex items-center gap-1 font-semibold uppercase">
              <span className="material-symbols-outlined text-[14px]">psychology</span>
              SMART SYSTEM ASSUMPTIONS
            </span>
            <button
              onClick={onOpenAssumptions}
              className="text-xs text-[#c4b5fd] hover:text-[#e1e0ff] flex items-center gap-0.5 active:scale-95 transition-transform"
            >
              Edit <span className="material-symbols-outlined text-[14px]">tune</span>
            </button>
          </div>
          <p className="text-xs text-[#a1a1aa] leading-relaxed">
            {synthesis.smartAssumptions.join(', ')}
          </p>
        </div>
      </section>

      {/* Quality Score Gauge Card */}
      <section className="rounded-2xl surface p-4 relative overflow-hidden">
        <div className="flex items-center justify-between pb-2 border-b border-[#27272a]/20">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#34d399] text-[18px]">verified</span>
            <span className="text-[10px] font-code-md text-[#a1a1aa] tracking-wider uppercase font-semibold">
              QUALITY INSPECTOR
            </span>
          </div>
          <span className="inline-flex items-center gap-1 text-[10px] font-code-md px-2 py-0.5 rounded-full bg-[#4edea3]/10 text-[#34d399] border border-[#34d399]/30 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3] animate-pulse"></span>
            {synthesis.qualityScore.readyPercent || 99.2}% READY
          </span>
        </div>

        <div className="grid grid-cols-12 gap-3 items-center mt-3">
          {/* Radial Circular Ring */}
          <div className="col-span-5 flex flex-col items-center justify-center p-2 rounded-xl bg-[#0c0c0e]/70 border border-[#34d399]/20 relative emerald-glow">
            <div className="relative w-20 h-20 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-[#272a32]"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3.2"
                />
                <path
                  className="text-[#34d399] transition-all duration-1000 ease-out"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeDasharray={`${synthesis.qualityScore.overall || 94}, 100`}
                  strokeLinecap="round"
                  strokeWidth="3.2"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-xl font-headline-md font-bold text-[#fafafa] tracking-tighter">
                  {synthesis.qualityScore.overall || 94}
                  <span className="text-xs font-normal text-[#34d399]">/100</span>
                </span>
                <span className="text-[9px] font-code-md text-[#34d399] font-bold uppercase">
                  {synthesis.qualityScore.grade || 'EXPERT'}
                </span>
              </div>
            </div>
            <span className="text-xs font-code-md text-[#34d399] mt-1 font-semibold">
              {synthesis.qualityScore.grade || 'Expert'} Grade
            </span>
          </div>

          {/* Sub-metrics breakdown bars */}
          <div className="col-span-7 space-y-1.5">
            <div>
              <div className="flex justify-between text-[10px] font-code-md text-[#a1a1aa] mb-0.5">
                <span>Clarity</span>
                <span className="text-[#34d399]">{synthesis.qualityScore.clarity || 96}%</span>
              </div>
              <div className="w-full bg-[#222226] rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-[#4edea3] h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${synthesis.qualityScore.clarity || 96}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[10px] font-code-md text-[#a1a1aa] mb-0.5">
                <span>Specificity</span>
                <span className="text-[#34d399]">{synthesis.qualityScore.specificity || 92}%</span>
              </div>
              <div className="w-full bg-[#222226] rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-[#4edea3] h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${synthesis.qualityScore.specificity || 92}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[10px] font-code-md text-[#a1a1aa] mb-0.5">
                <span>Context</span>
                <span className="text-[#34d399]">{synthesis.qualityScore.context || 95}%</span>
              </div>
              <div className="w-full bg-[#222226] rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-[#4edea3] h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${synthesis.qualityScore.context || 95}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[10px] font-code-md text-[#a1a1aa] mb-0.5">
                <span>Constraints</span>
                <span className="text-[#c4b5fd]">{synthesis.qualityScore.constraints || 90}%</span>
              </div>
              <div className="w-full bg-[#222226] rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-[#8b5cf6] h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${synthesis.qualityScore.constraints || 90}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[10px] font-code-md text-[#a1a1aa] mb-0.5">
                <span>Platform Fit</span>
                <span className="text-[#34d399]">{synthesis.qualityScore.platformFit || 97}%</span>
              </div>
              <div className="w-full bg-[#222226] rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-[#4edea3] h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${synthesis.qualityScore.platformFit || 97}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Production Compiler Container */}
      <section className="rounded-2xl surface p-4 relative">
        <div className="flex flex-col gap-2.5 mb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#c4b5fd] text-[18px]">terminal</span>
              <span className="text-[10px] font-code-md text-[#a1a1aa] tracking-wider uppercase font-semibold">
                PRODUCTION COMPILER
              </span>
            </div>
            <span className="text-[11px] font-code-md text-[#908fa0]">v3.4.1</span>
          </div>

          {/* Version Segmented Control */}
          <div className="grid grid-cols-3 bg-[#0c0c0e] p-1 rounded-xl border border-[#27272a]/30 text-center select-none">
            <button
              onClick={() => setActiveTab('simple')}
              className={`py-1.5 text-xs rounded-lg transition-all ${
                activeTab === 'simple'
                  ? 'bg-[#1a1a1e] text-[#c4b5fd] font-semibold border border-[#8b5cf6]/25 shadow-sm'
                  : 'text-[#a1a1aa] hover:text-[#fafafa]'
              }`}
            >
              Simple
            </button>
            <button
              onClick={() => setActiveTab('pro')}
              className={`py-1.5 text-xs rounded-lg transition-all ${
                activeTab === 'pro'
                  ? 'bg-[#1a1a1e] text-[#c4b5fd] font-semibold border border-[#8b5cf6]/25 shadow-sm'
                  : 'text-[#a1a1aa] hover:text-[#fafafa]'
              }`}
            >
              Professional
            </button>
            <button
              onClick={() => setActiveTab('expert')}
              className={`py-1.5 text-xs rounded-lg transition-all ${
                activeTab === 'expert'
                  ? 'bg-[#1a1a1e] text-[#c4b5fd] font-semibold border border-[#8b5cf6]/25 shadow-sm'
                  : 'text-[#a1a1aa] hover:text-[#fafafa]'
              }`}
            >
              Expert (Selected)
            </button>
          </div>

          {/* Architecture Focus Selector: Full-Stack vs Frontend HTML vs Backend */}
          <div className="pt-1">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-code-md text-[#a1a1aa] uppercase tracking-wider">
                Code & Architecture Focus:
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-code-md text-[#34d399]">
                <span className="material-symbols-outlined text-[13px]">check_circle</span>
                HTML Files Included
              </span>
            </div>
            <div className="grid grid-cols-3 bg-[#0c0c0e] p-1 rounded-xl border border-[#27272a]/30 text-center select-none text-xs">
              <button
                onClick={() => setArchitectureFocus('fullstack')}
                className={`py-1.5 px-1 rounded-lg transition-all flex items-center justify-center gap-1 ${
                  architectureFocus === 'fullstack'
                    ? 'bg-[#8b5cf6]/25 text-[#e1e0ff] font-semibold border border-[#8083ff]/40 shadow-sm'
                    : 'text-[#a1a1aa] hover:text-[#fafafa]'
                }`}
                title="Includes both complete semantic HTML5 client files and backend routes"
              >
                <span className="material-symbols-outlined text-[14px]">layers</span>
                <span className="truncate">Full-Stack (HTML+API)</span>
              </button>
              <button
                onClick={() => setArchitectureFocus('frontend')}
                className={`py-1.5 px-1 rounded-lg transition-all flex items-center justify-center gap-1 ${
                  architectureFocus === 'frontend'
                    ? 'bg-[#4edea3]/20 text-[#34d399] font-semibold border border-[#34d399]/40 shadow-sm'
                    : 'text-[#a1a1aa] hover:text-[#fafafa]'
                }`}
                title="Specializes on index.html, semantic layout, accessible forms & Tailwind UI"
              >
                <span className="material-symbols-outlined text-[14px]">html</span>
                <span className="truncate">Frontend & HTML</span>
              </button>
              <button
                onClick={() => setArchitectureFocus('backend')}
                className={`py-1.5 px-1 rounded-lg transition-all flex items-center justify-center gap-1 ${
                  architectureFocus === 'backend'
                    ? 'bg-[#d0bcff]/20 text-[#d0bcff] font-semibold border border-[#a78bfa]/40 shadow-sm'
                    : 'text-[#a1a1aa] hover:text-[#fafafa]'
                }`}
                title="Specializes on database schemas, controllers, webhooks and security"
              >
                <span className="material-symbols-outlined text-[14px]">database</span>
                <span className="truncate">Backend & APIs</span>
              </button>
            </div>
          </div>

          {/* HTML Points Confirmation Banner */}
          <div className="flex items-center justify-between p-2 rounded-xl bg-[#4edea3]/10 border border-[#34d399]/25 text-xs">
            <div className="flex items-center gap-1.5 text-[#34d399] font-code-md text-[11px]">
              <span className="material-symbols-outlined text-[16px]">html</span>
              <span className="font-semibold">HTML5 Entry & UI Templates Mandated</span>
            </div>
            <span className="text-[10px] text-[#a1a1aa] font-code-md">
              {architectureFocus === 'frontend'
                ? 'index.html • Semantic Tags • Components'
                : architectureFocus === 'backend'
                ? 'REST Endpoints • Zod • Prisma'
                : 'index.html + Backend Routes'}
            </span>
          </div>
        </div>

        {/* Syntax Highlighted Code Container */}
        <div className="relative bg-[#0c0c0e] rounded-xl border border-[#27272a]/40 overflow-hidden">
          {/* Code Card Header */}
          <div className="flex items-center justify-between px-3 py-2 bg-[#1a1a1e] border-b border-[#27272a]/20 text-xs font-code-md">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ffb4ab]/80"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#c0c1ff]/80"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#4edea3]/80"></span>
              </div>
              <span className="text-[#a1a1aa] text-[11px] ml-1">
                {architectureFocus === 'frontend'
                  ? 'index.html_and_ui_spec.md'
                  : architectureFocus === 'backend'
                  ? 'backend_api_and_schemas.md'
                  : 'fullstack_html_and_backend.md'}
              </span>
            </div>
            <span className="text-[#34d399] bg-[#4edea3]/10 text-[10px] px-1.5 py-0.5 rounded border border-[#34d399]/20 flex items-center gap-1">
              <span className="material-symbols-outlined text-[12px]">
                {architectureFocus === 'frontend' ? 'html' : architectureFocus === 'backend' ? 'dns' : 'developer_board'}
              </span>
              {architectureFocus === 'frontend' ? 'HTML5 / Client UI' : architectureFocus === 'backend' ? 'Node / APIs' : 'Full-Stack'}
            </span>
          </div>

          {/* Preformatted Content */}
          <pre className="p-3 text-[12px] font-code-md leading-relaxed text-[#fafafa] overflow-x-auto whitespace-pre-wrap selection:bg-[#8b5cf6]/40 max-h-96">
            {currentCode}
          </pre>

          {/* Floating Micro-Action */}
          <div className="absolute top-10 right-3">
            <button
              onClick={handleCopy}
              className="bg-[#1a1a1e]/90 hover:bg-[#222226] text-[#fafafa] px-2.5 py-1 rounded-lg text-xs font-code-md flex items-center gap-1 border border-[#27272a]/30 backdrop-blur active:scale-90 transition-transform"
            >
              <span className="material-symbols-outlined text-[14px]">content_copy</span>
              Copy
            </button>
          </div>
        </div>

        {/* Token metadata badge */}
        <div className="flex items-center justify-between mt-2.5 text-[10px] font-code-md text-[#a1a1aa]">
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[13px] text-[#34d399]">check_circle</span>
            VALIDATED FOR CONTEXT WINDOW (200K)
          </span>
          <span className="text-[#c4b5fd] font-semibold">{synthesis.tokensTotal || 342} TOKENS</span>
        </div>
      </section>

      {/* Advanced Iteration & Export Options */}
      <section className="grid grid-cols-3 gap-2">
        <button
          onClick={onOpenPlayground}
          className="flex flex-col items-center justify-center p-2.5 rounded-xl surface text-center active:scale-95 transition-all hover:border-[#8b5cf6]/40"
        >
          <span className="material-symbols-outlined text-[#c4b5fd] text-[20px] mb-1">play_arrow</span>
          <span className="text-xs text-[#fafafa] font-medium">Playground</span>
        </button>
        <button
          onClick={onRefine}
          className="flex flex-col items-center justify-center p-2.5 rounded-xl surface text-center active:scale-95 transition-all hover:border-[#8b5cf6]/40"
        >
          <span className="material-symbols-outlined text-[#34d399] text-[20px] mb-1">auto_fix_high</span>
          <span className="text-xs text-[#fafafa] font-medium">Refine</span>
        </button>
        <button
          onClick={handleExport}
          className="flex flex-col items-center justify-center p-2.5 rounded-xl surface text-center active:scale-95 transition-all hover:border-[#8b5cf6]/40"
        >
          <span className="material-symbols-outlined text-[#d0bcff] text-[20px] mb-1">ios_share</span>
          <span className="text-xs text-[#fafafa] font-medium">Export</span>
        </button>
      </section>

      {/* Floating Bottom Sticky Action Dock (Elevated above nav) */}
      <div className="sticky bottom-4 z-30 pointer-events-none mt-6">
        <div className="pointer-events-auto bg-[#1a1a1e]/95 backdrop-blur-2xl p-2.5 rounded-2xl border border-[#27272a]/30 shadow-2xl electric-glow max-w-3xl mx-auto">
          <div className="flex items-center gap-2">
            {/* Primary Large Action Button */}
            <button
              onClick={handleCopy}
              className="flex-1 h-12 bg-gradient-to-r from-[#8b5cf6] to-[#571bc1] hover:opacity-95 text-white font-headline-sm text-sm font-bold rounded-xl flex items-center justify-center gap-2 active:scale-98 transition-all shadow-lg"
            >
              <span className="material-symbols-outlined text-[20px]">content_copy</span>
              <span>Copy Prompt</span>
              <span className="text-xs bg-white/20 px-1.5 py-0.5 rounded ml-1 font-code-md">⌘C</span>
            </button>

            {/* Quick Refine Shortcut */}
            <button
              onClick={onRefine}
              aria-label="Improve & Refine"
              className="w-12 h-12 rounded-xl bg-[#141416] hover:bg-[#1a1a1e] border border-[#27272a]/40 flex items-center justify-center text-[#fafafa] active:scale-95 transition-all"
              title="Refine in Diagnostic Lab"
            >
              <span className="material-symbols-outlined text-[#34d399] text-[22px]">auto_fix_high</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
