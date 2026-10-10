import { useState, type MouseEvent } from 'react';
import { PromptTemplate } from '../types';
import { CURATED_TEMPLATES } from '../data/templates';

interface LibraryScreenProps {
  onSelectTemplate: (template: PromptTemplate) => void;
  onCopySuccess: (msg: string) => void;
}

export function LibraryScreen({ onSelectTemplate, onCopySuccess }: LibraryScreenProps) {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'curated' | 'saved'>('curated');
  const [templates, setTemplates] = useState<PromptTemplate[]>(CURATED_TEMPLATES);

  const categories = [
    { id: 'all', label: 'All Materials' },
    { id: 'code', label: 'Web & Full-Stack' },
    { id: 'frontend', label: 'Frontend (HTML5)' },
    { id: 'backend', label: 'Backend & APIs' },
    { id: 'mobile_app', label: 'Mobile Apps' },
    { id: 'ppt', label: 'PPT & Decks' },
    { id: 'pdf', label: 'PDF & Reports' },
    { id: 'research', label: 'Research Studies' },
    { id: 'video', label: 'Video AI' },
    { id: 'image', label: 'Image & Midjourney' },
    { id: 'marketing', label: 'Marketing & Ads' },
    { id: 'text', label: 'Text & Essays' },
  ];

  const filteredTemplates = templates.filter((t) => {
    const matchesCategory = activeCategory === 'all' || t.category === activeCategory;
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesSaved = viewMode === 'curated' ? true : t.isBookmarked;
    return matchesCategory && matchesSearch && matchesSaved;
  });

  const toggleBookmark = (id: string, e: MouseEvent) => {
    e.stopPropagation();
    setTemplates((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isBookmarked: !t.isBookmarked } : t))
    );
    onCopySuccess('Bookmark status updated!');
  };

  return (
    <div className="flex-1 flex flex-col space-y-4 pt-1 pb-24">
      {/* SEARCH & FILTER ROW */}
      <section className="flex items-center gap-2.5">
        <div className="relative flex-1 group">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-[#a1a1aa] group-focus-within:text-[#c4b5fd] transition-colors">
            <span className="material-symbols-outlined text-[20px]">search</span>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#0c0c0e] border border-[#27272a]/40 rounded-xl text-xs sm:text-sm font-body-md text-[#fafafa] placeholder:text-[#a1a1aa]/60 focus:outline-none focus:border-[#8083ff] focus:ring-1 focus:ring-[#8083ff]/30 transition-all"
            placeholder="Search 250+ curated templates & history..."
          />
        </div>
        <button
          onClick={() => {
            setActiveCategory('all');
            setSearchQuery('');
          }}
          aria-label="Filter templates"
          className="flex items-center justify-center h-11 w-11 rounded-xl bg-[#1a1a1e] border border-[#27272a]/40 hover:border-[#8b5cf6]/50 text-[#a1a1aa] hover:text-[#c4b5fd] active:scale-95 transition-all card-sheen"
          title="Reset Filters"
        >
          <span className="material-symbols-outlined text-[20px]">tune</span>
        </button>
      </section>

      {/* SEGMENTED FILTER CONTROL */}
      <section>
        <div className="p-1 bg-[#0c0c0e] rounded-xl border border-[#27272a]/25 flex gap-1 items-center">
          <button
            onClick={() => setViewMode('curated')}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold text-center transition-all flex items-center justify-center gap-1.5 active:scale-95 ${
              viewMode === 'curated'
                ? 'bg-[#1a1a1e] text-[#fafafa] shadow-sm'
                : 'text-[#a1a1aa] hover:text-[#fafafa]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px] text-[#c4b5fd]">auto_stories</span>
            <span>Curated Templates (250+)</span>
          </button>
          <button
            onClick={() => setViewMode('saved')}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold text-center transition-all flex items-center justify-center gap-1.5 active:scale-95 ${
              viewMode === 'saved'
                ? 'bg-[#1a1a1e] text-[#fafafa] shadow-sm'
                : 'text-[#a1a1aa] hover:text-[#fafafa]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px] text-[#d0bcff]">bookmark</span>
            <span>My Saved Prompts ({templates.filter((t) => t.isBookmarked).length})</span>
          </button>
        </div>
      </section>

      {/* CATEGORY CAROUSEL */}
      <section className="relative -mx-4 px-4 overflow-hidden">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {categories.map((cat) => {
            const active = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap active:scale-95 transition-all ${
                  active
                    ? 'bg-[#c0c1ff] text-[#1000a9] shadow-sm shadow-[#c0c1ff]/20'
                    : 'bg-[#1a1a1e] border border-[#27272a]/30 text-[#a1a1aa] hover:text-[#c4b5fd] hover:border-[#8b5cf6]/40'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </section>

      {/* SECTION TITLE & STATS */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <h2 className="text-base sm:text-lg font-bold font-headline-md text-[#fafafa] tracking-tight">
            {viewMode === 'curated' ? 'Curated Templates' : 'Saved Templates'}
          </h2>
          <p className="text-xs text-[#a1a1aa]">Battle-tested orchestration prompt matrices</p>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#4edea3]/10 border border-[#34d399]/30">
          <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3]"></span>
          <span className="text-[10px] font-code-md text-[#34d399] uppercase font-bold">READY TO FORK</span>
        </div>
      </div>

      {/* FEATURED PROMPT CARDS */}
      <div className="flex flex-col gap-4">
        {filteredTemplates.map((item) => (
          <article
            key={item.id}
            onClick={() => onSelectTemplate(item)}
            className="p-4 rounded-2xl bg-[#141416] border border-[#27272a]/30 card-sheen relative overflow-hidden group hover:border-[#8b5cf6]/40 transition-colors cursor-pointer"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#8b5cf6]/10 rounded-full blur-2xl pointer-events-none"></div>

            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#222226] text-[#c4b5fd] border border-[#27272a]/40">
                  <span className="material-symbols-outlined text-[18px]">
                    {item.category === 'code'
                      ? 'terminal'
                      : item.category === 'image'
                      ? 'palette'
                      : item.category === 'marketing'
                      ? 'campaign'
                      : 'credit_card'}
                  </span>
                </span>
                <div>
                  <span className="text-[10px] font-code-md text-[#c4b5fd] uppercase">{item.platform}</span>
                  <h3 className="text-sm sm:text-base font-bold font-headline-sm text-[#fafafa] group-hover:text-[#c4b5fd] transition-colors leading-tight">
                    {item.title}
                  </h3>
                </div>
              </div>

              <button
                onClick={(e) => toggleBookmark(item.id, e)}
                aria-label="Bookmark template"
                className="text-[#a1a1aa] hover:text-[#c4b5fd] p-1 active:scale-90 transition-transform"
              >
                <span
                  className="material-symbols-outlined text-[20px]"
                  style={{ fontVariationSettings: item.isBookmarked ? "'FILL' 1" : "'FILL' 0" }}
                >
                  {item.isBookmarked ? 'bookmark' : 'bookmark_border'}
                </span>
              </button>
            </div>

            {/* If template has image preview */}
            {item.imageUrl ? (
              <div className="grid grid-cols-3 gap-3 my-2.5">
                <div className="col-span-1 rounded-xl overflow-hidden border border-[#27272a]/40 h-24 relative group-hover:border-[#8b5cf6]/50 transition-colors">
                  <img
                    src={item.imageUrl}
                    alt={item.imageAlt || item.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  {item.imageSpecs && (
                    <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-[#0c0c0e]/80 text-[9px] font-code-md text-[#fafafa] backdrop-blur-sm">
                      v6.1
                    </div>
                  )}
                </div>
                <div className="col-span-2 flex flex-col justify-between py-0.5">
                  <p className="text-xs text-[#a1a1aa] line-clamp-2 leading-relaxed">{item.description}</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {item.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-1.5 py-0.5 rounded bg-[#222226] text-[#c4b5fd] font-code-md text-[10px] border border-[#27272a]/20"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <>
                <p className="text-xs text-[#a1a1aa] mb-2.5 line-clamp-2 leading-relaxed">{item.description}</p>

                {item.hookFormula && (
                  <div className="p-2.5 rounded-xl bg-[#0c0c0e] border border-[#27272a]/30 mb-2.5 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#c4b5fd] text-[18px]">psychology_alt</span>
                    <div className="flex-1 overflow-hidden">
                      <div className="text-[10px] font-code-md text-[#c4b5fd] font-semibold">HOOK FORMULA:</div>
                      <div className="text-xs text-[#a1a1aa] truncate">{item.hookFormula}</div>
                    </div>
                  </div>
                )}

                {/* Prompt Tags */}
                <div className="flex flex-wrap items-center gap-1.5 mb-3">
                  {item.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md bg-[#222226]/80 text-[#fafafa] border border-[#27272a]/30 text-[10px] font-code-md"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </>
            )}

            {/* Metric Footer & Action */}
            <div className="flex items-center justify-between pt-2.5 border-t border-[#27272a]/20">
              <div className="flex items-center gap-3 text-xs text-[#a1a1aa]">
                <div className="flex items-center gap-1 text-[#34d399]">
                  <span
                    className="material-symbols-outlined text-[15px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    star
                  </span>
                  <span className="font-code-md font-semibold text-[#fafafa]">{item.rating}</span>
                </div>
                <span className="text-[#464554]">•</span>
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">play_arrow</span>
                  <span className="font-code-md">{item.usesCount} uses</span>
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectTemplate(item);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#222226] hover:bg-[#8b5cf6] text-[#fafafa] hover:text-[#0d0096] text-xs font-medium transition-all active:scale-95 border border-[#27272a]/30"
              >
                <span>Use Prompt</span>
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </button>
            </div>
          </article>
        ))}
      </div>

      {/* AUTONOMOUS MULTI-AGENT MESH PREVIEW CARD */}
      <section className="p-4 rounded-2xl bg-[#1a1a1e] border border-[#27272a]/40 agent-pipeline-glow relative mb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#c0c1ff] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#c0c1ff]"></span>
            </span>
            <h3 className="text-sm font-bold font-headline-sm text-[#fafafa]">Autonomous Multi-Agent Mesh</h3>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-[#4edea3]/15 text-[#34d399] border border-[#34d399]/30 text-[10px] font-code-md font-semibold">
            LIVE ENGINE
          </span>
        </div>

        <p className="text-xs text-[#a1a1aa] mb-3 leading-relaxed">
          Prompts submitted to execution undergo sequential multi-model refinement across specialized agent nodes:
        </p>

        {/* Pipeline Visualizer Nodes Grid */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          {/* Agent 1 */}
          <div className="p-2.5 rounded-xl bg-[#0c0c0e] border border-[#27272a]/30 flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-[#8b5cf6]/20 text-[#c4b5fd] flex items-center justify-center text-xs font-code-md font-bold">
              1
            </span>
            <div className="overflow-hidden">
              <div className="text-[9px] font-code-md text-[#a1a1aa] truncate">Agent 1</div>
              <div className="text-xs font-medium text-[#fafafa] truncate">Intent Detector</div>
            </div>
          </div>

          {/* Agent 2 */}
          <div className="p-2.5 rounded-xl bg-[#0c0c0e] border border-[#27272a]/30 flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-[#d0bcff]/20 text-[#d0bcff] flex items-center justify-center text-xs font-code-md font-bold">
              2
            </span>
            <div className="overflow-hidden">
              <div className="text-[9px] font-code-md text-[#a1a1aa] truncate">Agent 2</div>
              <div className="text-xs font-medium text-[#fafafa] truncate">Missing Specs</div>
            </div>
          </div>

          {/* Agent 3 */}
          <div className="p-2.5 rounded-xl bg-[#0c0c0e] border border-[#27272a]/30 flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-[#4edea3]/20 text-[#34d399] flex items-center justify-center text-xs font-code-md font-bold">
              3
            </span>
            <div className="overflow-hidden">
              <div className="text-[9px] font-code-md text-[#a1a1aa] truncate">Agent 3</div>
              <div className="text-xs font-medium text-[#fafafa] truncate">Platform Synthesizer</div>
            </div>
          </div>

          {/* Agent 4 */}
          <div className="p-2.5 rounded-xl bg-[#0c0c0e] border border-[#27272a]/30 flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-[#8b5cf6]/30 text-[#e1e0ff] flex items-center justify-center text-xs font-code-md font-bold">
              4
            </span>
            <div className="overflow-hidden">
              <div className="text-[9px] font-code-md text-[#a1a1aa] truncate">Agent 4</div>
              <div className="text-xs font-medium text-[#fafafa] truncate">QA Rater</div>
            </div>
          </div>
        </div>

        {/* Active AI Provider Status Indicator */}
        <div className="p-2.5 rounded-xl bg-[#141416] border border-[#27272a]/30 flex items-center gap-2.5">
          <span className="material-symbols-outlined text-[#34d399] text-[18px]">hub</span>
          <div className="flex-1 text-[11px] font-code-md text-[#a1a1aa]">
            <span className="text-[#fafafa] font-semibold">Active Mesh:</span> OpenAI GPT-4o & Anthropic Claude 3.5
            Sonnet with Gemini Fallback
          </div>
        </div>
      </section>
    </div>
  );
}
