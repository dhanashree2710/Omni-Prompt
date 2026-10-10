import { useState } from 'react';

interface PlaygroundModalProps {
  isOpen: boolean;
  onClose: () => void;
  promptText: string;
}

export function PlaygroundModal({ isOpen, onClose, promptText }: PlaygroundModalProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [activeFileTab, setActiveFileTab] = useState<'html' | 'backend'>('html');
  const [htmlOutput, setHtmlOutput] = useState<string>('');
  const [backendOutput, setBackendOutput] = useState<string>('');
  const [model, setModel] = useState<string>('Claude 3.5 Sonnet / GPT-4o');

  if (!isOpen) return null;

  const sampleHtmlResponse = `<!-- File: public/index.html (Semantic HTML5 & Client Layout) -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>CourseHub AI — Master Modern Web Engineering</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-[#0c0c0e] text-[#fafafa] font-sans antialiased min-h-screen">
  <!-- Semantic Header with Accessible Nav -->
  <header role="banner" class="border-b border-gray-800 bg-[#0c0c0e]/80 backdrop-blur sticky top-0 z-50">
    <nav aria-label="Main Navigation" class="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
      <a href="/" class="text-lg font-bold text-white tracking-tight flex items-center gap-2">
        <span class="w-3 h-3 rounded-full bg-emerald-400"></span> CourseHub AI
      </a>
      <div class="flex items-center gap-4">
        <a href="#catalog" class="text-xs text-gray-300 hover:text-white">Explore Courses</a>
        <button onclick="document.getElementById('checkout-modal').showModal()" class="px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white shadow transition-all">
          Enroll Now (₹2,999)
        </button>
      </div>
    </nav>
  </header>

  <!-- Primary Landmark: Main Content -->
  <main id="main-content" role="main" class="max-w-6xl mx-auto px-4 py-8 space-y-10">
    <!-- Hero Section -->
    <section aria-labelledby="hero-title" class="text-center space-y-3 py-6">
      <span class="text-[11px] font-mono px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
        Next-Gen E-Learning Platform
      </span>
      <h1 id="hero-title" class="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
        Master Full-Stack Engineering with Real Projects
      </h1>
      <p class="text-gray-400 max-w-xl mx-auto text-xs sm:text-sm">
        Interactive HLS video streaming, automated progress saving, and UPI/Razorpay payment gateway.
      </p>
    </section>

    <!-- Course Catalog Grid -->
    <section id="catalog" aria-labelledby="catalog-heading" class="space-y-4">
      <div class="flex items-center justify-between">
        <h2 id="catalog-heading" class="text-lg font-bold text-white">Course Curriculum</h2>
        <span class="text-xs text-emerald-400 font-mono">5 Core Modules • 48 Lessons</span>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
        <article class="p-5 rounded-2xl bg-[#1a1a1e] border border-gray-800 space-y-3 hover:border-gray-700 transition-all">
          <span class="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Module 01</span>
          <h3 class="text-sm font-semibold text-white">Semantic HTML5 & Modern Layouts</h3>
          <p class="text-xs text-gray-400">Accessible document outlines, ARIA roles, and responsive Tailwind styling.</p>
        </article>
        <article class="p-5 rounded-2xl bg-[#1a1a1e] border border-gray-800 space-y-3 hover:border-gray-700 transition-all">
          <span class="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">Module 02</span>
          <h3 class="text-sm font-semibold text-white">Secure Next.js 14 Server Actions</h3>
          <p class="text-xs text-gray-400">PostgreSQL migrations, Zod schema guards, and protected session state.</p>
        </article>
        <article class="p-5 rounded-2xl bg-[#1a1a1e] border border-gray-800 space-y-3 hover:border-gray-700 transition-all">
          <span class="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">Module 03</span>
          <h3 class="text-sm font-semibold text-white">Payment Gateway & Webhook Security</h3>
          <p class="text-xs text-gray-400">Razorpay / Stripe idempotent listeners with raw body signature verification.</p>
        </article>
      </div>
    </section>

    <!-- Interactive Video Player Container -->
    <section aria-labelledby="player-heading" class="p-6 rounded-2xl bg-[#1a1a1e] border border-gray-800 space-y-3">
      <h2 id="player-heading" class="text-base font-bold text-white">Lesson Player Preview</h2>
      <div class="aspect-video bg-black rounded-xl overflow-hidden relative flex items-center justify-center border border-gray-800 shadow-xl">
        <video id="course-video" class="w-full h-full object-cover" controls>
          <source src="https://cdn.example.com/lessons/intro.mp4" type="video/mp4" />
        </video>
      </div>
    </section>
  </main>

  <!-- Accessible Checkout Modal Dialog -->
  <dialog id="checkout-modal" aria-labelledby="modal-title" class="rounded-2xl bg-[#1a1a1e] text-white border border-gray-700 p-6 backdrop:bg-black/80 max-w-md w-full shadow-2xl">
    <div class="flex justify-between items-center mb-4">
      <h3 id="modal-title" class="text-sm font-bold">Complete Your Enrollment</h3>
      <button onclick="document.getElementById('checkout-modal').close()" class="text-gray-400 hover:text-white text-xs">✕</button>
    </div>
    <form method="dialog" class="space-y-4">
      <div>
        <label for="student-email" class="text-xs text-gray-300 block mb-1">Email Address</label>
        <input id="student-email" type="email" required class="w-full px-3 py-2 text-xs rounded-lg bg-gray-900 border border-gray-700 text-white" placeholder="you@domain.com" />
      </div>
      <button type="button" onclick="alert('Razorpay Checkout Triggered')" class="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 font-bold text-black text-xs transition-all">
        Proceed with Razorpay (UPI / Card)
      </button>
    </form>
  </dialog>
</body>
</html>`;

  const sampleBackendResponse = `// File: src/app/api/checkout/route.ts (Backend & Payment Processing)
import { z } from "zod";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/db";
import Razorpay from "razorpay";

// 1. Strict Schema Validation
export const CourseEnrollmentSchema = z.object({
  courseId: z.string().cuid(),
  paymentId: z.string().min(6),
  currency: z.enum(["INR", "USD"]),
});

export async function POST(req: Request) {
  const session = await getServerSession();
  if (!session?.user?.id) {
    return new Response(JSON.stringify({ error: "UNAUTHORIZED_ACCESS" }), { status: 401 });
  }

  const body = await req.json();
  const parsed = CourseEnrollmentSchema.safeParse(body);
  if (!parsed.success) {
    return new Response(JSON.stringify({ error: "INVALID_INPUT", issues: parsed.error.issues }), { status: 400 });
  }

  // Idempotent enrollment check
  const existing = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId: session.user.id,
        courseId: parsed.data.courseId,
      },
    },
  });

  if (existing) {
    return new Response(JSON.stringify({ status: "ALREADY_ACTIVE", enrollmentId: existing.id }));
  }

  // Activate course enrollment in PostgreSQL
  const enrollment = await prisma.enrollment.create({
    data: {
      userId: session.user.id,
      courseId: parsed.data.courseId,
      status: "ACTIVE",
    },
  });

  return new Response(JSON.stringify({ status: "ENROLLED", enrollmentId: enrollment.id }), { status: 201 });
}`;

  const handleTestRun = () => {
    setIsRunning(true);
    setHtmlOutput('');
    setBackendOutput('');

    let i = 0;
    const timer = setInterval(() => {
      setHtmlOutput(sampleHtmlResponse.slice(0, i + 16));
      setBackendOutput(sampleBackendResponse.slice(0, Math.round((i * sampleBackendResponse.length) / sampleHtmlResponse.length) + 16));
      i += 16;
      if (i >= sampleHtmlResponse.length) {
        clearInterval(timer);
        setIsRunning(false);
      }
    }, 15);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-[#1a1a1e] border border-[#8083ff]/30 w-full max-w-lg rounded-2xl p-5 shadow-2xl relative overflow-hidden flex flex-col max-h-[85vh]">
        <div className="flex items-center justify-between pb-3 border-b border-[#27272a]/30">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#a78bfa] text-[20px]">terminal</span>
            <h3 className="text-sm font-bold text-[#fafafa] font-headline-sm">Prompt Playground Sandbox</h3>
          </div>
          <button onClick={onClose} className="text-[#908fa0] hover:text-white">
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <div className="py-3 flex-1 overflow-y-auto space-y-3 no-scrollbar text-xs">
          <div className="flex items-center justify-between">
            <span className="text-[#c4b5fd] font-code-md text-[11px] uppercase">Active Target Engine:</span>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="bg-[#0c0c0e] border border-[#27272a]/40 rounded-lg text-xs px-2 py-1 text-[#fafafa]"
            >
              <option>Claude 3.5 Sonnet / GPT-4o</option>
              <option>Cursor AI Assistant</option>
              <option>Midjourney v6.1 Bot</option>
            </select>
          </div>

          <div className="p-3 rounded-xl bg-[#0c0c0e] border border-[#27272a]/30 max-h-36 overflow-y-auto font-code-md text-[#a1a1aa] whitespace-pre-wrap leading-relaxed">
            {promptText}
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleTestRun}
              disabled={isRunning}
              className="px-4 py-2 bg-gradient-to-r from-[#8b5cf6] to-[#571bc1] text-white font-bold rounded-xl flex items-center gap-2 shadow-lg active:scale-95 disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[16px]">play_arrow</span>
              {isRunning ? 'Streaming Generation...' : 'Execute Test Run'}
            </button>
          </div>

          {(htmlOutput || backendOutput || isRunning) && (
            <div className="space-y-2 pt-2 animate-in fade-in">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-code-md text-[#34d399] uppercase flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3] animate-pulse"></span>
                  Sandbox Artifact Deliverables:
                </span>
                <div className="flex items-center gap-1 bg-[#0c0c0e] p-0.5 rounded-lg border border-[#27272a]/40">
                  <button
                    onClick={() => setActiveFileTab('html')}
                    className={`px-2 py-0.5 text-[10px] font-code-md rounded-md flex items-center gap-1 transition-all ${
                      activeFileTab === 'html'
                        ? 'bg-[#4edea3]/20 text-[#34d399] font-bold border border-[#34d399]/30'
                        : 'text-[#a1a1aa] hover:text-white'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[12px]">html</span>
                    index.html
                  </button>
                  <button
                    onClick={() => setActiveFileTab('backend')}
                    className={`px-2 py-0.5 text-[10px] font-code-md rounded-md flex items-center gap-1 transition-all ${
                      activeFileTab === 'backend'
                        ? 'bg-[#8b5cf6]/25 text-[#c4b5fd] font-bold border border-[#8083ff]/30'
                        : 'text-[#a1a1aa] hover:text-white'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[12px]">terminal</span>
                    checkout/route.ts
                  </button>
                </div>
              </div>

              <div className="rounded-xl bg-[#0c0c0e] border border-[#27272a]/40 overflow-hidden">
                <div className="flex items-center justify-between px-3 py-1.5 bg-[#1a1a1e] border-b border-[#27272a]/30 text-[10px] font-code-md">
                  <span className="text-[#a1a1aa] flex items-center gap-1">
                    <span className="material-symbols-outlined text-[12px] text-[#34d399]">
                      {activeFileTab === 'html' ? 'description' : 'code'}
                    </span>
                    {activeFileTab === 'html' ? 'public/index.html (Semantic HTML5)' : 'src/app/api/checkout/route.ts (Backend API)'}
                  </span>
                  <span className="text-[#34d399]">
                    {activeFileTab === 'html' ? 'HTML5 / Responsive' : 'Zod / Prisma / NextAuth'}
                  </span>
                </div>
                <pre className="p-3 font-code-md text-[#34d399] text-[11px] overflow-x-auto whitespace-pre-wrap max-h-56 leading-relaxed">
                  {activeFileTab === 'html' ? (htmlOutput || 'Generating HTML structure...') : (backendOutput || 'Generating Backend code...')}
                </pre>
              </div>
            </div>
          )}
        </div>

        <div className="pt-3 border-t border-[#27272a]/30 flex justify-end">
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg bg-[#0c0c0e] text-xs text-[#a1a1aa] hover:text-[#fafafa]"
          >
            Close Sandbox
          </button>
        </div>
      </div>
    </div>
  );
}
