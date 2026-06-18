import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { ApiError } from '@/api/client';

interface GoogleSignInButtonProps {
  // Surface auth failures in the host (e.g. the modal's error region).
  onError?: (message: string) => void;
}

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({ onError }) => {
  const { loginWithGoogle } = useAuth();
  const containerRef = useRef<HTMLDivElement>(null);
  // Hidden when the backend reports Google login is not configured (503).
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    // No client id provisioned → nothing to render.
    if (!GOOGLE_CLIENT_ID || hidden) return;

    let cancelled = false;

    const handleCredential = async (response: GoogleCredentialResponse) => {
      try {
        await loginWithGoogle(response.credential);
      } catch (err) {
        if (err instanceof ApiError && err.status === 503) {
          setHidden(true); // not configured server-side — hide the button
          return;
        }
        // 401 (invalid token) and anything else → same user-facing message.
        onError?.('Google sign-in failed, try again');
      }
    };

    // The GIS script loads async/defer, so poll until it's ready.
    const tryRender = () => {
      if (cancelled) return;
      const google = window.google;
      if (!google || !containerRef.current) return false;

      google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleCredential,
        cancel_on_tap_outside: true,
      });

      const isLight = document.documentElement.classList.contains('light');
      const width = containerRef.current.clientWidth || 320;
      google.accounts.id.renderButton(containerRef.current, {
        theme: isLight ? 'outline' : 'filled_black',
        size: 'large',
        shape: 'pill',
        text: 'continue_with',
        logo_alignment: 'center',
        width,
      });
      return true;
    };

    if (!tryRender()) {
      const interval = setInterval(() => {
        if (tryRender()) clearInterval(interval);
      }, 200);
      // Give up after ~6s; leave the area empty rather than spinning forever.
      const timeout = setTimeout(() => clearInterval(interval), 6000);
      return () => {
        cancelled = true;
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }

    return () => {
      cancelled = true;
    };
  }, [hidden, loginWithGoogle, onError]);

  if (!GOOGLE_CLIENT_ID || hidden) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <span className="flex-1 h-px bg-[var(--border-primary)]"></span>
        <span className="text-[9px] font-black uppercase tracking-[0.3em] text-[var(--text-secondary)]">or</span>
        <span className="flex-1 h-px bg-[var(--border-primary)]"></span>
      </div>
      {/* GIS renders its iframe button into this container */}
      <div ref={containerRef} className="flex justify-center min-h-[44px]"></div>
    </div>
  );
};

export default GoogleSignInButton;
