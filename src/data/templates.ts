import { PromptTemplate } from '../types';

export const CURATED_TEMPLATES: PromptTemplate[] = [
  {
    id: 'template-1',
    title: 'Full-Stack SaaS Boilerplate (HTML + Backend)',
    description: 'Deterministic full-stack code architecture synthesis with semantic index.html template, Prisma migrations, and webhook instrumentation.',
    category: 'code',
    platform: 'Cursor / Claude 3.5',
    authorEngine: 'Cursor IDE',
    rating: 4.9,
    usesCount: '12.4k',
    tokens: 1480,
    temperature: 0.2,
    tags: ['HTML5 Entry', 'Next.js 15', 'Auth.js', 'Stripe SDK', 'Prisma'],
    codeSnippet: `Role: Principal Full-Stack SaaS Architect
Objective: Scaffold a production-ready web application architecture with semantic HTML5 entry point, client layouts, and backend APIs for:
"Tenant SaaS Dashboard with Analytics & Billing"

1. Frontend & Semantic HTML5 Architecture (MANDATORY):
• Entry point: Complete \`index.html\` with valid doctype, viewport, OpenGraph metadata, and preloaded fonts.
• Semantic Landmarks: <header>, <nav>, <main id="main">, <section>, <article>, and <footer> with explicit ARIA accessibility attributes.
• Accessible Dialog: Native <dialog> or ARIA modal markup for tenant onboarding.
• Styling: Responsive Tailwind CSS utilities with dark obsidian aesthetic (#0b0e15).

2. Backend Server Architecture:
• Next.js 15 App Router / Server Actions with strict Zod payload validation.
• PostgreSQL schema with Prisma ORM and transaction isolation.
• Stripe Billing SDK with idempotent webhook handler and customer portal.

Output: Complete production code for BOTH frontend HTML/UI templates and backend routes with zero placeholder stubs.`,
    isBookmarked: false,
  },
  {
    id: 'template-ppt-1',
    title: '10-Slide Investor Pitch Deck Blueprint',
    description: 'Widescreen 16:9 investor presentation blueprint with 60/40 visual-to-text layout math, slide metrics, and speaker scripts.',
    category: 'ppt',
    platform: 'PowerPoint / Keynote / Gamma',
    authorEngine: 'Keynote Architect',
    rating: 5.0,
    usesCount: '9.8k',
    tokens: 920,
    temperature: 0.3,
    tags: ['Pitch Deck', '16:9 Widescreen', 'Investor Ready', 'Speaker Notes'],
    codeSnippet: `Role: Principal Venture Pitch Strategist & Presentation Director
Objective: Synthesize a high-stakes 10-slide investor keynote deck blueprint for an AI automation platform raising $3M Seed round.

1. Slide Breakdown (16:9 Widescreen):
• Slide 1 [The Hook]: Bold 1-sentence value proposition. Zero jargon.
• Slide 2 [The Friction]: Quantified industry bottleneck ($14B lost annually in redundant data hygiene).
• Slide 3 [The Solution]: Paradigm shift before/after comparison flowchart.
• Slide 4 [Product Architecture]: 3-step automated telemetry workflow with animated UI callouts.
• Slide 5 [Market Sizing]: TAM ($38B) → SAM ($6.2B) → SOM ($850M) with analyst citations.
• Slide 6 [Business Model & Unit Economics]: 138% Net Revenue Retention, $18k ACV, 6-month CAC payback.
• Slide 7 [Competitive Moat]: 2x2 matrix demonstrating proprietary data flywheel.
• Slide 8 [Traction & Velocity]: 3.8x YoY ARR growth, logos of 14 enterprise pilot contracts.
• Slide 9 [Financial Forecast]: 3-year revenue milestones ($1.2M -> $4.5M -> $12M) with 78% gross margin.
• Slide 10 [The Ask & Milestones]: $3M Seed allocation (55% Engineering, 30% GTM, 15% Ops).

2. Visual Layout Directives:
• 60/40 Rule: Left 60% bold diagram/metric, Right 40% concise cards. Max 25 words per slide.
• Colors: Obsidian canvas (#0a0d14), electric mint (#4edea3) for gains, lavender (#c0c1ff) for badges.
• Speaker Delivery Notes: Exact 45-second spoken script for each slide.`,
    isBookmarked: true,
  },
  {
    id: 'template-pdf-1',
    title: 'Enterprise Technical Whitepaper & Report Spec',
    description: 'Multi-page PDF publishing blueprint with A4/Letter print specs, 2-column typographic layout, callouts, and implementation roadmap.',
    category: 'pdf',
    platform: 'PDF / InDesign / LaTeX',
    authorEngine: 'Enterprise Analyst',
    rating: 4.9,
    usesCount: '7.4k',
    tokens: 1100,
    temperature: 0.3,
    tags: ['Whitepaper', 'A4/Letter Specs', '2-Column Grid', 'Infographics'],
    codeSnippet: `Role: Principal Industry Analyst & Senior Document Architect
Objective: Author an authoritative, publication-ready enterprise PDF whitepaper on "Autonomous Multi-Agent AI in Enterprise Cloud Architecture".

1. Document Layout & Print Geometry:
• Geometry: Standard A4 & US Letter with 24mm outer margins and 18mm inner gutter margins.
• Typographic Scale: H1 (28pt bold), H2 (18pt semibold), Body (10.5pt on 15.5pt leading), Footnotes (8.5pt).
• Two-Column Layout: Crisp 2-column text flow with high-contrast pull quotes every 2 pages.

2. Structural Sections:
• Cover: Minimalist title, version metadata, document ID, and classification badge.
• Executive Summary: 250-word synthesis with 4 key findings in an emerald callout box.
• Section 1: Macro trends and economic drivers forcing autonomous orchestration.
• Section 2: Technical architecture blueprint and consensus protocols.
• Section 3: Benchmark comparison matrix: Traditional vs. Multi-Agent workflows.
• Section 4: Enterprise Case Study with latency reduction metrics (-64%).
• Section 5: 30-60-90 day deployment roadmap and risk mitigation matrix.
• Appendix: Technical glossary, research references, and author biographies.`,
    isBookmarked: false,
  },
  {
    id: 'template-mobile-1',
    title: 'Cross-Platform Mobile App (React Native / Flutter)',
    description: 'Production mobile blueprint with bottom tab navigation, FaceID biometric auth, MMKV cache, and iOS Dynamic Island safe areas.',
    category: 'mobile_app',
    platform: 'React Native Expo / Flutter',
    authorEngine: 'Mobile Lead',
    rating: 4.8,
    usesCount: '11.2k',
    tokens: 1250,
    temperature: 0.25,
    tags: ['React Native', 'Flutter', 'Biometric Auth', 'Dynamic Island'],
    codeSnippet: `Role: Principal Cross-Platform Mobile Engineer
Objective: Architect a cross-platform mobile application for:
"Fintech Personal Wealth & Real-Time Portfolio Tracker"

1. Native Mobile Architecture:
• Framework: React Native with Expo SDK 51 (or Flutter 3.22) with TypeScript strict mode.
• Navigation: Typed React Navigation (Native Stack + Custom SVG Bottom Tab Bar).
• Device Integrations:
  - LocalAuthentication for FaceID / Biometric quick unlock.
  - Safe Area: Dynamic padding for iOS Dynamic Island and Android navigation bars.
  - Haptic Engine: Subtle sensory feedback on gesture interactions.
• Offline Storage: MMKV synchronous key-value caching with background sync queue.

2. Core Screen Deliverables:
• (tabs)/dashboard: Portfolio balance hero card, interactive Sparkline chart, quick action pills.
• (tabs)/transactions: FlashList with pull-to-refresh, categorized transaction items.
• (tabs)/settings: Security preferences, biometric toggle, theme selector.

3. Deliverables: Complete native code, navigation manifests, and gesture animation configs.`,
    isBookmarked: true,
  },
  {
    id: 'template-res-1',
    title: 'Empirical Academic Research Study & Protocol',
    description: 'Exhaustive academic research study design with epistemological problem statement, hypotheses (H0/H1), ANOVA testing, and APA 7th citations.',
    category: 'research',
    platform: 'Academic / APA 7th / LaTeX',
    authorEngine: 'Research Fellow',
    rating: 4.9,
    usesCount: '5.8k',
    tokens: 1320,
    temperature: 0.2,
    tags: ['APA 7th', 'Empirical Study', 'Hypothesis Testing', 'MANOVA'],
    codeSnippet: `Role: Principal Academic Investigator & Quantitative Methodologist
Objective: Formulate a peer-review ready empirical research paper and study protocol on:
"The Impact of AI-Assisted Code Generation on Developer Cognitive Load and Software Vulnerability Rates"

1. Study Architecture:
• Section 1 [Epistemological Context]: Theoretical grounding, research gap identification, and 3 explicit Research Questions (RQ1, RQ2, RQ3).
• Section 2 [Hypotheses Matrix]:
  - H0: AI assistance produces no statistically significant difference in vulnerability density.
  - H1: Statistically significant interaction effect between AI code velocity and test coverage depth (alpha = 0.05).
• Section 3 [Systematic Literature Review]: PRISMA protocol synthesis of 45 recent peer-reviewed empirical studies.
• Section 4 [Methodology & Instrumentation]:
  - Stratified random sampling: Power analysis (G*Power) to determine sample size (N=180).
  - Measurement Instruments: NASA-TLX cognitive load index and static analysis vulnerability audits (SonarQube).
• Section 5 [Statistical Protocol]:
  - Descriptive statistics (mean, standard deviation, skewness).
  - Inferential testing: Two-way MANOVA and hierarchical linear regression with multicollinearity checks (VIF < 2.5).
• Section 6 [Ethical Safeguards & Limitations]: IRB approval protocol and confounder controls.
• Section 7 [References]: Structured according to APA 7th Edition guidelines.`,
    isBookmarked: false,
  },
  {
    id: 'template-fe-1',
    title: 'Semantic HTML5 Entry Point & Tailwind UI Architecture',
    description: 'Complete standalone index.html file with valid DOCTYPE, accessible landmark elements, responsive Tailwind CSS grid, and modal dialog.',
    category: 'frontend',
    platform: 'HTML5 / Tailwind CSS / Modern JS',
    authorEngine: 'Frontend Architect',
    rating: 5.0,
    usesCount: '14.6k',
    tokens: 1150,
    temperature: 0.2,
    tags: ['index.html', 'Semantic HTML5', 'WCAG AA', 'Accessible Form'],
    codeSnippet: `Role: Principal Frontend Architect & Accessibility Specialist
Objective: Author a benchmark-grade semantic HTML5 document and modern UI suite for:
"Modern Developer Analytics Platform Landing & Interactive Dashboard"

1. Semantic HTML5 Document Architecture (MANDATORY):
• Complete \`index.html\` Entry Point:
  - Valid <!DOCTYPE html>, <html lang="en">, UTF-8 encoding, responsive viewport, OpenGraph metadata.
  - Skip-to-content accessibility link (<a href="#main" class="sr-only focus:not-sr-only">).
  - Explicit landmark roles (<header role="banner">, <nav role="navigation">, <main id="main" role="main">, <aside>, <footer role="contentinfo">).
• Accessible Forms & Interactive Controls:
  - Every <input> bound to a matching <label> via id/for attributes.
  - Accessible modal dialog using native <dialog> element or ARIA modal (role="dialog" aria-modal="true").
  - Visible focus rings with high contrast (focus-visible:ring-2 focus-visible:ring-[#8083ff]).

2. Modern UI & Styling:
• Tailwind CSS utilities with dark obsidian surfaces (#0b0e15), subtle hairline borders, and fluid typography.
• Zero layout shift: pre-sized image containers and system font fallbacks.

Deliverables: Complete standalone \`index.html\` file and responsive component templates.`,
    isBookmarked: true,
  },
  {
    id: 'template-be-1',
    title: 'Distributed Backend Service & Idempotent APIs',
    description: 'Production backend architecture with REST/GraphQL endpoints, Zod schema validation, PostgreSQL DDL, and JWT rotation security.',
    category: 'backend',
    platform: 'FastAPI / Node.js / PostgreSQL',
    authorEngine: 'Cloud Systems Lead',
    rating: 4.9,
    usesCount: '8.9k',
    tokens: 1200,
    temperature: 0.15,
    tags: ['FastAPI', 'PostgreSQL', 'JWT Rotation', 'Idempotent Webhooks'],
    codeSnippet: `Role: Principal Backend Systems Architect & Security Specialist
Objective: Design an enterprise backend microservice and data layer for:
"High-Throughput Order Management & Webhook Event Processing"

1. System Architecture & API Endpoints:
• POST /api/v1/auth/login - Argon2id password verification, issue short-lived JWT + HttpOnly refresh token.
• POST /api/v1/orders - Idempotent resource creation with UUIDv7 primary keys and client idempotency keys.
• GET /api/v1/orders - Cursor-based pagination, indexed filtering, and Redis query caching.
• POST /api/v1/webhooks - Raw body cryptographic HMAC signature verification and deduplication.

2. Database Schema & Data Integrity:
• Complete PostgreSQL DDL with proper B-Tree indexes on foreign keys and timestamps.
• Transaction isolation boundaries for multi-table mutations.

3. Reliability & DevOps:
• Structured logging with correlation IDs, health checks (/healthz), and Dockerfile containerization.
• Graceful shutdown handling (SIGTERM) with connection pool draining.`,
    isBookmarked: false,
  },
  {
    id: 'template-vid-1',
    title: 'Cinematic Runway Gen-3 Drone & Anamorphic Direction',
    description: 'Anamorphic 35mm lens calibration, volumetric mist lighting, 24fps film cadence, and foley sound design cues.',
    category: 'video',
    platform: 'Runway Gen-3 / Sora / Kling',
    authorEngine: 'Cinema Director',
    rating: 4.8,
    usesCount: '13.1k',
    tokens: 410,
    temperature: 0.7,
    tags: ['Runway Gen-3', 'Sora', 'Anamorphic 35mm', '24fps Cadence'],
    codeSnippet: `Cinematic camera trajectory: smooth forward pedestal tracking shot with subtle low-angle tilt.
Subject: An autonomous solar harvesting rover traversing a crystalline obsidian desert at dawn.
Lighting: Volumetric morning mist illuminated by low-angle golden light, deep chiaroscuro shadows, natural anamorphic lens flare.
Camera Optics: Panavision C-Series anamorphic 40mm lens, T2.0 aperture, shallow focus pulling from foreground sand particles to the primary rover treads.
Motion Dynamics: Slow motion 60fps slowed to 24fps cinematic playback, zero morphing or temporal jitter, physics-accurate environmental dust interaction.
Sound Design Prompt: Ambient wind resonance, subtle binaural mechanical servos, low-frequency atmospheric sub-bass drone.`,
    isBookmarked: false,
  },
  {
    id: 'template-img-1',
    title: 'Photorealistic Cinematic Portrait (Midjourney v6.1)',
    description: 'Volumetric rim illumination, anamorphic 85mm lens calibration, skin subsurface scattering matrix.',
    category: 'image',
    platform: 'Midjourney v6.1 / FLUX.1',
    authorEngine: 'Midjourney v6.1',
    rating: 4.9,
    usesCount: '16.2k',
    tokens: 380,
    temperature: 0.7,
    tags: ['--ar 16:9', 'Rembrandt Rim', 'Kodak Portra', 'FLUX.1'],
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC5-2Lg5dP6eKI3AmkQiMFNCKfMiC_5GsaUwpR34LpSgvZJ5uz5hu9OmaK3zFm-Mmx3uBMyb_FIRuUBUa64dC02TJ9cuC55UMWlwYvxKdliauZzrU4v493B1_Q-zTS0HEU7QPlwrrAjfl77KbXQuzyZhdkyffCoCFvzWmyOVYvLUQhpT_4dBW8bebS0Yj7KiyE8gpQsSvAiol1-CaPatTIFK-wve5T5wxzRopq0qh6d_f7JgS0qlWLk',
    imageAlt: 'Striking hyper-realistic cinematic studio portrait of an android figure with subtle obsidian carbon textures and luminous cyan edge lighting.',
    imageSpecs: '--ar 16:9 --v 6.1 --stylize 700',
    codeSnippet: `cinematic hyper-realistic studio portrait of an android figure, subtle obsidian carbon fiber textures, intricate biometric circuits, illuminated by intense cyan edge rim lighting, deep cosmic dark slate void background, subtle violet volumetric dust motes, chiaroscuro lighting, soft 85mm f/1.4 lens depth of field, Kodak Portra color grading, raw photo quality --ar 16:9 --v 6.1 --style raw --stylize 650`,
    isBookmarked: true,
  },
  {
    id: 'template-mkt-1',
    title: 'High-Converting Viral Direct Response Ad Script',
    description: 'Direct-response psychological framework delivering a 3-second visual pattern interrupt, agitating tension, and culminating in high-friction CTA release.',
    category: 'marketing',
    platform: 'ChatGPT / Copywriting',
    authorEngine: 'Claude / ChatGPT',
    rating: 5.0,
    usesCount: '15.1k',
    tokens: 890,
    temperature: 0.8,
    tags: ['Direct Response', 'TikTok/Reels', 'FOMO Trigger'],
    codeSnippet: `Act as a Top 1% Direct Response Copywriter for DTC Brands.
Task: Write a high-velocity 30-second video ad script following the viral hook framework.

Framework Structure:
1. Pattern Interrupt (0-3s): Subvert common belief with visual paradox ("Stop taking cold showers for energy...")
2. Micro-Demo (3-12s): Split-screen tangible proof demonstrating instant transformation
3. Friction Agitation (12-22s): Highlight the hidden cost of inaction in relatable emotional terms
4. Irresistible Offer & CTA (22-30s): Zero-risk trial trigger with explicit urgency constraint

Tone: Conversational, energetic, authentic, non-salesy.`,
    isBookmarked: false,
  },
  {
    id: 'template-txt-1',
    title: 'Thought Leadership Narrative Essay & Thesis',
    description: 'Intellectual narrative essay architecture with compelling paradoxical hook, philosophical rigor, and zero generic AI filler.',
    category: 'text',
    platform: 'Editorial / Essay / Substack',
    authorEngine: 'Narrative Essayist',
    rating: 4.8,
    usesCount: '6.4k',
    tokens: 980,
    temperature: 0.6,
    tags: ['Thought Leadership', 'Narrative Arc', 'Anti-AI Fluff', 'Substack'],
    codeSnippet: `Role: Master Narrative Non-Fiction Author & Investigative Essayist
Objective: Produce an unforgettable, long-form essay on:
"The Illusion of Speed: Why Real Innovation Happens in Deliberate Friction"

1. Editorial Voice & Cadence:
• Voice: Sharp, intellectually fearless, evocative, and deeply grounded in first-principles reasoning.
• Rhythm: Varied sentence lengths (alternating 4-word punchy statements with 25-word rhythmic explorations).
• Anti-AI Heuristics: Strictly ban words like "delve", "testament", "tapestry", "multifaceted", and "in conclusion".

2. Structural Arc:
• The Opening Hook: An idiosyncratic, real-world vignette that encapsulates the wider philosophical dilemma.
• The Underlying Paradox: Why common intuitions about this topic fail under examination.
• The Anatomy of the Phenomenon: Deep-dive analysis supported by concrete historical or technological analogies.
• Steel-manning the Opposition: Present the strongest possible counter-argument before dismantling it.
• The Synthesis: A forward-looking realization of what this means for creative agency.`,
    isBookmarked: false,
  },
];
