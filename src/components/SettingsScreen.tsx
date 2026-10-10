import { useState } from 'react';

interface SettingsScreenProps {
  onCopySuccess: (msg: string) => void;
}

export function SettingsScreen({ onCopySuccess }: SettingsScreenProps) {
  const [defaultModel, setDefaultModel] = useState<string>('Claude 3.5 Sonnet / Cursor');
  const [autoDetectHinglish, setAutoDetectHinglish] = useState<boolean>(true);
  const [soundEffects, setSoundEffects] = useState<boolean>(true);
  const [cachePrompts, setCachePrompts] = useState<boolean>(true);

  const handleSave = () => {
    onCopySuccess('Configuration preferences saved!');
  };

  return (
    <div className="flex-1 flex flex-col space-y-4 pt-1 pb-24">
      {/* Header Profile / Engine Info */}
      <section className="p-4 rounded-2xl bg-[#1a1a1e] border border-[#27272a]/30 relative overflow-hidden">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#8b5cf6] to-[#571bc1] flex items-center justify-center text-white shadow-lg">
            <span className="material-symbols-outlined text-[24px]">psychology</span>
          </div>
          <div>
            <h2 className="text-base font-bold text-[#fafafa] font-headline-sm">OmniPrompt Engine</h2>
            <div className="flex items-center gap-1.5 text-xs text-[#34d399]">
              <span className="w-2 h-2 rounded-full bg-[#4edea3] animate-pulse"></span>
              <span className="font-code-md">v4.2.0 Synthetix Mesh Active</span>
            </div>
          </div>
        </div>
      </section>

      {/* Preferences Settings List */}
      <section className="space-y-3">
        <div className="p-4 rounded-2xl bg-[#141416] border border-[#27272a]/30 space-y-3">
          <h3 className="text-xs font-bold font-headline-sm text-[#c4b5fd] uppercase tracking-wider">
            Model & Prompt Execution
          </h3>

          <div className="flex items-center justify-between py-1">
            <div>
              <p className="text-xs font-semibold text-[#fafafa]">Default AI Platform</p>
              <p className="text-[10px] text-[#a1a1aa]">Primary compiler target for output syntax</p>
            </div>
            <select
              value={defaultModel}
              onChange={(e) => setDefaultModel(e.target.value)}
              className="bg-[#0c0c0e] border border-[#27272a]/40 text-xs rounded-lg px-2.5 py-1.5 text-[#fafafa] focus:outline-none"
            >
              <option>Cursor AI (Claude 3.5)</option>
              <option>ChatGPT (GPT-4o)</option>
              <option>Claude 3.7 Sonnet</option>
              <option>Midjourney v6.1</option>
              <option>Lovable / v0</option>
            </select>
          </div>

          <div className="flex items-center justify-between py-1 border-t border-[#27272a]/20">
            <div>
              <p className="text-xs font-semibold text-[#fafafa]">Auto-Detect Hinglish / Regional Indian Dialects</p>
              <p className="text-[10px] text-[#a1a1aa]">Synthesizes mixed colloquial phrasing into structured specs</p>
            </div>
            <input
              type="checkbox"
              checked={autoDetectHinglish}
              onChange={(e) => setAutoDetectHinglish(e.target.checked)}
              className="w-4 h-4 rounded text-[#a78bfa] focus:ring-0 bg-[#0c0c0e] border-[#27272a]"
            />
          </div>

          <div className="flex items-center justify-between py-1 border-t border-[#27272a]/20">
            <div>
              <p className="text-xs font-semibold text-[#fafafa]">Multi-Agent Quality Inspector</p>
              <p className="text-[10px] text-[#a1a1aa]">Calculate 5-metric benchmark breakdown automatically</p>
            </div>
            <input
              type="checkbox"
              checked={cachePrompts}
              onChange={(e) => setCachePrompts(e.target.checked)}
              className="w-4 h-4 rounded text-[#a78bfa] focus:ring-0 bg-[#0c0c0e] border-[#27272a]"
            />
          </div>

          <div className="flex items-center justify-between py-1 border-t border-[#27272a]/20">
            <div>
              <p className="text-xs font-semibold text-[#fafafa]">Haptic & Audio Feedback</p>
              <p className="text-[10px] text-[#a1a1aa]">Subtle interaction sounds during synthesis</p>
            </div>
            <input
              type="checkbox"
              checked={soundEffects}
              onChange={(e) => setSoundEffects(e.target.checked)}
              className="w-4 h-4 rounded text-[#a78bfa] focus:ring-0 bg-[#0c0c0e] border-[#27272a]"
            />
          </div>
        </div>

        {/* Engine Network Health */}
        <div className="p-4 rounded-2xl bg-[#141416] border border-[#27272a]/30 space-y-2">
          <h3 className="text-xs font-bold font-headline-sm text-[#34d399] uppercase tracking-wider">
            Network & Latency Telemetry
          </h3>

          <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
            <div className="p-2.5 rounded-xl bg-[#0c0c0e] border border-[#27272a]/30">
              <span className="text-[10px] text-[#908fa0] block">Average Latency</span>
              <span className="font-code-md text-[#34d399] font-bold">142 ms</span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#0c0c0e] border border-[#27272a]/30">
              <span className="text-[10px] text-[#908fa0] block">Context Window</span>
              <span className="font-code-md text-[#c4b5fd] font-bold">200k Tokens</span>
            </div>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-[#8b5cf6] to-[#571bc1] text-white font-headline-sm font-bold text-xs shadow-md active:scale-95"
        >
          Save Configuration
        </button>
      </section>
    </div>
  );
}
