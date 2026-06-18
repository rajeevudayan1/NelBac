import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { ApiError } from '@/api/client';
import { authApi } from '@/api/auth';
import GoogleSignInButton from './GoogleSignInButton';

const inputClass =
  'w-full bg-[var(--input-bg)] border border-[var(--border-primary)] rounded-2xl px-5 py-4 text-sm font-medium text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] outline-none focus:border-[#00f3ff] transition-all';

const labelClass =
  'block text-[10px] font-black uppercase tracking-[0.3em] text-[var(--text-secondary)] mb-2';

const AuthModal: React.FC = () => {
  const { authModalOpen, authModalView, openAuthModal, closeAuthModal, login, register } = useAuth();

  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [identifier, setIdentifier] = useState(''); // login: username or email

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const isLogin = authModalView === 'login';

  const resetForm = () => {
    setError(null);
    setNotice(null);
    setPassword('');
  };

  // Clear transient state whenever the modal opens or the view switches.
  useEffect(() => {
    if (authModalOpen) resetForm();
  }, [authModalOpen, authModalView]);

  // Lock background scroll while open + close on Escape.
  useEffect(() => {
    if (!authModalOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeAuthModal();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [authModalOpen, closeAuthModal]);

  if (!authModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      if (isLogin) {
        await login(identifier.trim(), password);
      } else {
        await register({
          email: email.trim(),
          username: username.trim(),
          password,
          full_name: fullName.trim() || undefined,
          phone: phone.trim() || undefined,
        });
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleForgotPassword = async () => {
    const target = identifier.trim();
    if (!target.includes('@')) {
      setError('Enter your account email above, then tap “Forgot password”.');
      return;
    }
    setError(null);
    try {
      await authApi.forgotPassword(target);
      setNotice('If that email exists, a reset link is on its way.');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not send reset link.');
    }
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-start justify-center pt-[10vh] px-4" onClick={closeAuthModal}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>

      <div
        className="relative w-full max-w-md animate-[slideDown_0.2s_ease-out]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="glass rounded-[2.5rem] border border-[var(--border-primary)] shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="px-8 pt-8 pb-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-black font-heading uppercase italic tracking-tighter text-[var(--text-primary)]">
                {isLogin ? 'Sign In.' : 'Sign Up.'}
              </h2>
              <button
                onClick={closeAuthModal}
                className="interactive w-9 h-9 rounded-full flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] bg-[var(--input-bg)] transition-all"
                aria-label="Close"
              >
                <i className="fas fa-times text-sm"></i>
              </button>
            </div>

            {/* Tab switch */}
            <div className="flex gap-2 p-1 rounded-2xl bg-[var(--input-bg)] border border-[var(--border-primary)]">
              {(['login', 'register'] as const).map((view) => (
                <button
                  key={view}
                  onClick={() => openAuthModal(view)}
                  className={`interactive flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.3em] transition-all ${
                    authModalView === view
                      ? 'bg-[var(--text-primary)] text-[var(--bg-primary)] shadow-lg'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  {view === 'login' ? 'Sign In' : 'Register'}
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-5">
            {isLogin ? (
              <div>
                <label className={labelClass}>Email or Username</label>
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="username"
                  required
                  className={inputClass}
                />
              </div>
            ) : (
              <>
                <div>
                  <label className={labelClass}>Full Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Jane Doe"
                    autoComplete="name"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
                    required
                    className={inputClass}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Username</label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="jane"
                      autoComplete="username"
                      minLength={3}
                      required
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Phone</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Optional"
                      autoComplete="tel"
                      className={inputClass}
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className={labelClass}>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={isLogin ? '••••••••' : 'At least 8 characters'}
                autoComplete={isLogin ? 'current-password' : 'new-password'}
                minLength={isLogin ? undefined : 8}
                required
                className={inputClass}
              />
              {isLogin && (
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="interactive mt-3 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--accent-solid)] hover:underline"
                >
                  Forgot password?
                </button>
              )}
            </div>

            {error && (
              <p className="text-[11px] font-bold text-red-400 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3">
                {error}
              </p>
            )}
            {notice && (
              <p className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-4 py-3">
                {notice}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="interactive w-full py-5 bg-[var(--text-primary)] text-[var(--bg-primary)] font-black uppercase tracking-[0.4em] text-[11px] rounded-2xl hover:bg-[#00f3ff] hover:text-black transition-all shadow-xl active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Please wait…' : isLogin ? 'Sign In' : 'Create Account'}
            </button>

            <GoogleSignInButton onError={setError} />

            <p className="text-center text-[11px] font-medium text-[var(--text-secondary)]">
              {isLogin ? "Don't have an account? " : 'Already registered? '}
              <button
                type="button"
                onClick={() => openAuthModal(isLogin ? 'register' : 'login')}
                className="interactive font-black text-[var(--accent-solid)] hover:underline uppercase tracking-wider"
              >
                {isLogin ? 'Register' : 'Sign In'}
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
