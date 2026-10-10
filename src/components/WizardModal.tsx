import { useState } from 'react';

interface WizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyPrompt: (generatedPrompt: string) => void;
}

export function WizardModal({ isOpen, onClose, onApplyPrompt }: WizardModalProps) {
  const [step, setStep] = useState<number>(1);
  const [category, setCategory] = useState<string>('Web Application (HTML + Backend)');
  const [goal, setGoal] = useState<string>('Online Course Platform with Razorpay Payment');
  const [targetEngine, setTargetEngine] = useState<string>('Cursor / Next.js');
  const [constraints, setConstraints] = useState<string[]>([
    'Complete HTML5 entry point (index.html) with semantic structure',
    'Responsive Tailwind UI templates & accessible forms',
    'Strict TypeScript types',
    'Secure webhooks without secret leakage',
  ]);

  if (!isOpen) return null;

  const categories = [
    { label: 'Web Application (HTML + Backend)', icon: 'terminal', desc: 'Full-Stack, index.html, UI, APIs' },
    { label: 'Frontend & HTML Templates', icon: 'html', desc: 'Semantic HTML5, CSS layout, forms' },
    { label: 'Backend Microservices & APIs', icon: 'database', desc: 'APIs, Auth, Database schemas' },
    { label: 'Mobile App (iOS & Android)', icon: 'smartphone', desc: 'React Native, Flutter, Native UI' },
    { label: 'PPT & Presentation Deck', icon: 'slideshow', desc: '10-slide pitch deck, speaker notes' },
    { label: 'PDF & Executive Whitepaper', icon: 'picture_as_pdf', desc: 'Multi-page report, 2-column print' },
    { label: 'Academic Research Study', icon: 'biotech', desc: 'Hypotheses, methodology, APA 7th' },
    { label: 'AI Video & Cinema Direction', icon: 'videocam', desc: 'Runway Gen-3, Sora, camera cues' },
    { label: 'AI Image & Art Generation', icon: 'palette', desc: 'Midjourney v6, Flux, 85mm portrait' },
    { label: 'Direct Response Marketing', icon: 'campaign', desc: 'Viral ad hooks, VSLs, email flows' },
    { label: 'Long-Form Text & Essay', icon: 'article', desc: 'Thought leadership, narrative prose' },
  ];

  const engineOptions = [
    'Cursor / Claude 3.5',
    'ChatGPT (GPT-4o)',
    'Midjourney v6.1 / Flux',
    'Runway Gen-3 / Sora',
    'Claude 3.7 Sonnet',
  ];

  const commonConstraints = [
    'Complete HTML5 entry point (index.html) with semantic structure',
    'Responsive Tailwind UI templates & accessible forms',
    'Strict TypeScript types',
    'Secure webhooks without secret leakage',
    '10-slide presentation deck layout with speaker notes',
    'A4/Letter print specs with 2-column executive layout',
    'Empirical research methodology with APA 7th citations',
    'React Native / Flutter safe-area navigation & offline cache',
    'Camera motion, anamorphic lens metadata & 24fps film cadence',
    'Midjourney 85mm optics & volumetric rim lighting',
    '3-second psychological pattern interrupt & FOMO hook',
    'Zero placeholder stubs or generic AI clichés',
  ];

  const toggleConstraint = (item: string) => {
    if (constraints.includes(item)) {
      setConstraints(constraints.filter((c) => c !== item));
    } else {
      setConstraints([...constraints, item]);
    }
  };

  const handleFinish = () => {
    const isPpt = category.includes('PPT');
    const isPdf = category.includes('PDF');
    const isResearch = category.includes('Research');
    const isMobile = category.includes('Mobile');
    const isVideo = category.includes('Video');
    const isImage = category.includes('Image');
    const isMarketing = category.includes('Marketing');
    const isText = category.includes('Text');
    const isFrontend = category.includes('Frontend');
    const isBackend = category.includes('Backend');

    let blueprintSections = '';

    if (isPpt) {
      blueprintSections = `1. Slide Deck Architecture:
• 10-Slide Pitch Deck Blueprint (16:9 Widescreen) covering Problem, Solution, Product Demo, Market (TAM/SAM/SOM), Traction, and The Ask.
• Visual Layout Math: 60% bold visual diagram on left, 3 concise data cards on right.
• Speaker Delivery Notes: Exact 45-second spoken script per slide and investor Q&A defense.`;
    } else if (isPdf) {
      blueprintSections = `1. Publication & Print Specifications:
• A4 / US Letter document geometry, 2-column readable grid, and executive summary callout box.
• Structured section breakdown with infographic placement directives and implementation playbook.`;
    } else if (isResearch) {
      blueprintSections = `1. Empirical Research Study Design:
• Epistemological problem statement, 3 explicit research questions, and operational hypotheses (H0, H1).
• Systematic literature review synthesis, statistical testing protocol (ANOVA/regression), and APA 7th citations.`;
    } else if (isMobile) {
      blueprintSections = `1. Mobile Application Architecture:
• React Native (Expo) or Flutter 3 native navigation hierarchy with bottom tabs and modal sheets.
• Biometric auth (FaceID), offline caching (MMKV/SQLite), and iPhone Dynamic Island safe-area padding.`;
    } else if (isVideo) {
      blueprintSections = `1. Cinematography & Camera Direction:
• Runway Gen-3 / Sora camera motion (dolly, pedestal, tracking) with anamorphic 35mm lens calibration.
• Volumetric lighting, 24fps cinematic film cadence, and foley sound design cues.`;
    } else if (isImage) {
      blueprintSections = `1. Visual Art & Optics Specifications:
• Midjourney v6.1 / Flux prompt with 85mm f/1.4 portraiture optics, chiaroscuro rim lighting, and Kodak Portra film stock grading (--ar 16:9 --v 6.1 --style raw).`;
    } else if (isMarketing) {
      blueprintSections = `1. Direct Response Marketing Architecture:
• 3-second psychological pattern interrupt hook, problem tension agitation, unique transformation mechanism, and high-urgency CTA.`;
    } else if (isText) {
      blueprintSections = `1. Narrative Prose & Editorial Voice:
• Intellectual thought leadership essay, varied sentence cadence, philosophical thesis, and complete ban on generic AI filler.`;
    } else if (isFrontend) {
      blueprintSections = `1. Frontend & Semantic HTML5 Architecture:
• Complete semantic HTML5 file (\`index.html\`) with viewport meta, accessible landmarks (<header>, <nav>, <main>, <section>, <footer>), and accessible form controls.
• Responsive modern Tailwind CSS UI with accessible modals and micro-interactions.`;
    } else if (isBackend) {
      blueprintSections = `1. Backend Services & Cloud Architecture:
• REST / GraphQL endpoints, strict schema validation (Zod/Pydantic), and PostgreSQL relational data models.
• Authentication security, idempotent webhook processing, and Docker containerization.`;
    } else {
      blueprintSections = `1. Frontend & Semantic HTML5 Architecture:
• Complete semantic HTML5 document (\`index.html\`) with viewport meta, accessible landmarks (<header>, <nav>, <main>, <section>, <footer>), and semantic tags.
• Modern, responsive Tailwind CSS UI layout with accessible form controls and micro-interactions.

2. Backend & System Architecture:
• Production-grade server logic with defensive error handling, Zod validation, and typed PostgreSQL schemas.`;
    }

    const compiled = `Role: Senior Architect & Expert Prompt Specialist
Task: Build a ${category} for "${goal}".
Target Engine: ${targetEngine}

${blueprintSections}

2. Key Constraints & Rules:
${constraints.map((c) => `• ${c}`).join('\n')}

Output Requirements:
Deliver complete production-grade blueprints and artifacts for this exact material type with zero placeholder comments or omissions.`;
    onApplyPrompt(compiled);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in">
      <div className="bg-[#1a1a1e] border border-[#8083ff]/30 w-full max-w-md rounded-2xl p-5 shadow-2xl relative overflow-hidden flex flex-col max-h-[85vh]">
        {/* Glowing atmospheric halo */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#8b5cf6]/15 rounded-full blur-2xl pointer-events-none"></div>

        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#27272a]/30">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#7c3aed]/40 flex items-center justify-center text-[#c4b5fd]">
              <span className="material-symbols-outlined text-[18px]">auto_fix_high</span>
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#fafafa] font-headline-sm">Prompt Builder Wizard</h3>
              <p className="text-[11px] text-[#a1a1aa]">Step {step} of 3</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-md hover:bg-[#222226] flex items-center justify-center text-[#a1a1aa]"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Step Content */}
        <div className="py-4 flex-1 overflow-y-auto space-y-4 no-scrollbar">
          {step === 1 && (
            <div className="space-y-3">
              <label className="text-[11px] font-code-md text-[#c4b5fd] uppercase tracking-wider block">
                1. What are you building?
              </label>
              <div className="grid grid-cols-2 gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.label}
                    onClick={() => setCategory(cat.label)}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                      category === cat.label
                        ? 'bg-[#8b5cf6]/20 border-[#8b5cf6] text-[#c4b5fd]'
                        : 'bg-[#0c0c0e] border-[#27272a]/40 text-[#a1a1aa] hover:border-[#8083ff]/40'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px] mb-1">{cat.icon}</span>
                    <span className="text-xs font-semibold text-[#fafafa]">{cat.label}</span>
                    <span className="text-[10px] text-[#908fa0] mt-0.5">{cat.desc}</span>
                  </button>
                ))}
              </div>

              <div className="pt-2">
                <label className="text-[11px] font-code-md text-[#908fa0] uppercase tracking-wider block mb-1">
                  Describe your idea in simple words:
                </label>
                <textarea
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  rows={2}
                  className="w-full rounded-xl bg-[#0c0c0e] border border-[#27272a]/40 text-xs p-2.5 text-[#fafafa] focus:ring-1 focus:ring-[#8083ff] focus:outline-none"
                  placeholder="e.g. Student e-learning platform with video streaming and certificate generator..."
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-3">
              <label className="text-[11px] font-code-md text-[#c4b5fd] uppercase tracking-wider block">
                2. Select Target Execution Model
              </label>
              <div className="space-y-2">
                {engineOptions.map((eng) => (
                  <button
                    key={eng}
                    onClick={() => setTargetEngine(eng)}
                    className={`w-full p-3 rounded-xl border flex items-center justify-between text-left transition-all ${
                      targetEngine === eng
                        ? 'bg-[#7c3aed]/35 border-[#a78bfa] text-[#fafafa]'
                        : 'bg-[#0c0c0e] border-[#27272a]/40 text-[#a1a1aa] hover:border-[#27272a]'
                    }`}
                  >
                    <span className="text-xs font-medium">{eng}</span>
                    {targetEngine === eng && (
                      <span className="material-symbols-outlined text-[#34d399] text-[18px]">check_circle</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-3">
              <label className="text-[11px] font-code-md text-[#c4b5fd] uppercase tracking-wider block">
                3. Add Technical Constraints
              </label>
              <p className="text-[11px] text-[#a1a1aa]">Tap to toggle constraints that ensure high-quality output:</p>
              <div className="flex flex-wrap gap-1.5">
                {commonConstraints.map((item) => {
                  const selected = constraints.includes(item);
                  return (
                    <button
                      key={item}
                      onClick={() => toggleConstraint(item)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-code-md border transition-all ${
                        selected
                          ? 'bg-[#4edea3]/20 border-[#34d399] text-[#34d399]'
                          : 'bg-[#0c0c0e] border-[#27272a]/40 text-[#908fa0]'
                      }`}
                    >
                      {selected ? '✓ ' : '+ '}
                      {item}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="pt-3 border-t border-[#27272a]/30 flex items-center justify-between gap-2">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="px-3 py-1.5 rounded-lg bg-[#0c0c0e] text-xs text-[#a1a1aa] hover:text-[#fafafa] border border-[#27272a]/40"
            >
              Back
            </button>
          ) : (
            <div></div>
          )}

          {step < 3 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#8b5cf6] to-[#571bc1] text-xs font-bold text-white shadow-md active:scale-95"
            >
              Continue
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#4edea3] to-[#00885d] text-xs font-bold text-[#002113] shadow-md active:scale-95 flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
              Compile into Studio
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
