import { PromptSynthesis, TargetPlatform, OutputType, PromptDepth } from '../types';

/** Infer best output type from free-text when user left default web_app */
export function autoDetectOutputType(rawInput: string): OutputType {
  const t = rawInput.toLowerCase();
  if (/\b(ppt|powerpoint|pitch\s*deck|keynote|slides?|presentation)\b/i.test(t)) return 'ppt';
  if (/\b(pdf|whitepaper|ebook|e-book|brochure)\b/i.test(t)) return 'pdf';
  if (/\b(research|thesis|dissertation|literature\s*review|hypothesis|apa)\b/i.test(t)) return 'research';
  if (/\b(mobile\s*app|android\s*app|ios\s*app|react\s*native|flutter|expo)\b/i.test(t)) return 'mobile_app';
  if (/\b(runway|sora|kling|pika|luma|gen-3|ai\s*video|cinematic\s*video|b-roll)\b/i.test(t)) return 'video';
  if (/\b(midjourney|dall-e|dalle|flux|logo|portrait|illustration|ai\s*image|thumbnail)\b/i.test(t)) return 'image';
  if (/\b(instagram\s*ad|facebook\s*ad|whatsapp\s*campaign|ad\s*copy|marketing|vsl|sales\s*letter|funnel|viral\s*hook)\b/i.test(t)) return 'marketing';
  if (/\b(essay|blog\s*post|article|story|novel|script\b|thought\s*leadership)\b/i.test(t)) return 'text';
  if (/\b(backend|rest\s*api|graphql|fastapi|microservice|prisma|database\s*schema)\b/i.test(t) && !/website|web\s*app/i.test(t)) return 'backend';
  if (/\b(frontend|html5|landing\s*page|tailwind\s*ui)\b/i.test(t) && !/full\s*stack|backend|api/i.test(t)) return 'frontend';
  if (/\b(website|web\s*app|full\s*stack|ecommerce|e-commerce|saas)\b/i.test(t)) return 'web_app';
  // Hinglish heuristics
  if (/logo|poster|banner\s*design|photo/i.test(t)) return 'image';
  if (/video|reel|youtube/i.test(t)) return 'video';
  if (/ad\b|ads|campaign|marketing|whatsapp\s*msg/i.test(t)) return 'marketing';
  if (/mobile\s*app|android|ios\s*app|flutter/i.test(t)) return 'mobile_app';
  if (/website|web\s*site|site\s*banani|online\s*store|ecommerce/i.test(t)) return 'web_app';
  return 'web_app';
}

export function synthesizePrompt(
  rawInput: string,
  platform: TargetPlatform = 'cursor',
  outputType: OutputType = 'web_app',
  depth: PromptDepth = 'dev'
): PromptSynthesis {
  const isHinglish =
    /mujhe|karna|banani|sake|chahiye|aur|jisme|hai|ho|kar|mein/i.test(rawInput);

  // Explicit chip wins; if still default web_app, auto-detect from text
  let resolved: OutputType = outputType;
  if (!outputType || outputType === 'web_app') {
    const detected = autoDetectOutputType(rawInput);
    if (detected !== 'web_app') resolved = detected;
  }

  const isPpt = resolved === 'ppt';
  const isPdf = resolved === 'pdf';
  const isResearch = resolved === 'research';
  const isMobile = resolved === 'mobile_app';
  const isFrontend = resolved === 'frontend';
  const isBackend = resolved === 'backend';
  const isVideo = resolved === 'video';
  const isImage = resolved === 'image';
  const isMarketing = resolved === 'marketing';
  const isText = resolved === 'text';

  // =========================================================================
  // PPT / PRESENTATION SLIDE DECK SYNTHESIZER
  // =========================================================================
  if (isPpt) {
    return {
      originalInput: rawInput,
      detectedLanguage: isHinglish ? 'Hinglish' : 'English',
      materialType: 'ppt',
      fidelity: 99.2,
      tokenCount: Math.round(rawInput.split(/\s+/).length * 1.3),
      decodedIntent: 'Executive Presentation & Keynote Deck Architecture',
      intentCode: 'PPT-DECK',
      extractedRequirements: [
        '10-Slide Investor Deck Structure',
        'Visual Layout & Composition Directives',
        'Data Callout & Metric Badges',
        'Speaker Delivery Scripts',
        'High-Contrast Typography Rules',
        'Audience Q&A Defense Matrix',
      ],
      smartAssumptions: [
        'Assumed 16:9 widescreen format, high-contrast dark aesthetic, 60/40 visual-to-text ratio, and strict Guy Kawasaki 10-slide rule.',
      ],
      qualityScore: {
        overall: 96,
        grade: 'Expert',
        readyPercent: 99.4,
        clarity: 98,
        specificity: 95,
        context: 96,
        constraints: 94,
        platformFit: 97,
      },
      versions: {
        simple: `Role: Presentation Designer & Pitch Specialist
Objective: Create a 10-slide presentation deck for: "${rawInput}"

Requirements:
1. Deliver a clear 10-slide outline (Title, Problem, Solution, Market, Product, Business Model, Traction, Competition, Financials, The Ask).
2. For each slide: Headline, 3 concise high-impact bullets, and suggested visual illustration.
3. Keep text concise and actionable.`,

        pro: `Role: Senior Venture Pitch Consultant & Presentation Architect
Objective: Build an executive pitch deck and visual slide blueprint for: "${rawInput}"

Deliverables:
• 10-Slide Master Outline:
  - Slide 1: High-concept title, tagline, and founding vision
  - Slide 2: The Critical Industry Pain Point ($X billion lost annually)
  - Slide 3: The Solution & Value Proposition
  - Slide 4: Product Architecture & Interactive Demo Walkthrough
  - Slide 5: Market Sizing (TAM, SAM, SOM)
  - Slide 6: Monetization Model & Unit Economics (CAC, LTV, Net Retention)
  - Slide 7: Unfair Competitive Moat & IP Strategy
  - Slide 8: Early Traction & Commercial Milestones
  - Slide 9: 3-Year Financial Forecasts & Key Unit Metrics
  - Slide 10: Funding Requirements & Capital Allocation
• Visual Layout Directives: Left 60% bold diagram/metric, Right 40% concise cards.
• Speaker Delivery Notes: Exact talking points for each slide.`,

        expert: `Role: Principal Keynote Strategist & Venture Capital Deck Director
Objective: Synthesize a high-stakes, 10-slide investor keynote deck blueprint for:
"${rawInput}"

1. Slide-by-Slide Structural Blueprint (16:9 Widescreen):
• Slide 01 [The Hook]: Bold 1-sentence value proposition. Zero jargon. Visual: Sleek 3D product render on obsidian canvas.
• Slide 02 [The Friction / Market Agitation]: Quantified problem statement. Callout: "Enterprises waste 38% of engineering hours on legacy workarounds."
• Slide 03 [The Unique Solution]: Paradigm shift explanation. Visual: Before vs. After comparison flowchart.
• Slide 04 [Product Deep Dive]: Three-step user workflow with animated telemetry screenshots and micro-copy.
• Slide 05 [Market Sizing]: TAM ($42B) → SAM ($8.4B) → SOM ($1.2B) with credible analyst citation sources.
• Slide 06 [Unit Economics & Monetization]: ARR tiers, net revenue retention (138%), and payback period under 7 months.
• Slide 07 [Competitive Matrix]: 2x2 quadrant positioning why existing incumbents fail to execute.
• Slide 08 [Traction & Velocity]: Quarter-over-quarter growth curve, logo wall of flagship enterprise pilots.
• Slide 09 [Financial Projections]: 3-year P&L trajectory with margin expansion from 64% to 81%.
• Slide 10 [The Investment Ask]: Target raise amount, 18-month runway milestones, and use-of-funds breakdown (50% R&D, 30% GTM, 20% Ops).

2. Slide Visual Design Standards:
• Typography: Display sans-serif (44pt+ headlines, 20-24pt body), maximum 25 words per slide.
• Color System: Deep space obsidian background (#0a0d14), electric mint (#4edea3) for positive metrics, lavender (#c0c1ff) for secondary accents.
• Layout Math: 60/40 rule with high negative space and zero text walls.

3. Presenter Delivery Notes & Q&A Armor:
• Include precise 45-second presenter spoken script for each slide.
• 5 pre-empted investor objections with exact counter-data evidence.`,
      },
      activeVersion: 'expert',
      targetStack: 'PowerPoint / Keynote / Pitch Deck Format',
      tokensTotal: 420,
      isBookmarked: false,
    };
  }

  // =========================================================================
  // PDF / WHITEPAPER & DOCUMENT BLUEPRINT SYNTHESIZER
  // =========================================================================
  if (isPdf) {
    return {
      originalInput: rawInput,
      detectedLanguage: isHinglish ? 'Hinglish' : 'English',
      materialType: 'pdf',
      fidelity: 99.1,
      tokenCount: Math.round(rawInput.split(/\s+/).length * 1.3),
      decodedIntent: 'Enterprise Whitepaper & Publication Document Architecture',
      intentCode: 'PDF-SPEC',
      extractedRequirements: [
        'A4 / US Letter Print Geometry Specs',
        'Executive Abstract & Key Takeaways',
        'Two-Column Typographic Hierarchy',
        'Data Infographic & Diagram Callouts',
        'Sidebar Frameworks & Pull Quotes',
        'Comprehensive Citations & Appendix',
      ],
      smartAssumptions: [
        'Assumed multi-page publication document, structured executive summary, formal enterprise tone, and accessible print-ready typography.',
      ],
      qualityScore: {
        overall: 95,
        grade: 'Expert',
        readyPercent: 99.2,
        clarity: 97,
        specificity: 94,
        context: 96,
        constraints: 93,
        platformFit: 96,
      },
      versions: {
        simple: `Role: Technical Writer & Publication Specialist
Objective: Write a structured, multi-page whitepaper/PDF document for: "${rawInput}"

Requirements:
1. Cover page with title, author, and executive summary.
2. 4 core sections with headings, subheadings, and key takeaways.
3. Summary checklist and closing conclusions.`,

        pro: `Role: Enterprise Research Lead & Publication Designer
Objective: Deliver an authoritative, multi-page whitepaper blueprint for: "${rawInput}"

Document Structure:
1. Title & Executive Summary (Key findings highlighted in callout box)
2. Industry Background & Problem Landscape
3. The Core Framework / Technical Methodology
4. Real-World Case Study with Quantified Benchmarks
5. Implementation Roadmap & Step-by-Step Adoption Guide
6. Conclusion, Glossary, and Citations.

Layout Specifications:
- Two-column readable body (10.5pt / 15pt leading)
- High-contrast pull quotes every 2 pages
- Stat callout badges with percentage figures.`,

        expert: `Role: Principal Industry Analyst & Senior Document Architect
Objective: Author a definitive, publication-ready enterprise whitepaper/PDF blueprint for:
"${rawInput}"

1. Complete Document Architecture:
• Cover Page: Minimalist typography, document version metadata, ISBN/report ID, and classification badge.
• Page 2 [Executive Briefing]: 250-word synthesis + 4 key bullet findings in a highlighted emerald callout box.
• Section 1 [Market Drivers & Macro Shift]: Empirical analysis of industry inflection points with trend graph directions.
• Section 2 [Architectural Deep Dive]: Core conceptual blueprint, mathematical models, or technical framework.
• Section 3 [Comparative Benchmark Matrix]: Table contrasting traditional solutions vs. the proposed modern approach.
• Section 4 [Enterprise Case Studies]: 2 validated deployment studies with ROI metrics and implementation timelines.
• Section 5 [Actionable Execution Playbook]: 30-60-90 day deployment checklist with risk mitigations.
• Appendix: Technical glossary, research references, and author bio.

2. Document Formatting & Print Layout Rules:
• Page Specs: A4 & US Letter standard with 24mm outer margins and 18mm inner margins.
• Typographic Scale: H1 (28pt), H2 (18pt), Body (10.5pt on 15pt leading), Footnotes (8.5pt).
• Callout Elements: Stat callout boxes with 32pt bold numbers and 9pt uppercase labels.
• Color Palette: Dark obsidian (#0f1117) text on crisp warm off-white (#f9f9fb) with emerald accents for graphs.`,
      },
      activeVersion: 'expert',
      targetStack: 'PDF / LaTeX / InDesign / Markdown Blueprint',
      tokensTotal: 440,
      isBookmarked: false,
    };
  }

  // =========================================================================
  // RESEARCH STUDY & ACADEMIC METHODOLOGY SYNTHESIZER
  // =========================================================================
  if (isResearch) {
    return {
      originalInput: rawInput,
      detectedLanguage: isHinglish ? 'Hinglish' : 'English',
      materialType: 'research',
      fidelity: 99.5,
      tokenCount: Math.round(rawInput.split(/\s+/).length * 1.3),
      decodedIntent: 'Empirical Academic Research Study & Methodology Protocol',
      intentCode: 'RES-STUDY',
      extractedRequirements: [
        'Hypothesis Formulation (H0, H1)',
        'Systematic Literature Review Protocol',
        'Quantitative / Qualitative Methodology',
        'Sampling Size & Statistical Tests',
        'Ethical Considerations & Controls',
        'APA 7th / IEEE Citation Framework',
      ],
      smartAssumptions: [
        'Assumed rigorous empirical research standard, operationalized independent/dependent variables, statistical significance tests (p < 0.05), and peer-review readiness.',
      ],
      qualityScore: {
        overall: 97,
        grade: 'Expert',
        readyPercent: 99.6,
        clarity: 98,
        specificity: 96,
        context: 97,
        constraints: 95,
        platformFit: 98,
      },
      versions: {
        simple: `Role: Academic Researcher & Methodologist
Objective: Develop a structured research proposal and study design for: "${rawInput}"

Requirements:
1. Problem Statement & Research Questions
2. Literature Review Summary with key theoretical frameworks
3. Research Methodology (data collection and analysis)
4. Expected Outcomes and Limitations.`,

        pro: `Role: Senior Research Methodologist & Statistical Analyst
Objective: Produce a comprehensive empirical research framework for: "${rawInput}"

Components:
1. Abstract & Operational Problem Definition
2. Hypotheses: Primary Null (H0) and Alternative (H1) hypotheses
3. Methodology: Mixed-methods approach with sampling parameters and instrument design
4. Statistical Protocol: Multiple regression, ANOVA, and Cohen's d effect size calculation
5. Validity & Reliability: Cronbach's alpha thresholds and triangulation protocols
6. APA 7th Edition Reference formatting.`,

        expert: `Role: Principal Academic Investigator & Quantitative Methodologist
Objective: Formulate an exhaustive, peer-review ready empirical research paper and study design for:
"${rawInput}"

1. Rigorous Study Architecture:
• Section 1 [Epistemological Context & Problem Statement]: Theoretical grounding, research gap identification, and 3 explicit Research Questions (RQ1, RQ2, RQ3).
• Section 2 [Hypotheses Matrix]:
  - H0: No statistically significant correlation between primary independent variables and observed outcome.
  - H1: Statistically significant positive effect (alpha = 0.05, 95% confidence interval).
• Section 3 [Systematic Literature Review Synthesis]: PRISMA protocol synthesis of recent high-impact peer-reviewed literature.
• Section 4 [Research Design & Data Instrumentation]:
  - Population & Stratified Random Sampling: Power analysis (G*Power) to determine minimum sample size N.
  - Measurement Scale: Operationalized 7-point Likert scales with construct validity and Cronbach's alpha > 0.82.
• Section 5 [Statistical Protocol]:
  - Descriptive statistics (mean, SD, skewness)
  - Inferential testing: MANOVA and hierarchical linear regression with multicollinearity checks (VIF < 3.0).
• Section 6 [Ethical Compliance & Limitations]: Institutional Review Board (IRB) safeguards, informed consent, and confounder controls.
• Section 7 [References]: Structured in APA 7th Edition or IEEE format.`,
      },
      activeVersion: 'expert',
      targetStack: 'Academic / APA 7th / LaTeX / Peer-Review',
      tokensTotal: 460,
      isBookmarked: false,
    };
  }

  // =========================================================================
  // MOBILE APP (REACT NATIVE / FLUTTER / SWIFT / KOTLIN) SYNTHESIZER
  // =========================================================================
  if (isMobile) {
    return {
      originalInput: rawInput,
      detectedLanguage: isHinglish ? 'Hinglish' : 'English',
      materialType: 'mobile_app',
      fidelity: 99.3,
      tokenCount: Math.round(rawInput.split(/\s+/).length * 1.3),
      decodedIntent: 'Cross-Platform Mobile Application Architecture (iOS & Android)',
      intentCode: 'MOB-APP',
      extractedRequirements: [
        'React Native (Expo) / Flutter Scaffold',
        'Bottom Tab & Stack Navigation',
        'Biometric Auth (FaceID/Fingerprint)',
        'Offline Cache (MMKV/SQLite)',
        'Responsive Notch & Safe Area Insets',
        'Push Notification Telemetry',
      ],
      smartAssumptions: [
        'Assumed React Native with TypeScript and Expo SDK 51 (or Flutter 3), native gesture animations, responsive safe area insets, and zero bridge lag.',
      ],
      qualityScore: {
        overall: 96,
        grade: 'Expert',
        readyPercent: 99.4,
        clarity: 97,
        specificity: 95,
        context: 96,
        constraints: 93,
        platformFit: 98,
      },
      versions: {
        simple: `Role: Mobile App Developer
Objective: Build a mobile app (React Native / Flutter) for: "${rawInput}"

Requirements:
1. Bottom tab bar navigation with core screens.
2. Smooth, responsive UI components optimized for iOS and Android.
3. Clean state management and local storage persistence.`,

        pro: `Role: Senior Cross-Platform Mobile Engineer
Objective: Architect a production-ready mobile application for: "${rawInput}"

Specifications:
• Framework: React Native with Expo SDK or Flutter 3 with strict types.
• Navigation: Typed React Navigation (Native Stack + Bottom Tabs) with smooth screen transitions.
• UI & Gestures: React Native Reanimated and Gesture Handler with haptic feedback.
• Storage: Fast key-value persistence with MMKV and Zustand global state.
• Safe Area: Perfect padding for iPhone Dynamic Island and Android navigation bar.`,

        expert: `Role: Principal Mobile Architect & Native Systems Lead
Objective: Deliver an enterprise-grade mobile application blueprint and complete codebase for:
"${rawInput}"

1. Native Mobile Architecture:
• Framework: React Native (Expo Router v3) with TypeScript strict mode or Flutter 3.x.
• Navigation Hierarchy:
  - (auth) Stack: Splash screen, Phone/OAuth Login, Biometric enrollment
  - (tabs) Layout: Custom SVG Bottom Tab Bar with animated indicator pill
  - (modals): Native presentation sheets with swipe-down-to-dismiss gesture
• Native Device Integrations:
  - Biometric authentication (LocalAuthentication for FaceID / TouchID)
  - Haptic Engine: Light, medium, and success haptic pulses on key taps
  - Offline Sync: MMKV synchronous storage with background sync queue.

2. Screen Specifications & Deliverables:
• \`app/(tabs)/index.tsx\`: Main Feed with pull-to-refresh and flash-list performance.
• \`app/(tabs)/explore.tsx\`: Search bar with debounced query and filter chips.
• \`app/(tabs)/profile.tsx\`: User telemetry, session settings, and dark mode toggle.
• \`components/ui/NativeCard.tsx\`: Elevation shadow math conforming to iOS shadow and Android elevation.

3. Performance & App Store Guidelines:
• 60fps/120fps fluid reanimated transitions without JS thread blocking.
• Full iOS Human Interface Guidelines and Android Material You compliance.`,
      },
      activeVersion: 'expert',
      targetStack: 'React Native Expo / Flutter / iOS & Android',
      tokensTotal: 430,
      isBookmarked: false,
    };
  }

  // =========================================================================
  // FRONTEND & SEMANTIC HTML5 SYNTHESIZER
  // =========================================================================
  if (isFrontend) {
    return {
      originalInput: rawInput,
      detectedLanguage: isHinglish ? 'Hinglish' : 'English',
      materialType: 'frontend',
      fidelity: 99.4,
      tokenCount: Math.round(rawInput.split(/\s+/).length * 1.3),
      decodedIntent: 'Semantic HTML5 Entry Point & Modern UI Architecture',
      intentCode: 'FE-HTML',
      extractedRequirements: [
        'Complete index.html Entry Point',
        'Semantic Landmark Tags (<header>, <nav>, <main>)',
        'Accessible Form Controls (<label>, ARIA)',
        'Responsive Tailwind CSS Layout',
        'Interactive Dialog (<dialog> Modal)',
        'Zero Cumulative Layout Shift (CLS)',
      ],
      smartAssumptions: [
        'Assumed valid semantic HTML5 markup, responsive mobile-first Tailwind CSS utilities, WCAG AA compliance, and accessible interactive client components.',
      ],
      qualityScore: {
        overall: 96,
        grade: 'Expert',
        readyPercent: 99.5,
        clarity: 98,
        specificity: 95,
        context: 96,
        constraints: 94,
        platformFit: 98,
      },
      versions: {
        simple: `Role: Frontend Developer
Objective: Create a complete semantic HTML5 and CSS/Tailwind UI for: "${rawInput}"

Deliverables:
1. \`index.html\` file with valid doctype, viewport meta, and clean semantic structure.
2. Responsive header, hero section, card grid, and footer.
3. Accessible form inputs with matching labels and submit button.`,

        pro: `Role: Senior Frontend Engineer & UI Specialist
Objective: Build a production-ready, accessible HTML5 interface with Tailwind CSS for: "${rawInput}"

Requirements:
1. Semantic HTML5: <header>, <nav>, <main id="content">, <section>, <article>, and <footer>.
2. Responsive Layout: Mobile-first CSS grid and flexbox styling with dark obsidian aesthetics.
3. Accessible Forms: Explicit <label for="..."> associations, aria-invalid announcements, and keyboard focus rings.
4. Interactive Elements: Accessible modal dialog (<dialog>) and mobile drawer navigation.`,

        expert: `Role: Principal Frontend Architect & Accessibility Specialist
Objective: Author a benchmark-grade semantic HTML5 document and modern client component suite for:
"${rawInput}"

1. Semantic HTML5 Document Architecture (MANDATORY):
• Complete \`index.html\` Entry Point:
  - Valid <!DOCTYPE html>, <html lang="en">, UTF-8 encoding, responsive viewport, OpenGraph metadata.
  - Skip-to-content accessibility bypass link (<a href="#main" class="sr-only focus:not-sr-only">).
  - Explicit landmark roles (<header role="banner">, <nav role="navigation">, <main id="main" role="main">, <aside>, <footer role="contentinfo">).
• Accessible Forms & Interactive Controls:
  - Every <input> bound to a matching <label> via id/for attributes.
  - Accessible modal dialog using native <dialog> element or ARIA modal (role="dialog" aria-modal="true").
  - Visible focus rings with high contrast (focus-visible:ring-2 focus-visible:ring-[#8083ff]).

2. Modern UI & Styling:
• Tailwind CSS utilities with dark obsidian surfaces (#0b0e15), subtle hairline borders, and fluid typography.
• Zero layout shift: pre-sized image containers and system font fallbacks.

3. Output Deliverables:
Provide the complete standalone \`index.html\` file, modular component code, and instructions for zero-build preview.`,
      },
      activeVersion: 'expert',
      targetStack: 'HTML5 / Tailwind CSS / Modern JavaScript',
      tokensTotal: 420,
      isBookmarked: false,
    };
  }

  // =========================================================================
  // BACKEND & APIS & CLOUD ARCHITECTURE SYNTHESIZER
  // =========================================================================
  if (isBackend) {
    return {
      originalInput: rawInput,
      detectedLanguage: isHinglish ? 'Hinglish' : 'English',
      materialType: 'backend',
      fidelity: 99.2,
      tokenCount: Math.round(rawInput.split(/\s+/).length * 1.3),
      decodedIntent: 'Distributed Backend API, Data Model & Security Architecture',
      intentCode: 'BE-API',
      extractedRequirements: [
        'REST / GraphQL Endpoint Architecture',
        'Strict Schema Validation (Zod / Pydantic)',
        'Database Models & Foreign Key Relations',
        'JWT / Session Rotation Security',
        'Idempotent Webhook Processing',
        'Docker & Environment Secret Guards',
      ],
      smartAssumptions: [
        'Assumed Node.js/TypeScript or Python FastAPI, PostgreSQL database with ACID transactions, Redis caching layer, and defense-in-depth security.',
      ],
      qualityScore: {
        overall: 95,
        grade: 'Expert',
        readyPercent: 99.3,
        clarity: 97,
        specificity: 94,
        context: 96,
        constraints: 93,
        platformFit: 97,
      },
      versions: {
        simple: `Role: Backend Engineer
Objective: Build a secure backend API and database layer for: "${rawInput}"

Requirements:
1. Express/FastAPI server with route handlers and middleware.
2. PostgreSQL/MongoDB schema definitions for core entities.
3. Input validation and error handling responses.`,

        pro: `Role: Senior Backend Architect
Objective: Deliver a robust, scalable backend service architecture for: "${rawInput}"

Requirements:
• Framework: Node.js (TypeScript) or FastAPI with strict typing.
• Data Model: PostgreSQL schema with Prisma/Drizzle ORM and foreign key constraints.
• Auth & Security: JWT with refresh token rotation stored in HttpOnly cookies.
• Validation: Zod schemas for request body, query params, and URL parameters.
• Webhooks: Idempotent handlers with raw payload signature verification.`,

        expert: `Role: Principal Backend Systems Architect & Security Specialist
Objective: Design an enterprise backend microservice and data layer for:
"${rawInput}"

1. System Architecture & API Endpoints:
• POST /api/v1/auth/login - Argon2id password verification, issue short-lived JWT + HttpOnly refresh token.
• POST /api/v1/resources - Idempotent resource creation with UUIDv7 primary keys.
• GET /api/v1/resources - Cursor-based pagination, indexed filtering, and Redis query caching.
• POST /api/v1/webhooks - Raw body cryptographic signature verification and duplicate event deduplication.

2. Database Schema & Data Integrity:
• Complete Prisma or PostgreSQL DDL with proper B-Tree indexes on foreign keys and timestamps.
• Transaction isolation boundaries for multi-table mutations.

3. Reliability & DevOps:
• Structured logging with correlation IDs, health checks (/healthz), and Dockerfile containerization.
• Graceful shutdown handling (SIGTERM) with connection pool draining.`,
      },
      activeVersion: 'expert',
      targetStack: 'Node.js / FastAPI / PostgreSQL / Redis',
      tokensTotal: 410,
      isBookmarked: false,
    };
  }

  // =========================================================================
  // AI VIDEO GENERATION (RUNWAY / SORA / KLING / PIKA) SYNTHESIZER
  // =========================================================================
  if (isVideo) {
    return {
      originalInput: rawInput,
      detectedLanguage: isHinglish ? 'Hinglish' : 'English',
      materialType: 'video',
      fidelity: 98.9,
      tokenCount: Math.round(rawInput.split(/\s+/).length * 1.3),
      decodedIntent: 'Cinematic AI Video Generation & Camera Choreography',
      intentCode: 'VID-GEN',
      extractedRequirements: [
        'Camera Motion & Lens Calibration',
        'Temporal Subject Consistency',
        'Volumetric Lighting & Atmosphere',
        'Pacing & Slow-Motion Frame Rate',
        'Aspect Ratio & Resolution Metadata',
        'Sound Design & Foley Direction',
      ],
      smartAssumptions: [
        'Assumed Runway Gen-3 Alpha, OpenAI Sora, or Kling AI engine, cinematic anamorphic lenses, 24fps film cadence, and continuous motion physics.',
      ],
      qualityScore: {
        overall: 93,
        grade: 'Expert',
        readyPercent: 98.8,
        clarity: 95,
        specificity: 93,
        context: 92,
        constraints: 91,
        platformFit: 96,
      },
      versions: {
        simple: `Cinematic drone shot of "${rawInput}", slow smooth forward push-in, golden hour lighting, 4K quality, photorealistic motion.`,
        pro: `Cinematic anamorphic tracking shot of "${rawInput}". Smooth dolly zoom backward revealing dramatic depth of field. Volumetric atmospheric haze, rim lighting, 35mm film grain, 24fps film cadence, photorealistic temporal stability.`,
        expert: `Cinematic camera trajectory: smooth forward pedestal tracking shot with subtle low-angle tilt. Subject: "${rawInput}".
Lighting: Volumetric morning mist illuminated by low-angle golden light, deep chiaroscuro shadows, natural anamorphic lens flare.
Camera Optics: Panavision C-Series anamorphic 40mm lens, T2.0 aperture, shallow focus pulling from foreground particles to the primary subject.
Motion Dynamics: Slow motion 60fps slowed to 24fps cinematic playback, zero morphing or temporal jitter, physics-accurate environmental interaction.
Sound Design Prompt: Ambient wind resonance, subtle binaural foley, low-frequency atmospheric sub-bass drone.`,
      },
      activeVersion: 'expert',
      targetStack: 'Runway Gen-3 / Sora / Kling AI Engine',
      tokensTotal: 260,
      isBookmarked: false,
    };
  }

  // =========================================================================
  // AI IMAGE GENERATION (MIDJOURNEY / FLUX / DALL-E) SYNTHESIZER
  // =========================================================================
  if (isImage) {
    return {
      originalInput: rawInput,
      detectedLanguage: isHinglish ? 'Hinglish' : 'English',
      materialType: 'image',
      fidelity: 98.7,
      tokenCount: Math.round(rawInput.split(/\s+/).length * 1.3),
      decodedIntent: 'Hyper-Realistic Visual Identity & Asset Generation',
      intentCode: 'IMG-MIDJ',
      extractedRequirements: [
        'Camera Optics (85mm f/1.4)',
        'Chiaroscuro & Volumetric Rim Lighting',
        'Film Stock Color Calibration (Kodak Portra)',
        'Aspect Ratio Directives (--ar 16:9)',
        'Negative Constraints & Artifact Filtering',
      ],
      smartAssumptions: [
        'Assumed Midjourney v6.1 or FLUX.1 Pro engine, 8k octagonal subsurface scattering, and high negative space.',
      ],
      qualityScore: {
        overall: 94,
        grade: 'Expert',
        readyPercent: 98.9,
        clarity: 95,
        specificity: 94,
        context: 92,
        constraints: 91,
        platformFit: 97,
      },
      versions: {
        simple: `High quality photo of "${rawInput}", studio lighting, clean sharp focus, 8k resolution --ar 16:9`,
        pro: `Cinematic studio portrait of "${rawInput}", volumetric rim illumination, 85mm lens calibration, skin subsurface scattering, Kodak Portra color grade --ar 16:9 --v 6.1 --style raw`,
        expert: `Hyper-realistic cinematic photograph of "${rawInput}".
Lighting: Dual rim illumination with subtle cyan edge glow and warm tungsten key light, chiaroscuro contrast, atmospheric volumetric dust motes.
Camera & Optics: Hasselblad H6D-100c, 85mm f/1.4 portraiture lens, razor-sharp focus on primary texture, soft bokeh falloff.
Color & Texture: Kodak Portra 400 film stock grading, natural subsurface skin scattering, authentic micro-textures, zero CGI plastic sheen --ar 16:9 --v 6.1 --style raw --stylize 650 --no cartoon, 3d render, watermark, extra limbs, blur`,
      },
      activeVersion: 'expert',
      targetStack: 'Midjourney v6.1 / FLUX.1 Pro Engine',
      tokensTotal: 220,
      isBookmarked: false,
    };
  }

  // =========================================================================
  // MARKETING CONTENT & DIRECT RESPONSE SYNTHESIZER
  // =========================================================================
  if (isMarketing) {
    return {
      originalInput: rawInput,
      detectedLanguage: isHinglish ? 'Hinglish' : 'English',
      materialType: 'marketing',
      fidelity: 99.1,
      tokenCount: Math.round(rawInput.split(/\s+/).length * 1.3),
      decodedIntent: 'Direct-Response Marketing & High-Converting Copy Architecture',
      intentCode: 'MKT-COPY',
      extractedRequirements: [
        '3-Second Psychological Pattern Interrupt',
        'Friction Agitation & Hidden Cost of Inaction',
        'Unique Mechanism of Transformation',
        'Social Proof & Risk-Reversal Offer',
        'High-Urgency Call to Action (CTA)',
      ],
      smartAssumptions: [
        'Assumed direct response psychology, short punchy conversational rhythm, zero corporate jargon, and measurable conversion goals.',
      ],
      qualityScore: {
        overall: 95,
        grade: 'Expert',
        readyPercent: 99.3,
        clarity: 97,
        specificity: 95,
        context: 96,
        constraints: 92,
        platformFit: 97,
      },
      versions: {
        simple: `Role: Direct Response Copywriter
Task: Write high-converting ad copy for: "${rawInput}"
Include:
- Catchy hook
- 3 key benefits
- Clear Call to Action with urgency.`,

        pro: `Role: Top 1% Direct Response Copywriter & Funnel Strategist
Task: Produce a viral multi-platform marketing asset for: "${rawInput}"

Framework:
1. Hook (0-3s): Contrarian paradox or surprising statistic
2. Agitation: Describe the prospect's daily frustration in vivid sensory detail
3. The Pivot: Introduce the proprietary mechanism that makes traditional solutions obsolete
4. Irresistible Offer: Risk-free trial + explicit deadline constraint.`,

        expert: `Role: Principal Direct Response Copy Chief & Consumer Behavioralist
Objective: Author an elite, high-velocity marketing copy suite for:
"${rawInput}"

1. Psychological Hook Matrix (3 Variations):
• Hook A [Contrarian Paradox]: "Stop trying [common advice]. Here is why top 1% performers do the exact opposite."
• Hook B [The Hidden Cost]: "You are losing $X every month because of this silent bottleneck."
• Hook C [The Micro-Story]: "3 weeks ago I had given up. Then we tested this one variable..."

2. Core Conversion Body (AIDA + PAS Architecture):
• Problem Agitation: Pinpoint the visceral emotional friction without sounding accusatory.
• The Unique Mechanism: Give the methodology a proprietary, memorable name.
• Social Proof & Proof Stacking: Specific metrics (+42% uplift, 1,240+ verified users).
• Offer Stack & Risk Reversal: 100% money-back guarantee with zero friction.

3. Call to Action (CTA):
• Low-friction, high-intent trigger with real-time scarcity cue.`,
      },
      activeVersion: 'expert',
      targetStack: 'Direct Response / Ad Copy / Email Sequence',
      tokensTotal: 380,
      isBookmarked: false,
    };
  }

  // =========================================================================
  // TEXT, ESSAY & LONG-FORM STORYTELLING SYNTHESIZER
  // =========================================================================
  if (isText) {
    return {
      originalInput: rawInput,
      detectedLanguage: isHinglish ? 'Hinglish' : 'English',
      materialType: 'text',
      fidelity: 99.3,
      tokenCount: Math.round(rawInput.split(/\s+/).length * 1.3),
      decodedIntent: 'Thought Leadership & Deep Narrative Text Synthesis',
      intentCode: 'TXT-PROSE',
      extractedRequirements: [
        'Compelling Narrative Hook & Thesis',
        'Multi-Layered Conceptual Progression',
        'Sensory Detail & Concrete Analogies',
        'Counter-Argument Refutation',
        'Zero Generic AI Clichés & Buzzwords',
        'Resonant Philosophical Conclusion',
      ],
      smartAssumptions: [
        'Assumed literary prose standards, intellectual rigor, authentic voice, varied sentence pacing, and complete eradication of generic AI filler.',
      ],
      qualityScore: {
        overall: 96,
        grade: 'Expert',
        readyPercent: 99.5,
        clarity: 98,
        specificity: 95,
        context: 97,
        constraints: 94,
        platformFit: 98,
      },
      versions: {
        simple: `Role: Thoughtful Essayist & Writer
Objective: Write an insightful, well-structured piece on: "${rawInput}"
Include an engaging opening, three compelling arguments with examples, and a memorable conclusion.`,

        pro: `Role: Senior Editorial Essayist & Thought Leader
Objective: Author an authoritative long-form piece on: "${rawInput}"

Guidelines:
- Tone: Intellectual yet accessible, reminiscent of Paul Graham or The New Yorker.
- Structure: Start with an intriguing paradox, unpack the underlying mechanism, address intelligent counterarguments, and close with actionable perspective.
- Anti-Fluff Rule: Zero corporate buzzwords or generic AI phrases ("in today's fast-paced world").`,

        expert: `Role: Master Narrative Non-Fiction Author & Investigative Essayist
Objective: Produce an unforgettable, long-form essay and thesis on:
"${rawInput}"

1. Editorial Voice & Cadence:
• Voice: Sharp, intellectually fearless, evocative, and deeply grounded in first-principles reasoning.
• Rhythm: Varied sentence lengths (alternating 4-word punchy statements with 25-word rhythmic explorations).
• Anti-AI Heuristics: Strictly ban words like "delve", "testament", "tapestry", "multifaceted", and "in conclusion".

2. Structural Arc:
• The Opening Hook: An idiosyncratic, real-world vignette that encapsulates the wider philosophical dilemma.
• The Underlying Paradox: Why common intuitions about this topic fail under examination.
• The Anatomy of the Phenomenon: Deep-dive analysis supported by concrete historical or technological analogies.
• Steel-manning the Opposition: Present the strongest possible counter-argument before dismantling it.
• The Synthesis: A forward-looking, poetic realization of what this means for human agency.`,
      },
      activeVersion: 'expert',
      targetStack: 'Editorial Essay / Long-Form Narrative / Thought Leadership',
      tokensTotal: 410,
      isBookmarked: false,
    };
  }

  // =========================================================================
  // DEFAULT: FULL-STACK WEB APPLICATION (HTML5 + BACKEND) SYNTHESIZER
  // =========================================================================
  return {
    originalInput: rawInput,
    detectedLanguage: isHinglish ? 'Hinglish' : 'English',
    materialType: 'web_app',
    fidelity: 99.4,
    tokenCount: Math.round(rawInput.split(/\s+/).length * 1.35),
    decodedIntent: 'Full-Stack Web Application (HTML5 Entry Point + Backend APIs)',
    intentCode: 'WEB-FULL',
    extractedRequirements: [
      'Semantic HTML5 index.html Template',
      'Responsive Tailwind CSS UI Layout',
      'User Auth & Protected Routes',
      'Backend Server APIs & Controllers',
      'Database Schema (PostgreSQL/Prisma)',
      'Secure Webhook Signature Verification',
      'Complete Project File Structure',
    ],
    smartAssumptions: [
      'Assumed complete semantic HTML5 markup (index.html, responsive client templates), Next.js 14 / React, Tailwind CSS, and secure backend APIs with PostgreSQL & webhook listeners.',
    ],
    qualityScore: {
      overall: 95,
      grade: 'Expert',
      readyPercent: 99.5,
      clarity: 97,
      specificity: 94,
      context: 96,
      constraints: 93,
      platformFit: 98,
    },
    versions: {
      simple: `Role: Full-Stack Web Developer
Objective: Create a complete web application for: "${rawInput}"

Required Deliverables:
1. Frontend & HTML:
   • Complete semantic HTML5 structure (index.html, header, hero banner, interactive UI, and modal dialog).
   • Clean, responsive Tailwind CSS styling with accessible form controls and buttons.
2. Backend Code:
   • Server endpoints, auth middleware, and database schema.
3. Project Structure:
   • File tree showing both frontend HTML/client files and backend routes.`,

      pro: `Role: Senior Full-Stack Engineer
Objective: Build a modern full-stack web application with complete frontend HTML templates and backend APIs for: "${rawInput}"

1. Frontend & HTML5 Architecture (MANDATORY):
• Semantic HTML5 Markup: Provide the complete \`index.html\` entry point, root layout, semantic tags (<header>, <nav>, <main>, <section>, <article>, <aside>, <footer>), and accessible ARIA attributes.
• Client UI Templates: Responsive landing page, interactive dashboard, and accessible modal dialogs.
• Styling: Modern responsive Tailwind CSS layout with dark theme aesthetics.

2. Backend & Server Architecture:
• Next.js 14 App Router / Express with strict TypeScript schema validation (Zod).
• PostgreSQL schema with Prisma ORM and transaction safety.
• Secure session handling and webhook listeners with raw body verification.

3. Deliverables:
Provide production-ready code for BOTH the frontend HTML/UI files and backend API routes.`,

      expert: `Role: Senior Full-Stack Architect & Core UI Specialist
Objective: Build an end-to-end production web application with complete semantic HTML5 templates, role-based auth, and robust backend APIs for:
"${rawInput}"

1. Frontend & Semantic HTML5 Architecture (MANDATORY):
• HTML Entry & Document Structure:
  - Complete \`index.html\` entry point with responsive viewport, OpenGraph meta, preloaded typography, and semantic landmark elements.
  - Semantic HTML5 layout tags (<header role="banner">, <nav role="navigation">, <main role="main">, <article>, <aside role="complementary">, <footer role="contentinfo">).
  - Accessible form controls with explicit <label>, <input>, validation announcements, and accessible modal dialogs (<dialog>).
• Client UI Templates to Deliver:
  - \`index.html\` / \`src/app/page.tsx\`: High-converting landing hero & featured modules.
  - \`src/components/Navbar.tsx\`: Accessible navigation header.
  - \`src/components/MainLayout.tsx\`: Responsive CSS grid with accessible cards.
  - \`src/components/ModalDialog.tsx\`: Accessible modal dialog markup.
• Design System: Tailwind CSS v3/v4 responsive utilities with dark obsidian styling and WCAG AA contrast compliance.

2. Backend & Server Architecture:
• Next.js 14 App Router with Server Actions or Express REST controllers with strict Zod validation.
• PostgreSQL schema with Prisma / Drizzle ORM and foreign key constraints.
• Zero client-side secret exposure: handle webhooks with raw body signature verification and idempotent logs.

3. Deliverables:
Deliver production-grade code for BOTH frontend HTML/UI templates and backend API logic, including complete index.html, styled components, schemas, and environment config without placeholder stubs.`,
    },
    activeVersion: depth === 'quick' ? 'simple' : depth === 'pro' ? 'pro' : 'expert',
    targetStack: 'Cursor / Next.js / HTML5 / Claude 3.5 Sonnet',
    tokensTotal: 410,
    isBookmarked: false,
  };
}
