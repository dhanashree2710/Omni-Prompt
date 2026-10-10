import { useEffect } from 'react';

interface ToastProps {
  message: string;
  isVisible?: boolean;
  icon?: string;
  onClose?: () => void;
}

export function Toast({ message, isVisible = true, icon = 'check_circle', onClose }: ToastProps) {
  useEffect(() => {
    if (onClose) {
      const timer = setTimeout(() => onClose(), 2800);
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!isVisible && !message) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[90] pointer-events-none px-4 w-full max-w-sm">
      <div className="bg-[#1a1a1e] border border-[#2e2e33] text-[#fafafa] px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 text-sm pointer-events-auto animate-fade-in">
        <span className="material-symbols-outlined text-[#34d399] text-[18px] shrink-0">{icon}</span>
        <span className="text-[13px] leading-snug">{message}</span>
      </div>
    </div>
  );
}
