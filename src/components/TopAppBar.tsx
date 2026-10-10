import { ActiveTab } from '../types';

interface TopAppBarProps {
  activeTab: ActiveTab;
  isResultView?: boolean;
  onBack?: () => void;
  isBookmarked?: boolean;
  onToggleBookmark?: () => void;
  onShare?: () => void;
  tokensCount?: string;
  languageMode?: string;
  onToggleLanguage?: () => void;
  onCopySuccess?: (msg: string) => void;
}

export function TopAppBar({
  activeTab,
  isResultView,
  onBack,
  isBookmarked,
  onToggleBookmark,
  onShare,
  tokensCount = '4.2k tokens',
  languageMode = 'HI/EN',
  onToggleLanguage,
}: TopAppBarProps) {
  if (isResultView) {
    return (
      <header className="fixed top-0 left-0 right-0 w-full z-50 flex items-center justify-between px-4 h-16 max-w-md mx-auto bg-[#0c0c0e]/85 backdrop-blur-xl border-b border-[#27272a]/30 shadow-sm transition-all duration-150">
        <div className="flex items-center gap-2.5">
          <button
            onClick={onBack}
            aria-label="Go back"
            className="p-1.5 -ml-1.5 rounded-full text-[#fafafa] hover:text-[#c4b5fd] active:scale-95 transition-all flex items-center justify-center hover:bg-[#141416]"
          >
            <span className="material-symbols-outlined text-[22px]">arrow_back</span>
          </button>
          <div className="flex flex-col">
            <span className="text-[17px] font-bold text-[#fafafa] tracking-tight font-headline-sm">Prompt Result</span>
            <span className="text-[10px] font-code-md font-semibold text-[#34d399] flex items-center gap-1 uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3] animate-pulse"></span>
              SYNTHESIS READY
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={onToggleBookmark}
            aria-label="Bookmark"
            className={`w-9 h-9 rounded-full bg-[#141416] hover:bg-[#1a1a1e] active:scale-95 transition-all flex items-center justify-center ${
              isBookmarked ? 'text-[#c4b5fd]' : 'text-[#a1a1aa] hover:text-[#c4b5fd]'
            }`}
          >
            <span
              className="material-symbols-outlined text-[19px]"
              style={{ fontVariationSettings: isBookmarked ? "'FILL' 1" : "'FILL' 0" }}
            >
              bookmark
            </span>
          </button>

          <button
            onClick={onShare}
            aria-label="Share"
            className="w-9 h-9 rounded-full bg-[#141416] hover:bg-[#1a1a1e] text-[#a1a1aa] hover:text-[#c4b5fd] active:scale-95 transition-all flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-[19px]">share</span>
          </button>

          <div className="h-5 w-px bg-[#464554]/40 mx-0.5"></div>

          <div className="text-[12px] font-code-md text-[#c4b5fd] bg-[#8b5cf6]/20 px-2.5 py-1 rounded-full border border-[#8b5cf6]/25 flex items-center gap-1 font-medium">
            <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
            {tokensCount}
          </div>
        </div>
      </header>
    );
  }

  if (activeTab === 'improve') {
    return (
      <header className="fixed top-0 left-0 right-0 w-full z-50 bg-[#0c0c0e]/85 backdrop-blur-xl border-b border-[#27272a]/30 shadow-sm">
        <div className="max-w-md mx-auto h-16 flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#7c3aed]/35 flex items-center justify-center text-[#c4b5fd] border border-[#8b5cf6]/20">
              <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                auto_fix_high
              </span>
            </div>
            <div className="flex flex-col">
              <h1 className="text-[17px] font-bold text-[#fafafa] tracking-tight font-headline-sm">Prompt Diagnostic Lab</h1>
              <span className="text-[10px] font-code-md text-[#34d399] flex items-center gap-1 font-medium tracking-wider uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3] animate-pulse"></span>
                DIAGNOSTIC ENGINE v4.2
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={onToggleLanguage}
              className="px-2.5 py-1 rounded-lg bg-[#141416] hover:bg-[#1a1a1e] text-[#c4b5fd] font-code-md text-[11px] font-medium border border-[#27272a]/30 active:scale-95 transition-transform"
            >
              {languageMode}
            </button>
            <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-[#141416] border border-[#27272a]/40">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3] animate-pulse"></span>
              <span className="text-[11px] font-code-md text-[#c4b5fd] font-medium">{tokensCount}</span>
            </div>
          </div>
        </div>
      </header>
    );
  }

  // Default Studio & Library & History
  return (
    <header className="fixed top-0 left-0 right-0 w-full z-50 flex items-center justify-between px-4 h-16 max-w-md mx-auto bg-[#0c0c0e]/85 backdrop-blur-xl shadow-sm border-b border-[#27272a]/30">
      <div className="flex items-center space-x-2.5">
        <div className="w-8 h-8 rounded-lg bg-[#7c3aed]/40 flex items-center justify-center border border-[#8b5cf6]/20 text-[#c4b5fd]">
          <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            auto_awesome
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-[18px] font-bold text-[#fafafa] tracking-tight font-headline-sm">
            {activeTab === 'library' ? 'Prompt Hub' : activeTab === 'history' ? 'Session History' : 'OmniPrompt AI'}
          </span>
          {activeTab === 'studio' && (
            <span className="text-[10px] font-code-md text-[#a1a1aa] tracking-wider uppercase flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3]"></span>
              MULTI-AGENT SYNTHESIZER
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={onToggleLanguage}
          className="px-2 py-1 rounded-md bg-[#141416] hover:bg-[#1a1a1e] text-[#c4b5fd] font-code-md text-[11px] font-semibold border border-[#27272a]/30 active:scale-95 transition-all"
        >
          {languageMode}
        </button>
        <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-[#141416] border border-[#27272a]/40">
          <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3] animate-pulse"></span>
          <span className="text-[11px] font-code-md text-[#c4b5fd] font-medium">{tokensCount}</span>
        </div>
      </div>
    </header>
  );
}
