import { useState, useMemo, useEffect } from 'react';
import { OutputType, TargetPlatform, PromptDepth } from '../types';
import { autoDetectOutputType } from '../utils/synthesizer';
import { RECENT_PROMPTS, QUICK_SUGGESTIONS, RecentPrompt } from '../data/recentPrompts';

interface StudioScreenProps {
  onGenerate: (
    prompt: string,
    platform: TargetPlatform,
    outputType: OutputType,
    depth: PromptDepth
  ) => void | Promise<void>;
  onOpenWizard: () => void;
  initialPrompt?: string;
  isGenerating?: boolean;
}

export function StudioScreen({
  onGenerate,
  onOpenWizard,
  initialPrompt,
  isGenerating = false,
}: StudioScreenProps) {
  const [promptText, setPromptText] = useState<string>(initialPrompt || '');

  useEffect(() => {
    if (initialPrompt !== undefined) setPromptText(initialPrompt);
  }, [initialPrompt]);
  const [outputType, setOutputType] = useState<OutputType>('web_app');
  const [targetPlatform, setTargetPlatform] = useState<TargetPlatform>('cursor');
  const [promptDepth, setPromptDepth] = useState<PromptDepth>('dev');
  const [detectedLang, setDetectedLang] = useState<string>('Hinglish');
  const [isRecording, setIsRecording] = useState<boolean>(false);

  // Dynamic estimated token count calculation
  const estTokens = useMemo(() => {
    if (!promptText.trim()) return 0;
    return Math.max(12, Math.round(promptText.trim().split(/\s+/).length * 1.35));
  }, [promptText]);

  // Handle voice recording simulation
  const toggleVoiceRecording = () => {
    if (isRecording) {
      setIsRecording(false);
    } else {
      setIsRecording(true);
      setTimeout(() => {
        setPromptText(
          'Mujhe ek modern gym and fitness brand ke liye high-converting Instagram ad copy chahiye Hinglish tone mein jisme seasonal offer aur WhatsApp link ho...'
        );
        setDetectedLang('Hinglish');
        setIsRecording(false);
      }, 2200);
    }
  };

  const handleGenerateClick = () => {
    if (!promptText.trim() || isGenerating) return;
    void onGenerate(promptText, targetPlatform, outputType, promptDepth);
  };

  const handleSelectRecent = (recent: RecentPrompt) => {
    setPromptText(recent.fullPrompt);
  };

  const outputTypes: { id: OutputType; label: string; icon: string }[] = [
    { id: 'web_app', label: 'Web App (HTML+API)', icon: 'web' },
    { id: 'frontend', label: 'Frontend & HTML5', icon: 'html' },
    { id: 'backend', label: 'Backend & APIs', icon: 'database' },
    { id: 'mobile_app', label: 'Mobile App', icon: 'smartphone' },
    { id: 'image', label: 'AI Image & Art', icon: 'image' },
    { id: 'video', label: 'AI Video & Cinema', icon: 'videocam' },
    { id: 'text', label: 'Text & Copywriting', icon: 'article' },
    { id: 'marketing', label: 'Marketing & Ads', icon: 'campaign' },
    { id: 'research', label: 'Research Study', icon: 'biotech' },
    { id: 'pdf', label: 'PDF & Whitepaper', icon: 'picture_as_pdf' },
    { id: 'ppt', label: 'PPT & Pitch Deck', icon: 'slideshow' },
  ];

  const platforms: { id: TargetPlatform; label: string; icon?: string }[] = [
    { id: 'auto', label: 'Auto-Select' },
    { id: 'cursor', label: 'Cursor AI', icon: 'terminal' },
    { id: 'claude', label: 'Claude 3.5' },
    { id: 'chatgpt', label: 'ChatGPT-4o' },
    { id: 'midjourney', label: 'Midjourney v6' },
    { id: 'runway', label: 'Runway / Sora' },
    { id: 'lovable', label: 'Lovable / v0' },
    { id: 'flutter', label: 'Flutter / Expo' },
  ];

  const depths: { id: PromptDepth; label: string }[] = [
    { id: 'quick', label: 'Quick' },
    { id: 'pro', label: 'Pro' },
    { id: 'expert', label: 'Expert' },
    { id: 'creative', label: 'Creative' },
    { id: 'dev', label: 'Dev' },
  ];

  return (
    <div className="flex-1 flex flex-col space-y-5 pb-8">
      {/* Subheader Context / Active Engine Pill */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center space-x-2">
          <span className="text-[10px] font-code-md uppercase tracking-wider text-[#a1a1aa]">Active Engine</span>
          <span className="text-[#a1a1aa]/40">•</span>
          <div className="inline-flex items-center space-x-1.5 px-2 py-0.5 rounded-md bg-[#141416] border border-[#27272a]/30 text-[#c4b5fd] text-xs font-body-sm">
            <span className="material-symbols-outlined text-[13px] text-[#34d399]">neurology</span>
            <span className="font-medium">GPT-4o / Claude 3.5</span>
          </div>
        </div>
        <div className="flex items-center space-x-1 text-[#34d399] text-[10px] font-code-md emerald-glow px-2 py-0.5 rounded-full bg-[#059669]/20 border border-[#34d399]/30">
          <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3] animate-pulse"></span>
          <span>ONLINE</span>
        </div>
      </div>

      {/* HERO PROMPT INPUT CARD */}
      <section className="bg-[#141416] rounded-2xl surface border border-[#27272a]/30 p-4 flex flex-col space-y-3 relative overflow-hidden transition-all duration-200 focus-within:border-[#8b5cf6]/60 focus-within:ring-1 focus-within:ring-[#c0c1ff]/40">
        {/* Ambient Card Inner Gradient */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#8b5cf6]/10 rounded-full blur-2xl pointer-events-none"></div>

        {/* Top Row Metadata in Input */}
        <div className="flex items-center justify-between border-b border-[#27272a]/20 pb-2">
          <div className="flex items-center space-x-1.5 bg-[#1a1a1e] px-2 py-1 rounded-lg border border-[#27272a]/30">
            <span className="material-symbols-outlined text-[14px] text-[#34d399]">translate</span>
            <span className="text-[10px] font-code-md text-[#a1a1aa]">Auto-Detect:</span>
            <span className="text-[10px] font-code-md text-[#34d399] font-semibold">{detectedLang}</span>
            <button
              onClick={() => setDetectedLang(detectedLang === 'Hinglish' ? 'English' : 'Hinglish')}
              className="text-[#a1a1aa] hover:text-[#c4b5fd] transition-colors ml-0.5"
              title="Toggle Language Mode"
            >
              <span className="material-symbols-outlined text-[14px]">tune</span>
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-code-md text-[#a1a1aa]">Est. ~{estTokens} tokens</span>
            <button
              onClick={() => setPromptText('')}
              className="w-6 h-6 rounded-md hover:bg-[#222226]/40 flex items-center justify-center text-[#a1a1aa] hover:text-[#ffb4ab] transition-colors"
              title="Clear input"
            >
              <span className="material-symbols-outlined text-[15px]">close</span>
            </button>
          </div>
        </div>

        {/* Textarea / Input Zone */}
        <div className="relative py-1">
          <textarea
            value={promptText}
            onChange={(e) => {
              const v = e.target.value;
              setPromptText(v);
              // Auto-select material type from what the user is typing
              if (v.trim().length > 12) {
                const detected = autoDetectOutputType(v);
                setOutputType(detected);
              }
            }}
            className="w-full bg-transparent border-0 p-0 text-[#fafafa] font-body-md text-sm sm:text-base placeholder:text-[#a1a1aa]/40 focus:ring-0 resize-none leading-relaxed focus:outline-none"
            placeholder="Describe your idea in your own words (English, Hinglish, Hindi, Marathi, etc.)..."
            rows={4}
          />
        </div>

        {/* Card Footer Tools */}
        <div className="flex items-center justify-between pt-2 border-t border-[#27272a]/20">
          <div className="flex items-center space-x-1.5">
            <button
              onClick={toggleVoiceRecording}
              className={`h-8 px-2.5 rounded-lg border flex items-center space-x-1.5 text-xs transition-colors active:scale-95 ${
                isRecording
                  ? 'bg-[#93000a]/40 border-[#ffb4ab] text-[#ffb4ab] animate-pulse'
                  : 'bg-[#1a1a1e] border-[#27272a]/30 hover:border-[#8b5cf6]/40 text-[#a1a1aa] hover:text-[#c4b5fd]'
              }`}
            >
              <span className="material-symbols-outlined text-[16px] text-[#34d399]">mic</span>
              <span>{isRecording ? 'Listening...' : 'Voice Input'}</span>
            </button>
            <button
              onClick={() => alert('Reference file attachment supported: schema, mocks, or screenshots')}
              className="h-8 w-8 rounded-lg bg-[#1a1a1e] border border-[#27272a]/30 hover:border-[#8b5cf6]/40 text-[#a1a1aa] hover:text-[#c4b5fd] flex items-center justify-center transition-colors active:scale-95"
              title="Add Reference Context"
            >
              <span className="material-symbols-outlined text-[16px]">attach_file</span>
            </button>
          </div>
          <div className="flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-[#4edea3]"></span>
            <span className="text-[10px] font-code-md text-[#a1a1aa]">
              Intent:{' '}
              <strong className="text-[#fafafa]">
                {outputType === 'ppt'
                  ? 'PPT & Presentation Deck (16:9 Slides)'
                  : outputType === 'pdf'
                  ? 'PDF & Executive Whitepaper'
                  : outputType === 'research'
                  ? 'Academic Research Study & Methodology'
                  : outputType === 'mobile_app'
                  ? 'Mobile App (iOS & Android Native)'
                  : outputType === 'frontend'
                  ? 'Frontend & Semantic HTML5'
                  : outputType === 'backend'
                  ? 'Backend APIs & Database Architecture'
                  : outputType === 'video'
                  ? 'Cinematic AI Video & Camera Motion'
                  : outputType === 'image'
                  ? 'Hyper-Realistic AI Image & Art'
                  : outputType === 'marketing'
                  ? 'Direct Response Marketing & Viral Hooks'
                  : outputType === 'text'
                  ? 'Long-Form Text & Narrative Essay'
                  : 'Full-Stack Web App (HTML + Backend)'}
              </strong>
            </span>
          </div>
        </div>
      </section>

      {/* Wizard Helper Banner (Bento Micro-Card) */}
      <div
        onClick={onOpenWizard}
        className="rounded-xl p-3 bg-[#1a1a1e]/60 border border-[#8b5cf6]/20 flex items-center justify-between relative overflow-hidden group hover:border-[#8b5cf6]/40 transition-colors cursor-pointer"
      >
        <div className="flex items-center space-x-3 z-10">
          <div className="w-8 h-8 rounded-lg bg-[#8b5cf6]/25 flex items-center justify-center text-[#c4b5fd]">
            <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              auto_fix_high
            </span>
          </div>
          <div>
            <p className="text-xs text-[#fafafa] font-medium font-body-sm">Need guided blueprint creation?</p>
            <p className="text-[10px] font-code-md text-[#c4b5fd] underline underline-offset-2">
              Launch [Prompt Architecture Wizard] — Covers Apps, PPT, PDF, Video, Research & more
            </p>
          </div>
        </div>
        <span className="material-symbols-outlined text-[#a1a1aa] group-hover:translate-x-0.5 transition-transform text-[18px] z-10">
          chevron_right
        </span>
      </div>

      {/* SELECTORS & TUNING CONTROLS */}
      <section className="space-y-3.5">
        {/* Output Type Selector */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-[10px] font-code-md text-[#a1a1aa] uppercase tracking-wider">Material / Output Type</label>
            <span className="text-[10px] font-code-md text-[#34d399] flex items-center gap-1">
              <span className="material-symbols-outlined text-[13px]">auto_awesome</span>
              All Formats Supported
            </span>
          </div>
          <div className="flex space-x-2 overflow-x-auto no-scrollbar pb-1 -mx-4 px-4">
            {outputTypes.map((type) => {
              const active = outputType === type.id;
              return (
                <button
                  key={type.id}
                  onClick={() => setOutputType(type.id)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs whitespace-nowrap active:scale-95 transition-transform ${
                    active
                      ? 'bg-[#8b5cf6]/30 border border-[#8b5cf6] text-[#c4b5fd] font-semibold shadow-sm shadow-[#8b5cf6]/20'
                      : 'bg-[#1a1a1e] border border-[#27272a]/30 text-[#a1a1aa] hover:border-[#27272a]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">{type.icon}</span>
                  <span>{type.label}</span>
                </button>
              );
            })}
          </div>

          {/* Dynamic Deliverable Helper Pill */}
          <div className="mt-2 p-2 rounded-xl bg-[#4edea3]/10 border border-[#34d399]/25 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-[#34d399] font-code-md text-[11px]">
              <span className="material-symbols-outlined text-[15px]">verified</span>
              <span>
                {outputType === 'ppt'
                  ? 'Generates 10-slide keynote/pitch deck blueprints with visual layout math & speaker scripts'
                  : outputType === 'pdf'
                  ? 'Generates A4/Letter multi-page whitepaper specifications with 2-column grid & diagrams'
                  : outputType === 'research'
                  ? 'Generates empirical methodology, hypotheses (H0/H1), statistical protocol & APA citations'
                  : outputType === 'mobile_app'
                  ? 'Generates React Native / Flutter blueprints with navigation, safe area & native device APIs'
                  : outputType === 'frontend'
                  ? 'Generates complete semantic HTML5 (index.html), accessible form controls, and Tailwind UI'
                  : outputType === 'backend'
                  ? 'Generates REST/GraphQL endpoints, database schemas (PostgreSQL/Prisma), and auth webhooks'
                  : outputType === 'video'
                  ? 'Generates Runway Gen-3 / Sora camera motion, anamorphic lens optics, and foley sound cues'
                  : outputType === 'image'
                  ? 'Generates Midjourney v6.1 / Flux prompts with 85mm portrait optics, rim light & raw style'
                  : outputType === 'marketing'
                  ? 'Generates 3-second pattern interrupts, psychological tension agitation & high-urgency CTAs'
                  : outputType === 'text'
                  ? 'Generates deep narrative thought-leadership essays, sensory pacing & zero generic AI fluff'
                  : 'Mandates complete semantic HTML5 files (index.html, UI layout) + robust Backend APIs'}
              </span>
            </div>
            <span className="text-[10px] text-[#a1a1aa] font-code-md uppercase">
              {outputType.replace('_', ' ')}
            </span>
          </div>
        </div>

        {/* Target Platform Selector */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-[10px] font-code-md text-[#a1a1aa] uppercase tracking-wider">
              Target AI Platform
            </label>
            <span className="text-[10px] font-code-md text-[#34d399]">Optimized Syntax</span>
          </div>
          <div className="flex space-x-2 overflow-x-auto no-scrollbar pb-1 -mx-4 px-4">
            {platforms.map((plat) => {
              const active = targetPlatform === plat.id;
              return (
                <button
                  key={plat.id}
                  onClick={() => setTargetPlatform(plat.id)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs whitespace-nowrap transition-transform active:scale-95 ${
                    active
                      ? 'bg-[#7c3aed]/60 border border-[#a78bfa] text-[#e9ddff] font-semibold shadow-sm shadow-[#7c3aed]/30'
                      : 'bg-[#1a1a1e] border border-[#27272a]/30 text-[#a1a1aa] hover:border-[#27272a]'
                  }`}
                >
                  {plat.icon && <span className="material-symbols-outlined text-[15px]">{plat.icon}</span>}
                  <span>{plat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Mode Selector Segmented Tabs */}
        <div>
          <label className="text-[10px] font-code-md text-[#a1a1aa] uppercase tracking-wider block mb-1.5">
            Prompt Engineering Depth
          </label>
          <div className="grid grid-cols-5 gap-1 p-1 bg-[#1a1a1e] rounded-xl border border-[#27272a]/30 text-center">
            {depths.map((d) => {
              const active = promptDepth === d.id;
              return (
                <button
                  key={d.id}
                  onClick={() => setPromptDepth(d.id)}
                  className={`py-1.5 rounded-lg text-xs transition-colors ${
                    active
                      ? 'font-semibold bg-[#222226] text-[#c4b5fd] shadow-sm border border-[#27272a]/40'
                      : 'text-[#a1a1aa] hover:text-[#fafafa]'
                  }`}
                >
                  {d.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* PRIMARY ACTION CTA */}
      <section className="pt-2">
        <button
          onClick={handleGenerateClick}
          disabled={isGenerating || !promptText.trim()}
          className="w-full h-12 rounded-xl btn-primary electric-glow active:scale-[0.98] transition-all group disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <div className="w-full h-full bg-[#0c0c0e]/80 rounded-[11px] flex flex-col items-center justify-center px-4 hover:bg-[#0c0c0e]/50 transition-colors backdrop-blur-md">
            <div className="flex items-center space-x-2">
              <span className="text-base sm:text-[17px] font-bold text-[#fafafa] tracking-tight group-hover:text-[#c4b5fd] transition-colors font-headline-sm">
                {isGenerating ? 'Synthesizing Pipeline...' : 'Generate Perfect Prompt'}
              </span>
              <span
                className="material-symbols-outlined text-[#c4b5fd] text-[20px] group-hover:rotate-12 transition-transform"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                auto_awesome
              </span>
            </div>
            <div className="flex items-center space-x-1.5 text-[11px] font-code-md text-[#c4b5fd]/80 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3] animate-pulse"></span>
              <span>Multi-Agent pipeline ready (Context + Constraint Synthesis)</span>
            </div>
          </div>
        </button>
      </section>

      {/* QUICK SUGGESTIONS CHIPS */}
      <section className="pt-1">
        <div className="flex items-center gap-1.5 mb-2">
          <span className="material-symbols-outlined text-[#34d399] text-sm">lightbulb</span>
          <label className="text-[10px] font-code-md text-[#a1a1aa] uppercase tracking-wider">
            Quick Suggestions (Hinglish & English)
          </label>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {QUICK_SUGGESTIONS.map((sug, i) => (
            <button
              key={i}
              onClick={() => {
                setPromptText(sug.text);
                setDetectedLang(sug.text.includes('Mujhe') ? 'Hinglish' : 'English');
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1a1a1e] hover:bg-[#222226] border border-[#27272a]/30 text-xs text-[#a1a1aa] hover:text-[#fafafa] active:scale-95 transition-all text-left"
            >
              <span>{sug.label}</span>
              <span className="material-symbols-outlined text-[13px] text-[#c4b5fd]">north_east</span>
            </button>
          ))}
        </div>
      </section>

      {/* EXAMPLE PROMPTS HORIZONTAL TRAY */}
      <section className="pt-2 pb-6">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center space-x-1.5">
            <span className="material-symbols-outlined text-[16px] text-[#c4b5fd]">history</span>
            <span className="text-[10px] font-code-md text-[#fafafa] uppercase tracking-wider font-semibold">
              Recent & Quick Prompts
            </span>
          </div>
          <span className="text-[10px] font-code-md text-[#c4b5fd] hover:underline cursor-pointer">
            View All ({RECENT_PROMPTS.length})
          </span>
        </div>

        <div className="flex space-x-3 overflow-x-auto no-scrollbar pb-1 -mx-4 px-4">
          {RECENT_PROMPTS.map((item) => (
            <div
              key={item.id}
              onClick={() => handleSelectRecent(item)}
              className="w-64 flex-shrink-0 bg-[#141416] rounded-xl p-3 border border-[#27272a]/30 flex flex-col justify-between space-y-2 hover:border-[#8b5cf6]/40 transition-all cursor-pointer group"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`text-[10px] font-code-md px-2 py-0.5 rounded bg-[#1a1a1e] border border-[#27272a]/30 ${
                      item.tagColor === 'tertiary'
                        ? 'text-[#34d399]'
                        : item.tagColor === 'secondary'
                        ? 'text-[#d0bcff]'
                        : 'text-[#c4b5fd]'
                    }`}
                  >
                    {item.tag}
                  </span>
                  <span className="text-[11px] font-code-md text-[#a1a1aa]">{item.timeAgo}</span>
                </div>
                <p className="text-xs text-[#fafafa] line-clamp-2 leading-relaxed">{item.snippet}</p>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-[#27272a]/20 text-[11px] text-[#a1a1aa]">
                <span className="flex items-center space-x-1 font-code-md">
                  <span className="material-symbols-outlined text-[13px]">{item.engineIcon}</span>
                  <span>{item.engine}</span>
                </span>
                <span className="text-[#c4b5fd] font-medium flex items-center space-x-0.5 group-hover:translate-x-0.5 transition-transform">
                  <span>Re-use</span>
                  <span className="material-symbols-outlined text-[12px]">arrow_forward</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
