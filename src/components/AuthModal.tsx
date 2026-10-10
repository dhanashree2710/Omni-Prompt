import { useState, FormEvent } from 'react';
import { login, register, AuthUser, authErrorMessage } from '../utils/auth';

interface AuthModalProps {
  onSuccess: (user: AuthUser) => void;
  onClose?: () => void;
}

export function AuthModal({ onSuccess, onClose }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    const em = email.trim();
    const p = password;
    if (!em.includes('@') || em.length < 5) {
      setError('Enter a valid email address');
      return;
    }
    if (p.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      const data = mode === 'login' ? await login(em, p) : await register(em, p);
      onSuccess(data.user);
    } catch (err: unknown) {
      setError(authErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-[#0c0c0e]/85 backdrop-blur-md">
      <div className="w-full max-w-sm bg-[#141416] border border-[#27272a] rounded-2xl shadow-2xl overflow-hidden animate-fade-in">
        <div className="px-6 pt-6 pb-4 text-center border-b border-[#1f1f23] relative">
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center text-[#71717a] hover:text-white hover:bg-[#1a1a1e] transition"
              aria-label="Close"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          )}
          <div className="w-16 h-16 mx-auto mb-3 rounded-2xl overflow-hidden bg-white/5 flex items-center justify-center">
            <img src="/logo.png" alt="OmniPrompt" className="w-14 h-14 object-contain" />
          </div>
          <h2 className="text-lg font-semibold text-[#fafafa]">
            {mode === 'login' ? 'Welcome back' : 'Create account'}
          </h2>
          <p className="text-[12px] text-[#71717a] mt-1">
            {mode === 'login'
              ? 'Sign in to generate prompts & save private history'
              : 'Create an account to generate and save your work'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-[11px] font-medium text-[#a1a1aa] mb-1.5">Email</label>
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-10 px-3 rounded-lg bg-[#0c0c0e] border border-[#27272a] text-sm text-[#fafafa] placeholder:text-[#52525b] focus:outline-none focus:border-[#8b5cf6] focus:ring-2 focus:ring-[#8b5cf6]/20"
              placeholder="you@example.com"
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-[11px] font-medium text-[#a1a1aa] mb-1.5">Password</label>
            <input
              type="password"
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-10 px-3 rounded-lg bg-[#0c0c0e] border border-[#27272a] text-sm text-[#fafafa] placeholder:text-[#52525b] focus:outline-none focus:border-[#8b5cf6] focus:ring-2 focus:ring-[#8b5cf6]/20"
              placeholder="Min 6 characters"
              disabled={loading}
            />
          </div>

          {error && (
            <div className="text-[12px] text-[#f87171] bg-[#f87171]/10 border border-[#f87171]/25 rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 rounded-xl btn-primary text-sm font-medium disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="material-symbols-outlined animate-spin text-[18px]">
                  progress_activity
                </span>
                Please wait…
              </>
            ) : mode === 'login' ? (
              'Sign in'
            ) : (
              'Create account'
            )}
          </button>
        </form>

        <div className="px-6 pb-6 text-center">
          <button
            type="button"
            onClick={() => {
              setMode(mode === 'login' ? 'register' : 'login');
              setError('');
            }}
            className="text-[12px] text-[#a1a1aa] hover:text-[#c4b5fd] transition"
          >
            {mode === 'login' ? (
              <>
                New here? <span className="text-[#a78bfa] font-medium">Create an account</span>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <span className="text-[#a78bfa] font-medium">Sign in</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
