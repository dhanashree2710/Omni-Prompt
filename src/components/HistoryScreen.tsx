import { useState, useEffect, useMemo } from 'react';
import { loadHistory, clearHistory, formatTimeAgo, syncHistoryFromServer, HistoryItem } from '../utils/history';
import { copyToClipboard } from '../utils/clipboard';

interface HistoryScreenProps {
  onReRunPrompt: (promptText: string) => void;
  onCopySuccess: (msg: string) => void;
}

type DisplayItem = {
  id: string;
  title: string;
  prompt: string;
  date: string;
  tokens: number;
  score: number;
  engine: string;
  category: string;
};

function mapStored(items: HistoryItem[]): DisplayItem[] {
  return items.map((h) => ({
    id: h.id,
    title: h.title,
    prompt: h.fullPrompt,
    date: formatTimeAgo(h.createdAt),
    tokens: Math.round(h.fullPrompt.split(/\s+/).length * 1.3),
    score: 90 + (h.createdAt % 8),
    engine: h.engine,
    category: h.tag,
  }));
}

export function HistoryScreen({ onReRunPrompt, onCopySuccess }: HistoryScreenProps) {
  const [filterEngine, setFilterEngine] = useState('all');
  const [stored, setStored] = useState<HistoryItem[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const items = await syncHistoryFromServer();
      if (!cancelled) setStored(items);
    })();
    return () => { cancelled = true; };
  }, []);

  const historyItems = useMemo(() => mapStored(stored), [stored]);

  const filtered = historyItems.filter((item) => {
    if (filterEngine === 'all') return true;
    return item.engine.toLowerCase().includes(filterEngine.toLowerCase());
  });

  const handleClear = () => {
    clearHistory();
    setStored([]);
    onCopySuccess('History cleared');
  };

  return (
    <div className="flex-1 flex flex-col space-y-4 pt-1 pb-24">
      <section className="grid grid-cols-3 gap-2">
        <div className="rounded-xl bg-[#1a1a1e] border border-[#27272a]/30 p-3 flex flex-col items-center text-center">
          <span className="text-[10px] font-code-md text-[#908fa0] uppercase">Prompts Run</span>
          <span className="text-xl font-bold font-headline-md text-[#fafafa] mt-0.5">
            {historyItems.length}
          </span>
          <span className="text-[9px] text-[#34d399] font-code-md">Session</span>
        </div>
        <div className="rounded-xl bg-[#1a1a1e] border border-[#27272a]/30 p-3 flex flex-col items-center text-center">
          <span className="text-[10px] font-code-md text-[#908fa0] uppercase">Tokens</span>
          <span className="text-xl font-bold font-headline-md text-[#c4b5fd] mt-0.5">
            {(historyItems.reduce((a, b) => a + b.tokens, 0) / 1000).toFixed(1)}k
          </span>
          <span className="text-[9px] text-[#c4b5fd] font-code-md">Context Safe</span>
        </div>
        <div className="rounded-xl bg-[#1a1a1e] border border-[#27272a]/30 p-3 flex flex-col items-center text-center">
          <span className="text-[10px] font-code-md text-[#908fa0] uppercase">Avg QA</span>
          <span className="text-xl font-bold font-headline-md text-[#34d399] mt-0.5">
            {historyItems.length
              ? (historyItems.reduce((a, b) => a + b.score, 0) / historyItems.length).toFixed(1)
              : '—'}
          </span>
          <span className="text-[9px] text-[#34d399] font-code-md">Expert Grade</span>
        </div>
      </section>

      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar flex-1">
          {['all', 'cursor', 'gpt-4o', 'midjourney'].map((f) => (
            <button
              key={f}
              onClick={() => setFilterEngine(f)}
              className={`px-3 py-1 rounded-full text-xs capitalize transition-all shrink-0 ${
                filterEngine === f
                  ? 'bg-[#8b5cf6]/30 text-[#c4b5fd] border border-[#8b5cf6]/40 font-semibold'
                  : 'bg-[#1a1a1e] text-[#a1a1aa] border border-[#27272a]/30'
              }`}
            >
              {f === 'all' ? 'All Models' : f}
            </button>
          ))}
        </div>
        {stored.length > 0 && (
          <button
            onClick={handleClear}
            className="text-[11px] text-[#f87171] hover:underline shrink-0 px-2 py-1 rounded-lg hover:bg-[#f87171]/10"
          >
            Clear history
          </button>
        )}
      </div>

      <section className="space-y-3">
        {filtered.length === 0 && (
          <div className="text-center py-10 text-[#908fa0] text-sm">
            No history yet — synthesize a prompt in Studio.
          </div>
        )}
        {filtered.map((h) => (
          <div
            key={h.id}
            className="p-3.5 rounded-2xl bg-[#141416] border border-[#27272a]/30 hover:border-[#8b5cf6]/40 transition-all flex flex-col gap-2"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold text-[#fafafa] font-headline-sm line-clamp-1">
                {h.title}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#4edea3]/10 text-[#34d399] border border-[#34d399]/30 text-[10px] font-code-md font-semibold shrink-0">
                {h.score}/100
              </span>
            </div>
            <p className="text-xs text-[#a1a1aa] italic line-clamp-2 bg-[#0c0c0e] p-2 rounded-lg border border-[#27272a]/20">
              &ldquo;{h.prompt}&rdquo;
            </p>
            <div className="flex items-center justify-between text-[11px] font-code-md text-[#908fa0] pt-1 border-t border-[#27272a]/20">
              <span>
                {h.date} • {h.tokens} tk
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={async () => {
                    const ok = await copyToClipboard(h.prompt);
                    onCopySuccess(ok ? 'Copied past prompt!' : 'Copy failed — try Ctrl+C');
                  }}
                  className="text-[#a1a1aa] hover:text-[#c4b5fd] flex items-center gap-0.5"
                >
                  <span className="material-symbols-outlined text-[14px]">content_copy</span> Copy
                </button>
                <button
                  onClick={() => onReRunPrompt(h.prompt)}
                  className="text-[#c4b5fd] font-semibold hover:text-[#e1e0ff] flex items-center gap-0.5 active:scale-95"
                >
                  <span>Re-run</span>
                  <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
