import { ActiveTab } from '../types';

interface BottomNavBarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
}

export function BottomNavBar({ activeTab, onTabChange }: BottomNavBarProps) {
  const tabs: { id: ActiveTab; label: string; icon: string }[] = [
    { id: 'studio', label: 'Studio', icon: 'psychology' },
    { id: 'improve', label: 'Improve', icon: 'auto_fix_high' },
    { id: 'library', label: 'Library', icon: 'folder_special' },
    { id: 'history', label: 'History', icon: 'history' },
    { id: 'settings', label: 'Settings', icon: 'settings' },
  ];

  return (
    <nav className="fixed bottom-3 left-4 right-4 rounded-full z-40 flex justify-around items-center px-2 h-16 max-w-md mx-auto bg-[#1a1a1e]/92 backdrop-blur-2xl border border-[#27272a]/30 shadow-2xl shadow-[#8b5cf6]/15">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center justify-center py-1.5 px-3 transition-all duration-150 active:scale-90 rounded-full ${
              isActive
                ? 'text-[#c4b5fd] bg-[#8b5cf6]/25 font-semibold shadow-sm shadow-[#8b5cf6]/20'
                : 'text-[#a1a1aa] hover:text-[#c4b5fd]'
            }`}
          >
            <span
              className="material-symbols-outlined text-[20px]"
              style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
            >
              {tab.icon}
            </span>
            <span className="text-[10px] font-code-md tracking-wider mt-0.5">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
