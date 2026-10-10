export interface RecentPrompt {
  id: string;
  title: string;
  timeAgo: string;
  engine: string;
  engineIcon: string;
  tag: string;
  tagColor: 'tertiary' | 'secondary' | 'primary';
  snippet: string;
  fullPrompt: string;
}

export const RECENT_PROMPTS: RecentPrompt[] = [
  {
    id: 'recent-1',
    title: 'FastAPI Auth',
    timeAgo: '2h ago',
    engine: 'Cursor',
    engineIcon: 'terminal',
    tag: 'FastAPI Auth',
    tagColor: 'tertiary',
    snippet: 'JWT authentication flow with refresh tokens and PostgreSQL session schema...',
    fullPrompt: 'Create a production FastAPI authentication microservice with Argon2 password hashing, rotating refresh tokens stored in HttpOnly cookies, and strict Pydantic v2 validation models.',
  },
  {
    id: 'recent-2',
    title: 'SaaS Pricing',
    timeAgo: 'Yesterday',
    engine: 'Claude',
    engineIcon: 'code',
    tag: 'SaaS Pricing',
    tagColor: 'secondary',
    snippet: 'Tailwind CSS 3-tier pricing matrix with annual discount toggle and feature flags...',
    fullPrompt: 'Design a high-converting responsive SaaS pricing matrix in Tailwind CSS with monthly/yearly billing toggle, tier feature comparisons, and accessible tooltips.',
  },
  {
    id: 'recent-3',
    title: 'Razorpay UPI',
    timeAgo: '3d ago',
    engine: 'GPT-4o',
    engineIcon: 'terminal',
    tag: 'Razorpay UPI',
    tagColor: 'primary',
    snippet: 'Next.js webhook handler for checkout validation and Indian GST invoice compute...',
    fullPrompt: 'Mujhe ek Razorpay webhook handler banana hai Next.js mein jisme UPI payment verification, failed transaction retry aur GST invoice generation ho.',
  },
];

export const QUICK_SUGGESTIONS = [
  {
    label: 'Web App: E-commerce in Hinglish',
    text: 'Mujhe ek complete e-commerce website chahiye Hinglish tone mein jisme product cart, UPI payment gateway aur WhatsApp notification integrate ho.',
  },
  {
    label: 'PPT: 10-Slide Investor Pitch Deck',
    text: 'Create a 10-slide high-stakes investor pitch deck for an AI automation startup seeking $2.5M Seed round with market metrics and speaker notes.',
  },
  {
    label: 'PDF: Whitepaper on Autonomous AI Agents',
    text: 'Author an enterprise PDF whitepaper on Autonomous Multi-Agent Workflows in Fortune 500 with executive abstract, 2-column layout and implementation roadmap.',
  },
  {
    label: 'Mobile App: Flutter Health Tracker',
    text: 'Build a cross-platform mobile health tracking app in Flutter with bottom navigation, Apple HealthKit sync, biometric login and offline SQLite cache.',
  },
  {
    label: 'Research: GenAI Impact on Developer Velocity',
    text: 'Design an empirical academic research study investigating LLM code generation impact on developer productivity with hypotheses, ANOVA tests, and APA 7th citations.',
  },
  {
    label: 'Video: Runway Gen-3 Drone Flythrough',
    text: 'Cinematic FPV drone shot flying through a futuristic cybernetic botanical garden at dusk, volumetric god rays, anamorphic lens flare, 24fps.',
  },
  {
    label: 'Image: Midjourney 85mm Studio Portrait',
    text: 'Cinematic 85mm studio portrait of an aerospace engineer, subtle chiaroscuro rim lighting, Kodak Portra 400 color grade, 8k resolution --ar 16:9.',
  },
  {
    label: 'Frontend: HTML5 Responsive Dashboard UI',
    text: 'Complete semantic HTML5 index.html file with responsive Tailwind CSS dashboard layout, accessible modals, and dark theme UI.',
  },
  {
    label: 'Backend: FastAPI Microservice with Auth',
    text: 'Build a production FastAPI backend service with PostgreSQL, Redis cache, JWT authentication, and idempotent webhook handlers.',
  },
  {
    label: 'Marketing: High-Converting Ad Hook',
    text: 'Write a high-converting direct response video ad script using a 3-second psychological pattern interrupt and risk-reversal offer.',
  },
];
