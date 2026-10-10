import { useState, useCallback, useEffect } from 'react';
import {
  ActiveTab,
  PromptSynthesis,
  TargetPlatform,
  OutputType,
  PromptDepth,
  PromptTemplate,
} from './types';
import { StudioScreen } from './components/StudioScreen';
import { ResultScreen } from './components/ResultScreen';
import { ImproveScreen } from './components/ImproveScreen';
import { LibraryScreen } from './components/LibraryScreen';
import { HistoryScreen } from './components/HistoryScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { WizardModal } from './components/WizardModal';
import { AssumptionsModal } from './components/AssumptionsModal';
import { PlaygroundModal } from './components/PlaygroundModal';
import { AuthModal } from './components/AuthModal';
import { Toast } from './components/Toast';
import { synthesizePrompt, autoDetectOutputType } from './utils/synthesizer';
import { synthesizePromptRemote } from './utils/api';
import { saveHistoryItem } from './utils/history';
import { AuthUser, fetchMe, getStoredUser, logout as authLogout } from './utils/auth';
import logoUrl from './assets/logo.jpeg';

const NAV_ITEMS: { id: ActiveTab; label: string; icon: string }[] = [
  { id: 'studio', label: 'Studio', icon: 'edit_square' },
  { id: 'improve', label: 'Improve', icon: 'auto_fix_high' },
  { id: 'library', label: 'Library', icon: 'menu_book' },
  { id: 'history', label: 'History', icon: 'history' },
  { id: 'settings', label: 'Settings', icon: 'settings' },
];

export function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('studio');
  const [isResultView, setIsResultView] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [isAssumptionsOpen, setIsAssumptionsOpen] = useState(false);
  const [isPlaygroundOpen, setIsPlaygroundOpen] = useState(false);

  const [user, setUser] = useState<AuthUser | null>(() => getStoredUser());
  const [authChecked, setAuthChecked] = useState(false);
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const me = await fetchMe();
      if (!cancelled) {
        setUser(me);
        setAuthChecked(true);
        // Dashboard opens first — login only when user tries to operate
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const requireAuth = useCallback(() => {
    if (!user) {
      setShowAuth(true);
      return false;
    }
    return true;
  }, [user]);

  const handleAuthSuccess = (u: AuthUser) => {
    setUser(u);
    setShowAuth(false);
    setToastMessage(`Welcome, ${u.username}!`);
  };

  const handleLogout = async () => {
    try {
      await authLogout();
    } catch {
      /* ignore */
    }
    setUser(null);
    setShowAuth(true);
    setActiveTab('studio');
    setIsResultView(false);
    setToastMessage('Signed out');
  };

  const [studioPrompt, setStudioPrompt] = useState('');

  const [synthesis, setSynthesis] = useState<PromptSynthesis>(() =>
    synthesizePrompt('', 'cursor', 'web_app', 'dev')
  );

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
  }, []);

  const handleGenerate = async (
    prompt: string,
    platform: TargetPlatform,
    outputType: OutputType,
    depth: PromptDepth
  ) => {
    if (!requireAuth()) return;
    setStudioPrompt(prompt);
    setIsGenerating(true);
    try {
      const result = await synthesizePromptRemote(prompt, platform, outputType, depth);
      setSynthesis(result);
      setIsResultView(true);
      try {
        saveHistoryItem(result, platform === 'auto' ? 'Cursor' : platform);
      } catch {
        /* ignore */
      }
      showToast('Synthesized into production multi-agent prompt!');
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Synthesis failed';
      showToast(msg);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleBackToStudio = () => setIsResultView(false);

  const handleTabChange = (tab: ActiveTab) => {
    if (!requireAuth()) return;
    setActiveTab(tab);
    if (tab !== 'studio') setIsResultView(false);
    setSidebarOpen(false);
  };

  const handleRefine = () => {
    setActiveTab('improve');
    setIsResultView(false);
    showToast('Loaded into Diagnostic Lab for deep refinement');
  };

  const handleSelectTemplate = async (template: PromptTemplate) => {
    const promptText = template.fullPrompt || template.codeSnippet;
    setStudioPrompt(promptText);
    setIsGenerating(true);
    try {
      const result = await synthesizePromptRemote(promptText, 'cursor', autoDetectOutputType(promptText), 'expert');
      result.decodedIntent = template.title;
      setSynthesis(result);
      setActiveTab('studio');
      setIsResultView(true);
      try {
        saveHistoryItem(result, template.platform || 'Cursor');
      } catch {
        /* ignore */
      }
      showToast(`Loaded "${template.title}" template`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApplyWizardPrompt = async (generatedPrompt: string) => {
    setStudioPrompt(generatedPrompt);
    setIsGenerating(true);
    try {
      const result = await synthesizePromptRemote(generatedPrompt, 'cursor', autoDetectOutputType(generatedPrompt), 'expert');
      setSynthesis(result);
      setIsResultView(true);
      try {
        saveHistoryItem(result);
      } catch {
        /* ignore */
      }
      showToast('Wizard prompt compiled & synthesized successfully!');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveAssumptions = (updatedAssumptions: string[]) => {
    setSynthesis((prev) => ({ ...prev, smartAssumptions: updatedAssumptions }));
    showToast('Updated system assumptions & recalculated constraints');
  };

  const handleAcceptImprovedPrompt = (improvedPrompt: string) => {
    setStudioPrompt(improvedPrompt);
    setActiveTab('studio');
    setIsResultView(false);
  };

  const handleReRunFromHistory = async (promptText: string) => {
    setStudioPrompt(promptText);
    setIsGenerating(true);
    try {
      const result = await synthesizePromptRemote(promptText, 'cursor', autoDetectOutputType(promptText), 'expert');
      setSynthesis(result);
      setActiveTab('studio');
      setIsResultView(true);
      try {
        saveHistoryItem(result);
      } catch {
        /* ignore */
      }
      showToast('Past prompt re-synthesized!');
    } finally {
      setIsGenerating(false);
    }
  };

  const pageTitle =
    isResultView
      ? 'Prompt Result'
      : activeTab === 'improve'
        ? 'Diagnostic Lab'
        : activeTab === 'library'
          ? 'Prompt Library'
          : activeTab === 'history'
            ? 'History'
            : activeTab === 'settings'
              ? 'Settings'
              : 'Studio';

  return (
    <div className="h-full flex bg-[#0c0c0e] text-[#fafafa] font-sans overflow-hidden">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:static inset-y-0 left-0 z-50
          w-[240px] flex flex-col
          bg-[#0c0c0e] border-r border-[#1f1f23]
          transition-transform duration-200 ease-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        {/* Brand */}
        <div className="h-14 flex items-center gap-2.5 px-4 border-b border-[#1f1f23]">
          <img src={logoUrl} alt="OmniPrompt" className="w-9 h-9 rounded-lg object-contain bg-white p-0.5 shadow-sm" />
          <div className="min-w-0 flex-1">
            <span className="text-[14px] font-semibold tracking-tight block truncate">OmniPrompt</span>
            <span className="text-[10px] text-[#71717a]">AI Studio</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto custom-scroll">
          <p className="px-3 mb-2 text-[10px] font-medium uppercase tracking-wider text-[#52525b]">
            Workspace
          </p>
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => handleTabChange(item.id)}
              className={`nav-item ${activeTab === item.id && !isResultView ? 'active' : ''}`}
            >
              <span
                className="material-symbols-outlined text-[18px]"
                style={{ fontVariationSettings: activeTab === item.id ? "'FILL' 1" : "'FILL' 0" }}
              >
                {item.icon}
              </span>
              {item.label}
            </button>
          ))}
        </nav>

        {/* Footer user */}
        <div className="px-3 py-3 border-t border-[#1f1f23] space-y-2">
          {user ? (
            <div className="flex items-center gap-2 px-2">
              <div className="w-7 h-7 rounded-full bg-[#8b5cf6]/20 border border-[#8b5cf6]/30 flex items-center justify-center text-[11px] font-semibold text-[#c4b5fd]">
                {user.username.slice(0, 1).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-medium truncate">{user.username}</p>
                <p className="text-[10px] text-[#52525b]">Private session</p>
              </div>
              <button
                onClick={handleLogout}
                title="Sign out"
                className="w-7 h-7 rounded-lg flex items-center justify-center text-[#71717a] hover:text-[#f87171] hover:bg-[#1a1a1e] transition"
              >
                <span className="material-symbols-outlined text-[16px]">logout</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowAuth(true)}
              className="w-full nav-item justify-center text-[#a78bfa]"
            >
              <span className="material-symbols-outlined text-[18px]">login</span>
              Sign in
            </button>
          )}
          <div className="flex items-center gap-2 px-2 text-[11px] text-[#52525b]">
            <span className="dot-online" />
            <span>Engine online</span>
          </div>
        </div>
      </aside>

      {/* Main column */}
      <div className="flex-1 flex flex-col min-w-0 h-full">
        {/* Top bar */}
        <header className="h-14 shrink-0 flex items-center gap-3 px-4 md:px-6 border-b border-[#1f1f23]">
          <button
            className="md:hidden w-8 h-8 rounded-lg flex items-center justify-center text-[#a1a1aa] hover:bg-[#1a1a1e] hover:text-white transition"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="material-symbols-outlined text-[20px]">menu</span>
          </button>
          <img src={logoUrl} alt="OmniPrompt" className="md:hidden w-8 h-8 rounded-lg object-contain bg-white p-0.5" />

          {isResultView && (
            <button
              onClick={handleBackToStudio}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-[#a1a1aa] hover:bg-[#1a1a1e] hover:text-white transition"
            >
              <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            </button>
          )}

          <div className="flex-1 min-w-0">
            <h1 className="text-[14px] font-medium truncate">{pageTitle}</h1>
            {activeTab === 'studio' && !isResultView && (
              <p className="text-[11px] text-[#71717a] truncate">Multi-agent prompt synthesizer</p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] text-[#a1a1aa] bg-[#1a1a1e] border border-[#27272a] px-2.5 py-1 rounded-full">
              <span className="dot-online" />
              Online
            </span>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto custom-scroll">
          <div className="max-w-3xl mx-auto px-4 md:px-6 py-6 animate-fade-in" key={`${activeTab}-${isResultView}`}>
            {activeTab === 'studio' && !isResultView && (
              <StudioScreen
                initialPrompt={studioPrompt}
                onGenerate={handleGenerate}
                onOpenWizard={() => { if (requireAuth()) setIsWizardOpen(true); }}
                isGenerating={isGenerating}
              />
            )}

            {activeTab === 'studio' && isResultView && (
              <ResultScreen
                synthesis={synthesis}
                onRefine={handleRefine}
                onOpenPlayground={() => setIsPlaygroundOpen(true)}
                onOpenAssumptions={() => setIsAssumptionsOpen(true)}
                onCopySuccess={showToast}
              />
            )}

            {activeTab === 'improve' && (
              <ImproveScreen
                onAcceptPrompt={handleAcceptImprovedPrompt}
                onCopySuccess={showToast}
              />
            )}

            {activeTab === 'library' && (
              <LibraryScreen
                onSelectTemplate={handleSelectTemplate}
                onCopySuccess={showToast}
              />
            )}

            {activeTab === 'history' && (
              <HistoryScreen
                onReRunPrompt={handleReRunFromHistory}
                onCopySuccess={showToast}
              />
            )}

            {activeTab === 'settings' && (
              <SettingsScreen onCopySuccess={showToast} />
            )}
          </div>
        </main>
      </div>

      {/* Modals */}
      <WizardModal
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        onApplyPrompt={handleApplyWizardPrompt}
      />
      <AssumptionsModal
        isOpen={isAssumptionsOpen}
        onClose={() => setIsAssumptionsOpen(false)}
        assumptions={synthesis.smartAssumptions}
        onSave={handleSaveAssumptions}
      />
      <PlaygroundModal
        isOpen={isPlaygroundOpen}
        onClose={() => setIsPlaygroundOpen(false)}
        promptText={synthesis.versions[synthesis.activeVersion || 'expert']}
      />

      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      )}

      {/* Login only when user tries to operate (not on first open) */}
      {showAuth && (
        <AuthModal
          onSuccess={handleAuthSuccess}
          onClose={() => setShowAuth(false)}
        />
      )}

      {/* Generating overlay */}
      {isGenerating && (
        <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-[#1a1a1e] border border-[#2e2e33] rounded-2xl px-6 py-5 flex items-center gap-4 shadow-2xl">
            <div className="w-10 h-10 rounded-xl bg-[#8b5cf6]/15 flex items-center justify-center">
              <span className="material-symbols-outlined text-[#a78bfa] animate-spin text-[22px]">
                progress_activity
              </span>
            </div>
            <div>
              <p className="text-sm font-medium">Synthesizing…</p>
              <p className="text-[11px] text-[#71717a] mt-0.5">Multi-agent mesh compiling your prompt</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
